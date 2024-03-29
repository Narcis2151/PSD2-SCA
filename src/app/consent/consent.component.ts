import { Component } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';

import ConsentResponseData from './consent.model';
import AccountsResponseData from './accounts.model';
import { ConsentService } from './consent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrl: './consent.component.scss',
})
export class ConsentComponent {
  isLoading = false;
  subscription: Subscription = new Subscription();
  consentId: string = '';
  accounts: AccountsResponseData[] = [];
  recurringIndicator: Boolean = false;
  validUntil: Date = new Date();
  redirectUrl: String = '';
  datePicker: any;

  constructor(
    private consentService: ConsentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.consentId = params['consentId'];
    });
    this.isLoading = true;
    this.consentService.fetchConsent(this.consentId).subscribe((consent) => {
      this.accounts = consent.accounts;
      this.recurringIndicator = consent.isRecurrent;
      this.validUntil = consent.validUntil;
      this.redirectUrl = consent.redirectUrl;
    });
    this.isLoading = false;
  }

  onSubmit(accountsForm: NgForm) {
    console.log(accountsForm.value);
    // this.router.navigate([this.redirectUrl]);
  }

  onDateChange(event: any) {
    this.validUntil = event.target.value;
  }

  onCheckboxChange(event: any) {
    this.recurringIndicator = event.target.checked;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
