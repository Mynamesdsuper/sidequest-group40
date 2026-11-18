import path from 'node:path';
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';

// Proves that the ESLint rule local/module-boundaries triggers on deep imports between modules.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rule = require('../../eslint-rules/module-boundaries.js');

const src = path.resolve(__dirname, '../../src');
const inTeams = path.join(src, 'modules/teams/services/team.service.ts');

const tester = new RuleTester({ languageOptions: { parser: tseslint.parser } });

tester.run('module-boundaries', rule, {
  valid: [
    { filename: inTeams, code: "import { definition } from '../../participations';" },
    { filename: inTeams, code: "import { x } from '../../participations/index';" },
    { filename: inTeams, code: "import { Team } from '../models';" }, // same module
    { filename: inTeams, code: "import { v } from '../../../shared/validation';" }, // shared code
    { filename: inTeams, code: "import express from 'express';" }, // package
    {
      filename: path.join(src, 'app.ts'),
      code: "import { x } from './modules/teams/services/team.service';",
    }, // not a module file
  ],
  invalid: [
    {
      filename: inTeams,
      code: "import { accept } from '../../participations/services/accept.service';",
      errors: [{ messageId: 'deep' }],
    },
    {
      filename: inTeams,
      code: "export { User } from '../../users/models';",
      errors: [{ messageId: 'deep' }],
    },
    {
      filename: inTeams,
      code: "export * from '../../missions/domain/policy';",
      errors: [{ messageId: 'deep' }],
    },
    {
      filename: inTeams,
      code: "const m = import('../../missions/missions.routes');",
      errors: [{ messageId: 'deep' }],
    },
  ],
});
