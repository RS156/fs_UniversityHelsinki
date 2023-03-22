describe("Blog App", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);

    const user = {
      username: "RS_TEST",
      name: "Rishabh Sarkar",
      password: "Password",
    };

    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.contains("username").find("input");
    cy.contains("password").find("input");
    cy.get("#login-button");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("RS_TEST");
      cy.get("#password").type("Password");
      cy.get("#login-button").click();

      cy.contains("Rishabh Sarkar logged in");
      cy.contains("logout");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("RS_TEST");
      cy.get("#password").type("Wrong");
      cy.get("#login-button").click();

      cy.get(".notification.error")
        .should("contain", "wrong user name or password.")
        .and("have.css", "border-style", "solid")
        .and("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      const user = {
        username: "RS_TEST",
        password: "Password",
      };
      cy.login(user);
    });

    it("a blog can be created", function () {
      cy.contains("new note").click();

      cy.contains("create");

      cy.get("#titleInp").type("Testing blog");
      cy.get("#authorInp").type("Rishabh Author");
      cy.get("#urlInp").type("http://www.google.com");
      cy.get("#create-blog-btn").click();
      cy.wait(1000);
      cy.get(".blogTitle")
        .should("contain", "Testing blog")
        .and("contain", "Rishabh Author");
    });

    describe("and has 1 blog created", function () {
      beforeEach(function () {
        const blog = {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0,
        };
        cy.createBlog(blog);
        cy.visit("");
        cy.wait(1000);
      });

      it("able to like a blog", function () {
        cy.get(".blogContainer")
          .should("contain", "React patterns")
          .and("contain", "Michael Chan")
          .as("blog");
        cy.get("@blog").contains("view").click();
        cy.get("@blog").find("button").contains("like").as("likeBtn");
        let initialLikeCount;
        cy.get("@likeBtn")
          .parent()
          .invoke("text")
          .then((initialText) => {
            initialLikeCount = parseInt(initialText.match(/\d+/)[0]);
          });
        cy.get("@likeBtn").click();
        cy.get("@likeBtn")
          .parent()
          .invoke("text")
          .should((newText) => {
            const updatedLikeCount = parseInt(newText.match(/\d+/)[0]);
            expect(updatedLikeCount).to.eq(initialLikeCount + 1);
          });
      });

      it("user who created, can delete the blog", function () {
        cy.get(".blogContainer")
          .should("contain", "React patterns")
          .and("contain", "Michael Chan")
          .as("blog");
        cy.get("@blog").contains("view").click();
        cy.get("@blog").find("button").contains("remove").click();
        cy.on("window:confirm", (str) => true);
        cy.wait(1000);
        cy.get("@blog").should("not.exist");
      });

      describe("Has 2 users", function () {
        let secondUser;
        beforeEach(function () {
          secondUser = {
            username: "rs156",
            name: "Second user",
            password: "Password",
          };

          cy.request("POST", `${Cypress.env("BACKEND")}/users`, secondUser);
        });

        it("only created user can view remove button, not any other user", function () {
          cy.get(".blogContainer")
            .should("contain", "React patterns")
            .and("contain", "Michael Chan")
            .as("blog");
          cy.get("@blog").contains("view").click();
          cy.get("@blog").find("button").contains("remove");

          cy.contains("logout").click();
          cy.login({ username: "rs156", password: "Password" });
          cy.get(".blogContainer")
            .should("contain", "React patterns")
            .and("contain", "Michael Chan")
            .as("blog");
          cy.get("@blog").contains("view").click();
          cy.get("@blog").find("button").contains("remove").should("not.exist");
        });
      });
    });

    describe("and has multiple blogs added", function () {
      beforeEach(function () {
        //cy.log("in before each");
        cy.fixture("test_data.json")
          .then((data) => {
           
            data.forEach((blog) => {
              cy.createBlog(blog);
            });
          })
          
        cy.visit("");
        cy.wait(1000);
      });

      it.only("blogs are ordered according to likes", function () {
        cy.get(".blogTitle")
        .find('button')        
        .each(($button)=>{
          cy.wrap($button).click()
        })
        let likesList = []
        cy.get('.blogLikesContainer')
        .each($elem =>{
          cy.wrap($elem).getLikeCount().then(likeCount =>{
            //cy.log(likeCount)
            likesList = likesList.concat(likeCount)
          })
          })
          .then(elem => {
            const sortedlikeslist = [...likesList].sort((a,b)=> (b-a))
            cy.log(likesList.join())
            expect(likesList.join()=== sortedlikeslist.join()).to.be.true
          })
          
      
      })
    })
  })
})
