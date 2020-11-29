import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TokenInterceptor } from './token.interceptor';
import { DeviceSearchComponent } from './device-search/device-search.component';
import { DeviceCreationComponent } from './device-creation/device-creation.component';
import { NetworkComponent } from './network/network.component';
import { WikiComponent } from './wiki/wiki.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { StringFilterPipe } from './string-filter.pipe';
import { WikiPageComponent } from './wiki-page/wiki-page.component';
import { WikiPageDeviceComponent } from './wiki-page/wiki-page-device/wiki-page-device.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { StringAvailFilterPipe } from './string-avail-filter.pipe';
import { EmailValidationComponent } from './email-validation/email-validation.component';
import { AvailabilityEditComponent } from './profile-page/availability-edit/availability-edit.component';
import { AvailabilityDeleteComponent } from './profile-page/availability-delete/availability-delete.component';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import {environment} from '../environments/environment';
import { AvailabilityAddComponent } from './wiki-page/availability-add/availability-add.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    DeviceSearchComponent,
    DeviceCreationComponent,
    NetworkComponent,
    WikiComponent,
    StringFilterPipe,
    WikiPageComponent,
    WikiPageDeviceComponent,
    ContactFormComponent,
    ProfilePageComponent,
    StringAvailFilterPipe,
    EmailValidationComponent,
    AvailabilityEditComponent,
    AvailabilityDeleteComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    AvailabilityAddComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    NgxPaginationModule,
    CarouselModule.forRoot(),
    NgHcaptchaModule.forRoot({
      siteKey: environment.captchaSiteKey,
      languageCode: 'en'
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
