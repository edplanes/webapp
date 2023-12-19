describe('Login Page', () => {
  before(() => {
    cy.intercept("/assets/config/config.dev.json", {
      body: {
        "apiServer": "http://localhost:8080"
      }
    })
  })

  it('invalid form not cause request', () => {
    cy.intercept("/api/auth").as('authRequest')
    cy.visit('/login')
    cy.get('button[type="submit"]').click()
    cy.wait(2000);
    cy.get('@authRequest.all').then((interceptions) => {
      console.log(interceptions)
      expect(interceptions).to.have.length(0)
    })
  })

  it('displays error', () => {
    cy.visit('/login')
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('have.length.at.least', 2)
  })

  it('top navbar displays single row', () => {
    cy.visit('/login')
    cy.get('mat-toolbar > mat-toolbar-row').should('have.length', 1)
  })

  it('verifies the login flow', () => {
    cy.intercept("/api/auth", {
      hostname: "localhost"
    }, (req) => {
      expect(req.headers["authorization"]).contain("YWRtaW5AbG9jYWxob3N0LmNvbTphZG1pbg==")

      req.reply(200, {
        token: "eyJraWQiOiI2ODBjNWY3Ny1mODlhLTQ3OTUtOTA4Ny1kYWM5NTU4NzRmOWUiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3MDMwNTIyNzMsImlhdCI6MTcwMzAxNjI3Mywic2NvcGUiOiJST0xFX0FETUlOLFJPTEVfVVNFUiJ9.VFNmN-9e8KQONeij0NiS4kDiqgGSET_v-t1tgRSE0LKC5nF2QgRgQWJ-IrWx0x_gO8NEK11JVKXUea-ppbZO9n8kwGM5RcI5fhyWVBqQEbxrMIE0hoEtrhYWisc8_xlHEtJzwExOlXaa7vDh-EtbpWvkmHKtt4MyMg8yo-tmBRVPf-zf4Qi1WoqK278IWTg-XwgtAOtyzY2MIRPtf87BnEhDlEesrDhQMb-8BUGrHFhsrr7GAxYfNP4iOqDbc4-q12UXy6wSJT1318t3TqHFyZlFehQ3Pu379Vp_WzFEV2GmneSYac4LXOhVENnoL32M9805E0SCZWNas8M-eeAlhw",
        expiresAt: new Date("2023-12-20T06:04:33.907518411Z").getTime(),
        payload: {
          id: "6581e06d5e8a2548bfb4bc96",
          username: "admin",
          email: "admin@localhost.com"
        }

      })
    }).as("login")
    cy.visit('/login')
    cy.get('input[type="email"]').type("admin@localhost.com")
    cy.get('input[type="password"]').type("admin")
    cy.get('button[type="submit"]').click()
    cy.wait("@login")
    cy.url().should('match', /(http:\/\/|https:\/\/)?[^\/\?]+\/$/)
  })
})
