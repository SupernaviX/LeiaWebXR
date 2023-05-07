package com.simongellis.leia.webxr

import android.content.Context
import android.graphics.SurfaceTexture
import android.opengl.GLES20.*
import android.util.AttributeSet
import android.view.Surface
import androidx.core.view.doOnLayout
import com.leia.sdk.views.InputViewsAsset
import com.leia.sdk.views.InterlacedSurfaceView
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10

open class LeiaSurfaceView(context: Context, attrs: AttributeSet) : InterlacedSurfaceView(context, attrs) {
    private val asset = InputViewsAsset()
    private var backingTexture: SurfaceTexture? = null
    private var surface: Surface? = null

    private val textureRenderer = LeiaTextureRenderer()

    init {
        addOnLayoutChangeListener { v, _, _, _, _, _, _, _, _ ->
            resize(v.width, v.height)
        }
        doOnLayout { resize(it.width, it.height) }
        setViewAsset(asset)
    }

    fun addTexture(texture: SurfaceTexture, transform: FloatArray) {
        textureRenderer.addTexture(texture, transform)
    }

    override fun setRenderer(renderer: Renderer) {
        var framebuffer = -1
        super.setRenderer(object : Renderer {
            override fun onSurfaceCreated(gl: GL10, config: EGLConfig) {
                val framebufferIds = IntArray(1)
                glGenFramebuffers(1, framebufferIds, 0)
                framebuffer = framebufferIds[0]
                textureRenderer.onSurfaceCreated()
                renderer.onSurfaceCreated(gl, config)
            }

            override fun onSurfaceChanged(gl: GL10, width: Int, height: Int) {
                textureRenderer.onSurfaceChanged(width, height)
                renderer.onSurfaceChanged(gl, width, height)
            }

            override fun onDrawFrame(gl: GL10) {
                if (asset.IsSurfaceValid()) {
                    glBindTexture(GL_TEXTURE_2D, asset.GetSurfaceId())
                    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, null)

                    glBindFramebuffer(GL_FRAMEBUFFER, framebuffer)
                    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, asset.GetSurfaceId(), 0)

                    textureRenderer.onDrawFrame()
                }
                renderer.onDrawFrame(gl)
            }
        })
    }

    private fun resize(width: Int, height: Int) {
        val surfaceTexture = backingTexture
        if (surfaceTexture == null || !asset.IsSurfaceValid()) {
            asset.CreateEmptySurfaceForPicture(width, height) {
                backingTexture = it
                surface = Surface(it)
            }
        } else {
            surfaceTexture.setDefaultBufferSize(width, height)
        }
    }

}