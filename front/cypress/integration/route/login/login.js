describe('Login', () => {
  describe('Login page', () => {
    beforeEach(() => {
      // User not logged well configured
      cy.intercept(
        {
          url: Cypress.env('serverUrl'),
          pathname: '/api/v1/me',
          method: 'GET'
        },
        { statusCode: 401 }
      );
      cy.intercept(
        {
          url: Cypress.env('serverUrl'),
          pathname: '/api/v1/me/picture',
          method: 'GET'
        },
        { statusCode: 401 }
      );

      cy.intercept(
        {
          url: Cypress.env('serverUrl'),
          pathname: '/api/v1/access_token',
          method: 'POST'
        },
        { statusCode: 401 }
      ).as('access_token');

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

      // Check redirect to /login
      cy.location('pathname').should('eq', '/login');

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
  });

  describe('Login failed', () => {
    beforeEach(() => {
      // User not logged well configured
      cy.intercept(
        {
          url: Cypress.env('serverUrl'),
          pathname: '/api/v1/me',
          method: 'GET'
        },
        { statusCode: 401 }
      );
      cy.intercept(
        {
          url: Cypress.env('serverUrl'),
          pathname: '/api/v1/me/picture',
          method: 'GET'
        },
        { statusCode: 401 }
      );

      cy.intercept(
        {
          url: Cypress.env('serverUrl'),
          pathname: '/api/v1/access_token',
          method: 'POST'
        },
        { statusCode: 401 }
      ).as('access_token');

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

    it('Submit login without email', () => {
      // Go to home page
      cy.visit('/');

      // Submit empty form
      cy.get('form button').click();

      // Check email input is red
      cy.get('form input[type=email]')
        .should('have.class', 'is-invalid')
        .next()
        .should('have.class', 'invalid-feedback');
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
        .then(e => e.attr('disabled') === true);

      // Get server response
      cy.wait('@login');
      cy.wait('@access_token');

      // Bad credential alert displayed
      cy.get('.alert.alert-danger').should('be.visible');

      // Submit button is enabled
      cy.get('form button').should('not.have.attr', 'disabled');
    });

    it('Submit login bad credententials', () => {
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
      cy.get('form input[type=password]').type('password');

      // Submit empty form
      cy.get('form button')
        .click()
        .then(e => e.attr('disabled') === true);

      // Get server response
      cy.wait('@login');
      cy.wait('@access_token');

      // Bad credential alert displayed
      cy.get('.alert.alert-danger').should('be.visible');

      // Submit button is enabled
      cy.get('form button').should('not.have.attr', 'disabled');
    });
  });

  describe('Login success', () => {
    it('Good credentials', () => {
      // Gladys login bad credentials
      cy.intercept(
        {
          url: Cypress.env('serverUrl'),
          method: 'POST',
          pathname: '/api/v1/login'
        },
        { statusCode: 200 }
      ).as('login');

      // Go to home page
      cy.visit('/');

      cy.get('form input[type=email]').type('tony.stark@gladysassistant.com');
      cy.get('form input[type=password]').type('password');

      // Submit empty form
      cy.get('form button')
        .click()
        .then(e => e.attr('disabled') === true);

      // Get server response
      cy.wait('@login');

      // Check redirect to /dashboard
      cy.location('pathname').should('eq', '/dashboard');
    });
  });
});
