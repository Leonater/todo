const PORT = process.env.PORT || 3000;

const today = new Date()
const inputDate = today.toISOString().split('T')[0];
const containsDate = today.toLocaleDateString();

describe('Todo', function () {

    beforeEach(() => {
        cy.visit(`http://localhost:${PORT}/todo.html`);
      });

    it('successfully loads', function () {
        cy.visit(`http://localhost:${PORT}/todo.html`) // ändern Sie URL zu Ihrer App
    });

    it('Fügt ein neues Todo hinzu und zeigt es an', function () {
        cy.get('#todo').type('Neue Aufgabe');
        cy.get('#due').type(inputDate);
        cy.get('#status').select('offen');
        cy.get('[type="submit"]').click();
    
        cy.get('#todo-list .todo').should('have.length.at.least', 1);
        cy.contains('Neue Aufgabe');
        cy.contains(containsDate);
        cy.contains('offen');
    });

    it('Zeigt eine Fehlermeldung, wenn kein Titel eingegeben wurde', function () {
        cy.get('#due').type(inputDate);
        cy.get('[type="submit"]').click();
        
        cy.get('#todo').invoke('prop', 'validationMessage').should('not.be.empty');
    });

    it('Zeigt eine Fehlermeldung, wenn ein Fälligkeitsdatum in der Vergangenheit liegt', function () {
        cy.get('#todo').type('Falsches Datum');
        cy.get('#due').type('2020-11-20');
        cy.get('[type="submit"]').click();
        
        cy.get('#due').invoke('prop', 'validationMessage').should('not.be.empty');
    });

    it('Ändert den Status eines Todos', function () {
        cy.get('#todo').type('Status ändern');
        cy.get('#due').type(inputDate);
        cy.get('[type="submit"]').click();
        
        cy.contains('.todo', 'Status ändern')
            .find('.status')
            .click();

        cy.contains('.todo', 'Status ändern') 
            .find('.status')
            .should('contain', 'in Bearbeitung');
    });

    it('Löscht ein Todo', function () {
        cy.get('#todo').type('Aufgabe löschen');
        cy.get('#due').type(inputDate);
        cy.get('[type="submit"]').click();

        cy.contains('.todo', 'Aufgabe löschen')
            .find('.delete')
            .click();
        
        cy.contains('.todo', 'Aufgabe löschen').should('not.exist');
    });
});
