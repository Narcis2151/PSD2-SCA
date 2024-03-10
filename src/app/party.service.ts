import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PartyResponseData {
  partyIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  constructor(private http: HttpClient) {}

  getParties(consentId: string) {
    const userData = JSON.parse(localStorage.getItem('userData') ?? '');
    const token = userData ? userData._token : null;
    const headers = { Authorization: `Bearer ${token}` };
    console.log(headers);
    return this.http.get<PartyResponseData>(
      `http://localhost:3000/${consentId}/party`,
      { headers }
    );
  }
}
