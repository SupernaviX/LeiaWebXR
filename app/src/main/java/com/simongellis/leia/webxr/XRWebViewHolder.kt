package com.simongellis.leia.webxr

import android.content.Context
import android.util.AttributeSet
import android.view.LayoutInflater
import androidx.constraintlayout.widget.ConstraintLayout

class XRWebViewHolder(context: Context, attrs: AttributeSet) : ConstraintLayout(context, attrs) {
    private val surfaceView: PassthroughView
    val webView: SurfaceAwareWebView

    var backlightEnabled = false
        set(value) {
            field = value
            if (value) {
                webView.surface = surfaceView.mainSurface
                surfaceView.elevation = 2f
                surfaceView.enableCamera()
            } else {
                webView.surface = null
                surfaceView.elevation = 0f
                surfaceView.disableCamera()
            }
        }

    init {
        val view = LayoutInflater.from(context).inflate(R.layout.xr_web_view_holder, this, true)

        surfaceView = view.findViewById(R.id.surfaceview)
        webView = view.findViewById(R.id.webview)
        backlightEnabled = false
    }

    fun onResume() {
        surfaceView.onResume()
        webView.onResume()
    }

    fun onPause() {
        surfaceView.onPause()
        webView.onPause()
    }
}