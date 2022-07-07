describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      user: 'testuser',
      password: 'testpassword',
      username: 'testusername'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#username')
    cy.get('#password')
    cy.get('#loginButton')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testusername')
      cy.get('#password').type('testpassword')
      cy.get('#loginButton').click()
      cy.get('html')
        .should('contain', 'Logged in testusername')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testusername')
      cy.get('#password').type('wrongpassword')
      cy.get('#loginButton').click()
      cy.get('html')
        .should('not.contain', 'Logged in testusername')
      cy.get('.error')
        .should('contain', 'Invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testusername')
      cy.get('#password').type('testpassword')
      cy.get('#loginButton').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('testtitle')
      cy.get('#author').type('testauthor')
      cy.get('#url').type('testurl')
      cy.get('#submitButton').click()
      cy.get('html')
        .should('contain', 'A new blog testtitle by author named testauthor added')
      cy.contains('testtitle by testauthor')
      cy.get('#viewButton')
    })
  })

})