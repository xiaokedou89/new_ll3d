import * as Three from "three";
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex';
let ThreeArToolkitSource = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new THREEx.ArToolkitSource();
        }
        return instance;
    }
})();
let ThreeArToolkitContext= (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = new THREEx.ArToolkitContext({
                cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
                detectionMode: 'mono',
                canvasWidth: 80*3,
                canvasHeight: 60*3,
            });
        }
        return instance;
    }
})();
