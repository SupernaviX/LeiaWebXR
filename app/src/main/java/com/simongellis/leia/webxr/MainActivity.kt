package com.simongellis.leia.webxr

import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.content.Intent
import android.content.Intent.ACTION_SEND
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.net.http.SslError
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.SslErrorHandler
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebChromeClient.FileChooserParams
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContract
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.leia.sdk.LeiaSDK

class MainActivity : AppCompatActivity() {
    private var _requestedUrl: String? = null
    private lateinit var xrWebViewHolder: XRWebViewHolder

    private var _filePathCallback: ValueCallback<Array<Uri>>? = null
    private val _inputFileChooser = registerForActivityResult(FileChooserActivityContract, this::onFilesChosen)

    private var _dialog: Dialog? = null
        set(value) {
            field = value
            value?.setOnDismissListener { field = null }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


        val windowInsetsController =
            WindowCompat.getInsetsController(window, window.decorView)
        windowInsetsController.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        windowInsetsController.hide(WindowInsetsCompat.Type.systemBars())

        xrWebViewHolder = findViewById(R.id.xr_web_view_holder)
        val webView = xrWebViewHolder.webView
        webView.settings.apply {
            javaScriptEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            databaseEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
        }

        val leia = LeiaInterface(this, xrWebViewHolder)
        webView.addJavascriptInterface(leia, "Leia")

        val startup = assets.open("webxr.js").bufferedReader().use { it.readText() }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView, url: String?, favicon: Bitmap?) {
                xrWebViewHolder.onPageStarted()
                view.evaluateJavascript(startup) {
                    Log.i("MainActivity", it)
                }
                super.onPageStarted(view, url, favicon)
            }

            override fun onReceivedSslError(
                view: WebView,
                handler: SslErrorHandler,
                error: SslError
            ) {
                val cert = error.certificate
                if (error.primaryError == SslError.SSL_UNTRUSTED && cert.issuedTo.dName == cert.issuedBy.dName) {
                    _dialog = AlertDialog.Builder(this@MainActivity)
                        .setTitle("Self-Signed SSL Cert")
                        .setMessage("The URL ${error.url} has a self-signed SSL certificate. It may not be the website you expect.")
                        .setPositiveButton("Open anyway") { _, _ -> handler.proceed() }
                        .setNegativeButton("Do not open") { _, _ -> handler.cancel() }
                        .create()
                } else {
                    _dialog = AlertDialog.Builder(this@MainActivity)
                        .setTitle("Invalid SSL Cert")
                        .setMessage("The URL ${error.url} has an invalid SSL certificate. This app will not load it.\n${error}")
                        .setPositiveButton("OK") { _, _ -> }
                        .create()
                    handler.cancel()
                }
                _dialog?.show()
            }
        }
        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView,
                filePathCallback: ValueCallback<Array<Uri>>,
                fileChooserParams: FileChooserParams
            ): Boolean {
                chooseFiles(filePathCallback, fileChooserParams)
                return true
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

    private fun chooseFiles(filePathCallback: ValueCallback<Array<Uri>>, fileChooserParams: FileChooserParams) {
        _filePathCallback = filePathCallback
        _inputFileChooser.launch(fileChooserParams)
    }

    private fun onFilesChosen(files: Array<Uri>) {
        _filePathCallback?.onReceiveValue(files)
        _filePathCallback = null
    }

    private object FileChooserActivityContract : ActivityResultContract<FileChooserParams, Array<Uri>>() {
        override fun createIntent(context: Context, input: FileChooserParams): Intent {
            return input.createIntent()
        }

        override fun parseResult(resultCode: Int, intent: Intent?): Array<Uri> {
            return FileChooserParams.parseResult(resultCode, intent) ?: arrayOf()
        }
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