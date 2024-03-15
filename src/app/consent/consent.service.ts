import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import ConsentResponseData from './consent.model';

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  constructor(private http: HttpClient) {}

  fetchConsent(consentId: string) {
    const userData = JSON.parse(localStorage.getItem('userData') ?? '');
    const token = userData ? userData._token : null;
    const headers = { authorization: `Bearer ${token}` };
    const consent$ = this.http.get<ConsentResponseData>(
      `http://localhost:3000/${consentId}/consent`,
      {
        headers,
      }
    );
    return consent$.pipe(catchError(this.handleError));
  }

  submitConsent(consentId: string, consentData: ConsentResponseData) {
    const userData = JSON.parse(localStorage.getItem('userData') ?? '');
    const token = userData ? userData._token : null;
    const headers = { authorization: `Bearer ${token}` };
    const consent$ = this.http.post<ConsentResponseData>(
      `http://localhost:3000/${consentId}/consent`,
      consentData,
      {
        headers,
      }
    );
    consent$
      .pipe(
        catchError(this.handleError),
        tap((consent) => {
          this.handleConsentSubmission(+consent.consentId);
        })
      )
      .subscribe();
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error) {
      return throwError(() => new Error(errorMessage));
    }
    return throwError(() => errorRes.error);
  }

  private handleConsentSubmission(id: number) {
    console.log('Consent submitted with id: ', id);
  }
}
