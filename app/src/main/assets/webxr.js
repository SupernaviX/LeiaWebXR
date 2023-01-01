console.log('shazam');

const IDENTITY_MATRIX = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
function multiply(m1, m2) {
    return new Float32Array([
        m2[0]*m1[0] + m2[1]*m1[4] + m2[2]*m1[8] + m2[3]*m1[12],
        m2[0]*m1[1] + m2[1]*m1[5] + m2[2]*m1[9] + m2[3]*m1[13],
        m2[0]*m1[2] + m2[1]*m1[6] + m2[2]*m1[10] + m2[3]*m1[14],
        m2[0]*m1[3] + m2[1]*m1[7] + m2[2]*m1[11] + m2[3]*m1[15],

        m2[4]*m1[0] + m2[5]*m1[4] + m2[6]*m1[8] + m2[7]*m1[12],
        m2[4]*m1[1] + m2[5]*m1[5] + m2[6]*m1[9] + m2[7]*m1[13],
        m2[4]*m1[2] + m2[5]*m1[6] + m2[6]*m1[10] + m2[7]*m1[14],
        m2[4]*m1[3] + m2[5]*m1[7] + m2[6]*m1[11] + m2[7]*m1[15],

        m2[8]*m1[0] + m2[9]*m1[4] + m2[10]*m1[8] + m2[11]*m1[12],
        m2[8]*m1[1] + m2[9]*m1[5] + m2[10]*m1[9] + m2[11]*m1[13],
        m2[8]*m1[2] + m2[9]*m1[6] + m2[10]*m1[10] + m2[11]*m1[14],
        m2[8]*m1[3] + m2[9]*m1[7] + m2[10]*m1[11] + m2[11]*m1[15],

        m2[12]*m1[0] + m2[13]*m1[4] + m2[14]*m1[8] + m2[15]*m1[12],
        m2[12]*m1[1] + m2[13]*m1[5] + m2[14]*m1[9] + m2[15]*m1[13],
        m2[12]*m1[2] + m2[13]*m1[6] + m2[14]*m1[10] + m2[15]*m1[14],
        m2[12]*m1[3] + m2[13]*m1[7] + m2[14]*m1[11] + m2[15]*m1[15],
    ]);
}
function invert(m) {
    const r = new Float32Array([
        m[5]*m[10]*m[15] - m[5]*m[11]*m[14] - m[9]*m[6]*m[15] + m[9]*m[7]*m[14] + m[13]*m[6]*m[11] - m[13]*m[7]*m[10],
        -m[1]*m[10]*m[15] + m[1]*m[11]*m[14] + m[9]*m[2]*m[15] - m[9]*m[3]*m[14] - m[13]*m[2]*m[11] + m[13]*m[3]*m[10],
        m[1]*m[6]*m[15] - m[1]*m[7]*m[14] - m[5]*m[2]*m[15] + m[5]*m[3]*m[14] + m[13]*m[2]*m[7] - m[13]*m[3]*m[6],
        -m[1]*m[6]*m[11] + m[1]*m[7]*m[10] + m[5]*m[2]*m[11] - m[5]*m[3]*m[10] - m[9]*m[2]*m[7] + m[9]*m[3]*m[6],

        -m[4]*m[10]*m[15] + m[4]*m[11]*m[14] + m[8]*m[6]*m[15] - m[8]*m[7]*m[14] - m[12]*m[6]*m[11] + m[12]*m[7]*m[10],
        m[0]*m[10]*m[15] - m[0]*m[11]*m[14] - m[8]*m[2]*m[15] + m[8]*m[3]*m[14] + m[12]*m[2]*m[11] - m[12]*m[3]*m[10],
        -m[0]*m[6]*m[15] + m[0]*m[7]*m[14] + m[4]*m[2]*m[15] - m[4]*m[3]*m[14] - m[12]*m[2]*m[7] + m[12]*m[3]*m[6],
        m[0]*m[6]*m[11] - m[0]*m[7]*m[10] - m[4]*m[2]*m[11] + m[4]*m[3]*m[10] + m[8]*m[2]*m[7] - m[8]*m[3]*m[6],

        m[4]*m[9]*m[15] - m[4]*m[11]*m[13] - m[8]*m[5]*m[15] + m[8]*m[7]*m[13] + m[12]*m[5]*m[11] - m[12]*m[7]*m[9],
        -m[0]*m[9]*m[15] + m[0]*m[11]*m[13] + m[8]*m[1]*m[15] - m[8]*m[3]*m[13] - m[12]*m[1]*m[11] + m[12]*m[3]*m[9],
        m[0]*m[5]*m[15] - m[0]*m[7]*m[13] - m[4]*m[1]*m[15] + m[4]*m[3]*m[13] + m[12]*m[1]*m[7] - m[12]*m[3]*m[5],
        -m[0]*m[5]*m[11] + m[0]*m[7]*m[9] + m[4]*m[1]*m[11] - m[4]*m[3]*m[9] - m[8]*m[1]*m[7] + m[8]*m[3]*m[5],

        -m[4]*m[9]*m[14] + m[4]*m[10]*m[13] + m[8]*m[5]*m[14] - m[8]*m[6]*m[13] - m[12]*m[5]*m[10] + m[12]*m[6]*m[9],
        m[0]*m[9]*m[14] - m[0]*m[10]*m[13] - m[8]*m[1]*m[14] + m[8]*m[2]*m[13] + m[12]*m[1]*m[10] - m[12]*m[2]*m[9],
        -m[0]*m[5]*m[14] + m[0]*m[6]*m[13] + m[4]*m[1]*m[14] - m[4]*m[2]*m[13] - m[12]*m[1]*m[6] + m[12]*m[2]*m[5],
        m[0]*m[5]*m[10] - m[0]*m[6]*m[9] - m[4]*m[1]*m[10] + m[4]*m[2]*m[9] + m[8]*m[1]*m[6] - m[8]*m[2]*m[5],
    ]);

    var det = m[0]*r[0] + m[4]*r[1] + m[8]*r[2] + m[12]*r[3];
    for (let i = 0; i < 16; i++) r[i] /= det;
    return r;
};

