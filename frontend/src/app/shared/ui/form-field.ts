import { Component, input } from '@angular/core';

/**
 * Label + projected control + hint + validation error. The projected control must have id = fieldId and
 * aria-describedby = fieldId + '-hint' / fieldId + '-error', so hint and error are read with the field.
 */
@Component({
  selector: 'app-form-field',
  template: `
    <div class="field">
      <label [for]="fieldId()">{{ label() }}</label>
      <ng-content />
      @if (hint()) {
        <small class="text-muted" [id]="fieldId() + '-hint'">{{ hint() }}</small>
      }
      @if (error()) {
        <small class="error" [id]="fieldId() + '-error'">{{ error() }}</small>
      }
    </div>
  `,
  styles: `
    .field {
      display: grid;
      gap: var(--space-1);
    }
    label {
      font-weight: 600;
    }
    .error {
      color: var(--color-danger);
    }
  `,
})
export class FormField {
  readonly label = input.required<string>();
  readonly fieldId = input.required<string>();
  readonly hint = input<string>();
  /** Message to show, e.g. from the backend VALIDATION_ERROR details; nothing is shown when empty. */
  readonly error = input<string | null>();
}
