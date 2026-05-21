"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getPlayground } from "@/lib/playgrounds";
import type { PlaygroundId } from "@/types/game";

interface ThreeBackgroundProps {
  playground?: PlaygroundId;
}

export function ThreeBackground({ playground = "cyberpunk" }: ThreeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const theme = getPlayground(playground);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(theme.accent, 0.9);
    const point = new THREE.PointLight(theme.particle, 9, 18);
    point.position.set(3, 4, 5);
    scene.add(ambient, point);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 16;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: theme.particle,
        size: 0.045,
        transparent: true,
        opacity: 0.8
      })
    );
    scene.add(particles);

    const material = new THREE.MeshStandardMaterial({
      color: theme.accent,
      emissive: theme.accent,
      emissiveIntensity: 0.28,
      metalness: 0.55,
      roughness: 0.25
    });
    const shapes = [
      new THREE.Mesh(new THREE.TorusKnotGeometry(0.55, 0.17, 80, 10), material),
      new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 0), material),
      new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), material)
    ];
    shapes[0].position.set(-4.2, 1.6, -1);
    shapes[1].position.set(4.1, -1.3, -0.8);
    shapes[2].position.set(2.7, 2.7, -1.6);
    shapes.forEach((shape) => scene.add(shape));

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      particles.rotation.y = time * 0.045;
      particles.rotation.x = Math.sin(time * 0.18) * 0.08;
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.004 + index * 0.001;
        shape.rotation.y += 0.006 + index * 0.001;
        shape.position.y += Math.sin(time + index) * 0.0015;
      });
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      mount.removeChild(renderer.domElement);
      particlesGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [playground]);

  return <div ref={mountRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-75" />;
}