function getPosition(matrix) {
    return DOMPointReadOnly.fromPoint({
        x: matrix[12],
        y: matrix[13],
        z: matrix[14],
        w: matrix[15],
    });
}
function getOrientation(matrix) {
    const m00 = matrix[0];
    const m11 = matrix[5];
    const m22 = matrix[10];
    if (m00 + m11 + m22 > 0) {
        const s = Math.sqrt(m00 + m11 + m22 + 1) * 2;
        return DOMPointReadOnly.fromPoint({
            x: (matrix[6] - matrix[9]) / s,
            y: (matrix[8] - matrix[2]) / s,
            z: (matrix[1] - matrix[4]) / s,
            w: s / 4,
        });
    }
    if ((m00 > m11) && (m00 > m22)) {
        const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
        return DOMPointReadOnly.fromPoint({
            x: s / 4,
            y: (matrix[1] + matrix[4]) / s,
            z: (matrix[8] + matrix[2]) / s,
            w: (matrix[6] - matrix[9]) / s,
        });
    }
    if (m11 > m22) {
        const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
        return DOMPointReadOnly.fromPoint({
            x: (matrix[1] + matrix[4]) / s,
            y: s / 4,
            z: (matrix[6] + matrix[9]) / s,
            w: (matrix[8] - matrix[2]) / s,
        });
    }
    const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
    return DOMPointReadOnly.fromPoint({
        x: (matrix[8] + matrix[2]) / s,
        y: (matrix[6] + matrix[9]) / s,
        z: s / 4,
        w: (matrix[1] - matrix[4]) / s,
    });
}

