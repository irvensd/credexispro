describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('form').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
    cy.get('button').contains('Test Login').should('exist');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.get('form').contains('Email is required').should('be.visible');
    cy.get('form').contains('Password is required').should('be.visible');
  });

  it('should show validation error for invalid email', () => {
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    cy.get('form').contains('Invalid email address').should('be.visible');
  });

  it('should handle successful login', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check if redirected to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="dashboard-title"]').should('be.visible');
  });

  it('should handle test login', () => {
    cy.get('button').contains('Test Login').click();

    // Check if redirected to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="dashboard-title"]').should('be.visible');
  });

  it('should show loading state during login', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check loading state
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('button[type="submit"]').contains('Loading').should('be.visible');
  });

  it('should handle login error', () => {
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check error message
    cy.get('[data-testid="error-message"]')
      .contains('Invalid credentials')
      .should('be.visible');
  });

  it('should persist login state after page reload', () => {
    // Login
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check if redirected to dashboard
    cy.url().should('include', '/dashboard');

    // Reload page
    cy.reload();

    // Should still be on dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="dashboard-title"]').should('be.visible');
  });

  it('should redirect to login when accessing protected route without auth', () => {
    // Try to access dashboard directly
    cy.visit('/dashboard');

    // Should be redirected to login
    cy.url().should('include', '/login');
    cy.get('form').should('exist');
  });
}); 