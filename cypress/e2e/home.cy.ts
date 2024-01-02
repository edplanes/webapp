describe('Home Page', () => {
  before(() => {
    cy.intercept('/assets/config/config.dev.json', {
      body: {
        apiServer: 'http://localhost:8080/api',
      },
    });
  });

  it('displays all airlines', () => {
    cy.visit('/');
  });
});