function translation(x, y, z) {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
}

window.leiaManager = (function() {
    const fullscreenBackdrop = document.createElement('div');
    fullscreenBackdrop.style = 'background: white; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 99999;'

    let active = false;
    let canvas = null;

    let oldCanvasParent = null;
    let oldCanvasWidth = null;
    let oldCanvasHeight = null;
    let oldCanvasStyle = null;
    function appendCanvasToBackdrop() {
        if (!canvas) return;
        oldCanvasParent = canvas.parentElement;
        oldCanvasStyle = canvas.style;
        oldCanvasWidth = canvas.width;
        oldCanvasHeight = canvas.height;
        fullscreenBackdrop.appendChild(canvas);
        canvas.style = 'width: 100%; height: 100%;'
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
    }
    function removeCanvasFromBackdrop() {
        if (!canvas) return;
        if (oldCanvasParent) {
            oldCanvasParent.appendChild(canvas);
        } else {
            fullscreenBackdrop.removeChild(canvas);
        }
        canvas.style = oldCanvasStyle;
        canvas.width = oldCanvasWidth;
        canvas.height = oldCanvasHeight;
    }

    function activate(session) {
        if (active) return;
        active = true;

        history.pushState({ leiaXrEnabled: true }, '');
        const onFullscreenExited = (event) => {
            event.preventDefault();
            window.removeEventListener('popstate', onFullscreenExited);
            navigator.xr._shutdownSession(session);
            deactivate();
        }
        window.addEventListener('popstate', onFullscreenExited);

        document.body.appendChild(fullscreenBackdrop);
        appendCanvasToBackdrop();
    }

    function attachCanvas(_canvas) {
        if (canvas !== _canvas) {
            canvas = _canvas;
            appendCanvasToBackdrop();
        }
    }
    function deactivate() {
        if (!active) return;
        active = false;
        document.body.removeChild(fullscreenBackdrop)
        removeCanvasFromBackdrop();
    }

    return {
        activate,
        attachCanvas,
        deactivate
    };
})();

class XRWebGLLayer {
    #device;
    constructor(session, context) {
        this.session = session;
        this.#device = session._device;
        this.context = context;
        this._compositionEnabled = session._mode !== 'inline';
    }

    get framebuffer() { return this.#device.framebuffer; }

    getViewport(view) {
        return this.#device.getViewport(view);
    }
}
Object.setPrototypeOf(XRWebGLLayer.prototype, XRLayer.prototype);

class XRRigidTransform {
    #position;
    #orientation;
    #matrix;
    #inverse;
    constructor(position, orientation, matrix = null, inverse = null) {
        this.#position = DOMPointReadOnly.fromPoint(position);
        this.#orientation = DOMPointReadOnly.fromPoint(orientation);
        this.#matrix = matrix;
        this.#inverse = inverse;
    }

    get position() { return this.#position; }
    get orientation() { return this.#orientation; }
    get matrix() {
        if (this.#matrix === null) {
            const { x, y, z, w } = this.#position;
            const { x: qx, y: qy, z: qz, w: qw } = this.#orientation;
            this.#matrix = new Float32Array([
                1 - 2 * (qy**2 + qz**2),
                2 * (qx * qy + qz * qw),
                2 * (qx * qz - qy * qw),
                x,
                2 * (qx * qy - qz * qw),
                1 - 2 * (qx**2 + qz**2),
                2 * (qy * qz + qx * qw),
                y,
                2 * (qx * qz + qy * qw),
                2 * (qy * qz - qx * qw),
                1 - 2 * (qx**2 + qy**2),
                z,
                0,
                0,
                0,
                w,
            ]);
        }
        return this.#matrix;
    }

    static _fromMatrix(matrix) {
        const position = getPosition(matrix);
        const orientation = getOrientation(matrix);
        return new XRRigidTransform(position, orientation, matrix);
    }

