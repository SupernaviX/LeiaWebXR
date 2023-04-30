# Leia Web XR

A functional experiment in getting WebXR working on the Lume Pad 2.

The JS shim is in [webxr.js](./app/src/main/assets/webxr.js). It relies on a window object named `Leia` with `enableBacklight(passthrough: boolean)` and `disableBacklight()` methods. The MainActivity wires it all up.