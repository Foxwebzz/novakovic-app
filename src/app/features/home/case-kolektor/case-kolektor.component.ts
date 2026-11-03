import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';

interface Step {
  title: string;
  text: string;
  video: string;
  poster: string;
}

@Component({
  selector: 'app-case-kolektor',
  templateUrl: './case-kolektor.component.html',
  styleUrl: './case-kolektor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseKolektorComponent {
  private readonly videoRef = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly destroyRef = inject(DestroyRef);
  private inView = false;

  protected readonly steps: Step[] = [
    {
      title: 'Izbor materijala',
      text: 'Materijali se biraju iz kataloga po grupama, sa već unetim cenama. Nema prepisivanja ni traženja po cenovnicima.',
      video: '/media/kolektor-materijali.mp4',
      poster: '/media/kolektor-materijali.webp',
    },
    {
      title: 'Proračun uživo',
      text: 'Promena količine odmah menja cenu. Zbir, energetski dodatak i cena po kilogramu računaju se sami, pa ponudu možete da uskladite i dok razgovarate sa kupcem.',
      video: '/media/kolektor-kalkulacija.mp4',
      poster: '/media/kolektor-kalkulacija.webp',
    },
    {
      title: 'Dokument za kupca',
      text: 'Jednim klikom nastaje PDF sa logom firme i svim stavkama, spreman za slanje. Za dalju obradu sve se izvozi i u Excel.',
      video: '/media/kolektor-pdf.mp4',
      poster: '/media/kolektor-pdf.webp',
    },
  ];

  protected readonly active = signal(0);
  protected readonly current = computed(() => this.steps[this.active()]);
  protected readonly reducedMotion = signal(false);

  constructor() {
    afterNextRender(() => {
      this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      const video = this.videoRef().nativeElement;
      const observer = new IntersectionObserver(
        ([entry]) => {
          this.inView = entry.isIntersecting;
          if (this.inView) this.play();
          else video.pause();
        },
        { threshold: 0.35 },
      );
      observer.observe(video);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected select(index: number): void {
    this.active.set(index);
    // Postavi izvor odmah, da play() ne čeka sledeći ciklus detekcije promena
    const video = this.videoRef().nativeElement;
    const step = this.steps[index];
    if (!video.src.endsWith(step.video)) {
      video.poster = step.poster;
      video.src = step.video;
    }
    this.play();
  }

  protected onEnded(): void {
    if (this.reducedMotion()) return;
    this.select((this.active() + 1) % this.steps.length);
  }

  private play(): void {
    if (this.reducedMotion() || !this.inView) return;
    const video = this.videoRef().nativeElement;
    video.play().catch(() => {
      // Pregledač je blokirao autoplay; poster ostaje vidljiv
    });
  }
}
