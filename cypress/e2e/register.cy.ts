describe('Register page', () => {
  before(() => {
    cy.intercept('/assets/config/config.dev.json', {
      body: {
        apiServer: 'http://localhost:8080/api',
      },
    });
  });

  it('search airports from db', () => {
    cy.intercept('/api/airports?search=*', { fixture: 'airports' });
    cy.visit('/register');
    cy.get('input[formControlName="homeAirport"]').type('ep');
    cy.contains('EPAR').click();
  });
});
