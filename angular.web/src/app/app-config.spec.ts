import { DEFAULT_APP_CONFIG, loadAppConfig } from './app-config';

describe('loadAppConfig', () => {
  const respond = (body: unknown, status = 200) =>
    (() => Promise.resolve(new Response(JSON.stringify(body), { status }))) as unknown as typeof fetch;

  it('merges config.json over the defaults and trims trailing slashes from the API URL', async () => {
    const config = await loadAppConfig(respond({ environment: 'UAT', apiBaseUrl: 'https://api.uat.test//' }));
    expect(config).toEqual({ environment: 'UAT', apiBaseUrl: 'https://api.uat.test', version: 'dev' });
  });

  it('requests config.json bypassing the HTTP cache', async () => {
    const fetchSpy = jasmine.createSpy('fetch').and.returnValue(Promise.resolve(new Response('{}')));
    await loadAppConfig(fetchSpy as unknown as typeof fetch);
    expect(fetchSpy).toHaveBeenCalledWith('config.json', { cache: 'no-store' });
  });

  it('falls back to the defaults when config.json is missing', async () => {
    expect(await loadAppConfig(respond({}, 404))).toEqual(DEFAULT_APP_CONFIG);
  });

  it('falls back to the defaults when the request fails', async () => {
    const failing = (() => Promise.reject(new Error('offline'))) as unknown as typeof fetch;
    expect(await loadAppConfig(failing)).toEqual(DEFAULT_APP_CONFIG);
  });
});
