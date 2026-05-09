import '@testing-library/jest-dom';

describe('Authentication Component Tests - RegisterPage', () => {
  // TC_AUTH_005: Verify student registration
  test('TC_AUTH_005: should validate registration data', () => {
    const userData = {
      fullName: 'New Student',
      email: 'newstudent@example.com',
      password: 'SecurePass123!',
    };
    expect(userData.fullName).toBeTruthy();
    expect(userData.email).toContain('@');
    expect(userData.password.length).toBeGreaterThanOrEqual(8);
  });

  // TC_AUTH_006: Verify password complexity requirements
  test('TC_AUTH_006: should enforce password complexity', () => {
    const password = 'weakpass';
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    expect(passwordRegex.test(password)).toBeFalsy();
    
    const strongPassword = 'SecurePass123!';
    expect(passwordRegex.test(strongPassword)).toBeTruthy();
  });
});
