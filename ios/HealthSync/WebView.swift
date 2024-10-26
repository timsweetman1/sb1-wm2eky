import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let webView: WKWebView
    
    func makeUIView(context: Context) -> WKWebView {
        webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {}
}