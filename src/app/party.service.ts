import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './shared/user.model';
export interface PartyResponseData {
  id: number;
  name: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  user = new BehaviorSubject<User>(new User());
  private parties: PartyResponseData[] = [];
  public partiesChanged = new Subject<PartyResponseData[]>();

  constructor(private http: HttpClient) {}

  fetchParties(consentId: string) {
    const userData = JSON.parse(localStorage.getItem('userData') ?? '');
    const token = userData ? userData._token : null;
    const headers = { authorization: `Bearer ${token}` };
    const $parties = this.http.get<PartyResponseData[]>(
      `http://localhost:3000/${consentId}/party`,
      {
        headers,
      }
    );
    $parties
      .pipe(
        tap((parties) => {
          this.setParties(parties);
        })
      )
      .subscribe();
  }

  setParties(partyData: PartyResponseData[]) {
    this.parties = partyData;
    this.partiesChanged.next(this.parties.slice());
  }

  submitParty(consentId: string, partyData: PartyResponseData) {
    const userData = JSON.parse(localStorage.getItem('userData') ?? '');
    const token = userData ? userData._token : null;
    const headers = { authorization: `Bearer ${token}` };
    const $party = this.http.post<PartyResponseData>(
      `http://localhost:3000/${consentId}/party`,
      partyData,
      {
        headers,
      }
    );
    $party
      .pipe(
        catchError(this.handleError),
        tap((party) => {
          this.handlePartySubmission(party);
        })
      )
      .subscribe();
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorRes.error.message) {
      case 'Unauthorized':
        errorMessage = 'Unauthorized';
        break;
      case 'User or password incorrect':
        errorMessage = 'User or password incorrect';
        break;
      case 'Consent not found':
        errorMessage = 'Consent not found';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }

  handlePartySubmission(party: PartyResponseData) {
    const currentUser = JSON.parse(localStorage.getItem('userData') ?? '');
    currentUser.partyId = party.id;
    const user = new User(...currentUser);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
