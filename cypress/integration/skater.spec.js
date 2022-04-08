describe("skaters testing", () => { 
    it("index se abre correctamente (smoke test)", () => {
        cy.visit("http://localhost:5000")
        cy.contains("Lista de participantes")
    })

    it("click login (boton test)", () => {
        cy.visit("http://localhost:5000/login")
        cy.contains("Ingresar").click()
    })

    it("Formulario (input test)", () =>  {
        cy.visit("http://localhost:5000/login")
        cy.get("input:first").type("nombre")
    })

 })

