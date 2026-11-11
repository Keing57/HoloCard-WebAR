const scene = new THREE.Scene();

const camera = new THREE.Camera();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam'
});

const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'https://raw.githack.com/AR-js-org/AR.js/master/data/data/camera_para.dat',
    detectionMode: 'mono'
});

arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

function onResize() {
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
}

window.addEventListener('resize', () => {
    onResize();
});

arToolkitSource.init(() => {
    onResize();
}, (err) => {
    const ui = document.getElementById('ui') || document.querySelector('.ui');
    if (ui) {
        ui.textContent = 'Hiba: A kamera hozzáférés le van tiltva!';
    }
});

window.addEventListener('camera-error', () => {
    const ui = document.getElementById('ui') || document.querySelector('.ui');
    if (ui) {
        ui.textContent = 'Hiba: A kamera hozzáférés le van tiltva!';
    }
});
