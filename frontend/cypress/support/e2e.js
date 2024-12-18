beforeEach(() => {
    cy.log('I run before every test in every spec file!!!!!!')
})

Cypress.on('uncaught:exception', (err, runnable) => {
    // Return false, um Cypress mitzuteilen, die Exception zu ignorieren.
    return false;
  });
  