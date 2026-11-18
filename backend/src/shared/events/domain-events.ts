// Catalogue of the domain events (docs/design/module-contracts.md). Payload shapes are frozen by
// task S0-EVENTS (P2); until then every payload is a plain object.
// TODO(S0-EVENTS, P2): replace EventPayload with the frozen payload type of each event.

type EventPayload = Record<string, unknown>;

export interface DomainEvents {
  'user.registered': EventPayload;
  'mission.published': EventPayload;
  'mission.updated': EventPayload;
  'mission.closed': EventPayload;
  'mission.access.granted': EventPayload;
  'mission.access.revoked': EventPayload;
  'participation.accepted': EventPayload;
  'participation.objective.submitted': EventPayload;
  'participation.objective.reviewed': EventPayload;
  'participation.status.changed': EventPayload;
  'waitlist.offered': EventPayload;
  'waitlist.offer.expired': EventPayload;
  'invitation.created': EventPayload;
  'invitation.responded': EventPayload;
  'invitation.revoked': EventPayload;
  'team.invitation.created': EventPayload;
  'team.invitation.responded': EventPayload;
  'team.member.joined': EventPayload;
  'team.member.left': EventPayload;
  'team.progress.updated': EventPayload;
}

export type DomainEventName = keyof DomainEvents;
