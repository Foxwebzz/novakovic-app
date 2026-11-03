import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-case-timplast',
  imports: [NgOptimizedImage],
  templateUrl: './case-timplast.component.html',
  styleUrl: './case-timplast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseTimplastComponent {
  protected readonly points = [
    'PVC prozori po dimenzijama, jednokrilni i dvokrilni',
    'Komarnici i roletne računaju se po kvadratu',
    'Cena sa ugradnjom i bez nje, odmah jedna pored druge',
    'Radi i na telefonu, kod kupca na terenu',
  ];
}
