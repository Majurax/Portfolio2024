import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import {Vector3} from "three";

let scene, renderer, model, camera, cameraControls, mouseX, mouseY;
let firstSphere = {pos: new THREE.Vector3(2.5, 2, 0), size: 0.5, color: '#f1ad50'};


const models = [];

function addLight(color, intensity) {
    const light2 = new THREE.AmbientLight(color, intensity/25);
    const light = new THREE.PointLight(firstSphere.color, intensity/5);
    light.position.set(firstSphere.pos.x, firstSphere.pos.y, firstSphere.pos.z);
    models.push({name: "firstSphere_1", object: light, position: firstSphere.pos, rotation: 0});
    scene.add(light);
    scene.add(light2);

}

async function init() {
    const canvas = document.getElementById('displayContent');
    const loader = new GLTFLoader();

    scene = new THREE.Scene();
    //scene.background = new THREE.Color("#14202b");

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.set(0, 5, 8);
    camera.lookAt(new Vector3(0, 0, -2))

    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('canvas'), alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);



    addObjectUrl('oldscreen', {x: 0, y: 0, z: 0}, -Math.PI/2, loader);
    addSphere(firstSphere.color, firstSphere.size, firstSphere.pos);
    addCube("firstBox", "#1a191d", 3, new THREE.Vector3(-3, 2.5, -1.5), -Math.PI/6, -Math.PI/12, -Math.PI/6);
    addCube("secondBox", "#1a191d", 2, new THREE.Vector3(-2, -1, 0), Math.PI/6, Math.PI/12, Math.PI/6);


    //addPlane('#1a191d', 400);

    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.rotateSpeed = 0.4;
    cameraControls.panSpeed = 0.5;
    camera.enableDamping = true;


    renderer.render(scene, camera);
    camera.updateProjectionMatrix();


    addLight('#707070', 20);

    renderer.setAnimationLoop(updateCanvas);

    const animate = function () {
        requestAnimationFrame(animate);

        const timer = 0.0008 * Date.now();

        //camera.position.x += ( mouseX - camera.position.x ) * .05;
        //camera.position.y += ( - mouseY - camera.position.y ) * .05;
        for(let i = 0; i < models.length; i++) {

            models[i].object.position.y = models[i].position.y + 0.2 * Math.sin(timer + i*Math.PI);
            models[i].object.rotation.y = models[i].rotation + 0.1 * Math.sin(timer + i*Math.PI);

            renderer.render(scene, camera);
        }
    };

    animate();

}

function addPlane(color, size){
    const material = new THREE.MeshBasicMaterial({color: color});
    const geometry = new THREE.PlaneGeometry(size, size);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI/2);
    scene.add(mesh);
}

function addSphere (color, size, pos){
    const material = new THREE.MeshBasicMaterial({color: color});
    const geometry = new THREE.SphereGeometry(size);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    models.push({name: "firstSphere_2", object: mesh, position: firstSphere.pos, rotation: 0});
    scene.add(mesh);
}

function addCube (name, color, size, pos, xRotation, yRotation, zRotation){
    const material = new THREE.MeshBasicMaterial({color: color});
    const geometry = new THREE.BoxGeometry(size, size, size);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.rotation.set(xRotation, yRotation, zRotation);
    models.push({name: name, object: mesh, position: pos, rotation: yRotation});
    scene.add(mesh);
}

function updateCanvas() {
    renderer.render( scene, camera );

    camera.updateProjectionMatrix();
    cameraControls.update();
    renderer.render(scene, camera);
}


function addObjectUrl(name, position, rotation, loader){
    loader.load('3DObjectsPortfolio/'+name+'.glb', function (gltf) {
        model = gltf.scene
        model.rotateOnAxis(new THREE.Vector3(0,1,0), rotation);
        model.position.set(position.x, position.y, position.z);
        models.push({name: name, object: model, position: position, rotation: rotation});
        scene.add(model);


    }, undefined, function (error) {
        console.error(error);
    });
}
/*
window.addEventListener('mousemove', () => {
    mouseX = ( event.clientX - window.innerWidth / 2 ) / 100;
    mouseY = ( event.clientY - window.innerHeight / 2 ) / 100;
})

 */

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

init()
updateCanvas();

