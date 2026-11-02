"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useColorway } from "@/components/ColorwayProvider";
import type { Colorway } from "@/lib/colorways";
import { stageTarget, type Slot } from "@/lib/shoePose";
import { buildShoe, createShoeMaterials, type ShoeMaterials } from "./buildShoe";

const SHOE_LENGTH = 4.5;
const FOV = 35;
const CAM_Z = 10;
const TAU = Math.PI * 2;

function readSlots(): Slot[] {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-shoe-slot]"));
  return els.map((el) => {
    const r = el.getBoundingClientRect();
    const n = (k: string) => Number(el.dataset[k] ?? 0);
    return {
      rect: { top: r.top, left: r.left, width: r.width, height: r.height },
      pose: { rotX: n("rx"), rotY: n("ry"), rotZ: n("rz"), spin: n("spin") },
    };
  });
}

function dotTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  if (g) {
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.35, "rgba(255,255,255,0.8)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeDust(count: number, tex: THREE.Texture, size: number) {
  const geo = new THREE.BufferGeometry();
  const p = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    p[i * 3] = (Math.random() - 0.5) * 22;
    p[i * 3 + 1] = (Math.random() - 0.5) * 14;
    p[i * 3 + 2] = -8 + Math.random() * 11;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  const mat = new THREE.PointsMaterial({ size, map: tex, transparent: true, depthWrite: false, sizeAttenuation: true });
  return new THREE.Points(geo, mat);
}

type Targets = Record<keyof Colorway["shoe"], THREE.Color> & { accent: THREE.Color };

function targetsFor(c: Colorway): Targets {
  return {
    upper: new THREE.Color(c.shoe.upper),
    midsole: new THREE.Color(c.shoe.midsole),
    outsole: new THREE.Color(c.shoe.outsole),
    trim: new THREE.Color(c.shoe.trim),
    glow: new THREE.Color(c.shoe.glow),
    accent: new THREE.Color(c.accent),
  };
}

/**
 * 画面に固定した1枚の WebGL。靴は [data-shoe-slot] の置き場をスクロールに合わせて渡り歩く。
 * prefers-reduced-motion では、回転・粒・揺れを止め、置き場にそのまま付く。
 */
