import type { DomainEventName, DomainEvents } from './domain-events';

type Handler<E extends DomainEventName> = (payload: DomainEvents[E]) => void | Promise<void>;

/**
 * Typed in-process event bus: the Observer pattern. The owning module publishes a domain event,
 * other modules subscribe to it without importing each other.
 * A failing subscriber is logged and does not stop the others, nor the publisher.
 */
export class EventBus {
  private readonly handlers = new Map<DomainEventName, Set<Handler<DomainEventName>>>();

  /** Returns a function that removes the subscription. */
  subscribe<E extends DomainEventName>(event: E, handler: Handler<E>): () => void {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler as Handler<DomainEventName>);
    this.handlers.set(event, set);
    return () => set.delete(handler as Handler<DomainEventName>);
  }

  /** Runs the subscribers in subscription order and waits for them. Call it after the DB commit. */
  async publish<E extends DomainEventName>(event: E, payload: DomainEvents[E]): Promise<void> {
    for (const handler of this.handlers.get(event) ?? []) {
      try {
        await handler(payload);
      } catch (err) {
        console.error(`[event-bus] subscriber of "${event}" failed`, err);
      }
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}

/** The process-wide bus (Singleton), handed to the modules through the module context. */
export const eventBus = new EventBus();
