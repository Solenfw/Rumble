import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import earthTexture from '../assets/earth-uv-map.jpg';
import { getLayer } from "../hooks/getLayer";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import { latLonToVector3 } from '../utils/earthquakeUtils';
// import { magnitudeToColor, magnitudeToSize } from '../utils/colorScale';

const Globe = () => {

  const mountRef = useRef(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();

    // set up camera, renderer, controls
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    mountRef.current.appendChild(renderer.domElement);

    const ctrls = new OrbitControls(camera, renderer.domElement);
    ctrls.enableDamping = true;

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    scene.add(hemiLight);

    // Sprites BG
    const gradientBackground = getLayer({
      hue: 0.5,
      numSprites: 8,
      opacity: 0.2,
      radius: 10,
      size: 24,
      z: -15.5,
    });
    scene.add(gradientBackground);

    function animate() {
      requestAnimationFrame(animate);
      // sphere.rotation.x += 0.01;
      // sphere.rotation.y += 0.02;
      renderer.render(scene, camera);
      ctrls.update();
    }

    animate();

    function handleWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleWindowResize, false);
  }, []);
  
  return <div ref={mountRef} />;

}

export default Globe;