export function ShoeStage() {
  const holder = useRef<HTMLDivElement>(null);
  const { colorway } = useColorway();
  const colorRef = useRef<Colorway>(colorway);
  const bumpRef = useRef(0);
  const wakeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    colorRef.current = colorway;
    bumpRef.current = 1;
    wakeRef.current?.();
  }, [colorway]);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 720px)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: "high-performance" });
    } catch {
      el.dataset.failed = "true";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // 蛍光色が白っぽく褪せないよう、色相を保つトーンマップ
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
    camera.position.set(0, 0, CAM_Z);

    // 光：上からの白、左にピンク、右に青の縁取り
    scene.add(new THREE.HemisphereLight("#ffffff", "#202030", 0.6));
    const key = new THREE.DirectionalLight("#ffffff", 2.2);
    key.position.set(3, 6, 6);
    scene.add(key);
    const rimA = new THREE.PointLight("#ff2e9a", 40, 30);
    rimA.position.set(-6, 2, 2);
    scene.add(rimA);
    const rimB = new THREE.PointLight("#3b4bff", 50, 30);
    rimB.position.set(6, -1, -3);
    scene.add(rimB);

    const mats: ShoeMaterials = createShoeMaterials();
    const first = targetsFor(colorRef.current);
    mats.upper.color.copy(first.upper);
    mats.midsole.color.copy(first.midsole);
    mats.outsole.color.copy(first.outsole);
    mats.trim.color.copy(first.trim);
    mats.glow.color.copy(first.glow);

    // rig：位置と大きさ。shoe：向き
    const rig = new THREE.Group();
    const tilt = new THREE.Group();
    const shoe = buildShoe(mats);
    tilt.add(shoe);
    rig.add(tilt);

    // 足元の光る輪
    const ringMat = new THREE.MeshBasicMaterial({ color: first.accent, toneMapped: false, transparent: true, opacity: 0.9 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.025, 8, 128), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.25;
    rig.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.012, 6, 128), ringMat);
    ring2.rotation.x = Math.PI / 2 + 0.25;
    ring2.position.y = -1.0;
    rig.add(ring2);
    scene.add(rig);

    // 粒（白と差し色）
    const tex = dotTexture();
    const dustW = makeDust(small ? 140 : 320, tex, 0.07);
    const dustA = makeDust(small ? 70 : 160, tex, 0.12);
    (dustW.material as THREE.PointsMaterial).color.set("#ffffff");
    (dustW.material as THREE.PointsMaterial).opacity = 0.55;
    (dustA.material as THREE.PointsMaterial).color.copy(first.accent);
    scene.add(dustW, dustA);

    let w = 1;
    let h = 1;
    const resize = () => {
      w = Math.max(el.clientWidth, 1);
      h = Math.max(el.clientHeight, 1);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      wake();
    };

    const state = {
      x: 0,
      y: 0,
      s: 0.0001,
      rx: 0,
      ry: 0,
      rz: 0,
      spinAngle: reduced ? 0 : -0.9,
      intro: reduced ? 1 : 0,
    };
    let lastScroll = window.scrollY;
    let velocity = 0;
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    let raf = 0;
    let running = false;
    let last = performance.now();
    let settled = 0;
    let targetId = colorRef.current.id;
    let c = first;
    const glowTarget = new THREE.Color();

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const visibleH = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      const upp = visibleH / h;

      const target = stageTarget(readSlots(), h);
      const k = reduced ? 1 : 1 - Math.exp(-dt * 7);
      if (target) {
        const tx = (target.cx - w / 2) * upp;
        const ty = -(target.cy - h / 2) * upp;
        const ts = Math.max(0.0001, (target.size * 0.9 * upp) / SHOE_LENGTH);
        // 置き場に付いて流れる時は追いつきを速く（文字とずれない）
        const kp = reduced ? 1 : 1 - Math.exp(-dt * 14);
        state.x += (tx - state.x) * kp;
        state.y += (ty - state.y) * kp;
        state.s += (ts - state.s) * k;
        state.rx += (target.rotX - state.rx) * k;
        state.rz += (target.rotZ - state.rz) * k;

        if (!reduced) {
          state.spinAngle += dt * 0.45 * target.spin;
          const home = Math.round(state.spinAngle / TAU) * TAU;
          state.spinAngle += (home - state.spinAngle) * (1 - target.spin) * (1 - Math.exp(-dt * 3));
        }
        const ry = target.rotY + state.spinAngle;
        state.ry += (ry - state.ry) * k;
      }

      // スクロールの速さで、靴が少し傾く
      const sy = window.scrollY;
      const v = (sy - lastScroll) / Math.max(dt, 0.001);
      lastScroll = sy;
      velocity += (THREE.MathUtils.clamp(v, -3000, 3000) - velocity) * (1 - Math.exp(-dt * 6));

      if (!reduced) state.intro = Math.min(1, state.intro + dt * 0.9);
      const introE = 1 - Math.pow(1 - state.intro, 3);
      const bump = bumpRef.current;
      bumpRef.current = Math.max(0, bump - dt * 2.2);
      const pop = 1 + Math.sin(bump * Math.PI) * 0.08;

      rig.position.set(state.x, state.y + (reduced ? 0 : Math.sin(now / 900) * 0.06 * state.s), 0);
      rig.scale.setScalar(state.s * introE * pop);
      tilt.rotation.set(
        state.rx + (reduced ? 0 : pointer.y * 0.12),
        state.ry + (reduced ? 0 : pointer.x * 0.25),
        state.rz + (reduced ? 0 : THREE.MathUtils.clamp(velocity * -0.00012, -0.35, 0.35)),
      );
      ring.rotation.z += reduced ? 0 : dt * 0.6;
      ring2.rotation.z -= reduced ? 0 : dt * 0.35;

      // 色を寄せる
      if (colorRef.current.id !== targetId) {
        targetId = colorRef.current.id;
        c = targetsFor(colorRef.current);
      }
      const kc = reduced ? 1 : 1 - Math.exp(-dt * 6);
      mats.upper.color.lerp(c.upper, kc);
      mats.midsole.color.lerp(c.midsole, kc);
      mats.outsole.color.lerp(c.outsole, kc);
      mats.trim.color.lerp(c.trim, kc);
      ringMat.color.lerp(c.accent, kc);
      (dustA.material as THREE.PointsMaterial).color.lerp(c.accent, kc);
      const glowPulse = reduced ? 1.3 : 1.1 + Math.sin(now / 260) * 0.35;
      glowTarget.copy(c.glow).multiplyScalar(glowPulse);
      mats.glow.color.lerp(glowTarget, kc);

      if (!reduced) {
        for (const d of [dustW, dustA]) {
          d.rotation.y += dt * 0.02;
          d.position.y = ((now / 1000) * 0.15 + sy * 0.0015) % 2;
        }
      }

      renderer.render(scene, camera);

      // 止まったら描くのをやめる（reduced のときだけ）
      if (reduced) {
        settled++;
        if (settled > 2) {
          running = false;
          return;
        }
      }
      if (!document.hidden) raf = requestAnimationFrame(frame);
      else running = false;
    };

    function wake() {
      settled = 0;
      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    wakeRef.current = wake;

    const onScroll = () => {
      if (reduced) wake();
    };
    const onVis = () => {
      if (!document.hidden) wake();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    el.dataset.ready = "true";
    wake();

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) o.geometry.dispose();
      });
      Object.values(mats).forEach((mt) => mt.dispose());
      ringMat.dispose();
      (dustW.material as THREE.Material).dispose();
      (dustA.material as THREE.Material).dispose();
      tex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={holder} className="stage" aria-hidden="true" />;
}
