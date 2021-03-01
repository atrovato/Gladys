describe('Dashboard', () => {
  before(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, 'language', { value: 'en-US' });
      }
    });
  });

  it('Check menu', () => {
    cy.get('#headerMenuCollapse')
      .should('be.visible')
      .find('ul')
      .should('have.length', 1)
      .children('li')
      .should('have.length', 6)
      .each((item, i) => {
        expect(item).to.have.
      })
  });
});
