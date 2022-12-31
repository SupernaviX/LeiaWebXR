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
        -m[4]*m[10]*m[15] + m[4]*m[11]*m[14] + m[8]*m[6]*m[15] - m[8]*m[7]*m[14] - m[12]*m[6]*m[11] + m[12]*m[7]*m[10],
        m[4]*m[9]*m[15] - m[4]*m[11]*m[13] - m[8]*m[5]*m[15] + m[8]*m[7]*m[13] + m[12]*m[5]*m[11] - m[12]*m[7]*m[9],
        -m[4]*m[9]*m[14] + m[4]*m[10]*m[13] + m[8]*m[5]*m[14] - m[8]*m[6]*m[13] - m[12]*m[5]*m[10] + m[12]*m[6]*m[9],

        -m[1]*m[10]*m[15] + m[1]*m[11]*m[14] + m[9]*m[2]*m[15] - m[9]*m[3]*m[14] - m[13]*m[2]*m[11] + m[13]*m[3]*m[10],
        m[0]*m[10]*m[15] - m[0]*m[11]*m[14] - m[8]*m[2]*m[15] + m[8]*m[3]*m[14] + m[12]*m[2]*m[11] - m[12]*m[3]*m[10],
        -m[0]*m[9]*m[15] + m[0]*m[11]*m[13] + m[8]*m[1]*m[15] - m[8]*m[3]*m[13] - m[12]*m[1]*m[11] + m[12]*m[3]*m[9],
        m[0]*m[9]*m[14] - m[0]*m[10]*m[13] - m[8]*m[1]*m[14] + m[8]*m[2]*m[13] + m[12]*m[1]*m[10] - m[12]*m[2]*m[9],

        m[1]*m[6]*m[15] - m[1]*m[7]*m[14] - m[5]*m[2]*m[15] + m[5]*m[3]*m[14] + m[13]*m[2]*m[7] - m[13]*m[3]*m[6],
        -m[0]*m[6]*m[15] + m[0]*m[7]*m[14] + m[4]*m[2]*m[15] - m[4]*m[3]*m[14] - m[12]*m[2]*m[7] + m[12]*m[3]*m[6],
        m[0]*m[5]*m[15] - m[0]*m[7]*m[13] - m[4]*m[1]*m[15] + m[4]*m[3]*m[13] + m[12]*m[1]*m[7] - m[12]*m[3]*m[5],
        -m[0]*m[5]*m[14] + m[0]*m[6]*m[13] + m[4]*m[1]*m[14] - m[4]*m[2]*m[13] - m[12]*m[1]*m[6] + m[12]*m[2]*m[5],

        -m[1]*m[6]*m[11] + m[1]*m[7]*m[10] + m[5]*m[2]*m[11] - m[5]*m[3]*m[10] - m[9]*m[2]*m[7] + m[9]*m[3]*m[6],
        m[0]*m[6]*m[11] - m[0]*m[7]*m[10] - m[4]*m[2]*m[11] + m[4]*m[3]*m[10] + m[8]*m[2]*m[7] - m[8]*m[3]*m[6],
        -m[0]*m[5]*m[11] + m[0]*m[7]*m[9] + m[4]*m[1]*m[11] - m[4]*m[3]*m[9] - m[8]*m[1]*m[7] + m[8]*m[3]*m[5],
        m[0]*m[5]*m[10] - m[0]*m[6]*m[9] - m[4]*m[1]*m[10] + m[4]*m[2]*m[9] + m[8]*m[1]*m[6] - m[8]*m[2]*m[5],
    ])

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

