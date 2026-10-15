'use client'
/* eslint-disable react-hooks/immutability -- three.js objects are imperative: materials, buffers and
   particle state are intentionally mutated inside useFrame (outside React render), which is the
   documented React Three Fiber pattern. No React state is mutated here. */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { engineLayers } from '@/data/engine'
import type { TierSettings } from './tiers'

/**
 * WebGL Commerce Engine (lazy chunk). Original geometry built from primitives — no external models,
 * no post-processing, no shadows. Six plates (Design → Conversion) separate as the page scrolls,
 * the focused layer slides out, and data particles flow down into one conversion node.
 */

const COLORS = {
  plate: '#102347',
  plateActive: '#18315F',
  edge: new THREE.Color('#C9CFDA'),
  edgeActive: new THREE.Color('#3CC594'),
  ui: '#D7DDE8',
  emerald: '#3CC594',
  teal: '#45C2C2',
  silver: '#9AA4B5',
}

type Refs = {
  focusRef: MutableRefObject<number | null>
  spreadRef: MutableRefObject<number>
}

const smooth = { spread: 0 }

/** Deterministic PRNG (mulberry32) — stable particle layout across renders, no impure Math.random. */
function prng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function layerY(index: number, spread: number) {
  const gap = 0.72 + spread * 0.4
  return (2.5 - index) * gap
}

/** Frames the whole engine for any stage aspect ratio (tall desktop stage, wide mobile stage). */
function CameraFit() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera
  const size = useThree((state) => state.size)
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    const vHalf = THREE.MathUtils.degToRad(camera.fov / 2)
    const hHalf = Math.atan(Math.tan(vHalf) * aspect)
    // Projected half-extents of the full stack (incl. max spread + parallax margin), in world units.
    const distance = Math.max(4.4 / Math.tan(vHalf), 3.25 / Math.tan(hHalf), 11)
    const direction = new THREE.Vector3(1, 0.8, 1).normalize()
    camera.position.copy(direction.multiplyScalar(distance))
    camera.lookAt(0, -0.15, 0)
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

function useMaterials() {
  return useMemo(
    () => ({
      ui: new THREE.MeshStandardMaterial({ color: COLORS.ui, roughness: 0.6, metalness: 0.1, transparent: true, opacity: 0.55 }),
      emerald: new THREE.MeshStandardMaterial({ color: COLORS.emerald, roughness: 0.35, metalness: 0.2, emissive: COLORS.emerald, emissiveIntensity: 0.35 }),
      teal: new THREE.MeshStandardMaterial({ color: COLORS.teal, roughness: 0.4, metalness: 0.2, transparent: true, opacity: 0.75 }),
      silver: new THREE.MeshStandardMaterial({ color: COLORS.silver, roughness: 0.5, metalness: 0.3, transparent: true, opacity: 0.6 }),
      line: new THREE.LineBasicMaterial({ color: COLORS.teal, transparent: true, opacity: 0.7 }),
    }),
    [],
  )
}

type Mats = ReturnType<typeof useMaterials>

function Box({ size, position, material }: { size: [number, number, number]; position: [number, number, number]; material: THREE.Material }) {
  return (
    <mesh position={position} material={material}>
      <boxGeometry args={size} />
    </mesh>
  )
}

