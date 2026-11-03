import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactService, NETLIFY_FORM_NAME } from './contact.service';

describe('ContactService', () => {
  const message = { name: 'Petar', company: 'Firma d.o.o.', contact: 'petar@firma.rs', message: 'Ponude u Excelu' };

  afterEach(() => vi.restoreAllMocks());

  it('šalje formu kao urlencoded POST sa nazivom Netlify forme', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));
    const service = TestBed.inject(ContactService);

    await service.send(message);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/');
    expect(init?.method).toBe('POST');
    const body = new URLSearchParams(String(init?.body));
    expect(body.get('form-name')).toBe(NETLIFY_FORM_NAME);
    expect(body.get('ime')).toBe('Petar');
    expect(body.get('kontakt')).toBe('petar@firma.rs');
  });

  it('baca grešku kad server vrati neuspeh', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));
    const service = TestBed.inject(ContactService);

    await expect(service.send(message)).rejects.toThrow();
  });
});
