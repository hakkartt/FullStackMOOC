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
      cy.login({ username: 'testusername', password: 'testpassword' })
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
        .get('#viewButton')
        .contains('view')
    })

    describe('When multiple blogs have been created', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'title1', author: 'author1', url: 'url1', likes: 0 })
        cy.createBlog({ title: 'title2', author: 'author2', url: 'url2', likes: 0 })
      })

      it('A blog can be liked', function() {
        cy.contains('title2 by author2')
          .contains('view')
          .click()
        cy.contains('url: url2')
          .contains('likes: 0')
          .contains('like')
          .click()
        cy.contains('url: url2')
          .contains('likes: 1')
          .contains('hide')
      })

      it('A blog can be deleted by a user that has created the blog', function() {
        cy.contains('title2 by author2')
          .contains('view')
          .click()
        cy.contains('url2')
          .contains('remove')
          .click()
        cy.on('window.confirm', () => true)
        cy.get('html')
          .should('contain', 'Deleted title2 from bloglist')
          .should('not.contain', 'title2 by author2')
      })

      it('A blog can NOT be deleted by a user that has NOT created the blog', function() {
        const anotheruser = {
          user: 'anotheruser',
          password: 'anotherpassword',
          username: 'anotherusername'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', anotheruser)
        cy.visit('http://localhost:3000')
        cy.login({ username: 'anotherusername', password: 'anotherpassword' })

        cy.contains('title1 by author1')
          .contains('view')
          .click()
        cy.contains('url1')
          .should('not.contain', 'remove')
          .contains('hide')
          .click()
        cy.contains('title2 by author2')
          .contains('view')
          .click()
        cy.contains('url2')
          .should('not.contain', 'remove')
      })
    })
  })
})