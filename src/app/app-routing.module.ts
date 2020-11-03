import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DeviceSearchComponent } from './device-search/device-search.component';
import { DeviceCreationComponent } from './device-creation/device-creation.component';
import { NetworkComponent } from './network/network.component';
import { WikiComponent } from './wiki/wiki.component';
import { WikiPageComponent } from './wiki-page/wiki-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'device-search', component: DeviceSearchComponent },
  { path: 'device-creation', component: DeviceCreationComponent },
  { path: 'network', component: NetworkComponent },
  { path: 'wiki', component: WikiComponent },
  { path: 'wiki-page/:id', component: WikiPageComponent},
  { path: 'settings/profile', component: ProfilePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
