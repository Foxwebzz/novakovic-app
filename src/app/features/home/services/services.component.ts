import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Service {
  title: string;
  text: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  protected readonly services: Service[] = [
    {
      title: 'Kalkulacije i ponude',
      text: 'Cena se računa iz vaših materijala, normi i dodataka. Ponuda je gotova dok kupac još čeka na telefonu.',
    },
    {
      title: 'Katalozi i cenovnici',
      text: 'Jedno mesto za sve artikle i cene, koje svi u firmi vide isto i menjaju na jednom mestu.',
    },
    {
      title: 'Dokumenti jednim klikom',
      text: 'PDF ponude, radni nalozi i specifikacije sa vašim logom, i izvoz u Excel kad zatreba.',
    },
    {
      title: 'Evidencije i pregledi',
      text: 'Ko je šta uradio, šta je poslato kupcu i koliko košta koja grupa troškova, bez ručnog sabiranja.',
    },
    {
      title: 'Povezivanje sistema',
      text: 'Kad podaci već postoje u drugom programu ili tabeli, aplikacija ih preuzima umesto da se kucaju ponovo.',
    },
  ];
}