window.leiaManager = (function() {
    const fullscreenBackdrop = document.createElement('div');
    fullscreenBackdrop.style = 'background: white; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 99999;'

    let active = false;
    let canvas = null;

    let oldCanvasParent = null;
    function appendCanvasToBackdrop() {
        if (!canvas) return;
        oldCanvasParent = canvas.parentElement;
        fullscreenBackdrop.appendChild(canvas);
    }
    function removeCanvasFromBackdrop() {
        if (!canvas) return;
        if (oldCanvasParent) {
            oldCanvasParent.appendChild(canvas);
        } else {
            fullscreenBackdrop.removeChild(canvas);
        }
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
    #framebuffer;
    #viewports = [];
    constructor(session, context) {
        this.session = session;
        this.context = context;
        this._compositionEnabled = session._mode !== 'inline';
        this.#framebuffer = null; // TODO: for non-inline displays this should be non-null
    }

    get framebuffer() { return this.#framebuffer; }

    _setViewports(viewports) {
        this.#viewports = viewports;
    }

    getViewport(view) {
        return view._findViewport(this.#viewports);
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
    #eye;
    #projectionMatrix;
    #transform;
    constructor(viewSpace, projectionMatrix, transform, eye = 'none') {
        this.#eye = eye;
        this.#viewSpace = viewSpace;
        this.#projectionMatrix = projectionMatrix;
        this.#transform = transform;
    }

    get eye() { return this.#eye; }
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
    constructor(projectionMatrix, originOffset) {
        super(originOffset);
        this.projectionMatrix = projectionMatrix;
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
        const views = this.#device.viewSpaces.map(viewSpace => {
            const relativeMatrix = multiply(invertedRefSpaceMatrix, viewSpace._originOffset);
            return new XRView(viewSpace, viewSpace.projectionMatrix, XRRigidTransform._fromMatrix(relativeMatrix));
        });
        return new XRViewerPose(transform, views);
    }
}

class XRDevice {
    #viewSpaces;
    #oldState;
    #oldWidth;
    #oldHeight;

    constructor(viewSpaces) {
        this.#viewSpaces = viewSpaces;
    }

    get viewSpaces() {
        return this.#viewSpaces;
    }

    onSessionStart() {}
    onSessionEnd() {}

    updateDisplay(renderState) {
        const { baseLayer } = renderState;
        const { width = 0, height = 0 } = renderState._canvas || {};
        if (this.#oldState === renderState && this.#oldWidth === width && this.#oldHeight === height) {
            return;
        }
        this.#oldState = renderState;
        this.#oldWidth = width;
        this.#oldHeight = height;
        this._updateViewSpaces(renderState, width, height);
        if (baseLayer) {
            const viewports = this._computeViewports(width, height);
            baseLayer._setViewports(viewports);
        }
    }

    _updateViewSpaces(renderState, width, height) {}
    _computeViewports(width, height) {}
}
class InlineXRDevice extends XRDevice {
    #projectionMatrix;
    #viewSpace;

    constructor() {
        const projectionMatrix = new Float32Array(16);
        const viewSpace = new XRViewSpace(projectionMatrix, IDENTITY_MATRIX);
        super([viewSpace]);
        this.#projectionMatrix = projectionMatrix;
        this.#viewSpace = viewSpace;
    }

    _updateViewSpaces(renderState, width, height) {
        const { depthNear, depthFar, inlineVerticalFieldOfView } = renderState;
        const fov = inlineVerticalFieldOfView || (Math.PI / 2); // TODO: shouldn't need this
        const target = this.#projectionMatrix;

        const aspectRatio = width / height;
        const s = 1 / Math.tan(fov / 2);
        target[0] = s / aspectRatio;
        target[5] = s;
        target[10] = -(depthFar + depthNear) / (depthFar - depthNear);
        target[11] = -1;
        target[14] = -2 * depthFar * depthNear / (depthFar - depthNear);
    }

    _computeViewports(width, height) {
        return [
            { viewSpace: this.#viewSpace, viewport: new XRViewport(0, 0, width, height), }
        ];
    }
}
class LeiaXRDevice extends InlineXRDevice { // TODO: just extend the base
    onSessionStart(session) {
        leiaManager.activate(session);
    }

    onSessionEnd() {
        leiaManager.deactivate();
    }

    updateDisplay(renderState) {
        if (renderState._canvas != null) {
            leiaManager.attachCanvas(renderState._canvas);
        }
        super.updateDisplay(renderState);
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
    #device;

    constructor(mode, device) {
        super();
        this._mode = mode;
        this.#device = device;
        this.#animationFrame = new XRFrame(this, this.#device, true);
        this.#activeRenderState = Object.freeze({
            depthNear: 0.1,
            depthFar: 1000.0,
            inlineVerticalFieldOfView: mode === 'inline' ? Math.PI * 0.5 : null,
            baseLayer: null,
            _compositionEnabled: true,
            _canvas: null,
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
        let canvas = null;
        if (state.baseLayer) {
            if (this._mode === 'inline' && state.baseLayer._compositionEnabled === false) {
                compositionEnabled = false;
            }
            canvas = state.baseLayer.context.canvas;
        }
        this.#pendingRenderState = Object.freeze({
            ...this.#activeRenderState,
            ...state,
            _compositionEnabled: compositionEnabled,
            _canvas: canvas,
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
        const frame = this.#animationFrame;
        frame._setTimes(timestamp, timestamp);
        if (this.#shouldRenderFrame()) {
            this.#device.updateDisplay(this.#activeRenderState);

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
        }
        if (this.#pendingRenderState) {
            this.#applyPendingRenderState();
        }
        this.#windowRafHandle = window.requestAnimationFrame(timestamp => this.#onWindowAnimationFrame(timestamp))
    }

    #shouldRenderFrame() {
        const activeState = this.#activeRenderState;
        if (activeState.baseLayer == null || activeState._canvas === null) {
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
            this.#device.updateDisplay(newState)
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