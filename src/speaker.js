import * as THREE from "../lib/threejs/src/Three.js";
import { OrbitControls } from "../lib/threejs/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../lib/threejs/examples/jsm/loaders/GLTFLoader.js";

import * as TWEEN from "../lib/tween/dist/tween.esm.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
//scene.add(new THREE.AxesHelper(5));

const light = new THREE.AmbientLight( 0xfffffff, 1.0 );
scene.add(light);

// Change position to wherever Solidworks places
// the light for the speaker model

const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
// camera.position.set(1, 1, 1);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

const coords = document.getElementById("coords");
controls.addEventListener("change", () => {
    const coordStr = `x: ${camera.position.x},
        y: ${camera.position.y}, z: ${camera.position.z}`;
    coords.textContent = coordStr;
});
coords.textContent = `x: ${camera.position.x},
    y: ${camera.position.y}, z: ${camera.position.z}`;

const gltfLoader = new GLTFLoader();
let speakerModel;

gltfLoader.load("models/ueboom.glb", (speaker) => {
    speakerModel = speaker.scene;
    speakerModel.scale.set(2, 2, 2);
    scene.add(speakerModel);
});

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

let regionIdx = 1;

// const regionColors = [
//     {
//         red: 0,
//         green: 0,
//         blue: 0
//     },
//     {
//         red: 0,
//         green: 118,
//         blue: 102
//     },
//     {
//         red: 0,
//         green: 0,
//         blue: 0
//     },
//     {
//         red: 15,
//         green: 15,
//         blue: 15
//     },
//     {
//         red: 181,
//         green: 126,
//         blue: 255
//     }
// ]

const regionColors = [
    {
        red: 0,
        green: 58,
        blue: 41
    },
    {
        red: 0,
        green: 0,
        blue: 0
    },
    {
        red: 255,
        green: 255,
        blue: 255
    },
    {
        red: 255,
        green: 255,
        blue: 255
    },
    {
        red: 0,
        green: 0,
        blue: 0
    }
]

const cameraPositions = [
    {
        x: -0.5336290,
        y: 0.87171749,
        z: -1.3983363
    },
    {
        x: -1.6062573,
        y: 0.64333546,
        z: -0.07782479
    },
    {
        x: -0.29310435,
        y: 1.8240819,
        z: 0.01182917
    },
    {
        x: -0.0137209,
        y: 0.4730322,
        z: -1.6696127
    },
    {
        x: -0.03922812,
        y: -1.6239463,
        z: -0.08784197
    },
]

const materials = ["yellow_low_gloss_plastic",
    "carbon_fiber_dyneema_plain_2d", "polypropylene",
    "white_medium_gloss_plastic", "black_spray_paint"];

function colorSpeaker(mtl) {
    const rc = regionColors[regionIdx - 1];

    const changeMtl = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`rgb(${rc.red},${rc.green},${rc.blue})`)
    });
    if(mtl.type === "Mesh") {
        mtl.material = changeMtl;
    }
    else {
        for(const material of mtl.children) {
            material.material = changeMtl;
        }
    }
}

let redSlider = document.getElementById("redSlider");
let greenSlider = document.getElementById("greenSlider");
let blueSlider = document.getElementById("blueSlider");

redSlider.addEventListener("input", (event) => {
    regionColors[regionIdx - 1].red = event.target.value;
    speakerModel.traverse((material) => {
        if(material.name === materials[regionIdx - 1]) {
            colorSpeaker(material);
            console.log(materials[regionIdx - 1]);
        }
    });
});

greenSlider.addEventListener("input", (event) => {
    regionColors[regionIdx - 1].green = event.target.value;
    speakerModel.traverse((material) => {
        if(material.name === materials[regionIdx - 1]) {
            colorSpeaker(material);
        }
    });
});

blueSlider.addEventListener("input", (event) => {
    regionColors[regionIdx - 1].blue = event.target.value;
    speakerModel.traverse((material) => {
        if(material.name === materials[regionIdx - 1]) {
            colorSpeaker(material);
        }
    });
});

const region1Btn = document.getElementById("region1Btn");
const region2Btn = document.getElementById("region2Btn");
const region3Btn = document.getElementById("region3Btn");
const region4Btn = document.getElementById("region4Btn");
const region5Btn = document.getElementById("region5Btn");

region1Btn.addEventListener("click", () => {
    region1Btn.classList.add("selected-btn");
    region2Btn.classList.remove("selected-btn");
    region3Btn.classList.remove("selected-btn");
    region4Btn.classList.remove("selected-btn");
    region5Btn.classList.remove("selected-btn");
    regionIdx = 1;

    resetSliders();
    updateCamera(true);
});

region2Btn.addEventListener("click", () => {
    region2Btn.classList.add("selected-btn");
    region1Btn.classList.remove("selected-btn");
    region3Btn.classList.remove("selected-btn");
    region4Btn.classList.remove("selected-btn");
    region5Btn.classList.remove("selected-btn");
    regionIdx = 2;
    
    resetSliders();
    updateCamera(true);
});

region3Btn.addEventListener("click", () => {
    region3Btn.classList.add("selected-btn");
    region1Btn.classList.remove("selected-btn");
    region2Btn.classList.remove("selected-btn");
    region4Btn.classList.remove("selected-btn");
    region5Btn.classList.remove("selected-btn");
    regionIdx = 3;
    
    resetSliders();
    updateCamera(true);
});

region4Btn.addEventListener("click", () => {
    region4Btn.classList.add("selected-btn");
    region1Btn.classList.remove("selected-btn");
    region2Btn.classList.remove("selected-btn");
    region3Btn.classList.remove("selected-btn");
    region5Btn.classList.remove("selected-btn");
    regionIdx = 4;
    
    resetSliders();
    updateCamera(true);
});

region5Btn.addEventListener("click", () => {
    region5Btn.classList.add("selected-btn");
    region1Btn.classList.remove("selected-btn");
    region2Btn.classList.remove("selected-btn");
    region3Btn.classList.remove("selected-btn");
    region4Btn.classList.remove("selected-btn");
    regionIdx = 5;
    
    resetSliders();
    updateCamera(true);
});

function resetSliders() {
    const rc = regionColors[regionIdx - 1];
    redSlider.value = rc.red;
    greenSlider.value = rc.green;
    blueSlider.value = rc.blue;
}

function updateCamera(animate) {
    const camPos = cameraPositions[regionIdx - 1];

    if(!animate) {
        camera.position.set(camPos.x, camPos.y, camPos.z);
    }
    else {
        let initCamPos = {x: 0, y: 0, z: 0};
        let finCamPos = {x: 0, y: 0, z: 0};

        Object.assign(initCamPos, camera.position);
        Object.assign(finCamPos, camPos);

        const tween = new TWEEN.Tween(initCamPos)
            .to(finCamPos, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                camera.position.set(initCamPos.x, initCamPos.y, initCamPos.z);
            }).start();
    }
}
resetSliders();
updateCamera(false);

document.getElementById("reset").addEventListener("click", () => {

    scene.remove(speakerModel);

    gltfLoader.load("../models/ueboom.glb", (speaker) => {
        speakerModel = speaker.scene;
        speakerModel.scale.set(2, 2, 2);
        scene.add(speakerModel);
    });

    regionColors.map(rc => {
        rc.red = 0;
        rc.green = 0;
        rc.blue = 0;
    });
    regionIdx = 1;

    resetSliders();
    updateCamera(false);
});

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
}

animate();