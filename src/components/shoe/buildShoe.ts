import * as THREE from "three";

/**
 * 写真も3Dモデルも無いので、靴をパーツから組む。
 * 側面の形（x が前後・y が高さ）を押し出し、上から見た幅を前後と高さで絞って靴の形にする。
 * つま先は +x。長さ約 4.4、高さ約 1.9。
 */

export type ShoeMaterials = {
  upper: THREE.MeshPhysicalMaterial;
  midsole: THREE.MeshPhysicalMaterial;
  outsole: THREE.MeshStandardMaterial;
  trim: THREE.MeshPhysicalMaterial;
  glow: THREE.MeshBasicMaterial;
  dark: THREE.MeshStandardMaterial;
  lace: THREE.MeshStandardMaterial;
};

/** 上から見た幅の割合（ボール部がいちばん広く、かかととつま先が細い） */
function widthAt(x: number): number {
  const u = (x - 0.4) / 2.0;
  return Math.max(0.52, 1 - 0.38 * u * u);
}

/** 押し出した形を z の真ん中にそろえ、前後・高さで幅を絞る */
function taper(geo: THREE.BufferGeometry, depth: number, topNarrow: number, yFrom: number, ySpan: number) {
  geo.translate(0, 0, -depth / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const k = Math.min(1, Math.max(0, (y - yFrom) / ySpan));
    pos.setZ(i, pos.getZ(i) * widthAt(x) * (1 - topNarrow * k * k));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function midsoleShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-2.02, 0.2);
  s.quadraticCurveTo(-2.05, 0.06, -1.82, 0.06);
  s.lineTo(1.35, 0.06);
  s.quadraticCurveTo(2.12, 0.08, 2.2, 0.42);
  s.lineTo(2.1, 0.5);
  // 中底の上の線（かかとが高い）。波打たせて厚底らしく
  s.quadraticCurveTo(0.9, 0.5, 0.2, 0.6);
  s.quadraticCurveTo(-0.9, 0.74, -1.92, 0.8);
  s.quadraticCurveTo(-2.1, 0.72, -2.02, 0.2);
  return s;
}

function outsoleShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.98, 0.2);
  s.quadraticCurveTo(-2.06, -0.02, -1.8, -0.02);
  s.lineTo(1.35, -0.02);
  s.quadraticCurveTo(2.2, 0.0, 2.26, 0.4);
  s.lineTo(2.14, 0.38);
  s.quadraticCurveTo(2.04, 0.12, 1.35, 0.12);
  s.lineTo(-1.8, 0.12);
  s.quadraticCurveTo(-1.95, 0.12, -1.98, 0.2);
  return s;
}

function upperShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.85, 0.74);
  s.lineTo(1.95, 0.5);
  s.quadraticCurveTo(2.26, 0.55, 2.06, 0.82);
  // つま先の箱は低く平ら
  s.quadraticCurveTo(1.7, 1.0, 1.05, 1.04);
  // 甲に向かって反り上がる
  s.quadraticCurveTo(0.45, 1.08, 0.05, 1.42);
  s.lineTo(-0.55, 1.72);
  // 履き口のくぼみ
  s.quadraticCurveTo(-1.0, 1.48, -1.5, 1.6);
  // かかとが持ち上がる
  s.quadraticCurveTo(-1.95, 1.7, -2.08, 1.95);
  s.quadraticCurveTo(-2.22, 1.3, -1.85, 0.74);
  return s;
}

/** つま先から側面の下をぐるりと覆う帯（マッドガード） */
function mudguardShape(): THREE.Shape {
  const s = new THREE.Shape();
  // かかと側はヒールカウンターに任せる（重ねると面がちらつく）
  s.moveTo(-1.25, 0.7);
  s.lineTo(1.95, 0.48);
  s.quadraticCurveTo(2.28, 0.54, 2.12, 0.8);
  s.quadraticCurveTo(1.85, 0.94, 1.4, 0.9);
  s.quadraticCurveTo(0.6, 0.84, 0.1, 0.92);
  s.quadraticCurveTo(-0.7, 1.0, -1.25, 0.98);
  s.lineTo(-1.25, 0.7);
  return s;
}

/** かかとを包む板（ヒールカウンター） */
function heelShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.86, 0.76);
  s.lineTo(-1.2, 0.74);
  s.quadraticCurveTo(-1.1, 1.1, -1.42, 1.36);
  s.quadraticCurveTo(-1.8, 1.56, -1.98, 1.78);
  s.quadraticCurveTo(-2.14, 1.3, -1.86, 0.76);
  return s;
}

/** 側面の「脈拍の波」の帯（PULSAR の名前から） */
function pulseShape(): THREE.Shape {
  const pts: [number, number][] = [
    [-1.55, 1.02],
    [-0.75, 1.02],
    [-0.52, 1.36],
    [-0.22, 0.74],
    [0.06, 1.18],
    [0.26, 0.98],
    [1.45, 0.86],
  ];
  const up: THREE.Vector2[] = [];
  const down: THREE.Vector2[] = [];
  const half = 0.065;
  pts.forEach(([x, y]) => {
    up.push(new THREE.Vector2(x, y + half));
    down.push(new THREE.Vector2(x, y - half));
  });
  const s = new THREE.Shape();
  s.moveTo(up[0].x, up[0].y);
  up.slice(1).forEach((p) => s.lineTo(p.x, p.y));
  down.reverse().forEach((p) => s.lineTo(p.x, p.y));
  s.closePath();
  return s;
}

