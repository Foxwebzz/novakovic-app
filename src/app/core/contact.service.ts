import { Injectable } from '@angular/core';

export interface ContactMessage {
  name: string;
  company: string;
  contact: string;
  message: string;
}

/** Naziv forme mora da se poklapa sa skrivenom formom u src/index.html (Netlify Forms). */
export const NETLIFY_FORM_NAME = 'upit';

@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(data: ContactMessage, honeypot = ''): Promise<void> {
    const body = new URLSearchParams({
      'form-name': NETLIFY_FORM_NAME,
      'bot-field': honeypot,
      ime: data.name,
      firma: data.company,
      kontakt: data.contact,
      poruka: data.message,
    });

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Slanje forme nije uspelo (${response.status})`);
    }
  }
}
