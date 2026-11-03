import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Phase {
  title: string;
  text: string;
}

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessComponent {
  protected readonly phases: Phase[] = [
    {
      title: 'Razgovor',
      text: 'Opišete posao koji vam oduzima vreme. Pogledam tabele i dokumente sa kojima danas radite.',
    },
    {
      title: 'Predlog',
      text: 'Dobijete jasan predlog: šta aplikacija radi, koliko traje izrada i koliko košta. Pre nego što bilo šta počne.',
    },
    {
      title: 'Izrada uz vas',
      text: 'Prve ekrane vidite rano i probate ih na svojim podacima. Ispravke se rade usput, ne na kraju.',
    },
    {
      title: 'Uvođenje i podrška',
      text: 'Aplikacija kreće sa vašim podacima, a ja ostajem dostupan za dorade kad posao to traži.',
    },
  ];
}
