import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import type { HeroScene } from './hero-scene';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly destroyRef = inject(DestroyRef);
  private scene: HeroScene | null = null;

  protected readonly sceneReady = signal(false);

  constructor() {
    afterNextRender(() => {
      void this.startScene();
    });
    this.destroyRef.onDestroy(() => this.scene?.destroy());
  }

  private async startScene(): Promise<void> {
    const canvas = this.canvas().nativeElement;
    if (!this.supportsWebGL()) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { HeroScene } = await import('./hero-scene');
    this.scene = new HeroScene(canvas, { reducedMotion });
    this.sceneReady.set(true);
  }

  private supportsWebGL(): boolean {
    try {
      const test = document.createElement('canvas');
      return !!(test.getContext('webgl2') ?? test.getContext('webgl'));
    } catch {
      return false;
    }
  }
}
