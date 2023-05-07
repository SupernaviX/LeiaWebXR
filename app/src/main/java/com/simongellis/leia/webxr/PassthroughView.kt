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
import android.opengl.Matrix
import android.util.AttributeSet
import android.util.Log
import android.util.Size
import android.view.Surface
import androidx.core.content.getSystemService
import androidx.core.view.doOnLayout
import java.util.concurrent.Executors

class PassthroughView(context: Context, attrs: AttributeSet) : LeiaSurfaceView(context, attrs) {
    private val cameraManager = context.getSystemService<CameraManager>()!!
    private val cameraExecutor = Executors.newSingleThreadExecutor()
    private var cameraDevice: CameraDevice? = null

    private val leftSurfaceTexture = SurfaceTexture(false)
    private val rightSurfaceTexture = SurfaceTexture(false)
    private val mainSurfaceTexture = SurfaceTexture(false)
    val mainSurface = Surface(mainSurfaceTexture)

    init {
        addOnLayoutChangeListener { v, _, _, _, _, _, _, _, _ ->
            resize(v.width, v.height)
        }
        doOnLayout { resize(it.width, it.height) }

        val identity = FloatArray(16)
        Matrix.setIdentityM(identity, 0)

        // left camera takes up left half of the screen
        val leftTransform = FloatArray(16)
        Matrix.scaleM(leftTransform, 0, identity, 0, 0.5f, 1f, 1f)
        Matrix.translateM(leftTransform, 0, -1f, 0f, 0f)
        addTexture(leftSurfaceTexture, leftTransform)

        // right camera takes up right half of the screen
        val rightTransform = FloatArray(16)
        Matrix.scaleM(rightTransform, 0, identity, 0, 0.5f, 1f, 1f)
        Matrix.translateM(rightTransform, 0, 1f, 0f, 0f)
        addTexture(rightSurfaceTexture, rightTransform)

        // main surface goes on top of it all
        addTexture(mainSurfaceTexture, identity)
    }

    private val TAG = "PassthroughView"

    fun enableCamera() {
        val leftSize = getSize(BACK_LEFT_PHYSICAL_CAMERA_ID)
        leftSurfaceTexture.setDefaultBufferSize(leftSize.width, leftSize.height)
        val rightSize = getSize(BACK_RIGHT_PHYSICAL_CAMERA_ID)
        rightSurfaceTexture.setDefaultBufferSize(rightSize.width, rightSize.height)

        printCameraInfo()

        val leftSurface = Surface(leftSurfaceTexture)
        val rightSurface = Surface(rightSurfaceTexture)
        createCameraSession(leftSurface, rightSurface) {
            cameraDevice = it.device
            val builder = it.device.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
            builder.addTarget(leftSurface)
            builder.addTarget(rightSurface)
            val request = builder.build()
            it.setSingleRepeatingRequest(request, cameraExecutor, object : CaptureCallback() {})
        }
    }

    private fun printCameraInfo() {
        cameraManager.cameraIdList.forEach {
            Log.i(TAG, "Advertised camera id: $it")
            printCameraInfo(it)
        }
        Log.i(TAG, "Logical camera id: $BACK_LOGICAL_CAMERA_ID")
        printCameraInfo(BACK_LOGICAL_CAMERA_ID)
        Log.i(TAG, "Left physical camera id: $BACK_LEFT_PHYSICAL_CAMERA_ID")
        printCameraInfo(BACK_LEFT_PHYSICAL_CAMERA_ID)
        Log.i(TAG, "Right physical camera id: $BACK_RIGHT_PHYSICAL_CAMERA_ID")
        printCameraInfo(BACK_RIGHT_PHYSICAL_CAMERA_ID)
    }

    private fun printCameraInfo(cameraId: String) {
        val chars = cameraManager.getCameraCharacteristics(cameraId)
        val capabilities = chars.get(CameraCharacteristics.REQUEST_AVAILABLE_CAPABILITIES) ?: intArrayOf()
        Log.i(TAG, "$cameraId multicam: ${capabilities.contains(CameraCharacteristics.REQUEST_AVAILABLE_CAPABILITIES_LOGICAL_MULTI_CAMERA)}")
        Log.i(TAG, "$cameraId physical cameras: ${chars.physicalCameraIds.joinToString(", ")}")
    }

    fun disableCamera() {
        cameraDevice?.close()
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
        mainSurfaceTexture.setDefaultBufferSize(width, height)
    }

    companion object {
        const val BACK_LOGICAL_CAMERA_ID = "4"
        const val BACK_LEFT_PHYSICAL_CAMERA_ID = "2"
        const val BACK_RIGHT_PHYSICAL_CAMERA_ID = "0"
    }
}