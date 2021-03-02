describe('Login', () => {
  beforeEach(() => {
    // Gladys well configured
    cy.intercept(
      {
        url: Cypress.env('serverUrl'),
        pathname: '/api/v1/setup',
        method: 'GET'
      },
      { fixture: '/api/v1/setup/account_configured.json' }
    );
  });

  it('Check login form', () => {
    // Go to home page
    cy.visit('/');

    // Check form title
    cy.get('form .card-title').should('have.text', 'Connexion');
    // Check form inputs
    cy.get('form input').should('have.length', 2);
    // Check form email type
    cy.get('form input[type=email]')
      .should('be.visible')
      .should('not.be.disabled')
      .should('not.have.class', 'is-invalid')
      .should('have.length', 1);
    // Check form password input
    cy.get('form input[type=password]')
      .should('be.visible')
      .should('not.be.disabled')
      .should('not.have.class', 'is-invalid')
      .should('have.length', 1);
    // Check form submit button
    cy.get('form button')
      .should('be.visible')
      .should('not.be.disabled')
      .should('have.length', 1);
  });

  it('Submit login without email', () => {
    // Go to home page
    cy.visit('/');

    // Submit empty form
    cy.get('form button').click();

    // Check email input is red
    cy.get('form input[type=email]')
      .should('have.class', 'is-invalid')
      .next()
      .should('have.class', 'invalid-feedback')
      .contains('E-mail invalide');
  });

  it('Submit login without password', () => {
    // Gladys login bad credentials
    cy.intercept(
      {
        url: Cypress.env('serverUrl'),
        method: 'POST',
        pathname: '/api/v1/login'
      },
      { statusCode: 401 }
    ).as('login');

    // Go to home page
    cy.visit('/');

    cy.get('form input[type=email]').type('tony.stark@gladysassistant.com');

    // Submit empty form
    cy.get('form button')
      .click()
      .should('be.disabled');

    // Get server response
    cy.wait('@login');

    // Bad credential alert displayed
    cy.get('alert alert-danger').should('be.visible');

    // Submit button is enabled
    cy.get('form button').should('not.be.disabled');
  });
});
