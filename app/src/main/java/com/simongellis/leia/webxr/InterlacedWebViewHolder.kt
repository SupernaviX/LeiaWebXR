package com.simongellis.leia.webxr

import android.content.Context
import android.graphics.SurfaceTexture
import android.util.AttributeSet
import android.view.LayoutInflater
import android.view.Surface
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.view.doOnLayout
import com.leia.sdk.views.InputViewsAsset
import com.leia.sdk.views.InterlacedSurfaceView

class InterlacedWebViewHolder(context: Context, attrs: AttributeSet) : ConstraintLayout(context, attrs) {
    private val asset = InputViewsAsset()

    private val surfaceView: InterlacedSurfaceView
    val webView: SurfaceAwareWebView

    private var texture: SurfaceTexture? = null
    private var surface: Surface? = null
        set(value) {
            field = value
            if (backlightEnabled) {
                webView.surface = value
            }
        }

    var backlightEnabled = false
        set(value) {
            field = value
            if (value) {
                webView.surface = surface
                surfaceView.elevation = 2f
            } else {
                webView.surface = null
                surfaceView.elevation = 0f
            }
        }

    init {
        val view = LayoutInflater.from(context).inflate(R.layout.interlaced_web_view_holder, this, true)

        surfaceView = view.findViewById(R.id.surfaceview)
        webView = view.findViewById(R.id.webview)
        backlightEnabled = false

        webView.addOnLayoutChangeListener { v, _, _, _, _, _, _, _, _ ->
            resize(v.width, v.height)
        }
        webView.doOnLayout { resize(it.width, it.height) }

        surfaceView.setViewAsset(asset)
    }

    fun onResume() {
        surfaceView.onResume()
        webView.onResume()
    }

    fun onPause() {
        surfaceView.onPause()
        webView.onPause()
    }

    private fun resize(width: Int, height: Int) {
        val surfaceTexture = texture
        if (surfaceTexture == null || !asset.IsSurfaceValid()) {
            asset.CreateEmptySurfaceForVideo(width, height) {
                texture = it
                surface = Surface(it)
            }
        } else {
            surfaceTexture.setDefaultBufferSize(width, height)
        }
    }
}