import SwiftUI
import WebKit

struct ContentView: View {
    @EnvironmentObject var healthKitManager: HealthKitManager
    @StateObject private var webViewStore = WebViewStore()
    
    var body: some View {
        ZStack {
            WebView(webView: webViewStore.webView)
                .onAppear {
                    setupWebView()
                }
            
            if webViewStore.isLoading {
                ProgressView()
                    .scaleEffect(1.5)
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
            }
        }
        .alert("HealthKit Access Required", isPresented: $healthKitManager.showAuthorizationAlert) {
            Button("Open Settings", role: .none) {
                if let url = URL(string: UIApplication.openSettingsURLString) {
                    UIApplication.shared.open(url)
                }
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Please enable HealthKit access in Settings to use all features.")
        }
    }
    
    private func setupWebView() {
        // Configure the WebView with HealthKit message handler
        let contentController = webViewStore.webView.configuration.userContentController
        
        // Remove any existing message handler to avoid duplicates
        contentController.removeScriptMessageHandler(forName: "healthKit")
        
        // Add the message handler using a coordinator to bridge between WKScriptMessageHandler and SwiftUI
        let coordinator = WebViewCoordinator(healthKitManager: healthKitManager)
        contentController.add(coordinator, name: "healthKit")
        
        // Load the deployed web app URL
        if let url = URL(string: "https://jazzy-scone-d78242.netlify.app") {
            let request = URLRequest(url: url)
            webViewStore.webView.load(request)
        }
    }
}

// Coordinator class to handle WebView messages
class WebViewCoordinator: NSObject, WKScriptMessageHandler {
    private let healthKitManager: HealthKitManager
    
    init(healthKitManager: HealthKitManager) {
        self.healthKitManager = healthKitManager
        super.init()
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        // Forward the message to the HealthKitManager
        healthKitManager.userContentController(userContentController, didReceive: message)
    }
}