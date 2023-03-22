// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", `${Cypress.env("BACKEND")}/login`, {
    username: username,
    password: password,
  }).then((response) => {
    //console.log('cypress user',response.body);
    window.localStorage.setItem(
      "loggedinBlogAppUser",
      JSON.stringify(response.body)
    );
    cy.visit("");
    cy.wait(1000);
  });
});

Cypress.Commands.add("createBlog", (blog) => {
  const userObj = JSON.parse(
    window.localStorage.getItem("loggedinBlogAppUser")
  );
  const requestObj = {
    url: `${Cypress.env("BACKEND")}/blogs`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${userObj.token}`,
    },
    body: blog,
  };
  cy.request(requestObj);
});

Cypress.Commands.add("getLikeCount", { prevSubject: true }, $elem => {
  return cy.wrap($elem).invoke("text").then((initialText) => {
    const initialLikeCount = parseInt(initialText.match(/\d+/)[0]);
    return initialLikeCount;
  });
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
