import { Component, ElementRef, input, viewChild } from '@angular/core';

/**
 * Confirmation built on the native <dialog> element (focus trap, Esc and backdrop handled by the browser).
 * Usage: <app-confirm-dialog #confirm title="Leave team?" /> then `if (await confirm.ask()) { ... }`.
 */
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <dialog #dialog [attr.aria-labelledby]="titleId" (close)="settle(dialog.returnValue === 'confirm')">
      <form method="dialog" class="stack">
        <h2 [id]="titleId">{{ title() }}</h2>
        @if (message()) {
          <p>{{ message() }}</p>
        }
        <div class="cluster actions">
          <button class="btn" value="cancel">{{ cancelLabel() }}</button>
          <button class="btn" [class.btn-danger]="danger()" [class.btn-primary]="!danger()" value="confirm">
            {{ confirmLabel() }}
          </button>
        </div>
      </form>
    </dialog>
  `,
  styles: `
    dialog {
      max-width: min(28rem, calc(100vw - 2rem));
      padding: var(--space-5);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-surface);
      color: var(--color-text);
    }
    dialog::backdrop {
      background: rgb(0 0 0 / 0.5);
    }
    .actions {
      justify-content: end;
    }
  `,
})
export class ConfirmDialog {
  private static counter = 0;

  readonly title = input.required<string>();
  readonly message = input<string>();
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly danger = input(false);

  protected readonly titleId = `confirm-title-${++ConfirmDialog.counter}`;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private resolve?: (ok: boolean) => void;

  /** Opens the dialog; resolves true on confirm, false on cancel, Esc or close. */
  ask(): Promise<boolean> {
    const el = this.dialog().nativeElement;
    el.returnValue = '';
    el.showModal();
    return new Promise((resolve) => (this.resolve = resolve));
  }

  protected settle(ok: boolean): void {
    this.resolve?.(ok);
    this.resolve = undefined;
  }
}