    get inverse() {
        if (this.#inverse === null) {
            const inverseMatrix = invert(this.matrix);
            const inversePosition = getPosition(inverseMatrix);
            const inverseOrientation = getOrientation(inverseMatrix);
            this.#inverse = new XRRigidTransform(inversePosition, inverseOrientation, inverseMatrix, this);
        }
        return this.#inverse;
    }
}
const IDENTITY_TRANSFORM = new XRRigidTransform(
    { x: 0, y: 0, z: 0, w: 1 },
    { x: 0, y: 0, z: 0, w: 1 }
);

class XRPose {
    #transform;
    constructor(transform) {
        this.#transform = transform;
    }

    get transform() { return this.#transform; }
    get linearVelocity() { return null; }
    get angularVelocity() { return null; }
    get emulatedPosition() { return false; }
}

class XRViewerPose extends XRPose {
    #views;
    constructor(transform, views) {
        super(transform);
        this.#views = views;
    }
    get views() { return this.#views; }
}

class XRView {
    #viewSpace;
    #projectionMatrix;
    #transform;
    constructor(viewSpace, projectionMatrix, transform) {
        this.#viewSpace = viewSpace;
        this.#projectionMatrix = projectionMatrix;
        this.#transform = transform;
    }

    get eye() { return this.#viewSpace.eye; }
    get projectionMatrix() { return this.#projectionMatrix; }
    get transform() { return this.#transform; }

    _findViewport(viewports) {
        const viewport = viewports.find(v => v.viewSpace === this.#viewSpace);
        return viewport ? viewport.viewport : null;
    }
}

class XRViewport {
    #x;
    #y;
    #width;
    #height;
    constructor(x, y, width, height) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
    }

    get x() { return this.#x; }
    get y() { return this.#y; }
    get width() { return this.#width; }
    get height() { return this.#height; }
}

class XRSpace extends EventTarget {
    constructor(originOffset) {
        super();
        this._originOffset = originOffset;
    }
}
class XRViewSpace extends XRSpace {
    constructor(eye, originOffset) {
        super(originOffset);
        this.eye = eye;
    }
}
class XRReferenceSpace extends XRSpace {
    #type;
    constructor(type, originOffset) {
        super(originOffset);
        this.#type = type;
    }
    getOffsetReferenceSpace(additionalOffset) {
        const newOffset = multiply(this._originOffset, additionalOffset.matrix);
        return new XRReferenceSpace(this.#type, newOffset);
    }
}

class XRFrame {
    #session;
    #device;
    #animationFrame;
    #time;
    #predictedDisplayTime;

    constructor(session, device, animationFrame) {
        this.#session = session;
        this.#device = device;
        this.#animationFrame = animationFrame;
    }

    _setTimes(time, predictedDisplayTime) {
        this.#time = time;
        this.#predictedDisplayTime = predictedDisplayTime;
    }

    get session() { return this.#session; }
    get predictedDisplayTime() { return this.#predictedDisplayTime; }

    getViewerPose(refSpace) {
        const refSpaceMatrix = refSpace._originOffset;
        const transform = XRRigidTransform._fromMatrix(refSpaceMatrix);

        const invertedRefSpaceMatrix = invert(refSpaceMatrix);
        const { projectionMatrix, viewSpaces } = this.#device;
        const views = viewSpaces.map(viewSpace => {
            const relativeMatrix = multiply(invertedRefSpaceMatrix, viewSpace._originOffset);
            return new XRView(viewSpace, projectionMatrix, XRRigidTransform._fromMatrix(relativeMatrix));
        });
        return new XRViewerPose(transform, views);
    }
}

class XRDevice {
    #projectionMatrix;
    #viewSpaces;
    #viewports;
    #oldState;
    #oldWidth;
    #oldHeight;

    constructor(viewSpaces) {
        this.#projectionMatrix = new Float32Array(16);
        this.#viewSpaces = viewSpaces;
    }

    get projectionMatrix() {
        return this.#projectionMatrix;
    }

    get viewSpaces() {
        return this.#viewSpaces;
    }

    get framebuffer() {
        return null;
    }

    getViewport(view) {
        return view._findViewport(this.#viewports);
    }

    onSessionStart() {}
    onSessionEnd() {}

    updateDisplay(renderState) {
        const { baseLayer, _context: context } = renderState;
        const { width = 0, height = 0 } = context?.canvas ?? {};
        const contextChanged = this.#oldState !== renderState;
        const sizeChanged = this.#oldWidth !== width || this.#oldHeight !== height;
        if (contextChanged) {
            this.#oldState = renderState;
            this._onContextChanged(context);
        }
        if (contextChanged || sizeChanged) {
            this.#oldWidth = width;
            this.#oldHeight = height;
            const fov = this._getFov(renderState);
            const aspectRatio = width / height;
            const { depthNear, depthFar } = renderState;
            this._updateProjectionMatrix(fov, aspectRatio, depthNear, depthFar);
            this.#viewports = this._computeViewports(width, height);
        }
    }

    _updateProjectionMatrix(fov, aspectRatio, depthNear, depthFar) {
        const target = this.#projectionMatrix;

        const s = 1 / Math.tan(fov / 2);
        target[0] = s / aspectRatio;
        target[5] = s;
        target[10] = -(depthFar + depthNear) / (depthFar - depthNear);
        target[11] = -1;
        target[14] = -2 * depthFar * depthNear / (depthFar - depthNear);
    }

    draw() {
        const context = this.#oldState?._context;
        if (context != null) {
            const { width, height } = context.canvas;
            this._draw(context, width, height);
        }
    }

    _onContextChanged(context) {}
    _updateViewSpaces(renderState, width, height) {}
    _getFov(renderState) {}
    _computeViewports(width, height) {}
    _draw(context, width, height) {}
}
class InlineXRDevice extends XRDevice {
    #viewSpace;

    constructor() {
        const viewSpace = new XRViewSpace('none', IDENTITY_MATRIX);
        super([viewSpace]);
        this.#viewSpace = viewSpace;
    }

    _getFov(renderState) { return renderState.inlineVerticalFieldOfView; }

    _computeViewports(width, height) {
        return [
            { viewSpace: this.#viewSpace, viewport: new XRViewport(0, 0, width, height), }
        ];
    }
}

const VERTEX_SHADER =`
attribute vec4 a_Pos;
varying vec2 v_TexCoord;
void main() {
    gl_Position = a_Pos;
    v_TexCoord = a_Pos.xy * .5 + .5;
}`;

const FRAGMENT_SHADER =`
precision highp float;
varying vec2 v_TexCoord;
uniform sampler2D u_Texture;

void main() {
    float eye = mod(gl_FragCoord.x - 0.5, 4.0) / 4.0;

    float corrected_x = v_TexCoord.x / 4.0 + eye;

    gl_FragColor = texture2D(u_Texture, vec2(corrected_x, v_TexCoord.y));
}`;

class LeiaXRDevice extends XRDevice {
    #framebuffer = null;
    #texture = null;
    #positionBuffer = null;
    #texCoordBuffer = null;
    #indexBuffer = null;
    #program = null;

    #positionLocation = null;
    #texCoordLocation = null;
    #textureLocation = null;

    #viewSpaces = [];

    constructor() {
        const viewSpaces = [
            new XRViewSpace('left', translation(-0.065, 0, 0)),
            new XRViewSpace('left', translation(-0.0325, 0, 0)),
            new XRViewSpace('right', translation(0.0325, 0, 0)),
            new XRViewSpace('right', translation(0.065, 0, 0)),
        ];
        super(viewSpaces);
        this.#viewSpaces = viewSpaces;
    }

    onSessionStart(session) {
        leiaManager.activate(session);
    }

    onSessionEnd() {
        leiaManager.deactivate();
    }

    get framebuffer() {
        return this.#framebuffer;
    }

    _getFov() {
        return Math.PI / 2;  // TODO: should get this from hardware maybe
    }

    _computeViewports(width, height) {
        const vpWidth = width / 4;
        return this.#viewSpaces.map((viewSpace, i) => {
            const viewport = new XRViewport(vpWidth * i, 0, vpWidth, height);
            return { viewSpace, viewport };
        });
    }

    _onContextChanged(context) {
        if (!context) return;

        leiaManager.attachCanvas(context.canvas);
        const { width, height } = context.canvas;
        this.#initFramebuffer(context, width, height);
    }

    #initFramebuffer(gl, width, height) {
        this.#framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.#framebuffer);

        this.#texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.#texture, 0);

        const { depth, stencil } = gl.getContextAttributes();
        if (depth || stencil) {
            const dsBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, dsBuffer);
            if (depth && stencil) {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, dsBuffer);
            } else if (depth) {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, dsBuffer);
            } else {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, width, height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, dsBuffer);
            }
        }

        this.#positionBuffer = gl.createBuffer();
        this.#texCoordBuffer = gl.createBuffer();
        this.#indexBuffer = gl.createBuffer();

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, VERTEX_SHADER);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(vertexShader);
            console.error(`Could not compile vertex shader\n\n${info}`);
        }
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, FRAGMENT_SHADER);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(fragmentShader);
            console.error(`Could not compile fragment shader\n\n${info}`);
        }
        this.#program = gl.createProgram();
        gl.attachShader(this.#program, vertexShader);
        gl.attachShader(this.#program, fragmentShader);
        gl.linkProgram(this.#program);

        if (!gl.getProgramParameter(this.#program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(this.#program);
            console.error(`Could not link program\n\n${info}`);
        }

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        this.#positionLocation = gl.getAttribLocation(this.#program, "a_Pos");
        this.#textureLocation = gl.getUniformLocation(this.#program, "u_Texture");
    }

    _draw(gl, width, height) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, width, height);
        const positionVertices = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
        ]);
        gl.useProgram(this.#program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positionVertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.#positionLocation);
        gl.vertexAttribPointer(this.#positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1i(this.#textureLocation, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

class XRSessionEvent extends Event {
    #session;
    constructor(type, { session }) {
        super(type);
        this.#session = session;
    }
    get session() { return this.#session; }
}
class XRSession extends EventTarget {
    #animationFrame;
    #ended = false;
    #activeRenderState;
    #pendingRenderState = null;
    #animationFrameCallbacks = [];
    #runningAnimationFrameCallbacks = [];
    #animationFrameCallbackIdentifier = 0;
    #windowRafHandle;
    #viewerReferenceSpace;
    _device;

    constructor(mode, device) {
        super();
        this._mode = mode;
        this._device = device;
        this.#animationFrame = new XRFrame(this, device, true);
        this.#activeRenderState = Object.freeze({
            depthNear: 0.1,
            depthFar: 1000.0,
            inlineVerticalFieldOfView: mode === 'inline' ? Math.PI * 0.5 : null,
            baseLayer: null,
            _compositionEnabled: true,
            _context: null,
        });
        this.#viewerReferenceSpace = new XRReferenceSpace("viewer", IDENTITY_MATRIX);
        this.#windowRafHandle = window.requestAnimationFrame(timestamp => this.#onWindowAnimationFrame(timestamp));
    }

    async end() {
        if (this.#ended) {
            throw new Error('its already shut down');
        }
        this._shutdown();
    }
    _shutdown() {
        this.#ended = true;
        this.dispatchEvent(new XRSessionEvent('end', { session: this }));
    }

    get renderState() { return this.#activeRenderState; }

    get inputSources() { return []; }

    updateRenderState(state) {
        if (this.#ended) {
            throw new TypeError("Nuh uh!");
        }
        if (state.baseLayer && state.baseLayer.session !== this) {
            throw new TypeError("No Way!");
        }
        if (state.inlineVerticalFieldOfView != null && this._mode !== 'inline') {
            throw new TypeError("Please stop");
        }
        if (state.layers != null) {
            throw new TypeError("Don't support that layer stuff yet");
        }
        let compositionEnabled = true;
        let context = null;
        if (state.baseLayer) {
            if (this._mode === 'inline' && state.baseLayer._compositionEnabled === false) {
                compositionEnabled = false;
            }
            context = state.baseLayer.context;
        }
        this.#pendingRenderState = Object.freeze({
            ...this.#activeRenderState,
            ...state,
            _compositionEnabled: compositionEnabled,
            _context: context,
        });
    }

    async requestReferenceSpace(type) {
        //if (type === 'viewer') {
            return this.#viewerReferenceSpace;
        //}
        throw new TypeError("Only support viewer");
    }

    requestAnimationFrame(callback) {
        if (this.#ended) {
            return 0;
        }
        const identifier = ++this.#animationFrameCallbackIdentifier;
        this.#animationFrameCallbacks.push({ identifier, callback, cancelled: false });
        return identifier;
    }
    cancelAnimationFrame(handle) {
        this.#animationFrameCallbacks = this.#animationFrameCallbacks.filter(cb => {
            const matches = cb.identifier === handle;
            if (matches) {
                cb.cancelled = true;
            }
            return !matches;
        });
        this.#runningAnimationFrameCallbacks.forEach(cb => {
            if (cb.identifier === handle) {
                cb.cancelled = true;
            }
        });
    }

