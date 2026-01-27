import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import earthTexture from '../assets/earth-uv-map.jpg';
import { getLayer } from "../hooks/getLayer";
import { getStarfield } from '../hooks/getStarField';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// import { latLonToVector3 } from '../utils/earthquakeUtils';
// import { magnitudeToColor, magnitudeToSize } from '../utils/colorScale';

const Globe = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    
    // set up camera
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5; // Move camera back 5 units so we can see objects at origin
    
    // ============================================
    // RENDERER - Draws the scene to the canvas
    // ============================================
    const renderer = new THREE.WebGLRenderer({ 
        // antialias: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h); 
    mountRef.current.appendChild(renderer.domElement); // Add canvas to DOM
    
    // ============================================
    // CONTROLS - Mouse interaction for camera
    // ============================================
    const ctrls = new OrbitControls(camera, renderer.domElement);
    ctrls.enableDamping = true; 
    
    const geometry = new THREE.SphereGeometry();
    const lineMat = new THREE.LineBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, lineMat);
    scene.add(line); 

    // MeshStandardMaterial - Responds to lights realistically
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff, 
      transparent: true,
    });
    
    // Mesh = Geometry + Material
    // const sphere = new THREE.Mesh(geometry, material);
    // scene.add(sphere); 


    // ============================================
    // LIGHTING - Hemisphere light for ambiance
    // ============================================
    // HemisphereLight(skyColor, groundColor)
    // - White light from above, dark gray from below
    // - Creates soft, natural-looking lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    scene.add(hemiLight);
    
    // ============================================
    // BACKGROUND - Sprite-based gradient layer
    // ============================================
    const gradientBackground = getLayer({
      hue: 0.07,         // color (0-1 scale)
      numSprites: 8,    // 8 sprite particles
      opacity: 0.2,     // Semi-transparent
      radius: 10,       // Spread 10 units from center
      size: 24,         // Each sprite is 24 units large
      z: -15.5,         // Positioned far behind the sphere
    });
    // scene.add(gradientBackground);

    const stars = getStarfield();
    scene.add(stars);
    
    function animate() {
      requestAnimationFrame(animate); 
      // sphere.rotation.x += 0.01; 
      // sphere.rotation.y += 0.02; 
      renderer.render(scene, camera);
      ctrls.update(); 
    }
    animate(); 
    
    // ============================================
    // WINDOW RESIZE HANDLER - Keep canvas responsive
    // ============================================
    function handleWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight; // Update aspect ratio
      camera.updateProjectionMatrix(); // Apply the change to camera
      renderer.setSize(window.innerWidth, window.innerHeight); // Resize canvas
    }
    window.addEventListener('resize', handleWindowResize, false);
    
  }, []); 
  
  return <div ref={mountRef} />; 
}

export default Globe;