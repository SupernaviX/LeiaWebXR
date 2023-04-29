package com.simongellis.leia.webxr

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.util.AttributeSet
import android.view.Surface
import android.webkit.WebView

class SurfaceAwareWebView(context: Context, attrs: AttributeSet) : WebView(context, attrs) {
    var surface: Surface? = null
    init {
        setBackgroundColor(Color.TRANSPARENT)
    }
    @SuppressLint("CanvasSize")
    override fun draw(canvas: Canvas) {
        val surface = surface
        if (surface != null) {
            val surfaceCanvas = surface.lockHardwareCanvas()
            val scale = surfaceCanvas.width.toFloat() / canvas.width.toFloat()
            surfaceCanvas.scale(scale, scale)
            surfaceCanvas.translate(-scrollX.toFloat(), -scrollY.toFloat())
            super.draw(surfaceCanvas)
            surface.unlockCanvasAndPost(surfaceCanvas)
        } else {
            super.draw(canvas)
        }
    }
}