export function createShoeMaterials(): ShoeMaterials {
  return {
    upper: new THREE.MeshPhysicalMaterial({ roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.3, envMapIntensity: 0.45 }),
    midsole: new THREE.MeshPhysicalMaterial({ roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.6 }),
    outsole: new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.8 }),
    trim: new THREE.MeshPhysicalMaterial({ roughness: 0.25, clearcoat: 1, envMapIntensity: 0.5 }),
    glow: new THREE.MeshBasicMaterial({ toneMapped: false }),
    dark: new THREE.MeshStandardMaterial({ color: "#0b0b0d", roughness: 0.9 }),
    lace: new THREE.MeshStandardMaterial({ color: "#0b0b0d", roughness: 0.6 }),
  };
}

export function buildShoe(m: ShoeMaterials): THREE.Group {
  const shoe = new THREE.Group();

  // 外底
  const outsoleDepth = 1.4;
  const outsole = new THREE.ExtrudeGeometry(outsoleShape(), {
    depth: outsoleDepth,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 16,
  });
  taper(outsole, outsoleDepth, 0, 0, 1);
  shoe.add(new THREE.Mesh(outsole, m.outsole));

  // 中底（厚底）
  const midDepth = 1.3;
  const mid = new THREE.ExtrudeGeometry(midsoleShape(), {
    depth: midDepth,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 4,
    curveSegments: 24,
  });
  taper(mid, midDepth, 0, 0, 1);
  shoe.add(new THREE.Mesh(mid, m.midsole));

  // かかとの光るクッション（両側に窓として出る）
  const pod = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.62, 6, 16), m.glow);
  pod.rotation.z = Math.PI / 2;
  pod.scale.set(1, 1, 6.2);
  pod.position.set(-1.15, 0.42, 0);
  shoe.add(pod);

  // アッパー（丸く膨らませる）
  const upDepth = 1.0;
  const upper = new THREE.ExtrudeGeometry(upperShape(), {
    depth: upDepth,
    bevelEnabled: true,
    bevelThickness: 0.22,
    bevelSize: 0.16,
    bevelSegments: 6,
    curveSegments: 28,
  });
  taper(upper, upDepth, 0.42, 0.7, 1.15);
  shoe.add(new THREE.Mesh(upper, m.upper));

  // 重ねるパネル（アッパーより少しだけ外側に膨らませる）
  const panel = (shape: THREE.Shape, mat: THREE.Material, grow: number) => {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: upDepth,
      bevelEnabled: true,
      bevelThickness: 0.22 + grow,
      bevelSize: 0.16 + grow * 0.5,
      bevelSegments: 6,
      curveSegments: 24,
    });
    taper(g, upDepth, 0.42, 0.7, 1.15);
    shoe.add(new THREE.Mesh(g, mat));
  };
  panel(mudguardShape(), m.outsole, 0.04);
  panel(heelShape(), m.trim, 0.075);

  // 履き口（黒い穴）
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.06, 32), m.dark);
  collar.scale.set(0.52, 1, 0.26);
  collar.position.set(-1.05, 1.6, 0);
  collar.rotation.z = 0.12;
  shoe.add(collar);

  // ベロ
  const tongueShape = new THREE.Shape();
  tongueShape.moveTo(-0.15, 0);
  tongueShape.lineTo(0.18, 0);
  tongueShape.quadraticCurveTo(0.24, 0.42, 0.04, 0.5);
  tongueShape.quadraticCurveTo(-0.16, 0.48, -0.15, 0);
  const tongue = new THREE.Mesh(
    new THREE.ExtrudeGeometry(tongueShape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 3 }),
    m.trim,
  );
  tongue.geometry.translate(0, 0, -0.2);
  tongue.position.set(-0.6, 1.58, 0);
  tongue.rotation.z = 0.5;
  shoe.add(tongue);

  // 紐（甲の反りに沿って）
  const laceGeo = new THREE.CapsuleGeometry(0.06, 0.78, 4, 10);
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const lace = new THREE.Mesh(laceGeo, m.lace);
    lace.rotation.x = Math.PI / 2;
    lace.position.set(0.18 - t * 0.68, 1.5 + t * 0.32, 0);
    shoe.add(lace);
  }

  // かかとのつまみ
  const tab = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.24), m.trim);
  tab.position.set(-2.2, 1.9, 0);
  tab.rotation.z = -0.35;
  shoe.add(tab);

  // 側面の波（両側）
  for (const side of [1, -1]) {
    const geo = new THREE.ExtrudeGeometry(pulseShape(), { depth: 0.05, bevelEnabled: false });
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const k = Math.min(1, Math.max(0, (y - 0.7) / 1.15));
      const surface = 0.72 * widthAt(x) * (1 - 0.42 * k * k);
      pos.setZ(i, side * (surface + 0.012 + pos.getZ(i)));
    }
    geo.computeVertexNormals();
    shoe.add(new THREE.Mesh(geo, m.trim));
  }

  // 真ん中を原点に
  shoe.position.set(0, -0.95, 0);
  const wrap = new THREE.Group();
  wrap.add(shoe);
  return wrap;
}
