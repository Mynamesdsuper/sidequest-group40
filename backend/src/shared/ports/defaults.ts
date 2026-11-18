import type { Ports } from './ports';

// Safe default strategies (null objects): a module can be built and tested before the module
// that provides the real strategy exists. Each one is replaced through bindPort() by its owner.

export const defaultPorts: Ports = {
  notifier: {
    async notify(userId, type) {
      if (process.env.NODE_ENV === 'development')
        console.debug(`[notifier:default] ${type} -> ${userId} (not delivered)`);
    },
  },
  realtime: {
    emitToUser() {},
    emitToRoom() {},
    joinRoom() {},
    leaveRoom() {},
  },
  participationQuery: {
    hasStarted: async () => false,
    availability: async (missionIds) =>
      Object.fromEntries(missionIds.map((id) => [id, 'AVAILABLE' as const])),
    isUserEngaged: async () => false,
  },
  missionAccess: {
    // Until R07 every mission is public, and "published" is checked by the missions module itself,
    // which owns the mission data: the default only says "no extra restriction".
    canView: async () => true,
    grant: async () => {},
    revoke: async () => {},
  },
  teamMembership: {
    // Deny by default: nobody is a team member until R10 binds the real strategy.
    isMember: async () => false,
    isAdmin: async () => false,
    membersOf: async () => [],
  },
};
