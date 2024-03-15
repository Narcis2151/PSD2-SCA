import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrl: './consent.component.scss',
})
export class ConsentComponent {
  isLoading = false;
  recurringIndicator = true;
  accounts = [
    {
      name: 'Account 1',
      iban: 'RO1234567890',
      showBalances: true,
      showTransactions: true,
    },
    {
      name: 'Account 1',
      iban: 'RO1234567890',
      showBalances: true,
      showTransactions: true,
    },
  ];
  datePicker: any;

  onSubmit(accountsForm: NgForm) {
    throw new Error('Method not implemented.');
  }
}
