import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT } from '../contact-info';

@Component({
  selector: 'app-site-header',
  template: `
    <header class="header">
      <div class="wrap header__inner">
        <a class="header__brand" href="#top">
          <span class="header__mark" aria-hidden="true"></span>
          {{ contact.name }}
        </a>
        <nav class="header__nav" aria-label="Glavna navigacija">
          <a href="#primer">Primer</a>
          <a href="#usluge">Usluge</a>
          <a class="btn btn--primary header__cta" href="#kontakt">Pošalji upit</a>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './site-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent {
  protected readonly contact = CONTACT;
}
