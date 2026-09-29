import { Component, afterNextRender, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { APP_CONFIG } from './app-config';

interface ApiStatus {
  status: string;
  version: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly config = inject(APP_CONFIG);
  private readonly http = inject(HttpClient);

  title = 'angular.web';
  appVersion = this.config.version;
  environment = this.config.environment;
  status = 'Operational';
  /** NetCore.API reachability, probed from the browser only — never during the build-time prerender. */
  apiStatus = signal(this.config.apiBaseUrl ? 'checking' : 'not configured');

  constructor() {
    afterNextRender(() => this.checkApi());
  }

  private checkApi(): void {
    if (!this.config.apiBaseUrl) {
      return;
    }
    this.http.get<ApiStatus>(`${this.config.apiBaseUrl}/api/AppStatus`).subscribe({
      next: (api) => this.apiStatus.set(`${api.status} v${api.version}`),
      error: () => this.apiStatus.set('unreachable'),
    });
  }
}
