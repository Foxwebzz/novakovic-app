import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../core/contact.service';
import { CONTACT } from '../../../shared/contact-info';

type Status = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly contactService = inject(ContactService);

  protected readonly contact = CONTACT;
  protected readonly status = signal<Status>('idle');
  protected readonly submitted = signal(false);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    company: ['', Validators.maxLength(120)],
    contact: ['', [Validators.required, Validators.maxLength(160)]],
    message: ['', [Validators.required, Validators.maxLength(4000)]],
    botField: [''],
  });

  protected showError(field: 'name' | 'contact' | 'message'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.status.set('sending');
    const { botField, ...data } = this.form.getRawValue();
    try {
      await this.contactService.send(data, botField);
      this.status.set('sent');
      this.form.reset();
      this.submitted.set(false);
    } catch {
      this.status.set('error');
    }
  }
}