function LayerDetail({ id, mats, details }: { id: string; mats: Mats; details: boolean }) {
  const nodes = useMemo(
    () =>
      [
        [0.5, 0.09, -0.85],
        [1.1, 0.09, -0.2],
        [0.75, 0.09, 0.5],
        [1.5, 0.09, 0.95],
      ] as [number, number, number][],
    [],
  )
  const graphLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(nodes.map((point) => new THREE.Vector3(...point)))
    return new THREE.Line(geometry, mats.line)
  }, [nodes, mats.line])
  const ringRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.4
  })

  switch (id) {
    case 'design':
      return (
        <group>
          <Box size={[3.4, 0.03, 0.22]} position={[0, 0.07, -1.15]} material={mats.ui} />
          {[-1.1, 0, 1.1].map((x) =>
            [-0.42, 0.55].map((z) => (
              <Box key={`${x}${z}`} size={[0.95, 0.05, 0.72]} position={[x, 0.08, z]} material={x === 0 && z < 0 ? mats.emerald : mats.ui} />
            )),
          )}
        </group>
      )
    case 'development':
      if (!details) return <Box size={[2.6, 0.03, 0.1]} position={[-0.55, 0.07, 0]} material={mats.emerald} />
      return (
        <group>
          {[2.8, 1.8, 2.4, 1.2, 2.6, 2.0, 1.5, 2.3].map((width, row) => (
            <Box
              key={row}
              size={[width, 0.03, 0.1]}
              position={[-1.85 + width / 2 + (row % 3 === 1 ? 0.25 : 0), 0.07, -1.1 + row * 0.31]}
              material={row === 3 ? mats.emerald : row % 2 ? mats.silver : mats.teal}
            />
          ))}
        </group>
      )
    case 'performance':
      return (
        <group>
          <mesh position={[-0.75, 0.08, 0]} rotation={[-Math.PI / 2, 0, Math.PI * 0.35]} material={mats.emerald}>
            <torusGeometry args={[0.8, 0.035, 8, 64, Math.PI * 1.4]} />
          </mesh>
          <mesh position={[-0.75, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.silver}>
            <torusGeometry args={[0.8, 0.012, 6, 64]} />
          </mesh>
          {details ? (
            <>
              <primitive object={graphLine} />
              {nodes.map((position) => (
                <mesh key={position.join()} position={position} material={mats.emerald}>
                  <sphereGeometry args={[0.07, 12, 12]} />
                </mesh>
              ))}
            </>
          ) : null}
        </group>
      )
    case 'ux':
      return (
        <group>
          <Box size={[1.7, 0.05, 1.1]} position={[-0.85, 0.08, -0.5]} material={mats.ui} />
          <Box size={[0.95, 0.05, 1.1]} position={[0.95, 0.08, -0.5]} material={mats.silver} />
          {details ? <Box size={[3.4, 0.04, 0.32]} position={[0, 0.07, 0.5]} material={mats.ui} /> : null}
          <Box size={[1.3, 0.08, 0.32]} position={[-1.0, 0.09, 1.05]} material={mats.emerald} />
        </group>
      )
    case 'cro':
      return (
        <group>
          <Box size={[0.5, 0.45, 0.5]} position={[-0.65, 0.27, 0.15]} material={mats.silver} />
          <Box size={[0.5, 0.85, 0.5]} position={[0.45, 0.47, 0.15]} material={mats.emerald} />
        </group>
      )
    default:
      return (
        <group>
          <mesh position={[0, 0.34, 0]} material={mats.emerald}>
            <sphereGeometry args={[0.26, 32, 32]} />
          </mesh>
          <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.teal}>
            <torusGeometry args={[0.6, 0.016, 8, 72]} />
          </mesh>
          <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.silver}>
            <torusGeometry args={[1.0, 0.008, 6, 72]} />
          </mesh>
        </group>
      )
  }
}

function Plate({ index, id, mats, details, focusRef }: { index: number; id: string; mats: Mats; details: boolean; focusRef: Refs['focusRef'] }) {
  const group = useRef<THREE.Group>(null)
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(4.2, 0.09, 3.0), [])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(boxGeometry), [boxGeometry])
  const plateMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.plate, roughness: 0.55, metalness: 0.25, transparent: true, opacity: 0.95 }),
    [],
  )
  const edgeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: COLORS.edge.clone(), transparent: true, opacity: 0.35 }), [])
  const activeColor = useMemo(() => new THREE.Color(COLORS.plateActive), [])
  const baseColor = useMemo(() => new THREE.Color(COLORS.plate), [])

  useFrame((_, delta) => {
    const node = group.current
    if (!node) return
    const focused = focusRef.current
    const isActive = focused === index
    const k = 1 - Math.exp(-delta * 6)
    node.position.y += (layerY(index, smooth.spread) + (isActive ? 0.12 : 0) - node.position.y) * k
    node.position.x += ((isActive ? -0.45 : 0) - node.position.x) * k
    edgeMaterial.color.lerp(isActive ? COLORS.edgeActive : COLORS.edge, k)
    edgeMaterial.opacity += ((isActive ? 1 : focused === null ? 0.35 : 0.2) - edgeMaterial.opacity) * k
    plateMaterial.color.lerp(isActive ? activeColor : baseColor, k)
    plateMaterial.opacity += ((focused === null || isActive ? 0.95 : 0.6) - plateMaterial.opacity) * k
  })

  return (
    <group ref={group} position={[0, layerY(index, 0), 0]}>
      <mesh geometry={boxGeometry} material={plateMaterial} />
      <lineSegments geometry={edgesGeometry} material={edgeMaterial} />
      <LayerDetail id={id} mats={mats} details={details} />
    </group>
  )
}

