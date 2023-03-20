describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name : 'Rishabh Sarkar',
      username:'rsarkar',
      password : 'Password'
    }
    cy.request('POST','http://localhost:3001/api/users', user)    
    cy.visit('http://localhost:3000/')
  })

  it('front page can be opened', function () {

    cy.contains('Notes')
    cy.contains('Note app, Depatment of Computer Science, University of Helsinki')
  })

  it('login form can be opened', function () {

    cy.contains('login').click()

  })

  it('user can login', function () {

    cy.contains('login').click()
    cy.get('#username').type('rsarkar')
    cy.get('#password').type('Password')
    cy.get('#login-button').click()

    cy.contains('Rishabh Sarkar is logged in')
  })

  it('login fails with wrong password', function(){
    cy.contains('login').click()
    cy.get('#username').type('rsarkar')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
    .should('contain', 'Wrong credentials')
    .and('have.css', 'color','rgb(255, 0, 0)')
    .and('have.css', 'border-style','solid')

    cy.get('html').should('not.contain', 'Rishabh Sarkar is logged in')

  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({username:'rsarkar', password: 'Password'})
    })

    it('a new note can be created', function(){
       cy.contains('new note').click()
       cy.get('#note-input').type('a note created by cypress')
       cy.contains('save').click()
       cy.contains('a note created by cypress')
    })

    describe('and a note exists', function(){
      beforeEach(function(){
        cy.contains('new note').click()
        cy.get('#note-input').type('another note cypress')
        cy.contains('save').click()
        cy.contains('another note cypress')
      })

      it('it can be made not important', function(){
        cy.contains('another note cypress')
        .contains('make not important')
        .click()

        cy.contains('another note cypress')
        .contains('make important')
      })
    })
  })
})