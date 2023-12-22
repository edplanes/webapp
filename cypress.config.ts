import { defineConfig } from 'cypress';
import fs from 'fs';

export default defineConfig({
  video: true,
  e2e: {
    baseUrl: 'http://localhost:4200',
    experimentalRunAllSpecs: true,
    setupNodeEvents(on) {
      on(
        'after:spec',
        (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
          if (!results || !results.video) return;

          const failures = results.tests.some(test =>
            test.attempts.some(attempt => attempt.state === 'failed')
          );

          if (!failures) {
            fs.unlinkSync(results.video);
          }
        }
      );
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
