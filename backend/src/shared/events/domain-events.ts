// Catalogue of the domain events, FROZEN by task S0-EVENTS (docs/api/realtime-events.md, "Domain events").
// Rules: published by the owning module only after the DB commit; payloads carry IDs and small facts,
// never objective content or answers (A-07); subscribers resolve anything else through public APIs or ports.

export type Participant = { type: 'USER'; userId: string } | { type: 'TEAM'; teamId: string };

export type ParticipationStatus =
  | 'ACTIVE'
  | 'SUBMITTED'
  | 'COMPLETED'
  | 'FAILED'
  | 'ABANDONED'
  | 'EXPIRED';

export interface DomainEvents {
  'user.registered': { userId: string };
  'mission.published': { missionId: string; authorId: string };
  'mission.updated': { missionId: string; authorId: string };
  'mission.closed': { missionId: string; authorId: string; by: 'AUTHOR' | 'ADMIN' | 'SUSPENSION' };
  'mission.access.granted': { missionId: string; userId: string; source: 'MANUAL' | 'INVITE' };
  'mission.access.revoked': { missionId: string; userId: string; source: 'MANUAL' | 'INVITE' };
  'participation.accepted': {
    participationId: string;
    missionId: string;
    authorId: string;
    participant: Participant;
    attemptNo: number;
    deadlineAt: Date | null;
  };
  'participation.objective.submitted': {
    participationId: string;
    missionId: string;
    authorId: string;
    objectiveId: string;
    contributorId: string;
    needsReview: boolean;
  };
  'participation.objective.reviewed': {
    participationId: string;
    missionId: string;
    participant: Participant;
    objectiveId: string;
    verdict: 'APPROVED' | 'REJECTED';
  };
  'participation.status.changed': {
    participationId: string;
    missionId: string;
    authorId: string;
    participant: Participant;
    from: ParticipationStatus;
    to: ParticipationStatus;
  };
  'waitlist.offered': { entryId: string; missionId: string; participant: Participant; offerExpiresAt: Date };
  'waitlist.offer.expired': { entryId: string; missionId: string; participant: Participant };
  'invitation.created': { invitationId: string; missionId: string; inviterId: string; inviteeId: string };
  'invitation.responded': {
    invitationId: string;
    missionId: string;
    inviterId: string;
    inviteeId: string;
    response: 'ACCEPTED' | 'DECLINED';
  };
  'invitation.revoked': { invitationId: string; missionId: string; inviterId: string; inviteeId: string };
  'team.invitation.created': { invitationId: string; teamId: string; inviterId: string; inviteeId: string };
  'team.invitation.responded': {
    invitationId: string;
    teamId: string;
    inviterId: string;
    inviteeId: string;
    response: 'ACCEPTED' | 'DECLINED';
  };
  'team.member.joined': { teamId: string; userId: string };
  'team.member.left': { teamId: string; userId: string; by: 'SELF' | 'ADMIN' };
  'team.progress.updated': { participationId: string; teamId: string; seq: number };
}

export type DomainEventName = keyof DomainEvents;
