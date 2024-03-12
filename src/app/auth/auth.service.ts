import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from '../shared/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';

export interface AuthResponseData {
  accessToken: string;
  expiresIn: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(new User());
  // private tokenExpirationTimer: any;
  constructor(private http: HttpClient) {}

  login(consentId: string, loginName: string, password: string) {
    return this.http
      .post<AuthResponseData>(`http://localhost:3000/${consentId}/login`, {
        username: loginName,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            loginName,
            resData.accessToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    loginName: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      loginName,
      undefined,
      undefined,
      token,
      expirationDate
    );
    this.user.next(user);
    //this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
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
}
