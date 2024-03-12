import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import ConsentResponseData from './consent.model';
import AccountsResponseData from './accounts.model';

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  public consent = new BehaviorSubject<ConsentResponseData>(null);
  public consentChanged = new Subject<ConsentResponseData>();
  public accountsChanged = new Subject<AccountsResponseData[]>();
  public accounts: AccountsResponseData[] = [];

  constructor(private http: HttpClient) {}
}
