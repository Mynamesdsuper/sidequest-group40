import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { SKIP_ERROR_TOAST, apiUrl } from '../api';
import { PageHeader } from '../../shared/ui/page-header';

interface Health {
  status: 'ok';
  db: 'up' | 'down';
  time: string;
}

type BackendStatus = 'checking' | 'ok' | 'unreachable';

/** Home page. Calls GET /health to prove the frontend → backend → database wiring (E2E smoke test). */
@Component({
  selector: 'app-home-page',
  imports: [PageHeader],
  template: `
    <app-page-header title="SideQuest" subtitle="Create missions, play them, team up." />
    <section class="card status" aria-live="polite">
      <h2>System status</h2>
      @switch (status()) {
        @case ('checking') {
          <p>Checking the backend…</p>
        }
        @case ('ok') {
          <p class="ok">backend ok · database {{ db() }}</p>
        }
        @case ('unreachable') {
          <p class="ko">backend unreachable</p>
        }
      }
    </section>
  `,
  styles: `
    .status {
      max-width: 32rem;
    }
    .ok {
      color: var(--color-success);
    }
    .ko {
      color: var(--color-danger);
    }
  `,
})
export class HomePage implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly status = signal<BackendStatus>('checking');
  protected readonly db = signal<Health['db']>('down');

  ngOnInit(): void {
    // The page shows the failure itself, so no error toast.
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);
    this.http.get<Health>(apiUrl('health'), { context }).subscribe({
      next: (h) => {
        this.db.set(h.db);
        this.status.set('ok');
      },
      error: () => this.status.set('unreachable'),
    });
  }
}
