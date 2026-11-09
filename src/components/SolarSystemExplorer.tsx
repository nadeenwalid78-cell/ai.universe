import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  Language,
  PLANETS_DATA,
  PlanetData,
  UI_TRANSLATIONS,
} from "../data/spaceData";
import {
  createPlanetTexture,
  createRingTexture,
  createSunTexture,
} from "../utils/proceduralSpaceTextures";
import {
  Pause,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Compass,
  Sparkles,
  Eye,
  Plus,
  Minus,
} from "lucide-react";

interface SolarSystemExplorerProps {
  language: Language;
  selectedPlanetId: string | null;
  onSelectPlanet: (planetId: string) => void;
  onOpenPlanetDossier: (planetId: string) => void;
  onAskAiAbout: (topic: string) => void;
  astroUnits: boolean;
}

// Pre-allocated math helpers at module scope (zero GC in loop)
const _targetPos = new THREE.Vector3();
const _desiredCamPos = new THREE.Vector3();
const _worldPos = new THREE.Vector3();
const _zoomOffset = new THREE.Vector3();
const _dummyObj = new THREE.Object3D();

export const SolarSystemExplorer: React.FC<SolarSystemExplorerProps> = ({
  language,
  selectedPlanetId,
  onSelectPlanet,
  onOpenPlanetDossier,
  onAskAiAbout,
  astroUnits,
}) => {
  const t = UI_TRANSLATIONS[language].solarSystem;
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [orbitSpeedMultiplier, setOrbitSpeedMultiplier] = useState(1.0);
  const [showOrbits, setShowOrbits] = useState(true);
  const [focusedBodyId, setFocusedBodyId] = useState<string>(
    selectedPlanetId || "earth"
  );
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [specCardCollapsed, setSpecCardCollapsed] = useState(false);
  const [hoveredBodyName, setHoveredBodyName] = useState<string | null>(null);

  // Refs for mutable animation loop state so React state updates never recreate the WebGL scene
  const isPausedRef = useRef(isPaused);
  const speedRef = useRef(orbitSpeedMultiplier);
  const showOrbitsRef = useRef(showOrbits);
  const focusedBodyIdRef = useRef<string | null>(selectedPlanetId || null);
  const cameraTransitionActiveRef = useRef(false);
  const zoomTargetScaleRef = useRef(1.0);
  const languageRef = useRef(language);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = orbitSpeedMultiplier;
  }, [orbitSpeedMultiplier]);

  useEffect(() => {
    showOrbitsRef.current = showOrbits;
  }, [showOrbits]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    if (selectedPlanetId) {
      setFocusedBodyId(selectedPlanetId);
      focusedBodyIdRef.current = selectedPlanetId;
      cameraTransitionActiveRef.current = true;
    }
  }, [selectedPlanetId]);

  // Keyboard shortcut 'H' to toggle bottom control dock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key.toLowerCase() === "h") {
        setDockCollapsed((prev) => !prev);
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software WebGL detection per Three.js skill directive
    const isSoftwareGl = (() => {
      const gl = document.createElement("canvas").getContext("webgl2");
      if (!gl) return true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 1024;
    const height = container.clientHeight || 640;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070d);
    scene.fog = new THREE.FogExp2(0x05070d, 0.0038);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 600);
    camera.position.set(0, 34, 66);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 3. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 5;
    controls.maxDistance = 150;
    controls.maxPolarAngle = Math.PI * 0.85;

    // Cancel scripted camera transition when user grabs controls
    controls.addEventListener("start", () => {
      cameraTransitionActiveRef.current = false;
    });

    // 4. Studio & Heliocentric Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e1b4b, 0.55);
    scene.add(hemiLight);

    const sunPointLight = new THREE.PointLight(0xfffbeb, 4.2, 260, 0.45);
    sunPointLight.position.set(0, 0, 0);
    if (!isSoftwareGl) {
      sunPointLight.castShadow = true;
      sunPointLight.shadow.bias = -0.0005;
    }
    scene.add(sunPointLight);

    const rimDirLight = new THREE.DirectionalLight(0x818cf8, 0.65);
    rimDirLight.position.set(-40, 50, -40);
    scene.add(rimDirLight);

    // 5. Background 3D Starfield InstancedMesh (>20 repeated items)
    const starCount = 450;
    const starGeo = new THREE.OctahedronGeometry(0.16, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const starInstanced = new THREE.InstancedMesh(starGeo, starMat, starCount);
    const starPalette = [
      new THREE.Color(0xe0f2fe),
      new THREE.Color(0xfef08a),
      new THREE.Color(0xddd6fe),
      new THREE.Color(0xfed7aa),
    ];
    for (let i = 0; i < starCount; i++) {
      const r = 110 + ((i * 37) % 90);
      const theta = (i * 2.39996) % (Math.PI * 2);
      const phi = Math.acos(1 - (2 * (i + 0.5)) / starCount);
      _dummyObj.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.65,
        r * Math.sin(phi) * Math.sin(theta)
      );
      const s = 0.6 + (i % 5) * 0.25;
      _dummyObj.scale.set(s, s, s);
      _dummyObj.updateMatrix();
      starInstanced.setMatrixAt(i, _dummyObj.matrix);
      starInstanced.setColorAt(i, starPalette[i % starPalette.length]);
    }
    starInstanced.instanceMatrix.needsUpdate = true;
    if (starInstanced.instanceColor)
      starInstanced.instanceColor.needsUpdate = true;
    starInstanced.computeBoundingSphere();
    scene.add(starInstanced);

    const textureLoader = new THREE.TextureLoader();
    const loadRealTexture = (
      url: string,
      fallbackTex: THREE.Texture
    ): THREE.Texture => {
      const loaded = textureLoader.load(
        url,
        (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = maxAnisotropy;
          t.needsUpdate = true;
        },
        undefined,
        () => {
          // Keep fallback procedural texture if load fails
        }
      );
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = maxAnisotropy;
      return loaded || fallbackTex;
    };

    // 6. Composite Sun Model (THREE.Group with real photographic solar texture)
    const sunGroup = new THREE.Group();
    sunGroup.name = "sun";
    const fallbackSunTex = createSunTexture(maxAnisotropy);
    const sunTexture = loadRealTexture(
      "/images/textures/sun.jpg",
      fallbackSunTex
    );
    const sunCoreGeo = new THREE.SphereGeometry(4.2, 48, 48);
    const sunCoreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: sunTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: sunTexture,
      emissiveIntensity: 1.25,
      roughness: 0.3,
      metalness: 0.05,
    });
    const sunCoreMesh = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    sunCoreMesh.userData = { bodyId: "sun" };
    sunGroup.add(sunCoreMesh);

    const coronaGeo = new THREE.SphereGeometry(4.65, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      side: THREE.BackSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    sunGroup.add(coronaMesh);

    const outerCoronaGeo = new THREE.RingGeometry(4.7, 6.2, 64);
    const outerCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const outerCoronaMesh = new THREE.Mesh(outerCoronaGeo, outerCoronaMat);
    outerCoronaMesh.rotation.x = Math.PI / 2;
    sunGroup.add(outerCoronaMesh);

    scene.add(sunGroup);

    // 7. Asteroid Belt between Mars (23) and Jupiter (30) using InstancedMesh
    const asteroidCount = 220;
    const astGeo = new THREE.DodecahedronGeometry(0.14, 0);
    const astMat = new THREE.MeshStandardMaterial({
      color: 0x71717a,
      roughness: 0.85,
      metalness: 0.25,
    });
    const asteroidBelt = new THREE.InstancedMesh(
      astGeo,
      astMat,
      asteroidCount
    );
    for (let i = 0; i < asteroidCount; i++) {
      const angle = (i / asteroidCount) * Math.PI * 2 + (i % 7) * 0.13;
      const radius = 26.2 + ((i * 19) % 100) * 0.022;
      const yOffset = (((i * 31) % 20) - 10) * 0.06;
      _dummyObj.position.set(
        Math.cos(angle) * radius,
        yOffset,
        Math.sin(angle) * radius
      );
      _dummyObj.rotation.set(i * 0.4, i * 0.7, i * 0.2);
      const scale = 0.65 + (i % 4) * 0.28;
      _dummyObj.scale.set(scale, scale * 0.8, scale * 1.1);
      _dummyObj.updateMatrix();
      asteroidBelt.setMatrixAt(i, _dummyObj.matrix);
    }
    asteroidBelt.instanceMatrix.needsUpdate = true;
    asteroidBelt.computeBoundingSphere();
    scene.add(asteroidBelt);

    // 8. Build Composite 3-6 Part Planet Groups + Orbital Paths with Real NASA Textures
    const clickableMeshes: THREE.Object3D[] = [sunCoreMesh];
    const orbitLines: THREE.Line[] = [];
    const planetControllers: {
      planet: PlanetData;
      pivotGroup: THREE.Group;
      planetGroup: THREE.Group;
      surfaceMesh: THREE.Mesh;
      moonPivot?: THREE.Group;
      angle: number;
    }[] = [];

    const ringTexture = createRingTexture("#fde68a");
    const uranusRingTexture = createRingTexture("#67e8f9");
    const realMoonTexture = textureLoader.load("/images/textures/moon.jpg");
    realMoonTexture.colorSpace = THREE.SRGBColorSpace;
    realMoonTexture.anisotropy = maxAnisotropy;

    PLANETS_DATA.forEach((planet, idx) => {
      const {
        orbitRadius3D,
        radius3D,
        atmosphereColor,
        hasRings,
        ringTilt,
      } = planet.visualConfig;

      // Orbital path circle
      const orbitPoints: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        orbitPoints.push(
          new THREE.Vector3(
            Math.cos(theta) * orbitRadius3D,
            0,
            Math.sin(theta) * orbitRadius3D
          )
        );
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.55,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);
      orbitLines.push(orbitLine);

      // Planet composite group
      const pivotGroup = new THREE.Group();
      const initialAngle = idx * 0.85 + 0.4;
      pivotGroup.position.set(
        Math.cos(initialAngle) * orbitRadius3D,
        0,
        Math.sin(initialAngle) * orbitRadius3D
      );
      scene.add(pivotGroup);

      const planetGroup = new THREE.Group();
      // Axial tilt
      planetGroup.rotation.z = THREE.MathUtils.degToRad(
        Math.min(planet.axialTiltDeg, 98)
      );
      pivotGroup.add(planetGroup);

      // Part 1: High-res real NASA textured planetary sphere
      const fallbackTex = createPlanetTexture(planet, maxAnisotropy);
      const tex = loadRealTexture(
        `/images/textures/${planet.id}.jpg`,
        fallbackTex
      );
      const sphereGeo = new THREE.SphereGeometry(radius3D, 48, 48);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: tex,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: tex,
        emissiveIntensity: 0.24,
        roughness:
          planet.id === "mercury" || planet.id === "mars" ? 0.78 : 0.45,
        metalness: 0.05,
      });
      const surfaceMesh = new THREE.Mesh(sphereGeo, sphereMat);
      surfaceMesh.castShadow = !isSoftwareGl;
      surfaceMesh.receiveShadow = !isSoftwareGl;
      surfaceMesh.userData = { bodyId: planet.id };
      planetGroup.add(surfaceMesh);
      clickableMeshes.push(surfaceMesh);

      // Part 2: Invisible slightly larger collision proxy for effortless clicking
      const proxyGeo = new THREE.SphereGeometry(
        Math.max(radius3D * 1.45, 1.35),
        16,
        16
      );
      const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
      const proxyMesh = new THREE.Mesh(proxyGeo, proxyMat);
      proxyMesh.userData = { bodyId: planet.id };
      planetGroup.add(proxyMesh);
      clickableMeshes.push(proxyMesh);

      // Part 3: Atmospheric limb halo shell
      const atmoGeo = new THREE.SphereGeometry(radius3D * 1.06, 28, 28);
      const atmoMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(atmosphereColor),
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        side: THREE.BackSide,
      });
      const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
      planetGroup.add(atmoMesh);

      // Part 4: Equatorial orbital indicator ring or Planetary Ring System
      if (hasRings) {
        const innerR = radius3D * 1.35;
        const outerR =
          planet.id === "saturn" ? radius3D * 2.45 : radius3D * 1.95;
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 64);
        // Remap UVs radially for ring texture
        const pos = ringGeo.attributes.position;
        const uv = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const dist = Math.sqrt(vx * vx + vy * vy);
          uv.setXY(i, (dist - innerR) / (outerR - innerR), 0.5);
        }
        const ringMat = new THREE.MeshStandardMaterial({
          map: planet.id === "saturn" ? ringTexture : uranusRingTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          roughness: 0.5,
          metalness: 0.1,
          depthWrite: false,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2 + (ringTilt || 0) * 0.15;
        planetGroup.add(ringMesh);
      }

      // Part 5: Major Moon(s) for Earth, Mars, Jupiter, Saturn with real Moon texture
      let moonPivot: THREE.Group | undefined;
      if (
        planet.id === "earth" ||
        planet.id === "jupiter" ||
        planet.id === "saturn" ||
        planet.id === "mars"
      ) {
        moonPivot = new THREE.Group();
        const moonGeo = new THREE.SphereGeometry(
          Math.max(radius3D * 0.22, 0.2),
          20,
          20
        );
        const moonMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: realMoonTexture,
          emissive: new THREE.Color(0xffffff),
          emissiveMap: realMoonTexture,
          emissiveIntensity: 0.18,
          roughness: 0.8,
          metalness: 0.1,
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(radius3D * 1.9, 0.15, 0);
        moonPivot.add(moonMesh);
        pivotGroup.add(moonPivot);
      }

      planetControllers.push({
        planet,
        pivotGroup,
        planetGroup,
        surfaceMesh,
        moonPivot,
        angle: initialAngle,
      });
    });

    // Pre-warm shaders on GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 9. Raycasting for Click and Hover (throttled pointermove)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let lastHoverRaycast = 0;
    let pointerDownPos = { x: 0, y: 0 };

    const updatePointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return; // Ignore drag gestures

      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const bodyId = hits[0].object.userData?.bodyId;
        if (bodyId) {
          setFocusedBodyId(bodyId);
          focusedBodyIdRef.current = bodyId;
          cameraTransitionActiveRef.current = true;
          if (bodyId !== "sun") {
            onSelectPlanet(bodyId);
          }
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverRaycast < 55) return;
      lastHoverRaycast = now;

      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const bodyId = hits[0].object.userData?.bodyId;
        renderer.domElement.style.cursor = "pointer";
        if (bodyId === "sun") {
          setHoveredBodyName(
            languageRef.current === "ar" ? "الشمس (Sol)" : "The Sun (Sol)"
          );
        } else {
          const found = PLANETS_DATA.find((p) => p.id === bodyId);
          setHoveredBodyName(
            found ? found.name[languageRef.current] : null
          );
        }
      } else {
        renderer.domElement.style.cursor = "grab";
        setHoveredBodyName(null);
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointermove", onPointerMove);

    // 10. Animation Loop with Software-WebGL Pacing & Exponential Camera Damping
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);

      // Rotate Sun
      sunCoreMesh.rotation.y += delta * 0.18;
      asteroidBelt.rotation.y +=
        delta * 0.04 * (isPausedRef.current ? 0 : speedRef.current);

      // Toggle orbital lines visibility
      for (let i = 0; i < orbitLines.length; i++) {
        orbitLines[i].visible = showOrbitsRef.current;
      }

      // Advance planet orbits & axial rotations
      for (let i = 0; i < planetControllers.length; i++) {
        const ctrl = planetControllers[i];
        if (!isPausedRef.current) {
          ctrl.angle +=
            delta *
            ctrl.planet.visualConfig.orbitSpeed *
            0.35 *
            speedRef.current;
          const r = ctrl.planet.visualConfig.orbitRadius3D;
          ctrl.pivotGroup.position.set(
            Math.cos(ctrl.angle) * r,
            0,
            Math.sin(ctrl.angle) * r
          );
        }
        ctrl.surfaceMesh.rotation.y +=
          delta * ctrl.planet.visualConfig.rotationSpeed * 22;
        if (ctrl.moonPivot) {
          ctrl.moonPivot.rotation.y += delta * 1.4;
        }
      }

      // Smooth exponential damping toward focused celestial body
      const activeId = focusedBodyIdRef.current;
      if (activeId) {
        if (activeId === "sun") {
          _worldPos.set(0, 0, 0);
        } else {
          const foundCtrl = planetControllers.find(
            (c) => c.planet.id === activeId
          );
          if (foundCtrl) {
            _worldPos.copy(foundCtrl.pivotGroup.position);
          }
        }

        // Smoothly damp controls.target toward active planet
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          _worldPos.x,
          4.5,
          delta
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          _worldPos.y,
          4.5,
          delta
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          _worldPos.z,
          4.5,
          delta
        );

        if (cameraTransitionActiveRef.current) {
          const distOffset = activeId === "sun" ? 28 : 9.5;
          _desiredCamPos.set(
            _worldPos.x + distOffset * 0.7,
            _worldPos.y + distOffset * 0.55,
            _worldPos.z + distOffset
          );
          camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            _desiredCamPos.x,
            3.2,
            delta
          );
          camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            _desiredCamPos.y,
            3.2,
            delta
          );
          camera.position.z = THREE.MathUtils.damp(
            camera.position.z,
            _desiredCamPos.z,
            3.2,
            delta
          );
          if (camera.position.distanceTo(_desiredCamPos) < 0.8) {
            cameraTransitionActiveRef.current = false;
          }
        }
      } else if (cameraTransitionActiveRef.current) {
        // Overview reset
        _targetPos.set(0, 0, 0);
        _desiredCamPos.set(0, 34, 66);
        controls.target.lerp(_targetPos, 1 - Math.exp(-4 * delta));
        camera.position.lerp(_desiredCamPos, 1 - Math.exp(-3.5 * delta));
        if (camera.position.distanceTo(_desiredCamPos) < 0.8) {
          cameraTransitionActiveRef.current = false;
        }
      }

      // Smooth zoom from corner + / - buttons
      if (Math.abs(zoomTargetScaleRef.current - 1.0) > 0.001) {
        const nextScale = THREE.MathUtils.damp(
          zoomTargetScaleRef.current,
          1.0,
          10,
          delta
        );
        const stepRatio = zoomTargetScaleRef.current / nextScale;
        zoomTargetScaleRef.current = nextScale;

        _zoomOffset.copy(camera.position).sub(controls.target);
        const currentDist = _zoomOffset.length();
        if (currentDist > 0.001) {
          const clampedDist = THREE.MathUtils.clamp(
            currentDist * stepRatio,
            controls.minDistance,
            controls.maxDistance
          );
          _zoomOffset.setLength(clampedDist);
          camera.position.copy(controls.target).add(_zoomOffset);
          if (
            clampedDist === controls.minDistance ||
            clampedDist === controls.maxDistance
          ) {
            zoomTargetScaleRef.current = 1.0;
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1024;
      const h = container.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  const handleFocusBody = (id: string | null) => {
    zoomTargetScaleRef.current = 1.0;
    if (id === null) {
      setFocusedBodyId("overview");
      focusedBodyIdRef.current = null;
      cameraTransitionActiveRef.current = true;
      return;
    }
    setFocusedBodyId(id);
    focusedBodyIdRef.current = id;
    cameraTransitionActiveRef.current = true;
    if (id !== "sun") {
      onSelectPlanet(id);
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    cameraTransitionActiveRef.current = false;
    const factor = direction === "in" ? 0.76 : 1.32;
    zoomTargetScaleRef.current = THREE.MathUtils.clamp(
      zoomTargetScaleRef.current * factor,
      0.35,
      2.8
    );
  };

  const activePlanet: PlanetData | undefined = PLANETS_DATA.find(
    (p) => p.id === focusedBodyId
  );

  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <p className="text-xs font-mono tracking-wider text-cyan-400 uppercase mb-1.5">
            {t.kicker}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            {t.title}
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-xl">{t.subtitle}</p>
      </div>

      {/* 3D Viewport Container */}
      <div className="relative w-full h-[640px] sm:h-[700px] rounded-2xl overflow-hidden border border-slate-800 bg-[#05070d]">
        {/* Isolated WebGL Canvas Mount Ref */}
        <div ref={canvasMountRef} className="w-full h-full" />

        {/* Top-Left Minimal Spec Overlay (No backdrop-filter over WebGL per Three.js skill) */}
        <div className="absolute top-4 start-4 z-10 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-[#0b0f19]/92 border border-slate-800 rounded-xl p-3.5 pointer-events-auto transition-all duration-200">
          {focusedBodyId === "sun" ? (
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src="/images/space/sun.jpg"
                    alt={t.sunTitle}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/40 shrink-0 bg-black"
                  />
                  <div className="min-w-0">
                    <span className="block text-[11px] font-mono text-amber-400 truncate">
                      {t.sunType}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white truncate">
                      {t.sunTitle}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSpecCardCollapsed((prev) => !prev)}
                  aria-label={specCardCollapsed ? "Expand panel" : "Collapse panel"}
                  title={
                    specCardCollapsed
                      ? language === "ar"
                        ? "فتح المربع"
                        : "Expand info"
                      : language === "ar"
                      ? "إغلاق المربع"
                      : "Collapse info"
                  }
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                >
                  {specCardCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  )}
                </button>
              </div>

              {!specCardCollapsed && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-800/80">
                  <p className="text-xs font-mono text-slate-300 mb-2">
                    {t.sunTemp}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {t.sunDesc}
                  </p>
                  <button
                    onClick={() =>
                      onAskAiAbout(
                        language === "ar"
                          ? "اشرح كيف يولّد الاندماج النووي في نواة الشمس طاقتها وكيف تؤثر الرياح الشمسية على الكواكب."
                          : "Explain how nuclear fusion inside the Sun's core works and how solar wind affects the planets."
                      )
                    }
                    className="w-full py-2 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {t.askAiAbout} {t.sunTitle}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : activePlanet ? (
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={`/images/space/${activePlanet.id}.jpg`}
                    alt={activePlanet.name[language]}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500/40 shrink-0 bg-black"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono truncate">
                      <span>0{activePlanet.order}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">
                        {activePlanet.classification[language]}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                      {activePlanet.name[language]}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSpecCardCollapsed((prev) => !prev)}
                  aria-label={specCardCollapsed ? "Expand panel" : "Collapse panel"}
                  title={
                    specCardCollapsed
                      ? language === "ar"
                        ? "فتح المربع"
                        : "Expand info"
                      : language === "ar"
                      ? "إغلاق المربع"
                      : "Collapse info"
                  }
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                >
                  {specCardCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  )}
                </button>
              </div>

              {!specCardCollapsed && (
                <div className="mt-2">
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {activePlanet.tagline[language]}
                  </p>

                  {/* Quick Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 mb-3 text-xs">
                    <div>
                      <span className="block text-slate-400">
                        {UI_TRANSLATIONS[language].planets.distanceFromSun}
                      </span>
                      <span className="font-mono font-semibold text-slate-100 tabular-nums">
                        {astroUnits
                          ? `${activePlanet.distanceAU} AU`
                          : activePlanet.distanceKm}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400">
                        {UI_TRANSLATIONS[language].planets.avgTemperature}
                      </span>
                      <span className="font-mono font-semibold text-slate-100 tabular-nums">
                        {astroUnits
                          ? `${activePlanet.avgTempK} K`
                          : `${activePlanet.avgTempC} °C`}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400">
                        {UI_TRANSLATIONS[language].planets.diameter}
                      </span>
                      <span className="font-mono font-semibold text-slate-100 tabular-nums">
                        {activePlanet.diameterKm.toLocaleString()} km
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400">
                        {UI_TRANSLATIONS[language].planets.moons}
                      </span>
                      <span className="font-mono font-semibold text-slate-100 tabular-nums">
                        {activePlanet.moonsCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPlanetDossier(activePlanet.id)}
                      className="flex-1 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.openFullDossier}</span>
                    </button>
                    <button
                      onClick={() =>
                        onAskAiAbout(
                          language === "ar"
                            ? `ما هي أبرز الخصائص العلمية لكوكب ${activePlanet.name.ar} وما الذي يجعله فريداً في النظام الشمسي؟`
                            : `What are the most fascinating scientific facts about ${activePlanet.name.en} and what makes its atmosphere and structure unique?`
                        )
                      }
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1 whitespace-nowrap"
                      title={t.askAiAbout}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[11px] font-mono text-cyan-400 truncate">
                    {t.scaleModeObservatory}
                  </span>
                  <h3 className="text-base font-bold text-white truncate">
                    {t.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSpecCardCollapsed((prev) => !prev)}
                  aria-label={specCardCollapsed ? "Expand panel" : "Collapse panel"}
                  title={
                    specCardCollapsed
                      ? language === "ar"
                        ? "فتح المربع"
                        : "Expand info"
                      : language === "ar"
                      ? "إغلاق المربع"
                      : "Collapse info"
                  }
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                >
                  {specCardCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  )}
                </button>
              </div>
              {!specCardCollapsed && (
                <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                  {UI_TRANSLATIONS[language].hero.interactivePreviewHint}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Corner Zoom Controls (+ / -) & Hover Target Readout */}
        <div className="absolute top-4 end-4 z-10 flex flex-col items-end gap-2 pointer-events-auto">
          <div className="flex flex-col bg-[#0b0f19]/92 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <button
              onClick={() => handleZoom("in")}
              aria-label={language === "ar" ? "تكبير النظام الشمسي (+)" : "Zoom in (+)"}
              title={language === "ar" ? "تكبير (+)" : "Zoom in (+)"}
              className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-cyan-400 hover:bg-slate-800/90 active:bg-slate-800 transition-colors border-b border-slate-800 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom("out")}
              aria-label={language === "ar" ? "تصغير النظام الشمسي (-)" : "Zoom out (-)"}
              title={language === "ar" ? "تصغير (-)" : "Zoom out (-)"}
              className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-cyan-400 hover:bg-slate-800/90 active:bg-slate-800 transition-colors cursor-pointer"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>

          {hoveredBodyName && (
            <div className="bg-[#0b0f19]/92 border border-cyan-500/40 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 pointer-events-none whitespace-nowrap">
              ⊕ {hoveredBodyName}
            </div>
          )}
        </div>

        {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Clutter) */}
        <div
          className={`absolute bottom-4 inset-x-0 mx-auto z-10 w-[94%] max-w-[940px] transition-transform duration-200 ${
            dockCollapsed ? "translate-y-[calc(100%-34px)]" : "translate-y-0"
          }`}
        >
          {/* Collapse / Expand Handle */}
          <div className="flex justify-center mb-1">
            <button
              onClick={() => setDockCollapsed((prev) => !prev)}
              className="px-3 py-1 rounded-t-lg bg-[#0b0f19]/95 border border-b-0 border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.showDock} (H)</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.hideDock} (H)</span>
                </>
              )}
            </button>
          </div>

          {/* Main Dock Body */}
          <div className="bg-[#0b0f19]/95 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-2xl mx-auto">
            {/* Row 1: Celestial Body Selector Bar */}
            <div className="flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto pb-2.5 mb-2.5 border-b border-slate-800/80">
              <button
                onClick={() => handleFocusBody("sun")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  focusedBodyId === "sun"
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                ☀ {language === "ar" ? "الشمس" : "Sun"}
              </button>
              {PLANETS_DATA.map((planet) => (
                <button
                  key={planet.id}
                  onClick={() => handleFocusBody(planet.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    focusedBodyId === planet.id
                      ? "bg-cyan-500 text-slate-950 font-semibold"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  0{planet.order}. {planet.name[language]}
                </button>
              ))}
            </div>

            {/* Row 2: Playback, Speed Slider, Orbit Toggle & Reset Camera */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused((prev) => !prev)}
                  className="px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{t.resume}</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>{t.pause}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowOrbits((prev) => !prev)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                    showOrbits
                      ? "bg-slate-800 border-cyan-500/50 text-cyan-300"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 inline me-1.5" />
                  {t.showOrbits}: {showOrbits ? "ON" : "OFF"}
                </button>
              </div>

              {/* Speed Scrubber with Explicit Label & Unit */}
              <div className="flex items-center gap-3 flex-1 min-w-[200px] max-w-xs">
                <label
                  htmlFor="orbit-speed-slider"
                  className="text-xs text-slate-300 whitespace-nowrap shrink-0"
                >
                  {t.speedLabel}:
                </label>
                <input
                  id="orbit-speed-slider"
                  type="range"
                  min="0.1"
                  max="4.0"
                  step="0.1"
                  value={orbitSpeedMultiplier}
                  onChange={(e) =>
                    setOrbitSpeedMultiplier(parseFloat(e.target.value))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-xs font-mono text-cyan-400 tabular-nums whitespace-nowrap shrink-0">
                  {orbitSpeedMultiplier.toFixed(1)}×
                </span>
              </div>

              <button
                onClick={() => handleFocusBody(null)}
                className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetCamera}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
