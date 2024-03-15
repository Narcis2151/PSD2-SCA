import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../shared/user.model';
export interface PartyResponseData {
  id: number;
  name: string | null;
}

interface SubmitPartyResponseData {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  user = new BehaviorSubject<User>(new User());

  constructor(private http: HttpClient) {}

  fetchParties(consentId: string) {
    const userData = JSON.parse(localStorage.getItem('userData') ?? '');
    const token = userData ? userData._token : null;
    const headers = { authorization: `Bearer ${token}` };
    const parties$ = this.http.get<PartyResponseData[]>(
      `http://localhost:3000/${consentId}/party`,
      {
        headers,
      }
    );
    return parties$.pipe(catchError(this.handleError));
  }

  submitParty(consentId: string, partyData: PartyResponseData) {
    const userData = JSON.parse(localStorage.getItem('userData') ?? '');
    const token = userData ? userData._token : null;
    const headers = { authorization: `Bearer ${token}` };
    const party$ = this.http.post<SubmitPartyResponseData>(
      `http://localhost:3000/${consentId}/party`,
      partyData,
      {
        headers,
      }
    );
    party$
      .pipe(
        // catchError(this.handleError),
        tap((party) => {
          this.handlePartySubmission(+party.id);
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

  handlePartySubmission(id: Number) {
    const currentUser = JSON.parse(localStorage.getItem('userData') ?? '');
    currentUser.partyId = id;
    const user = new User(
      currentUser.loginName,
      currentUser.userId,
      currentUser.partyId,
      currentUser._token,
      currentUser._tokenExpirationDate
    );
    this.user.next(user);
    console.log(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
