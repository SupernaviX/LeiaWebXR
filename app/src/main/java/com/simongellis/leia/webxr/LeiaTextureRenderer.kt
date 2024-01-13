package com.simongellis.leia.webxr

import android.graphics.SurfaceTexture
import android.opengl.GLES11Ext.GL_TEXTURE_EXTERNAL_OES
import android.opengl.GLES20.*
import android.util.Log
import android.util.Size
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import java.nio.ShortBuffer

class LeiaTextureRenderer : Renderer {
    private val TAG = "LeiaTextureRenderer"

    private val textureHolders = mutableListOf<TextureHolder>()
    private var size = Size(640, 480)

    private var program = -1
    private var posLocation = -1
    private var texCoordLocation = -1
    private var mvLocation = -1
    private var texLocation = -1

    fun addTexture(texture: SurfaceTexture, transform: FloatArray) {
        textureHolders.add(TextureHolder(texture, transform))
    }

    override fun onSurfaceCreated() {
        val textureIds = IntArray(textureHolders.size)
        glGenTextures(textureIds.size, textureIds, 0)
        textureHolders.forEachIndexed { index, textureHolder ->
            val textureId = textureIds[index]
            textureHolder.updateTextureId(textureId)
        }

        program = glCreateProgram()
        val vertexShader = makeShader(GL_VERTEX_SHADER, VERTEX_SHADER)
        glAttachShader(program, vertexShader)
        val fragmentShader = makeShader(GL_FRAGMENT_SHADER, FRAGMENT_SHADER)
        glAttachShader(program, fragmentShader)
        glLinkProgram(program)

        posLocation = glGetAttribLocation(program, "a_Pos")
        texCoordLocation = glGetAttribLocation(program, "a_TexCoord")
        mvLocation = glGetUniformLocation(program, "u_MV")
        texLocation = glGetUniformLocation(program, "u_Texture")
    }

    override fun onSurfaceChanged(width: Int, height: Int) {
        size = Size(width, height)
    }

    override fun onDrawFrame() {
        glViewport(0, 0, size.width, size.height)
        logError("glViewport")
        glUseProgram(program)
        logError("glUseProgram")
        for (holder in textureHolders) {
            renderTexture(holder)
        }
    }

    private fun makeShader(type: Int, source: String): Int {
        val shader = glCreateShader(type)
        glShaderSource(shader, source)
        glCompileShader(shader)
        return shader
    }

    private fun renderTexture(holder: TextureHolder) {
        holder.tryUpdateTexImage()
        val textureId = holder.textureId
        val mv = holder.transform

        glActiveTexture(GL_TEXTURE0)
        logError("glActiveTexture")
        glBindTexture(GL_TEXTURE_EXTERNAL_OES, textureId)
        logError("glBindTexture")
        glUniform1i(texLocation, 0)
        logError("bind tex location")
        glUniformMatrix4fv(mvLocation, 1, false, mv, 0)
        logError("bind mv location")

        glVertexAttribPointer(
            posLocation,
            VERTEX_SIZE,
            GL_FLOAT,
            false,
            VERTEX_STRIDE,
            SQUARE_POS_VERTICES
        )
        logError("bind pos location")
        glVertexAttribPointer(
            texCoordLocation,
            VERTEX_SIZE,
            GL_FLOAT,
            false,
            VERTEX_STRIDE,
            SQUARE_TEX_VERTICES
        )
        logError("bind tex coord location")
        glEnableVertexAttribArray(posLocation)
        logError("enable pos vertex attrib array")
        glEnableVertexAttribArray(texCoordLocation)
        logError("enable tex coord vertex attrib array")
        glDrawElements(GL_TRIANGLES, SQUARE_INDICES_SIZE, GL_UNSIGNED_SHORT, SQUARE_INDICES)
        logError("draw shit")
    }

    private fun logError(message: String) {
        var error = glGetError()
        while (error != 0) {
            Log.i(TAG, "${error.toString(16)}: $message")
            if (error == GL_INVALID_FRAMEBUFFER_OPERATION) {
                val status = glCheckFramebufferStatus(GL_FRAMEBUFFER)
                Log.i(TAG, "\tstatus: ${status.toString(16)}")
            }
            error = glGetError()
        }
    }

    private class TextureHolder(private val texture: SurfaceTexture, val transform: FloatArray) {
        var textureId = -1
        private var stale = true
        init {
            texture.setOnFrameAvailableListener { stale = true }
        }

        fun updateTextureId(textureId: Int) {
            this.textureId = textureId
            texture.attachToGLContext(textureId)
        }

        fun tryUpdateTexImage() {
            if (stale) {
                stale = false
                texture.updateTexImage()
            }
        }
    }

    companion object {
        const val VERTEX_SHADER = """
            attribute vec4 a_Pos;
            attribute vec2 a_TexCoord;
            uniform mat4 u_MV;
            varying vec2 v_TexCoord;
            void main() {
                gl_Position = u_MV * a_Pos;
                // leia renders upside down, so flip Y values
                v_TexCoord = vec2(a_TexCoord.x, 1.0f - a_TexCoord.y);
            }
        """

        const val FRAGMENT_SHADER = """
            #extension GL_OES_EGL_image_external : require
            precision mediump float;
            varying vec2 v_TexCoord;
            uniform samplerExternalOES u_Texture;
            void main() {
                gl_FragColor = texture2D(u_Texture, v_TexCoord);
                if (gl_FragColor.a < 0.1) {
                    discard;
                }
            }
        """

        const val VERTEX_SIZE = 2
        const val VERTEX_STRIDE = 0

        val SQUARE_POS_VERTICES = floatBufferOf(
            -1f, +1f,
            -1f, -1f,
            +1f, -1f,
            +1f, +1f
        )
        val SQUARE_TEX_VERTICES = floatBufferOf(
            0f, 0f,
            0f, 1f,
            1f, 1f,
            1f, 0f
        )
        val SQUARE_INDICES = shortBufferOf(0, 1, 2, 0, 2, 3)
        val SQUARE_INDICES_SIZE = 6

        private fun floatBufferOf(vararg elements: Float): FloatBuffer {
            val buffer = ByteBuffer.allocateDirect(elements.size * 4)
                .order(ByteOrder.nativeOrder())
                .asFloatBuffer()
            buffer.put(elements)
            buffer.position(0)
            return buffer
        }

        private fun shortBufferOf(vararg elements: Short): ShortBuffer {
            val buffer = ByteBuffer.allocateDirect(elements.size * 4)
                .order(ByteOrder.nativeOrder())
                .asShortBuffer()
            buffer.put(elements)
            buffer.position(0)
            return buffer
        }

    }
}