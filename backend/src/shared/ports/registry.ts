import { defaultPorts } from './defaults';
import type { PortName, Ports } from './ports';

// Port registry: Dependency Injection. The owning module binds its concrete strategy once, in
// register(ctx); every other module asks for the port and never imports the provider.

const bound: Partial<Ports> = {};

export function bindPort<N extends PortName>(name: N, implementation: Ports[N]): void {
  bound[name] = implementation;
}

/** The bound strategy, or the safe default when the owner has not bound it yet. */
export function getPort<N extends PortName>(name: N): Ports[N] {
  return (bound[name] ?? defaultPorts[name]) as Ports[N];
}

/** Tests only: back to the defaults. */
export function resetPorts(): void {
  for (const name of Object.keys(bound) as PortName[]) delete bound[name];
}
