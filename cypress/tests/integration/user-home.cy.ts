import { setLocalStorageUser } from '../../support/e2e';

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
    setLocalStorageUser();
  });
});
