import { loadOpenApi, mergeOpenApi, type Fragment } from '../../src/shared/openapi/merge';

const base: Fragment = {
  source: 'common.yaml',
  doc: {
    openapi: '3.1.0',
    info: { title: 'API', version: '1' },
    paths: { '/health': {} },
    components: { schemas: { Error: {} } },
    tags: [{ name: 'System' }],
  },
};

describe('OpenAPI merge', () => {
  test('merges paths, components and tags of every fragment', () => {
    const doc = mergeOpenApi(base, [
      {
        source: 'teams.openapi.yaml',
        doc: { paths: { '/teams': {} }, components: { schemas: { Team: {} } }, tags: [{ name: 'Teams' }] },
      },
      { source: 'users.openapi.yaml', doc: { paths: { '/users/{id}': {} }, tags: [{ name: 'Users' }] } },
    ]);
    expect(doc.openapi).toBe('3.1.0');
    expect(Object.keys(doc.paths!)).toEqual(['/health', '/teams', '/users/{id}']);
    expect(Object.keys(doc.components!.schemas)).toEqual(['Error', 'Team']);
    expect(doc.tags!.map((t) => t.name)).toEqual(['System', 'Teams', 'Users']);
  });

  test.each([
    [
      'a path',
      { paths: { '/health': {} } },
      /duplicate paths\.\/health in x\.yaml \(already defined in common\.yaml\)/,
    ],
    ['a schema', { components: { schemas: { Error: {} } } }, /duplicate components\.schemas\.Error/],
    ['a tag', { tags: [{ name: 'System' }] }, /duplicate tag "System"/],
    ['an info key', { info: { title: 'Other' } }, /duplicate info\.title/],
  ])('fails loudly on a duplicate: %s', (_what, doc, message) => {
    expect(() => mergeOpenApi(base, [{ source: 'x.yaml', doc }])).toThrow(message);
  });

  test('the real fragments of the 8 modules merge without conflicts', () => {
    const doc = loadOpenApi();
    expect(doc.paths).toHaveProperty('/health');
    expect(doc.tags!.map((t) => t.name)).toEqual(
      expect.arrayContaining([
        'System',
        'Auth',
        'Users',
        'Missions',
        'Participations',
        'Notifications',
        'Dashboard',
        'Invitations',
        'Teams',
      ]),
    );
  });
});
