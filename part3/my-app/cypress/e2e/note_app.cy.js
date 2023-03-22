describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name : 'Rishabh Sarkar',
      username:'rsarkar',
      password : 'Password'
    }
    cy.request('POST',`${Cypress.env('BACKEND')}/users`, user)    
    cy.visit('')
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
        cy.createNote({
          content : 'another note cypress',
          important : true
        })
      })

      it('it can be made not important', function(){
        cy.contains('another note cypress')
        .parent()
        .find('button')
        .as('theButton')

        cy.get('@theButton')
        .contains('make not important')
        .click()

        cy.get('@theButton')
        .contains('make important')
      })
    })

    describe('and several notes exist', function(){
      beforeEach(function(){
        cy.createNote({
          content : 'first note',
          important : false
        })
        cy.createNote({
          content : 'second note',
          important : false
        })
        cy.createNote({
          content : 'third',
          important : false
        })
      })

      it('one of those notes can be made important', function(){
        cy.contains('second note')
        .parent()
        .find('button')
        .as('theButton')

        cy.get('@theButton').click()

        cy.get('@theButton')
        .should('contain','make not important')
      })

      it('then example', function(){
        cy.get('button')
        .then(buttons => {
          console.log('number of buttons', buttons.length);
          console.log('buttons data', buttons);
          cy.wrap(buttons[0]).click()
        })
      })
  })
})
})