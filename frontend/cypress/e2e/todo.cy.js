const PORT = process.env.PORT || 3000;

describe('Todo', function () {

    beforeEach(() => {
        cy.visit(`http://localhost:${PORT}/todo.html`);
      });

    it('successfully loads', function () {
        cy.visit(`http://localhost:${PORT}/todo.html`) // ändern Sie URL zu Ihrer App
    });

    it('Fügt ein neues Todo hinzu und zeigt es an', function () {
        cy.get('#todo').type('Neue Aufgabe');
        cy.get('#due').type('2024-11-20');
        cy.get('#status').select('offen');
        cy.get('[type="submit"]').click();
    
        cy.get('#todo-list .todo').should('have.length', 1);
        cy.contains('Neue Aufgabe');
        cy.contains('11/20/2024');
        cy.contains('offen');
    });

    it('Zeigt eine Fehlermeldung, wenn kein Titel eingegeben wurde', function () {
        cy.get('#due').type('2024-11-20');
        cy.get('[type="submit"]').click();
        
        cy.get('#todo').invoke('prop', 'validationMessage').should('not.be.empty');
    });

    it('Ändert den Status eines Todos', function () {
        cy.get('#todo').type('Another Task');
        cy.get('#due').type('2024-11-21');
        cy.get('[type="submit"]').click();
        
        cy.contains('.todo', 'Another Task')
            .find('.status')
            .click();

        cy.contains('.todo', 'Another Task') 
            .find('.status')
            .should('contain', 'in Bearbeitung');
    });

    it('Löscht ein Todo', function () {
        cy.get('#todo').type('Task to Delete');
        cy.get('#due').type('2024-11-22');
        cy.get('[type="submit"]').click();

        cy.contains('.todo', 'Task to Delete')
            .find('.delete')
            .click();
        
        cy.contains('.todo', 'Task to Delete').should('not.exist');
    });
});
