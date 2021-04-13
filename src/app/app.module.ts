import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { AuthGuardService } from './services/authGuard.service';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { WatchStorageService } from './services/watchstorage.service';
import { RouterModule } from '@angular/router';
import { AnonymousService } from './services/anonymous.service';
import { HeaderComponent } from './common/header/header.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FooterComponent } from './common/footer/footer.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SideMenuComponent } from './common/side-menu/side-menu.component';
import * as globlas from './services/globlas';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminsService } from './services/admins.service';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SideMenuComponent,
  ],
  imports: [
    BrowserModule,
    NzButtonModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    NzIconModule,
    NzGridModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
      },
    }),
    NgbModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    AuthGuardService,
    WatchStorageService,
    AnonymousService,
    globlas.GetTokenNow,
    AuthService,
    AdminsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function tokenGetter() {
  return localStorage.getItem('token');
}
