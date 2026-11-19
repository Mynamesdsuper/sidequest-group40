import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ToastContainer } from '../../shared/ui/toast-container';
import { NAV_LINKS } from './nav-links';

/**
 * Application shell: top bar, side navigation (an off-canvas drawer below 48rem), content, footer, toasts.
 * A route that shows a map sets `data: { showsMap: true }` and the footer adds the OpenStreetMap credit.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainer],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  host: { '(document:keydown.escape)': 'closeNav()' },
})
export class Shell {
  private readonly router = inject(Router);

  protected readonly links = NAV_LINKS;
  protected readonly navOpen = signal(false);
  protected readonly showMapCredit = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.currentRouteShowsMap()),
    ),
    { initialValue: false },
  );

  protected toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }

  private currentRouteShowsMap(): boolean {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route.data['showsMap'] === true;
  }
}
