package com.simongellis.leia.webxr

import android.content.Context
import android.content.Intent
import android.content.Intent.ACTION_SEND
import android.content.pm.PackageManager
import android.graphics.Bitmap
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.leia.sdk.LeiaSDK

class MainActivity : AppCompatActivity() {
    private var _requestedUrl: String? = null
    private lateinit var xrWebViewHolder: XRWebViewHolder

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


        val windowInsetsController =
            WindowCompat.getInsetsController(window, window.decorView)
        windowInsetsController.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        windowInsetsController.hide(WindowInsetsCompat.Type.systemBars())

        xrWebViewHolder = findViewById(R.id.xr_web_view_holder)
        val webView = xrWebViewHolder.webView
        webView.settings.javaScriptEnabled = true

        val leia = LeiaInterface(this, xrWebViewHolder)
        webView.addJavascriptInterface(leia, "Leia")

        val startup = assets.open("webxr.js").bufferedReader().use { it.readText() }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView, url: String?, favicon: Bitmap?) {
                view.evaluateJavascript(startup) {
                    Log.i("MainActivity", it)
                }
                super.onPageStarted(view, url, favicon)
            }
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })

        val requestedUrl = getRequestedUrl(intent) ?: "https://immersive-web.github.io/webxr-samples/"
        _requestedUrl = requestedUrl
        webView.loadUrl(requestedUrl)

        if (checkSelfPermission(android.Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(android.Manifest.permission.CAMERA), 42)
        }
    }

    override fun onPause() {
        super.onPause()
        xrWebViewHolder.onPause()
    }

    override fun onResume() {
        super.onResume()
        xrWebViewHolder.onResume()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        getRequestedUrl(intent)?.also {
            if (_requestedUrl != it) {
                _requestedUrl = it
                val webView = findViewById<WebView>(R.id.webview)
                webView.loadUrl(it)
            }
        }
    }

    private fun getRequestedUrl(intent: Intent): String? {
        if (intent.action == ACTION_SEND) {
            return intent.extras?.getString("android.intent.extra.TEXT")
        }
        return null
    }

    class LeiaInterface(context: Context, private val xrWebViewHolder: XRWebViewHolder) {
        private val sdk by lazy {
            val initArgs = LeiaSDK.InitArgs()
            initArgs.platform.context = context.applicationContext
            initArgs.enableFaceTracking = true
            initArgs.requiresFaceTrackingPermissionCheck = false
            LeiaSDK.createSDK(initArgs)
        }

        @JavascriptInterface
        fun enableBacklight(passthrough: Boolean) {
            sdk.enableBacklight(true)
            xrWebViewHolder.enableBacklight(passthrough)
        }

        @JavascriptInterface
        fun disableBacklight() {
            sdk.enableBacklight(false)
            xrWebViewHolder.disableBacklight()
        }
    }
}