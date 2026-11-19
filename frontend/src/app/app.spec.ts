import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { NAV_LINKS } from './core/layout/nav-links';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('renders the shell with a link for every feature', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('#side-nav a');
    expect(links.length).toBe(NAV_LINKS.length);
  });

  it('every navigation link has a route', () => {
    const paths = routes.map((r) => '/' + r.path);
    for (const link of NAV_LINKS) expect(paths).toContain(link.path);
  });

  it('the menu button toggles the drawer and updates aria-expanded', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const toggle = el.querySelector<HTMLButtonElement>('.nav-toggle')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('#side-nav')!.classList).toContain('open');
  });
});
