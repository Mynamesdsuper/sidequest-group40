// Proves that local/feature-boundaries triggers on deep imports between features. Run: npm run test:lint-rules
const path = require('node:path');
const { describe, it } = require('node:test');
const { RuleTester } = require('eslint');
const tseslint = require('typescript-eslint');
const rule = require('./feature-boundaries.js');

RuleTester.describe = describe;
RuleTester.it = it;

const app = path.resolve(__dirname, '../src/app');
const inTeamPlay = path.join(app, 'features/team-play/pages/play-page.ts');

new RuleTester({ languageOptions: { parser: tseslint.parser } }).run('feature-boundaries', rule, {
  valid: [
    { filename: inTeamPlay, code: "import { ObjectiveList } from '../../participation/public-api';" },
    { filename: inTeamPlay, code: "import { x } from '../team-play.routes';" }, // same feature
    { filename: inTeamPlay, code: "import { ToastService } from '../../../shared/ui';" }, // shared code
    { filename: inTeamPlay, code: "import { AuthService } from '../../../core/auth';" }, // core
    { filename: inTeamPlay, code: "import { Component } from '@angular/core';" }, // package
    {
      filename: path.join(app, 'app.routes.ts'),
      code: "const r = import('./features/teams/teams.routes');",
    }, // not a feature file
  ],
  invalid: [
    {
      filename: inTeamPlay,
      code: "import { ObjectiveList } from '../../participation/objective-list';",
      errors: [{ messageId: 'deep' }],
    },
    {
      filename: inTeamPlay,
      code: "export { TeamService } from '../../teams/team.service';",
      errors: [{ messageId: 'deep' }],
    },
    {
      filename: inTeamPlay,
      code: "export * from '../../missions';", // the folder is not the public API
      errors: [{ messageId: 'deep' }],
    },
    {
      filename: inTeamPlay,
      code: "const m = import('../../explore/explore.routes');",
      errors: [{ messageId: 'deep' }],
    },
  ],
});
