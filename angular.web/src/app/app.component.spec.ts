import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { APP_CONFIG, AppConfig } from './app-config';

const SIT_CONFIG: AppConfig = { environment: 'SIT', apiBaseUrl: 'http://api.test', version: '1.2.0' };

describe('AppComponent', () => {
  function setup(config: AppConfig = SIT_CONFIG) {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: config }],
    });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    // afterNextRender hooks run on an application tick.
    TestBed.inject(ApplicationRef).tick();
    return { fixture, http: TestBed.inject(HttpTestingController) };
  }

  const badge = (el: HTMLElement) => el.querySelector('.system-status-badge')?.textContent ?? '';

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should create the app', () => {
    const { fixture, http } = setup();
    expect(fixture.componentInstance).toBeTruthy();
    http.expectOne('http://api.test/api/AppStatus');
  });

  it(`should have the 'angular.web' title`, () => {
    const { fixture, http } = setup();
    expect(fixture.componentInstance.title).toEqual('angular.web');
    http.expectOne('http://api.test/api/AppStatus');
  });

  it('should take version and environment from the runtime config', () => {
    const { fixture, http } = setup();
    const app = fixture.componentInstance;
    expect(app.appVersion).toEqual('1.2.0');
    expect(app.environment).toEqual('SIT');
    expect(app.status).toEqual('Operational');
    http.expectOne('http://api.test/api/AppStatus');
  });

  it('should render title', () => {
    const { fixture, http } = setup();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, angular.web');
    http.expectOne('http://api.test/api/AppStatus');
  });

  it('should render system status badge', () => {
    const { fixture, http } = setup();
    expect(badge(fixture.nativeElement)).toContain('SIT');
    expect(badge(fixture.nativeElement)).toContain('v1.2.0');
    http.expectOne('http://api.test/api/AppStatus');
  });

  it('should show the API status and version when the API answers', () => {
    const { fixture, http } = setup();
    http.expectOne('http://api.test/api/AppStatus').flush({ status: 'Healthy', version: '20260928.1' });
    fixture.detectChanges();
    expect(badge(fixture.nativeElement)).toContain('API: Healthy v20260928.1');
  });

  it('should show the API as unreachable when the call fails', () => {
    const { fixture, http } = setup();
    http.expectOne('http://api.test/api/AppStatus').flush('down', { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();
    expect(badge(fixture.nativeElement)).toContain('API: unreachable');
  });

  it('should not call any API when none is configured', () => {
    const { fixture, http } = setup({ ...SIT_CONFIG, apiBaseUrl: '' });
    http.expectNone(() => true);
    expect(badge(fixture.nativeElement)).toContain('API: not configured');
  });
});
