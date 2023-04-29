package com.simongellis.leia.webxr

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.SurfaceTexture
import android.hardware.camera2.CameraCaptureSession
import android.hardware.camera2.CameraCaptureSession.CaptureCallback
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraDevice
import android.hardware.camera2.CameraManager
import android.hardware.camera2.params.OutputConfiguration
import android.hardware.camera2.params.SessionConfiguration
import android.opengl.GLES20.*
import android.opengl.GLES30.*
import android.util.AttributeSet
import android.util.Size
import android.view.Surface
import androidx.core.content.getSystemService
import androidx.core.view.doOnLayout
import com.leia.sdk.views.InputViewsAsset
import com.leia.sdk.views.InterlacedSurfaceView
import java.util.concurrent.Executors
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10

class PassthroughView(context: Context, attrs: AttributeSet) : InterlacedSurfaceView(context, attrs) {
    private val cameraManager = context.getSystemService<CameraManager>()!!
    private val cameraExecutor = Executors.newSingleThreadExecutor()

    private val asset = InputViewsAsset()

    private var texture: SurfaceTexture? = null
    private var surface: Surface? = null

    private val leftSurfaceTexture = SurfaceTexture(false)
    private var leftSize = Size(640, 480)
    private val rightSurfaceTexture = SurfaceTexture(false)
    private var rightSize = Size(640, 480)

    private val passthrough = PassthroughRenderer(leftSurfaceTexture, rightSurfaceTexture)

    init {
        addOnLayoutChangeListener { v, _, _, _, _, _, _, _, _ ->
            resize(v.width, v.height)
        }
        doOnLayout { resize(it.width, it.height) }
        setViewAsset(asset)
    }

    override fun setRenderer(renderer: Renderer) {
        var drawFramebuffer = -1
        super.setRenderer(object : Renderer {
            override fun onSurfaceCreated(gl: GL10, config: EGLConfig) {
                val framebufferIds = IntArray(1)
                glGenFramebuffers(1, framebufferIds, 0)
                drawFramebuffer = framebufferIds[0]

                passthrough.onSurfaceCreated()
                renderer.onSurfaceCreated(gl, config)
            }

            override fun onSurfaceChanged(gl: GL10, width: Int, height: Int) {
                passthrough.onSurfaceChanged(width, height)
                renderer.onSurfaceChanged(gl, width, height)
            }

            override fun onDrawFrame(gl: GL10) {
                if (asset.IsSurfaceValid()) {
                    glBindTexture(GL_TEXTURE_2D, asset.GetSurfaceId())
                    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, null)

                    glBindFramebuffer(GL_FRAMEBUFFER, drawFramebuffer)
                    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, asset.GetSurfaceId(), 0)

                    passthrough.onDrawFrame()
                }
                renderer.onDrawFrame(gl)
            }
        })
    }

    fun show() {
        leftSize = getSize(BACK_LEFT_PHYSICAL_CAMERA_ID)
        leftSurfaceTexture.setDefaultBufferSize(leftSize.width, leftSize.height)
        rightSize = getSize(BACK_RIGHT_PHYSICAL_CAMERA_ID)
        rightSurfaceTexture.setDefaultBufferSize(rightSize.width, rightSize.height)

        val leftSurface = Surface(leftSurfaceTexture)
        val rightSurface = Surface(rightSurfaceTexture)
        createCameraSession(leftSurface, rightSurface) {
            val builder = it.device.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
            builder.addTarget(leftSurface)
            builder.addTarget(rightSurface)
            val request = builder.build()
            it.setSingleRepeatingRequest(request, cameraExecutor, object : CaptureCallback() {})
        }
    }

    private fun getSize(cameraId: String): Size {
        val characteristics = cameraManager.getCameraCharacteristics(cameraId)
        val configMap = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP)
        return configMap!!.getOutputSizes(SurfaceTexture::class.java).first()
    }

    @SuppressLint("MissingPermission")
    private fun createCameraSession(leftSurface: Surface, rightSurface: Surface, callback: (CameraCaptureSession) -> Unit) {
        val outputs = listOf(
            OutputConfiguration(leftSurface).apply {
                setPhysicalCameraId(
                    BACK_LEFT_PHYSICAL_CAMERA_ID
                )
            },
            OutputConfiguration(rightSurface).apply {
                setPhysicalCameraId(
                    BACK_RIGHT_PHYSICAL_CAMERA_ID
                )
            }
        )
        val config = SessionConfiguration(SessionConfiguration.SESSION_REGULAR, outputs, cameraExecutor, object : CameraCaptureSession.StateCallback() {
            override fun onConfigured(session: CameraCaptureSession) {
                callback(session)
            }

            override fun onConfigureFailed(session: CameraCaptureSession) {
                session.device.close()
            }
        })
        cameraManager.openCamera(BACK_LOGICAL_CAMERA_ID, cameraExecutor, object : CameraDevice.StateCallback() {
            override fun onOpened(camera: CameraDevice) {
                camera.createCaptureSession(config)
            }

            override fun onDisconnected(camera: CameraDevice) {
                camera.close()
            }

            override fun onError(camera: CameraDevice, error: Int) {
                camera.close()
            }
        })
    }

    private fun resize(width: Int, height: Int) {
        val surfaceTexture = texture
        if (surfaceTexture == null || !asset.IsSurfaceValid()) {
            asset.CreateEmptySurfaceForPicture(width, height) {
                texture = it
                surface = Surface(it)
            }
        } else {
            surfaceTexture.setDefaultBufferSize(width, height)
        }
    }

    companion object {
        const val BACK_LOGICAL_CAMERA_ID = "4"
        const val BACK_LEFT_PHYSICAL_CAMERA_ID = "2"
        const val BACK_RIGHT_PHYSICAL_CAMERA_ID = "0"
    }
}