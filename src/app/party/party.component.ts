import { Component, OnInit } from '@angular/core';
import { PartyResponseData, PartyService } from '../party.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrl: './party.component.scss',
})
export class PartyComponent implements OnInit {
  isLoading = false;
  parties: PartyResponseData = { partyIds: [] };
  consentId: string = '';
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
    this.getParties(this.consentId);
    this.isLoading = false;
  }

  getParties(consentId: string) {
    this.partyService.getParties(consentId).subscribe((parties) => {
      console.log(parties);
      for (const party of parties.partyIds) {
        this.parties.partyIds.push(party);
      }
    });
  }
  onSubmit(partyForm: NgForm) {
    console.log(partyForm.value);
  }
}
