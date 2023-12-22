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
  env: {
    authResponse: {
      token:
        'eyJraWQiOiI2ODBjNWY3Ny1mODlhLTQ3OTUtOTA4Ny1kYWM5NTU4NzRmOWUiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3MDMwNTIyNzMsImlhdCI6MTcwMzAxNjI3Mywic2NvcGUiOiJST0xFX0FETUlOLFJPTEVfVVNFUiJ9.VFNmN-9e8KQONeij0NiS4kDiqgGSET_v-t1tgRSE0LKC5nF2QgRgQWJ-IrWx0x_gO8NEK11JVKXUea-ppbZO9n8kwGM5RcI5fhyWVBqQEbxrMIE0hoEtrhYWisc8_xlHEtJzwExOlXaa7vDh-EtbpWvkmHKtt4MyMg8yo-tmBRVPf-zf4Qi1WoqK278IWTg-XwgtAOtyzY2MIRPtf87BnEhDlEesrDhQMb-8BUGrHFhsrr7GAxYfNP4iOqDbc4-q12UXy6wSJT1318t3TqHFyZlFehQ3Pu379Vp_WzFEV2GmneSYac4LXOhVENnoL32M9805E0SCZWNas8M-eeAlhw',
      expiresAt: new Date('2023-12-20T06:04:33.907518411Z').getTime(),
      payload: {
        id: '6581e06d5e8a2548bfb4bc96',
        username: 'admin',
        email: 'admin@localhost.com',
      },
    },
  },
});
