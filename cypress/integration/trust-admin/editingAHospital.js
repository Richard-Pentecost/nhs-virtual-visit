import { thenIClickLogOut } from "../commonSteps";

describe("As an admin, I want to edit a hospital so that I can keep hospital changes up to date.", () => {
  function GivenIAmLoggedInAsAnAdmin() {
    cy.visit(Cypress.env("baseUrl") + "/trust-admin/login");
    cy.get("input[name=code]").type(Cypress.env("validTrustAdminCode"));
    cy.get("input[name=password]").type(Cypress.env("validTrustAdminPassword"));
    cy.get("button").contains("Log in").click();
  }

  function WhenIClickOnHospitals() {
    cy.get("a.nhsuk-header__navigation-link").contains("Hospitals").click();
  }

  function ThenISeeTheHospitalList() {
    cy.get("caption").should("contain", "List of hospitals");
  }

  function WhenIClickOnTheEditLink() {
    cy.get("a.nhsuk-link").contains("Edit").click();
  }

  function ThenIShouldBeOnTheEditHospitalPage() {
    cy.url().should("include", "/trust-admin/hospitals/1/edit");
    cy.get("input[name=hospital-name]").should("have.value", "Test Hospital");
  }

  function WhenIFillOutTheFormWithBadSurveyUrl() {
    cy.get("input[name=hospital-name]").type("Scorpia Hospital");
    cy.get("input[name=hospital-survey-url]").type("https://www");
  }

  function WhenIFillOutTheFormWithBadSupportUrl() {
    cy.get("input[name=hospital-name]").type("Scorpia Hospital");
    cy.get("input[name=hospital-support-url]").type("https://www");
  }

  function AndIClickTheEditHospitalButton() {
    cy.get("button[type=submit]").contains("Edit hospital").click();
  }

  function WhenISubmitFormEmptyHospitalName() {
    cy.get("input[name=hospital-name]").clear();
    AndIClickTheEditHospitalButton();
  }

  function ThenISeeErrors() {
    cy.get(".nhsuk-error-summary").should("be.visible");
  }

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnHospitals();
    ThenISeeTheHospitalList();

    WhenIClickOnTheEditLink();
    ThenIShouldBeOnTheEditHospitalPage();
    cy.audit();

    WhenISubmitFormEmptyHospitalName();
    ThenISeeErrors();

    thenIClickLogOut();
  });

  it("displays errors when survey url is invalid", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnHospitals();
    ThenISeeTheHospitalList();

    WhenIClickOnTheEditLink();
    ThenIShouldBeOnTheEditHospitalPage();

    WhenIFillOutTheFormWithBadSurveyUrl();
    AndIClickTheEditHospitalButton();
    ThenISeeErrors();

    thenIClickLogOut();
  });

  it("displays errors when support url is invalid", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnHospitals();
    ThenISeeTheHospitalList();

    WhenIClickOnTheEditLink();
    ThenIShouldBeOnTheEditHospitalPage();

    WhenIFillOutTheFormWithBadSupportUrl();
    AndIClickTheEditHospitalButton();
    ThenISeeErrors();

    thenIClickLogOut();
  });
});
