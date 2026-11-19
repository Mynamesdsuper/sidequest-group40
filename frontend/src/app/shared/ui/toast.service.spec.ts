import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(ToastService);
  });

  afterEach(() => vi.useRealTimers());

  it('adds toasts with distinct ids and removes one on dismiss', () => {
    const a = service.error('a');
    const b = service.success('b');
    expect(a).not.toBe(b);
    service.dismiss(a);
    expect(service.toasts()).toEqual([{ id: b, kind: 'success', message: 'b' }]);
  });

  it('closes a toast by itself after DURATION_MS', () => {
    service.show('hello');
    vi.advanceTimersByTime(ToastService.DURATION_MS - 1);
    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(service.toasts()).toEqual([]);
  });
});
