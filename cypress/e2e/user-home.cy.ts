import { setLocalStorageUser } from '../support/e2e';

describe('User Home Page', () => {
  before(() => {
    cy.intercept('/assets/config/config.dev.json', {
      body: {
        apiServer: 'http://localhost:8080/api',
      },
    });
  });

  beforeEach(() => {
    cy.clock(new Date('2023-12-20T01:04:33.907518411Z'));
    setLocalStorageUser();
  });

  afterEach(() => {
    cy.clearAllLocalStorage();
  });

  it('should render', () => {
    cy.visit('/user');
    setLocalStorageUser();
  });

  it('should display basic view', () => {
    cy.visit('/user');

    cy.contains('Next flight');
    cy.contains('Last flight');
    cy.get('button').contains('Book Flight');
  });

  it('should book flight', () => {
    cy.visit('/user');

    cy.contains('Next flight');
    cy.contains('Last flight');
    cy.get('button').contains('Book new flight').click();
    cy.contains('Free flight');
  });
});
