import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { AuthComponent } from './auth/auth.component';
import { PartyComponent } from './party/party.component';
import { ConsentComponent } from './consent/consent.component';

const appRoutes: Routes = [
  { path: ':consentId/login', component: AuthComponent },
  { path: ':consentId/party', component: PartyComponent },
  { path: ':consentId/consent', component: ConsentComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '', redirectTo: 'not-found', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
