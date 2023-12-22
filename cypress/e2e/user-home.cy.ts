export function setLocalStorage() {
  window.localStorage.setItem(
    'id_token',
    'eyJraWQiOiI2ODBjNWY3Ny1mODlhLTQ3OTUtOTA4Ny1kYWM5NTU4NzRmOWUiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3MDMwNTIyNzMsImlhdCI6MTcwMzAxNjI3Mywic2NvcGUiOiJST0xFX0FETUlOLFJPTEVfVVNFUiJ9.VFNmN-9e8KQONeij0NiS4kDiqgGSET_v-t1tgRSE0LKC5nF2QgRgQWJ-IrWx0x_gO8NEK11JVKXUea-ppbZO9n8kwGM5RcI5fhyWVBqQEbxrMIE0hoEtrhYWisc8_xlHEtJzwExOlXaa7vDh-EtbpWvkmHKtt4MyMg8yo-tmBRVPf-zf4Qi1WoqK278IWTg-XwgtAOtyzY2MIRPtf87BnEhDlEesrDhQMb-8BUGrHFhsrr7GAxYfNP4iOqDbc4-q12UXy6wSJT1318t3TqHFyZlFehQ3Pu379Vp_WzFEV2GmneSYac4LXOhVENnoL32M9805E0SCZWNas8M-eeAlhw'
  );
  window.localStorage.setItem(
    'user',
    '{"id":"6581e06d5e8a2548bfb4bc96","username":"admin","email":"admin@localhost.com"}'
  );
  window.localStorage.setItem('expires_at', '1703052273907');
}

describe('User Home Page', () => {
  before(() => {
    cy.intercept('/assets/config/config.dev.json', {
      body: {
        apiServer: 'http://localhost:8080/api',
      },
    });
    cy.clock(new Date('2023-12-20T01:04:33.907518411Z'));
  });

  it('should render', () => {
    cy.visit('/user');
    setLocalStorage();
  });
});
