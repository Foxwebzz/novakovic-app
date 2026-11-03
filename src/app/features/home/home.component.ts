import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { ProblemComponent } from './problem/problem.component';
import { CaseKolektorComponent } from './case-kolektor/case-kolektor.component';
import { CaseTimplastComponent } from './case-timplast/case-timplast.component';
import { ServicesComponent } from './services/services.component';
import { ProcessComponent } from './process/process.component';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    ProblemComponent,
    CaseKolektorComponent,
    CaseTimplastComponent,
    ServicesComponent,
    ProcessComponent,
    ContactComponent,
  ],
  template: `
    <app-hero />
    <app-problem />
    <app-case-kolektor />
    @defer (on viewport) {
      <app-case-timplast />
    } @placeholder {
      <div style="min-height: 40rem"></div>
    }
    <div id="usluge">
      <app-services />
    </div>
    <app-process />
    <app-contact />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
