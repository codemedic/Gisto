import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SettingsStore } from '../store/settings';
import { GithubAuthorizationService } from '../github-authorization.service';
import { GithubApiService } from '../github-api.service';
import { version } from '../helpers/version';
import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'login',
  template: `
    <div>
      <logo></logo>
      <small>v.{{ version }}</small>
      <button invert (click)="login()">Log-in with Github account</button>
    </div>

  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string = version;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authorization: GithubAuthorizationService,
              private githubApiService: GithubApiService,
              private settingsStore: SettingsStore,
              private electronService: ElectronService) {}

  ngOnInit() {
    if (this.settingsStore.isLoggedIn) {
      this.navigateToMainScreen();
    }

    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('token', (event, token) => {
        localStorage.setItem('api-token', token);
        this.navigateToMainScreen();
      });
    } else {
      this.route
        .queryParams
        .subscribe((params: Params) => {
          const code = params['code'];

          if (code) {
            this.authorization.fetchAuthToken(code)
              .then(() => this.navigateToMainScreen());
          }
        });
    }
  }

  navigateToMainScreen() {
    this.githubApiService.getUser();
    this.githubApiService.getGists();
    this.githubApiService.getStaredGists();
    setTimeout(() => this.router.navigate(['/main']), 5000);
  }

  login() {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.send('oauth2-login');
    } else {
      this.authorization.login();
    }
  }
}
