import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Row {
  task: string;
  before: string;
  after: string;
}

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemComponent {
  protected readonly rows: Row[] = [
    {
      task: 'Ponuda za kupca',
      before: 'Sklapa se satima, kopiranjem iz starih tabela.',
      after: 'Gotova za nekoliko minuta.',
    },
    {
      task: 'Cene materijala',
      before: 'Traže se po cenovnicima i prepisuju ručno.',
      after: 'Unete jednom, biraju se iz kataloga.',
    },
    {
      task: 'Zbirovi i dodaci',
      before: 'Jedna pogrešna formula i cela ponuda je pogrešna.',
      after: 'Sistem sam sabira, cena je uvek tačna.',
    },
    {
      task: 'Dokument za kupca',
      before: 'Formatiranje svaki put iz početka.',
      after: 'PDF sa logom i Excel jednim klikom.',
    },
    {
      task: 'Izmene ponude',
      before: 'Nova verzija znači novu kopiju fajla.',
      after: 'Sačuvana ponuda se otvori i doradi.',
    },
  ];
}