    #onWindowAnimationFrame(timestamp) {
        if (this.#ended) {
            return;
        }
        const frame = this.#animationFrame;
        frame._setTimes(timestamp, timestamp);
        if (this.#shouldRenderFrame()) {
            this._device.updateDisplay(this.#activeRenderState);

            this.#runningAnimationFrameCallbacks = this.#animationFrameCallbacks;
            this.#animationFrameCallbacks = [];
            this.#runningAnimationFrameCallbacks.forEach((callback) => {
                if (callback.cancelled) { return; }
                try {
                    callback.callback(timestamp, frame);
                } catch(err) {
                    console.error(err);
                    throw err;
                }
            });
            this.#runningAnimationFrameCallbacks = [];
            this._device.draw();
        }
        if (this.#pendingRenderState) {
            this.#applyPendingRenderState();
        }
        this.#windowRafHandle = window.requestAnimationFrame(timestamp => this.#onWindowAnimationFrame(timestamp))
    }

    #shouldRenderFrame() {
        const activeState = this.#activeRenderState;
        if (activeState.baseLayer == null || activeState._context === null) {
            return false;
        }
        return true;
    }

    #applyPendingRenderState() {
        const activeState = this.#activeRenderState;
        const newState = this.#pendingRenderState;
        this.#pendingRenderState = null;
        requestAnimationFrame(() => {
            this.#activeRenderState = newState;
            this._device.updateDisplay(newState);
        });
    }
}

class XRSystem extends EventTarget {
    #immersiveSession = null;
    async isSessionSupported(mode) {
        return true;
    }
    async requestSession(mode) {
        const isInline = mode === 'inline';
        if (!isInline && this.#immersiveSession) {
            throw new Error('you already have one running');
        }

        const device = isInline ? new InlineXRDevice() : new LeiaXRDevice();
        const session = new XRSession(mode, device);
        if (!isInline) {
            this.#immersiveSession = session;
        }
        device.onSessionStart(session);
        return session;
    }
    _shutdownSession(session) {
        if (this.#immersiveSession === session) {
            this.#immersiveSession = null;
        }
        session._shutdown();
    }
}
navigator.xr = new XRSystem();