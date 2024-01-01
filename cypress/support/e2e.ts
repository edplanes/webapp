// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
// import './commands';

export function setLocalStorageUser() {
  window.localStorage.setItem(
    'id_token',
    'eyJraWQiOiI2ODBjNWY3Ny1mODlhLTQ3OTUtOTA4Ny1kYWM5NTU4NzRmOWUiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3MDMwNTIyNzMsImlhdCI6MTcwMzAxNjI3Mywic2NvcGUiOiJST0xFX0FETUlOLFJPTEVfVVNFUiJ9.VFNmN-9e8KQONeij0NiS4kDiqgGSET_v-t1tgRSE0LKC5nF2QgRgQWJ-IrWx0x_gO8NEK11JVKXUea-ppbZO9n8kwGM5RcI5fhyWVBqQEbxrMIE0hoEtrhYWisc8_xlHEtJzwExOlXaa7vDh-EtbpWvkmHKtt4MyMg8yo-tmBRVPf-zf4Qi1WoqK278IWTg-XwgtAOtyzY2MIRPtf87BnEhDlEesrDhQMb-8BUGrHFhsrr7GAxYfNP4iOqDbc4-q12UXy6wSJT1318t3TqHFyZlFehQ3Pu379Vp_WzFEV2GmneSYac4LXOhVENnoL32M9805E0SCZWNas8M-eeAlhw'
  );
  window.localStorage.setItem(
    'user',
    '{"id":"6581e06d5e8a2548bfb4bc96","username":"admin","email":"admin@localhost.com", "roles": ["ADMIN"]}'
  );
  window.localStorage.setItem('expires_at', '1703052273907');
}
