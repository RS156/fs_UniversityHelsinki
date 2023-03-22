describe('Blog App',function() {
  beforeEach(function(){
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    const user = {
      "username" : "RS_TEST",
      "name" : "Rishabh Sarkar",
      "password": "Password"
  }
  
  cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
  cy.visit('')

  })

  it('Login form is shown', function() {
    cy.contains('username').find('input')
    cy.contains('password').find('input')
    cy.get('#login-button')
  })

  describe('Login', function(){
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('RS_TEST')
      cy.get('#password').type('Password')
      cy.get('#login-button').click()

      cy.contains('Rishabh Sarkar logged in')
      cy.contains('logout')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('RS_TEST')
      cy.get('#password').type('Wrong')
      cy.get('#login-button').click()

      cy.get('.notification.error')
      .should('contain', 'wrong user name or password.')
      .and('have.css', 'border-style', 'solid')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      
    })
  })

  describe('When logged in', function(){
    beforeEach(function(){
      cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
        "username" : "RS_TEST",        
        "password": "Password"
    })
    .then(response =>{
      console.log('cypress user',response.body);
      window.localStorage.setItem('loggedinBlogAppUser', 
      JSON.stringify(response.body))
      cy.visit('')
      cy.contains('Rishabh Sarkar logged in')
      cy.wait(2000)
    })
    })

    it('a blog can be created', function() {
      cy.contains('new note').click()
      
      cy.contains('create')

      cy.get('#titleInp').type('Testing blog')     
      cy.get('#authorInp').type('Rishabh Author')
      cy.get('#urlInp').type('http://www.google.com')
      cy.get('#create-blog-btn').click()
      cy.wait(2000)
      cy.get('.blogTitle')
      .should('contain', 'Testing blog')
      .and('contain', 'Rishabh Author')
    })

  })

})