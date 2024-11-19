const PORT = process.env.PORT || 3000;

describe('Todo', function () {
    it('successfully loads', function () {
        cy.visit(`http://localhost:${PORT}/todo.html`) // ändern Sie URL zu Ihrer App
    })
})