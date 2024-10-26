import Foundation

class HealthDataCache {
    private let fileManager = FileManager.default
    private let cacheDirectory: URL
    private let cacheValidityDuration: TimeInterval = 3600 // 1 hour
    
    init() {
        let urls = fileManager.urls(for: .cachesDirectory, in: .userDomainMask)
        cacheDirectory = urls[0].appendingPathComponent("HealthData")
        
        try? fileManager.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)
    }
    
    func cacheSleepData(_ data: Any) {
        save(data, to: "sleep_data.json")
    }
    
    func getSleepData(days: Int) -> Any? {
        return load("sleep_data.json")
    }
    
    private func save(_ data: Any, to filename: String) {
        let fileURL = cacheDirectory.appendingPathComponent(filename)
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: data)
            try jsonData.write(to: fileURL)
        } catch {
            print("Failed to cache data: \(error)")
        }
    }
    
    private func load(_ filename: String) -> Any? {
        let fileURL = cacheDirectory.appendingPathComponent(filename)
        
        guard let modificationDate = try? fileManager.attributesOfItem(atPath: fileURL.path)[.modificationDate] as? Date,
              Date().timeIntervalSince(modificationDate) < cacheValidityDuration,
              let data = try? Data(contentsOf: fileURL),
              let json = try? JSONSerialization.jsonObject(with: data) else {
            return nil
        }
        
        return json
    }
    
    func clearCache() {
        try? fileManager.removeItem(at: cacheDirectory)
        try? fileManager.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)
    }
}