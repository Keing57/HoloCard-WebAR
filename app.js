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

const markerRoot = new THREE.Group();
scene.add(markerRoot);

const markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: 'https://raw.githack.com/AR-js-org/AR.js/master/data/data/patt.hiro'
});

const knotGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000
});
const knot = new THREE.Mesh(knotGeometry, knotMaterial);
knot.position.y = 0.5;
markerRoot.add(knot);

const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true
});
const wireframeKnot = knot.clone();
wireframeKnot.material = wireframeMaterial;
wireframeKnot.scale.set(1.05, 1.05, 1.05);
markerRoot.add(wireframeKnot);

const cube = knot;

function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    }
    if (camera.aspect) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

window.addEventListener('resize', () => {
    onResize();
});

window.addEventListener('orientationchange', () => {
    setTimeout(onResize, 100);
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

function animate() {
    requestAnimationFrame(animate);
    if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
    }
    if (markerRoot.visible) {
        knot.rotation.x += 0.01;
        knot.rotation.y += 0.01;
        wireframeKnot.rotation.x += 0.01;
        wireframeKnot.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}

animate();
