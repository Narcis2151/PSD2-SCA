import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartyResponseData, PartyService } from './party.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrl: './party.component.scss',
})
export class PartyComponent implements OnInit, OnDestroy {
  isLoading = false;
  consentId: string = '';
  subscription: Subscription = new Subscription();
  parties: PartyResponseData[] = [];

  constructor(
    private partyService: PartyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.consentId = params['consentId'];
    });
    this.isLoading = true;
    this.subscription = this.partyService
      .fetchParties(this.consentId)
      .subscribe((parties) => {
        this.parties = parties;
      });
    console.log(this.parties);
    this.isLoading = false;
  }

  onSubmit(partyForm: NgForm) {
    console.log(partyForm.value);
    this.partyService.submitParty(this.consentId, partyForm.value);
    this.router.navigate([`/${this.consentId}/consent`]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
