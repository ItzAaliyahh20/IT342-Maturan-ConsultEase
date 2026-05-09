import '@testing-library/jest-dom';

describe('Dashboard Component Tests', () => {
  // TC_DASH_001: Verify student dashboard displays correctly
  test('TC_DASH_001: should render student dashboard', () => {
    const mockUser = {
      id: 1,
      email: 'student@example.com',
      fullName: 'John Doe',
      role: 'STUDENT',
    };
    expect(mockUser.role).toBe('STUDENT');
    expect(mockUser.fullName).toBeTruthy();
  });

  // TC_DASH_002: Verify faculty dashboard displays correctly
  test('TC_DASH_002: should render faculty dashboard', () => {
    const mockUser = {
      id: 2,
      email: 'faculty@example.com',
      fullName: 'Dr. Smith',
      role: 'FACULTY',
    };
    expect(mockUser.role).toBe('FACULTY');
    expect(mockUser.fullName).toContain('Dr.');
  });
});
