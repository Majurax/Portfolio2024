import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Vector3} from "three";

const terminalTabOption = document.getElementsByClassName('terminal-option')[0];
const terminalTabDiv = document.getElementsByClassName('terminal-tab')[0];
const footerTermIcon = document.getElementsByClassName('footer-terminal-icon')[0];
const hidingTerminalIcon = document.getElementsByClassName('terminal-hiding-tab-icon')[0];
const sizingTerminalIcon = document.getElementsByClassName('terminal-sizing-tab-icon')[0];
const closeTerminalIcon = document.getElementsByClassName('terminal-close-tab-icon')[0];
const closeNoteIcon = document.getElementsByClassName('note-close-tab-icon');
const hidingNoteIcon = document.getElementsByClassName('note-hiding-tab-icon');
const sizingNoteIcon = document.getElementsByClassName('note-sizing-tab-icon');
const footerNoteIcon = document.getElementsByClassName('footer-notes-icon')[0];
const desktop = document.getElementsByClassName('desktop')[0];
const coopCanvas = document.getElementById('displayContent');

const noteTabOption = document.getElementsByClassName('note-option');

const videoElement1 = document.querySelector('#SCC_vid1');
const videoElement2 = document.querySelector('#SCC_vid2');

const project = Array.from({ length: 4 }, (v, i) => `project-${i + 1}`)

const allMovableElement = ["terminal-tab", "note-tab-1", "note-tab-2", "note-tab-3", "note-tab-4"]
let mouseDownTerm, mouseDownNote1, mouseDownNote2, mouseDownNote3, mouseDownNote4 = false
let noClick = true;
let resize = [true, true, true, true, true];
let mouseDownNote = [false, false, false, false]
let offsetX, offsetY = 0;
let camera, renderer, scene, model;


function resizeElement(whatDiv){
    const tabDiv = document.getElementsByClassName(whatDiv)[0];
    if (tabDiv.style.width !== '100%') {
        tabDiv.style.width = '100%';
        tabDiv.style.height = '96%';
        tabDiv.style.top = '0';
        tabDiv.style.left = '0.001%';
        resize[0] = false;
    }
    else{
        tabDiv.style.width = '60%';
        tabDiv.style.height = '70%';
        tabDiv.style.top = '10%';
        tabDiv.style.left = '10%';
        resize[0] = true;
    }

}

function resizeNote(nb){
    const noteDiv = document.getElementsByClassName('note-tab-' + String(nb))[0]
    if (noteDiv.style.width !== '99.5%'){
        noteDiv.style.width = '99.5%';
        noteDiv.style.height = '95%';
        noteDiv.style.top = '0';
        noteDiv.style.left = '0.001%';
        resize[nb] = false
    }
    else{
        noteDiv.style.width = '40%';
        noteDiv.style.height = '80%'
        noteDiv.style.top = '10%';
        noteDiv.style.left = '10%'
        resize[nb] = true;
    }
}

coopCanvas.addEventListener('mousedown', () => {
    coopCanvas.style.cursor = 'grabbing';
})
coopCanvas.addEventListener('mouseup', () => {
    coopCanvas.style.cursor = 'grab';
})

desktop.addEventListener('mouseup', () => {
    terminalTabDiv.style.visibility = 'visible';
    moveElementFront('terminal-tab');
})

sizingTerminalIcon.addEventListener("mousedown", () => {
    resizeElement('terminal-tab');
})

addEventListener("mousedown", (event) => {
    noClick = false;
})
addEventListener("mouseup", (event) => {
    noClick = true;
})

project.forEach((projectName, index) => {
    const projectRunning = document.getElementsByClassName(projectName);
    const elementRunning = 'note-tab-' + (index + 1);

    sizingNoteIcon[index].addEventListener("mouseup", (event) => {resizeNote(index+1);})
    hidingNoteIcon[index].addEventListener("mouseup", (event) => {document.getElementsByClassName(elementRunning)[0].style.visibility = 'hidden';})
    closeNoteIcon[index].addEventListener("mouseup", (event) => {document.getElementsByClassName(elementRunning)[0].style.visibility = 'hidden';})

    projectRunning[0].addEventListener("mouseup", () => {
        openCloseTabs(elementRunning, true);
        moveElementFront(elementRunning);
    })
    projectRunning[1].addEventListener("mouseup", () => {
        openCloseTabs(elementRunning, true);
        moveElementFront(elementRunning);
    })


    noteTabOption[index].addEventListener("mousedown", (event) => {
        if (document.getElementsByClassName(elementRunning)[0].style.width === '99.5%' && resize[index+1] === true) resizeNote(index+1);
        mouseDownNote[index] = true;
        const rect = document.getElementsByClassName(elementRunning)[0].getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        resize[index+1] = true;
    })
    document.getElementsByClassName(elementRunning)[0].addEventListener("mousedown", (event) => {moveElementFront(elementRunning);})
})

