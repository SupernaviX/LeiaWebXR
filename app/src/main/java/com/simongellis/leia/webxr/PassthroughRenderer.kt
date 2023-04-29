package com.simongellis.leia.webxr

import android.graphics.SurfaceTexture
import android.opengl.GLES11Ext.GL_TEXTURE_EXTERNAL_OES
import android.opengl.GLES20.*
import android.opengl.Matrix
import android.util.Size
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import java.nio.ShortBuffer

class PassthroughRenderer(private val leftSurfaceTexture: SurfaceTexture, private val rightSurfaceTexture: SurfaceTexture) {
    private var leftTextureId = -1
    private var rightTextureId = -1

    private var program = -1
    private var posLocation = -1
    private var texCoordLocation = -1
    private var mvLocation = -1
    private var texLocation = -1

    private val leftTransform = FloatArray(16)
    private val rightTransform = FloatArray(16)
    private val projection = FloatArray(16)

    private var leftStale = true
    private var rightStale = true

    private var size = Size(640, 480)

    private val vertexBuffer: FloatBuffer
    private val textureBuffer: FloatBuffer
    private val indexBuffer: ShortBuffer

    init {
        leftSurfaceTexture.setOnFrameAvailableListener {
            leftStale = true
        }
        rightSurfaceTexture.setOnFrameAvailableListener {
            rightStale = true
        }

        vertexBuffer = ByteBuffer.allocateDirect(SQUARE_POS_VERTICES.size * 4)
            .order(ByteOrder.nativeOrder())
            .asFloatBuffer()
        vertexBuffer.put(SQUARE_POS_VERTICES)
        vertexBuffer.position(0)

        textureBuffer = ByteBuffer.allocateDirect(SQUARE_POS_VERTICES.size * 4)
            .order(ByteOrder.nativeOrder())
            .asFloatBuffer()
        textureBuffer.put(SQUARE_TEX_VERTICES)
        textureBuffer.position(0)

        indexBuffer = ByteBuffer.allocateDirect(SQUARE_INDICES.size * 2)
            .order(ByteOrder.nativeOrder())
            .asShortBuffer()
        indexBuffer.put(SQUARE_INDICES)
        indexBuffer.position(0)
    }

    fun onSurfaceCreated() {
        val textureIds = IntArray(2)
        glGenTextures(2, textureIds, 0)
        leftTextureId = textureIds[0]
        leftSurfaceTexture.attachToGLContext(leftTextureId)
        rightTextureId = textureIds[1]
        rightSurfaceTexture.attachToGLContext(rightTextureId)

        program = glCreateProgram()
        val vertexShader = makeShader(GL_VERTEX_SHADER, VERTEX_SHADER)
        glAttachShader(program, vertexShader)
        val fragmentShader = makeShader(GL_FRAGMENT_SHADER, FRAGMENT_SHADER)
        glAttachShader(program, fragmentShader)
        glLinkProgram(program)
        glUseProgram(program)

        posLocation = glGetAttribLocation(program, "a_Pos")
        texCoordLocation = glGetAttribLocation(program, "a_TexCoord")
        mvLocation = glGetUniformLocation(program, "u_MV")
        texLocation = glGetUniformLocation(program, "u_Texture")
    }

    fun onSurfaceChanged(width: Int, height: Int) {
        Matrix.setIdentityM(projection, 0)
        Matrix.scaleM(projection, 0, 0.5f, -1f, 1f)
        Matrix.translateM(leftTransform, 0, projection, 0, -1f, 0f, 0f)
        Matrix.translateM(rightTransform, 0, projection, 0, 1f, 0f, 0f)
        size = Size(width, height)
    }

    fun onDrawFrame() {
        glViewport(0, 0, size.width, size.height)
        glClearColor(1f, 0f, 0f, 1f)
        glClear(GL_COLOR_BUFFER_BIT)
        glUseProgram(program)
        if (leftStale) {
            leftStale = false
            leftSurfaceTexture.updateTexImage()
        }
        drawSquare(leftTextureId, leftTransform)
        if (rightStale) {
            rightStale = false
            rightSurfaceTexture.updateTexImage()
        }
        drawSquare(rightTextureId, rightTransform)
    }

    private fun makeShader(type: Int, source: String): Int {
        val shader = glCreateShader(type)
        glShaderSource(shader, source)
        glCompileShader(shader)
        return shader
    }

    private fun drawSquare(textureId: Int, mv: FloatArray) {
        glActiveTexture(GL_TEXTURE0)
        glBindTexture(GL_TEXTURE_EXTERNAL_OES, textureId)
        glUniform1i(texLocation, 0)
        glUniformMatrix4fv(mvLocation, 1, false, mv, 0)

        glVertexAttribPointer(posLocation, VERTEX_SIZE, GL_FLOAT, false, VERTEX_STRIDE, vertexBuffer)
        glVertexAttribPointer(texCoordLocation, VERTEX_SIZE, GL_FLOAT, false, VERTEX_STRIDE, textureBuffer)
        glEnableVertexAttribArray(posLocation)
        glEnableVertexAttribArray(texCoordLocation)
        glDrawElements(GL_TRIANGLES, SQUARE_INDICES.size, GL_UNSIGNED_SHORT, indexBuffer)
    }

    companion object {
        const val VERTEX_SHADER = """
            attribute vec4 a_Pos;
            attribute vec2 a_TexCoord;
            uniform mat4 u_MV;
            varying vec2 v_TexCoord;
            void main() {
                gl_Position = u_MV * a_Pos;
                v_TexCoord = a_TexCoord;
            }
        """

        const val FRAGMENT_SHADER = """
            #extension GL_OES_EGL_image_external : require
            precision mediump float;
            varying vec2 v_TexCoord;
            uniform samplerExternalOES u_Texture;
            void main() {
                gl_FragColor = texture2D(u_Texture, v_TexCoord);
                //gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
            }
        """

        const val VERTEX_SIZE = 2
        const val VERTEX_STRIDE = 0
        /*
        val SQUARE_POS_VERTICES = floatArrayOf(
            -.5f, +.5f,
            -.5f, -.5f,
            +.5f, -.5f,
            +.5f, +.5f
        )*/
        val SQUARE_POS_VERTICES = floatArrayOf(
            -1f, +1f,
            -1f, -1f,
            +1f, -1f,
            +1f, +1f
        )
        val SQUARE_TEX_VERTICES = floatArrayOf(
            0f, 0f,
            0f, 1f,
            1f, 1f,
            1f, 0f
        )
        val SQUARE_INDICES = shortArrayOf(0, 1, 2, 0, 2, 3)
    }
}