import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface PartyResponseData {
  id: number;
  name: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PartyService {
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
}
