import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartyResponseData, PartyService } from '../party.service';
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
    this.subscription = this.partyService.partiesChanged.subscribe(
      (parties: PartyResponseData[]) => {
        this.parties = parties;
        console.log(this.parties);
      }
    );
    this.isLoading = true;
    this.partyService.fetchParties(this.consentId);
    // console.log(this.parties);
    this.isLoading = false;
  }

  onSubmit(partyForm: NgForm) {
    console.log(partyForm.value);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