function DataFlow({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null)
  const { positions, seeds } = useMemo(() => {
    const random = prng(20261015 + count)
    const seedArray = Array.from({ length: count }, () => ({
      x: (random() - 0.5) * 3.6,
      z: (random() - 0.5) * 2.4,
      t: random(),
      speed: 0.08 + random() * 0.1,
      swirl: random() * Math.PI * 2,
    }))
    return { positions: new Float32Array(count * 3), seeds: seedArray }
  }, [count])
  const material = useMemo(
    () => new THREE.PointsMaterial({ color: COLORS.teal, size: 0.05, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false }),
    [],
  )

  useFrame((_, delta) => {
    const geometry = points.current?.geometry
    if (!geometry) return
    const top = layerY(0, smooth.spread) + 0.12
    const bottom = layerY(5, smooth.spread) + 0.34
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i]!
      seed.t = (seed.t + delta * seed.speed) % 1
      const eased = seed.t * seed.t * (3 - 2 * seed.t)
      const radius = (1 - eased) * 0.35
      positions[i * 3] = seed.x * (1 - eased) + Math.cos(seed.swirl + seed.t * 6) * radius
      positions[i * 3 + 1] = top + (bottom - top) * seed.t
      positions[i * 3 + 2] = seed.z * (1 - eased) + Math.sin(seed.swirl + seed.t * 6) * radius
    }
    const attribute = geometry.getAttribute('position') as THREE.BufferAttribute
    attribute.needsUpdate = true
  })

  return (
    <points ref={points} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  )
}

function Engine({ settings, focusRef, spreadRef, onReady }: Refs & { settings: TierSettings; onReady: () => void }) {
  const root = useRef<THREE.Group>(null)
  const mats = useMaterials()
  const notified = useRef(false)

  useFrame((state, delta) => {
    const k = 1 - Math.exp(-delta * 4)
    smooth.spread += (spreadRef.current - smooth.spread) * k
    const node = root.current
    if (node) {
      const sway = Math.sin(state.clock.elapsedTime * 0.25) * 0.05
      node.rotation.y += (state.pointer.x * 0.16 + sway - node.rotation.y) * k
      node.rotation.x += (-state.pointer.y * 0.05 - node.rotation.x) * k
    }
    if (!notified.current) {
      notified.current = true
      requestAnimationFrame(() => onReady())
    }
  })

  return (
    <group ref={root}>
      {engineLayers.map((layer) => (
        <Plate key={layer.id} index={layer.index} id={layer.id} mats={mats} details={settings.details} focusRef={focusRef} />
      ))}
      <DataFlow count={settings.particles} />
    </group>
  )
}

export default function EngineScene({
  settings,
  paused,
  focusRef,
  spreadRef,
  onReady,
}: Refs & { settings: TierSettings; paused: boolean; onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, settings.maxDpr]}
      frameloop={paused ? 'never' : 'always'}
      camera={{ position: [9, 7.2, 9], fov: 28, near: 0.1, far: 80 }}
      gl={{ antialias: settings.antialias, alpha: true, powerPreference: 'high-performance', stencil: false }}
      style={{ width: '100%', height: '100%' }}
    >
      <CameraFit />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 9, 4]} intensity={1.5} />
      <directionalLight position={[-6, 3, -4]} intensity={0.35} color="#8FDFF0" />
      <pointLight position={[0, -2.2, 0]} intensity={4} distance={6} color={COLORS.emerald} />
      <Engine settings={settings} focusRef={focusRef} spreadRef={spreadRef} onReady={onReady} />
    </Canvas>
  )
}
