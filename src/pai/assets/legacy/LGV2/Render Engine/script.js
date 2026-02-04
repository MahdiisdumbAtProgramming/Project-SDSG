// Basic Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const light = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

camera.position.z = 5;

let currentObject = null;

// Function to load models and textures
function loadModel(file) {
    const loader = new THREE.FBXLoader();
    const url = URL.createObjectURL(file); // Create a URL for the file

    loader.load(url, (object) => {
        if (currentObject) {
            scene.remove(currentObject);
        }
        applyDefaultMaterial(object);
        scene.add(object);
        currentObject = object;
        currentObject.position.set(0, 0, 0); // Center the model
    }, undefined, (error) => {
        console.error('Error loading model:', error);
    });
}

function loadTexture(file) {
    if (!currentObject) {
        console.error('No model loaded, cannot apply texture');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(event.target.result, (texture) => {
            currentObject.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texture;
                    child.material.needsUpdate = true; // Update the material
                }
            });
        }, undefined, (error) => {
            console.error('Error loading texture:', error);
        });
    };

    reader.readAsDataURL(file);
}

function applyDefaultMaterial(object) {
    object.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xff00ff }); // Default pink
        }
    });
}

function addSpinningCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    currentObject = cube;
}

// Handle model loading
document.getElementById('loadModelButton').addEventListener('click', () => {
    document.getElementById('modelInput').click();
});
document.getElementById('modelInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        loadModel(file);
    }
});

// Handle texture loading
document.getElementById('loadTextureButton').addEventListener('click', () => {
    document.getElementById('textureInput').click();
});
document.getElementById('textureInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        loadTexture(file);
    }
});

function animate() {
    requestAnimationFrame(animate);
    if (currentObject) {
        currentObject.rotation.x += 0.01;
        currentObject.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}

// Add an initial spinning cube
addSpinningCube();
animate();
