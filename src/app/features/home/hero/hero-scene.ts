import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  InstancedMesh,
  MathUtils,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

export interface HeroSceneOptions {
  reducedMotion: boolean;
}

interface Cell {
  col: number;
  row: number;
  from: Vector3;
  fromRot: Quaternion;
  to: Vector3;
  delay: number;
  kind: 'base' | 'header' | 'sum';
}

const COLORS = {
  base: new Color('#1f4366'),
  header: new Color('#2b5b86'),
  sum: new Color('#2fc47a'),
  flow: new Color('#2fc47a'),
};

const INTRO_SECONDS = 2.6;

/**
 * Hero scena: rasute ćelije tabele slažu se u uređenu mrežu,
 * a zatim "proračun" prolazi zeleno kroz redove i sliva se u red sa zbirom.
 */
export class HeroScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(35, 1, 0.1, 100);
  private readonly group = new Group();
  private readonly mesh: InstancedMesh;
  private readonly cells: Cell[] = [];
  private readonly dummy = new Object3D();
  private readonly tmpColor = new Color();
  private readonly identityQ = new Quaternion();
  private readonly cols: number;
  private readonly rows: number;

  private frame = 0;
  private running = false;
  private visible = true;
  private startTime = 0;
  private pointer = { x: 0, y: 0 };
  private tilt = { x: 0, y: 0 };
  private scrollProgress = 0;
  private readonly resizeObserver: ResizeObserver;
  private readonly intersection: IntersectionObserver;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: HeroSceneOptions,
  ) {
    const small = canvas.clientWidth < 700;
    this.cols = small ? 7 : 10;
    this.rows = small ? 9 : 11;

    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
    this.renderer.setClearColor(0x000000, 0);

    this.camera.position.set(0, 0, 18);

    this.scene.add(new AmbientLight(0xbfd6ea, 1.4));
    const key = new DirectionalLight(0xffffff, 2.2);
    key.position.set(-4, 6, 10);
    this.scene.add(key);
    const rim = new DirectionalLight(0x2fc47a, 0.9);
    rim.position.set(6, -4, 4);
    this.scene.add(rim);

    const geometry = new BoxGeometry(1.5, 0.52, 0.12);
    const material = new MeshStandardMaterial({ roughness: 0.55, metalness: 0.15 });
    this.mesh = new InstancedMesh(geometry, material, this.cols * this.rows);
    this.group.add(this.mesh);
    this.scene.add(this.group);

    this.buildCells();
    this.layout();

    this.resizeObserver = new ResizeObserver(() => this.layout());
    this.resizeObserver.observe(canvas);

    this.intersection = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.syncLoop();
    });
    this.intersection.observe(canvas);

    document.addEventListener('visibilitychange', this.onVisibility);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    if (!options.reducedMotion) {
      window.addEventListener('pointermove', this.onPointer, { passive: true });
    }

    this.startTime = performance.now();
    if (options.reducedMotion) {
      this.update(INTRO_SECONDS + 10, true);
      this.render();
    } else {
      this.syncLoop();
    }
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.intersection.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('pointermove', this.onPointer);
    this.mesh.geometry.dispose();
    (this.mesh.material as MeshStandardMaterial).dispose();
    this.renderer.dispose();
  }

  private buildCells(): void {
    const gapX = 1.64;
    const gapY = 0.66;
    const offX = ((this.cols - 1) * gapX) / 2;
    const offY = ((this.rows - 1) * gapY) / 2;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const kind: Cell['kind'] = row === 0 ? 'header' : row === this.rows - 1 ? 'sum' : 'base';
        const to = new Vector3(col * gapX - offX, offY - row * gapY - (kind === 'sum' ? 0.14 : 0), 0);
        const from = new Vector3(
          MathUtils.randFloatSpread(26),
          MathUtils.randFloatSpread(16),
          MathUtils.randFloat(-14, 6),
        );
        const fromRot = new Quaternion().setFromAxisAngle(
          new Vector3(Math.random(), Math.random(), Math.random()).normalize(),
          MathUtils.randFloat(-Math.PI, Math.PI),
        );
        const delay = (col / this.cols) * 0.7 + Math.random() * 0.35;
        this.cells.push({ col, row, from, fromRot, to, delay, kind });
      }
    }
  }

  private layout(): void {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    const portrait = w / h < 1;
    if (portrait) {
      this.group.position.set(0, -3.1, 0);
      this.group.scale.setScalar(0.72);
    } else {
      this.group.position.set(Math.min(4.6, 2.4 * (w / h)), -0.2, 0);
      this.group.scale.setScalar(w / h > 1.9 ? 0.86 : 0.76);
    }
    if (!this.running) this.render();
  }

  private readonly onPointer = (e: PointerEvent): void => {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  private readonly onScroll = (): void => {
    const h = this.canvas.clientHeight || window.innerHeight;
    this.scrollProgress = MathUtils.clamp(window.scrollY / h, 0, 1);
    if (this.options.reducedMotion) {
      this.update(INTRO_SECONDS + 10, true);
      this.render();
    }
  };

  private readonly onVisibility = (): void => this.syncLoop();

  private syncLoop(): void {
    const shouldRun = !this.options.reducedMotion && this.visible && document.visibilityState === 'visible';
    if (shouldRun && !this.running) {
      this.running = true;
      const tick = (): void => {
        if (!this.running) return;
        this.update((performance.now() - this.startTime) / 1000, false);
        this.render();
        this.frame = requestAnimationFrame(tick);
      };
      this.frame = requestAnimationFrame(tick);
    } else if (!shouldRun && this.running) {
      this.running = false;
      cancelAnimationFrame(this.frame);
    }
  }

  private update(t: number, still: boolean): void {
    // Nagib mreže: blaga perspektiva + praćenje miša + nagib pri skrolu
    this.tilt.x = MathUtils.lerp(this.tilt.x, this.pointer.y * 0.12, 0.05);
    this.tilt.y = MathUtils.lerp(this.tilt.y, this.pointer.x * 0.18, 0.05);
    this.group.rotation.set(-0.5 + this.tilt.x - this.scrollProgress * 0.35, -0.42 + this.tilt.y, -0.08);

    const introT = t / INTRO_SECONDS;
    const flowSpeed = 0.55;
    const flowPos = still ? -10 : ((t - INTRO_SECONDS) * flowSpeed) % (this.rows + 3);
    const assembled = MathUtils.clamp((t - INTRO_SECONDS) / 0.8, 0, 1);

    this.cells.forEach((cell, i) => {
      const local = MathUtils.clamp((introT - cell.delay * 0.55) / 0.6, 0, 1);
      const k = 1 - Math.pow(1 - local, 3);

      this.dummy.position.lerpVectors(cell.from, cell.to, k);
      if (!still) {
        this.dummy.position.z += Math.sin(t * 1.1 + cell.col * 0.45 + cell.row * 0.3) * 0.06 * assembled;
      }
      this.dummy.quaternion.slerpQuaternions(cell.fromRot, this.identityQ, k);
      this.dummy.scale.setScalar(MathUtils.lerp(0.6, 1, k));
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);

      // Boja: osnovna, pa zeleni talas proračuna kroz redove
      const base = COLORS[cell.kind];
      this.tmpColor.copy(cell.kind === 'sum' ? COLORS.base : base);
      if (cell.kind === 'sum') {
        this.tmpColor.lerp(COLORS.sum, still ? 1 : assembled);
      } else if (cell.kind === 'base') {
        const d = flowPos - cell.row - cell.col * 0.12;
        const pulse = d > 0 && d < 1.6 ? Math.sin((d / 1.6) * Math.PI) : 0;
        this.tmpColor.lerp(COLORS.flow, pulse * 0.85);
      }
      this.mesh.setColorAt(i, this.tmpColor);
    });

    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
