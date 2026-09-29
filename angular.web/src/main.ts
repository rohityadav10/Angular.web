import { mergeApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { APP_CONFIG, loadAppConfig } from './app/app-config';

// Read the per-environment config.json first, so every component starts with final values.
loadAppConfig()
  .then((config) =>
    bootstrapApplication(
      AppComponent,
      mergeApplicationConfig(appConfig, { providers: [{ provide: APP_CONFIG, useValue: config }] })
    )
  )
  .catch((err) => console.error(err));
