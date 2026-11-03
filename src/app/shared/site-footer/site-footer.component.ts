import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT } from '../contact-info';

@Component({
  selector: 'app-site-footer',
  template: `
    <footer class="footer">
      <div class="wrap footer__inner">
        <p>
          <strong>{{ contact.name }}</strong><br />
          Aplikacije po meri za firme
        </p>
        <p>
          <a [href]="'mailto:' + contact.email">{{ contact.email }}</a><br />
          <a [href]="contact.phoneHref">{{ contact.phoneDisplay }}</a>
        </p>
        <p class="footer__copy">© {{ year }} {{ contact.name }}</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      padding-block: var(--s-6);
      background: var(--c-ink);
      color: var(--c-on-ink-muted);
      border-top: 1px solid rgb(169 188 205 / 0.15);
      font-size: var(--fs-sm);
    }
    .footer__inner {
      display: flex;
      flex-wrap: wrap;
      gap: var(--s-5) var(--s-7);
      align-items: flex-end;
    }
    strong {
      color: var(--c-on-ink);
    }
    a {
      text-underline-offset: 3px;
    }
    a:hover {
      color: var(--c-on-ink);
    }
    .footer__copy {
      margin-left: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  protected readonly contact = CONTACT;
  protected readonly year = new Date().getFullYear();
}
