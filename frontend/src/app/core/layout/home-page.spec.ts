import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiUrl } from '../api';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    backend = TestBed.inject(HttpTestingController);
  });

  async function render(respond: (req: ReturnType<HttpTestingController['expectOne']>) => void) {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    respond(backend.expectOne(apiUrl('health')));
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  it('shows "backend ok" when /health answers', async () => {
    const text = await render((req) => req.flush({ status: 'ok', db: 'up', time: '2026-11-19T10:00:00Z' }));
    expect(text).toContain('backend ok');
    expect(text).toContain('database up');
  });

  it('shows "backend unreachable" when the request fails', async () => {
    const text = await render((req) => req.error(new ProgressEvent('error')));
    expect(text).toContain('backend unreachable');
  });
});
