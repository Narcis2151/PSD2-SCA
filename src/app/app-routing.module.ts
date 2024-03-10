import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '0/login', pathMatch: 'full' },
  { path: ':consentId/login', component: AuthComponent },
  // { path: '/:consentId/party', component: PartyComponent },
  // { path: '/:consentId/consent', component: ConsentComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
