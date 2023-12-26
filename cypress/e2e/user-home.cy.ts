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

  it('should display statistics', () => {
    cy.intercept('/api/user/6581e06d5e8a2548bfb4bc96/stats', {
      fixture: 'statistics',
    });
    cy.visit('/user');

    cy.contains('Statistics');
    cy.get('[data-cy="pireps"]').contains('2');
    cy.get('[data-cy="avgLandingRate"]').contains('-191 FPM');
    cy.get('[data-cy="inFlightTime"]').contains('01:40:00');
    cy.get('[data-cy="points"]').contains('195');
    cy.get('[data-cy="currentLocation"]').contains('EPGD/GDN');
    cy.get('[data-cy="averagePoints"]').contains('97');
    cy.get('[data-cy="mostFlownAircraft"]').contains('B738');
  });
});
