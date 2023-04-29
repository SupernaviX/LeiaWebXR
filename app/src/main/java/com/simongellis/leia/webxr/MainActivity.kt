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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


        val windowInsetsController =
            WindowCompat.getInsetsController(window, window.decorView)
        windowInsetsController.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        windowInsetsController.hide(WindowInsetsCompat.Type.systemBars())

        val interlacer = findViewById<InterlacedWebViewHolder>(R.id.interlacer)
        val webView = interlacer.webView
        webView.settings.javaScriptEnabled = true

        val leia = LeiaInterface(this, interlacer)
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

        if (checkSelfPermission(android.Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            leia.requestBacklightMode3D()
            findViewById<PassthroughView>(R.id.passthrough).show()
        } else {
            requestPermissions(arrayOf(android.Manifest.permission.CAMERA), 42)
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 42 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            findViewById<PassthroughView>(R.id.passthrough).show()
        }
    }

    override fun onPause() {
        super.onPause()
        findViewById<PassthroughView>(R.id.passthrough).onPause()
        findViewById<InterlacedWebViewHolder>(R.id.interlacer).onPause()
    }

    override fun onResume() {
        super.onResume()
        findViewById<PassthroughView>(R.id.passthrough).onResume()
        findViewById<InterlacedWebViewHolder>(R.id.interlacer).onResume()
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

    class LeiaInterface(context: Context, private val orchestrator: InterlacedWebViewHolder) {
        private val sdk by lazy {
            val initArgs = LeiaSDK.InitArgs()
            initArgs.platform.context = context.applicationContext
            initArgs.enableFaceTracking = true
            initArgs.requiresFaceTrackingPermissionCheck = false
            LeiaSDK.createSDK(initArgs)
        }

        @JavascriptInterface
        fun requestBacklightMode3D() {
            sdk.enableBacklight(true)
            orchestrator.backlightEnabled = true
        }

        @JavascriptInterface
        fun requestBacklightMode2D() {
            sdk.enableBacklight(false)
            orchestrator.backlightEnabled = false
        }
    }
}