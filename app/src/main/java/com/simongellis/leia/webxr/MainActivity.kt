package com.simongellis.leia.webxr

import android.content.Context
import android.graphics.Bitmap
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import com.leia.android.lights.LeiaDisplayManager
import com.leia.android.lights.LeiaSDK

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.addJavascriptInterface(LeiaInterface(this), "Leia")

        val startup = assets.open("webxr.js").bufferedReader().use { it.readText() }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView, url: String?, favicon: Bitmap?) {
                view.evaluateJavascript(startup) {
                    Log.i("MainActivity", it)
                }
                super.onPageStarted(view, url, favicon)
            }
        }

        webView.loadUrl("https://immersive-web.github.io/webxr-samples/immersive-vr-session.html?usePolyfill=0")
    }

    class LeiaInterface(context: Context) {
        private val displayManager = LeiaSDK.getDisplayManager(context)!!

        @JavascriptInterface
        fun requestBacklightMode3D() {
            displayManager.requestBacklightMode(LeiaDisplayManager.BacklightMode.MODE_3D)
        }

        @JavascriptInterface
        fun requestBacklightMode2D() {
            displayManager.requestBacklightMode(LeiaDisplayManager.BacklightMode.MODE_2D)
        }
    }

    override fun onBackPressed() {
        val webView = findViewById<WebView>(R.id.webview)
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}