terminalTabOption.addEventListener("mousedown", (event) => {
    if (terminalTabDiv.style.width === '100%' && resize[0] === true) resizeElement('terminal-tab', 'terminal-screen');
    mouseDownTerm = true;
    const rect = document.getElementsByClassName('terminal-tab')[0].getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    resize[0] = true
})
terminalTabDiv.addEventListener("mousedown", (event) => {
    moveElementFront('terminal-tab');
})

addEventListener("mouseup", (event) => {
    mouseDownTerm = false;
    mouseDownNote = [false, false, false, false];
    for (let i = 0; i < 4; i ++) {document.getElementsByClassName('note-option')[i].style.cursor = 'grab';}
    document.getElementsByClassName('terminal-option')[0].style.cursor = 'grab';
})

footerTermIcon.addEventListener("mouseup", (event) => {openCloseTabs('terminal-tab');})
closeTerminalIcon.addEventListener("mouseup", (event) => {openCloseTabs('terminal-tab');})
hidingTerminalIcon.addEventListener("mouseup", (event) => {openCloseTabs('terminal-tab');})


footerNoteIcon.addEventListener("mouseup", (event) => {openCloseTabs('note-tab-1');})

addEventListener('mousemove', (event) => {
    if (mouseDownTerm) {
        document.getElementsByClassName('terminal-option')[0].style.cursor = 'grabbing';
        if (event.clientY < window.innerHeight && event.clientY > 0) document.getElementsByClassName('terminal-tab')[0].style.top = ((event.clientY - offsetY) / window.innerHeight) * 100 + '%';
        if (event.clientX < window.innerWidth && event.clientX > 0) document.getElementsByClassName('terminal-tab')[0].style.left = ((event.clientX - offsetX) / window.innerWidth) * 100 + '%';
    }
    for (let i = 0; i < 5; i ++){
        if (mouseDownNote[i]) {
            document.getElementsByClassName('note-option')[i].style.cursor = 'grabbing';
            if (event.clientY < window.innerHeight && event.clientY > 0) document.getElementsByClassName('note-tab-' + (i+1))[0].style.top = ((event.clientY - offsetY) / window.innerHeight) * 100 + '%';
            if (event.clientX < window.innerWidth && event.clientX > 0) document.getElementsByClassName('note-tab-' + (i+1))[0].style.left = ((event.clientX - offsetX) / window.innerWidth) * 100 + '%';
        }
    }
})

function moveElementFront(element){
    document.getElementsByClassName(element)[0].style.zIndex = String(allMovableElement.length);
    allMovableElement.forEach((elementToGetBack) => {
        let elementIndexZ = document.getElementsByClassName(elementToGetBack)[0].style.zIndex
        if(elementToGetBack !== element) {
            if (Number(elementIndexZ)-1 >= 0) document.getElementsByClassName(elementToGetBack)[0].style.zIndex = String(Number(elementIndexZ) - 1);
        }
    })
}

function openCloseTabs(tabElementName, onlyClose){
    const tabElement = document.getElementsByClassName(tabElementName)[0];
    if (!onlyClose)(tabElement.style.visibility === 'hidden') ? tabElement.style.visibility = 'visible': tabElement.style.visibility = 'hidden';
    else tabElement.style.visibility = 'visible';

}

function init(){
    const canvas = document.getElementById('displayContent');
    const parent = canvas.parentElement;

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#fdfdfd");

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.aspect = parent.clientWidth / parent.clientHeight;

    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('displayContent')});
    renderer.setSize(parent.clientWidth*0.97, parent.clientHeight*0.97);

    const loader = new GLTFLoader();
    loader.load("3DObjectsPortfolio/coop.glb", function (gltf) {
        model = gltf.scene
        scene.add(model);
        camera.lookAt(new Vector3(0,0,-2))
    })

    const cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.enableZoom = false;
    cameraControls.rotateSpeed = 0.4;
    cameraControls.panSpeed = 0;
    camera.enableDamping = true;

    camera.position.set(0,5,8);

    renderer.render(scene, camera);
    camera.updateProjectionMatrix();

    const light = new THREE.AmbientLight(0x404040, 50);
    scene.add(light);

    const animate = function () {
        requestAnimationFrame(animate);

        if (noClick && Number(document.getElementsByClassName('note-tab-1')[0].style.zIndex) === allMovableElement.length) {
            model.rotation.y += 0.01;
        }
        else {
            videoElement1.pause();
            videoElement2.pause();
        }
        renderer.render(scene, camera);
    };

    animate();
}

addEventListener('resize', () => {
    const canvas = document.getElementById('displayContent');
    const parent = canvas.parentElement;

    renderer.setSize(parent.clientWidth * 0.97, parent.clientHeight * 0.97);
    camera.aspect = parent.clientWidth * 0.97 / parent.clientHeight * 0.97;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);

})

init()


videoElement1.addEventListener("click", () => {
    (!videoElement1.paused) ? videoElement1.pause() : videoElement1.play();
})

videoElement2.addEventListener("click", () => {
    (!videoElement2.paused) ? videoElement2.pause() : videoElement2.play();
})

