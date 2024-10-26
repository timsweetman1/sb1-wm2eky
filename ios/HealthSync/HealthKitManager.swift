import HealthKit
import WebKit
import UIKit

class HealthKitManager: NSObject, ObservableObject {
    private let healthStore = HKHealthStore()
    private let dataCache = HealthDataCache()
    
    @Published var isAuthorized = false
    @Published var showAuthorizationAlert = false
    
    private let requiredTypes: Set<HKSampleType> = [
        HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
        HKObjectType.quantityType(forIdentifier: .heartRate)!,
        HKObjectType.quantityType(forIdentifier: .restingHeartRate)!,
        HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN)!,
        HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!
    ]
    
    override init() {
        super.init()
        checkAuthorization()
    }
    
    private func checkAuthorization() {
        for type in requiredTypes {
            if !healthStore.authorizationStatus(for: type).wasAuthorized {
                isAuthorized = false
                return
            }
        }
        isAuthorized = true
    }
    
    func requestAuthorization() {
        healthStore.requestAuthorization(toShare: nil, read: requiredTypes) { [weak self] success, error in
            DispatchQueue.main.async {
                if success {
                    self?.isAuthorized = true
                    self?.setupBackgroundDelivery()
                } else {
                    self?.showAuthorizationAlert = true
                }
            }
        }
    }
    
    private func setupBackgroundDelivery() {
        guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else { return }
        
        healthStore.enableBackgroundDelivery(for: sleepType, frequency: .immediate) { success, error in
            if !success {
                print("Failed to enable background delivery for sleep data:", error?.localizedDescription ?? "")
            }
        }
    }
}

// MARK: - WKScriptMessageHandler
extension HealthKitManager: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let type = body["type"] as? String else { return }
        
        switch type {
        case "requestAuthorization":
            requestAuthorization()
        case "fetchSleepData":
            fetchSleepData(days: body["days"] as? Int ?? 7)
        case "fetchRecoveryData":
            fetchRecoveryData(days: body["days"] as? Int ?? 7)
        default:
            break
        }
    }
    
    private func fetchSleepData(days: Int) {
        guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else { return }
        
        let predicate = HKQuery.predicateForSamples(
            withStart: Calendar.current.date(byAdding: .day, value: -days, to: Date()),
            end: Date()
        )
        
        let query = HKSampleQuery(
            sampleType: sleepType,
            predicate: predicate,
            limit: HKObjectQueryNoLimit,
            sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)]
        ) { [weak self] _, samples, error in
            guard let samples = samples as? [HKCategorySample] else { return }
            
            let sleepData = samples.map { sample -> [String: Any] in
                return [
                    "date": sample.startDate.ISO8601Format(),
                    "duration": sample.endDate.timeIntervalSince(sample.startDate) / 3600,
                    "quality": sample.value == HKCategoryValueSleepAnalysis.asleep.rawValue ? 100 : 0
                ]
            }
            
            self?.sendToWebView(data: sleepData, eventName: "healthKitSleepData")
        }
        
        healthStore.execute(query)
    }
    
    private func fetchRecoveryData(days: Int) {
        guard let hrvType = HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN),
              let restingHRType = HKObjectType.quantityType(forIdentifier: .restingHeartRate) else { return }
        
        let predicate = HKQuery.predicateForSamples(
            withStart: Calendar.current.date(byAdding: .day, value: -days, to: Date()),
            end: Date()
        )
        
        let hrvQuery = HKStatisticsCollectionQuery(
            quantityType: hrvType,
            quantitySamplePredicate: predicate,
            options: .discreteAverage,
            anchorDate: Date().startOfDay,
            intervalComponents: DateComponents(day: 1)
        )
        
        hrvQuery.initialResultsHandler = { [weak self] query, results, error in
            guard let results = results else { return }
            
            var recoveryData: [[String: Any]] = []
            
            results.enumerateStatistics(from: Date().addingTimeInterval(-Double(days) * 86400), to: Date()) { statistics, _ in
                if let value = statistics.averageQuantity()?.doubleValue(for: HKUnit.second()) {
                    recoveryData.append([
                        "date": statistics.startDate.ISO8601Format(),
                        "hrv": value,
                        "score": min(100, value * 2), // Simple score calculation
                        "readiness": value > 45 ? "optimal" : value > 35 ? "moderate" : "low"
                    ])
                }
            }
            
            self?.sendToWebView(data: recoveryData, eventName: "healthKitRecoveryData")
        }
        
        healthStore.execute(hrvQuery)
    }
    
    private func sendToWebView(data: Any, eventName: String) {
        guard let jsonData = try? JSONSerialization.data(withJSONObject: data),
              let jsonString = String(data: jsonData, encoding: .utf8) else { return }
        
        let js = """
            const event = new CustomEvent('\(eventName)', { detail: { data: \(jsonString) } });
            window.dispatchEvent(event);
        """
        
        DispatchQueue.main.async {
            WKWebView.webViews().forEach { webView in
                webView.evaluateJavaScript(js)
            }
        }
    }
}

// MARK: - Date Extension
private extension Date {
    var startOfDay: Date {
        return Calendar.current.startOfDay(for: self)
    }
}

// MARK: - HKAuthorizationStatus Extension
private extension HKAuthorizationStatus {
    var wasAuthorized: Bool {
        return self == .sharingAuthorized
    }
}

// MARK: - WKWebView Extension
extension WKWebView {
    static func webViews() -> [WKWebView] {
        let scenes = UIApplication.shared.connectedScenes
        let windowScenes = scenes.compactMap { $0 as? UIWindowScene }
        return windowScenes.flatMap { scene in
            scene.windows.flatMap { window in
                window.subviews.compactMap { view in
                    return view as? WKWebView
                }
            }
        }
    }
}