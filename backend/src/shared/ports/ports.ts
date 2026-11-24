// Port interfaces (Strategy pattern): one module needs a capability, another module provides it.
// Signatures: docs/design/module-contracts.md (frozen by S0-API / S0-EVENTS (done)).

export interface Viewer {
  id: string;
  role: 'USER' | 'ADMIN';
}

export type AccessSource = 'MANUAL' | 'INVITE';
export type Availability = 'AVAILABLE' | 'FULL' | 'CLOSED';

/** Notification types (A-15), frozen by S0-EVENTS; payloads in docs/api/realtime-events.md. */
export type NotificationType =
  | 'mission.accepted'
  | 'participation.status.changed'
  | 'proof.reviewed'
  | 'invitation.received'
  | 'invitation.responded'
  | 'invitation.revoked'
  | 'waitlist.offered'
  | 'waitlist.offer.expired'
  | 'team.invitation.received'
  | 'team.member.joined'
  | 'team.member.left';

/** Bound by R06A (P2). */
export interface NotifierPort {
  notify(userId: string, type: NotificationType, payload: object): Promise<void>;
}

/** Bound by R06A (P2). */
export interface RealtimePort {
  emitToUser(userId: string, event: string, payload: object): void;
  emitToRoom(room: string, event: string, payload: object): void;
  joinRoom(userId: string, room: string): void;
  leaveRoom(userId: string, room: string): void;
}

/** Bound by R04 / R09 (P2). */
export interface ParticipationQueryPort {
  hasStarted(missionId: string): Promise<boolean>;
  availability(missionIds: string[]): Promise<Record<string, Availability>>;
  isUserEngaged(missionId: string, userId: string): Promise<boolean>;
}

/** Bound by R07 (P1). */
export interface MissionAccessPort {
  canView(viewer: Viewer | null, missionId: string): Promise<boolean>;
  grant(missionId: string, userId: string, source: AccessSource): Promise<void>;
  revoke(missionId: string, userId: string, source: AccessSource): Promise<void>;
}

/** Bound by R10 (P3). */
export interface TeamMembershipPort {
  isMember(teamId: string, userId: string): Promise<boolean>;
  isAdmin(teamId: string, userId: string): Promise<boolean>;
  membersOf(teamId: string): Promise<string[]>;
  /** IDs of the teams the user currently belongs to (A-20 check, dashboard). */
  teamsOf(userId: string): Promise<string[]>;
}

export interface Ports {
  notifier: NotifierPort;
  realtime: RealtimePort;
  participationQuery: ParticipationQueryPort;
  missionAccess: MissionAccessPort;
  teamMembership: TeamMembershipPort;
}

export type PortName = keyof Ports;
