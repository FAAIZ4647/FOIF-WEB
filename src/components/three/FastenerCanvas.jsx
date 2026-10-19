"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function FastenerCanvas() {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let isDisposed = false;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 500;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    setIsLoaded(true);

    // Lighting setup - Luxury Studio Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 9, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4e4f7, 2.2);
    rimLight.position.set(-7, -4, -4);
    scene.add(rimLight);

    const goldAccentLight = new THREE.DirectionalLight(0xd6b46a, 1.4);
    goldAccentLight.position.set(4, -5, 5);
    scene.add(goldAccentLight);

    const topLight = new THREE.PointLight(0xffffff, 1.6, 20);
    topLight.position.set(0, 6, 2);
    scene.add(topLight);

    // Fastener Assembly Group
    const fastenerGroup = new THREE.Group();

    // Materials
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8dadf,
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 1.2,
    });

    const stampedHeadMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.32,
    });

    const goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xb68a3a,
      metalness: 0.85,
      roughness: 0.25,
    });

    // 1. Hexagonal Head (6 radial segments)
    const hexRadius = 1.35;
    const hexHeight = 0.95;
    const hexGeo = new THREE.CylinderGeometry(hexRadius, hexRadius, hexHeight, 6, 1);
    const hexHead = new THREE.Mesh(hexGeo, steelMaterial);
    hexHead.position.y = 1.9;
    fastenerGroup.add(hexHead);

    // 1b. Circular Washer Face beneath Hex Head
    const washerFaceGeo = new THREE.CylinderGeometry(1.28, 1.28, 0.12, 36);
    const washerFace = new THREE.Mesh(washerFaceGeo, stampedHeadMaterial);
    washerFace.position.y = 1.38;
    fastenerGroup.add(washerFace);

    // 1c. Hex Head Top Chamfer Ring (beveled look)
    const chamferTopGeo = new THREE.CylinderGeometry(1.05, 1.32, 0.14, 6);
    const chamferTop = new THREE.Mesh(chamferTopGeo, stampedHeadMaterial);
    chamferTop.position.y = 2.42;
    fastenerGroup.add(chamferTop);

    // 1d. Head Top Stamp Disc (emulating grade 10.9 & FOIF mark)
    const stampDiscGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.04, 32);
    const stampDisc = new THREE.Mesh(stampDiscGeo, goldAccentMaterial);
    stampDisc.position.y = 2.5;
    fastenerGroup.add(stampDisc);

    // 2. Unthreaded Smooth Shank
    const shankRadius = 0.78;
    const shankLength = 1.1;
    const shankGeo = new THREE.CylinderGeometry(shankRadius, shankRadius, shankLength, 36);
    const unthreadedShank = new THREE.Mesh(shankGeo, steelMaterial);
    unthreadedShank.position.y = 0.82;
    fastenerGroup.add(unthreadedShank);

    // 3. Threaded Section (Helical Ridges / Machine Cut Metric Profile)
    const threadContainer = new THREE.Group();
    const threadCount = 22;
    const threadPitch = 0.12;
    const majorRadius = 0.79;
    const minorRadius = 0.69;

    const coreLength = threadCount * threadPitch + 0.2;
    const coreGeo = new THREE.CylinderGeometry(minorRadius, minorRadius, coreLength, 32);
    const coreMesh = new THREE.Mesh(coreGeo, steelMaterial);
    coreMesh.position.y = -(coreLength / 2) + 0.25;
    threadContainer.add(coreMesh);

    const threadRingGeo = new THREE.TorusGeometry(majorRadius - 0.08, 0.075, 8, 36);
    threadRingGeo.rotateX(Math.PI / 2);

    for (let i = 0; i < threadCount; i++) {
      const threadMesh = new THREE.Mesh(threadRingGeo, steelMaterial);
      threadMesh.position.y = -(i * threadPitch) + 0.2;
      threadMesh.rotation.z = 0.055;
      threadContainer.add(threadMesh);
    }
    fastenerGroup.add(threadContainer);

    // 4. Thread Chamfer Point / Lead-in Tip
    const tipGeo = new THREE.ConeGeometry(minorRadius, 0.32, 32);
    tipGeo.rotateX(Math.PI);
    const tipMesh = new THREE.Mesh(tipGeo, steelMaterial);
    tipMesh.position.y = -(threadCount * threadPitch) + 0.08;
    fastenerGroup.add(tipMesh);

    // Position and Initial Rotation
    fastenerGroup.position.set(0, 0, 0);
    fastenerGroup.rotation.set(0.35, -0.65, 0.25);
    scene.add(fastenerGroup);

    // Interactive Scroll & Mouse Dynamics
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const updateScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(window.innerHeight * 1.6, 1000);
      targetScrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === "mouse" && e.buttons === 0) {
        const rect = container.getBoundingClientRect();
        targetMouseX = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
        targetMouseY = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
        return;
      }
      if (e.buttons > 0 || e.pointerType !== "mouse") {
        const rect = container.getBoundingClientRect();
        targetMouseX = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2.4;
        targetMouseY = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2.4;
      }
    };

    const handleResize = () => {
      if (!container || isDisposed) return;
      const newWidth = container.clientWidth || 320;
      const newHeight = container.clientHeight || 360;
      camera.aspect = newWidth / Math.max(newHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(handleResize)
      : null;
    resizeObserver?.observe(container);

    window.addEventListener("scroll", updateScroll, { passive: true });
    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize);

    updateScroll();

    // Animation Loop with Smooth Interpolation
    const timer = new THREE.Timer();
    timer.connect(document);

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      timer.update();
      const time = timer.getElapsed();

      // Smooth lerp
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // 4-Phase Choreography
      const baseRotX = 0.35 + scrollProgress * Math.PI * 1.35 + mouseY * 0.15;
      const baseRotY =
        -0.65 +
        scrollProgress * Math.PI * 3.4 +
        (prefersReducedMotion ? 0 : time * 0.18) +
        mouseX * 0.25;
      const baseRotZ = 0.25 + Math.sin(scrollProgress * Math.PI * 2) * 0.32;

      fastenerGroup.rotation.x = baseRotX;
      fastenerGroup.rotation.y = baseRotY;
      fastenerGroup.rotation.z = baseRotZ;

      // Depth translation & parallax
      fastenerGroup.position.y =
        (prefersReducedMotion ? 0 : Math.sin(time * 1.2) * 0.08) - scrollProgress * 0.3;
      fastenerGroup.position.x =
        mouseX * 0.2 + Math.sin(scrollProgress * Math.PI) * 0.35;

      // Scale response
      const scale = 1.0 + Math.sin(scrollProgress * Math.PI) * 0.12;
      fastenerGroup.scale.set(scale, scale, scale);

      // Key light orbit for metallic gleam
      if (!prefersReducedMotion) {
        keyLight.position.x = 6 + Math.cos(time * 0.5) * 1.5;
        keyLight.position.y = 9 + Math.sin(time * 0.4) * 1.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      timer.dispose();
      window.removeEventListener("scroll", updateScroll);
      container.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      hexGeo.dispose();
      washerFaceGeo.dispose();
      chamferTopGeo.dispose();
      stampDiscGeo.dispose();
      shankGeo.dispose();
      coreGeo.dispose();
      threadRingGeo.dispose();
      tipGeo.dispose();

      steelMaterial.dispose();
      stampedHeadMaterial.dispose();
      goldAccentMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[280px] bg-transparent relative flex items-center justify-center"
      style={{ display: "block" }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
            <span className="font-label-mono-sm text-[10px] text-secondary tracking-widest uppercase">
              Loading 3D Fastener...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
