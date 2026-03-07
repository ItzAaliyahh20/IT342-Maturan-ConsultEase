import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Lock, Mail, User, X, Check, Copy } from 'lucide-react';
import authService from '../auth/authService';

// Generate a random temporary password
const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  const length = 12;
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const AddFacultyPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate password on component mount
  React.useEffect(() => {
    setTempPassword(generateTempPassword());
  }, []);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.createFaculty({
        fullName,
        email,
        temporaryPassword: tempPassword
      });
      
      // Show modal with temporary password
      setShowModal(true);
    } catch (err: any) {
      console.error('Create faculty error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again as an administrator.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to create faculty account. Please try again. ' + (err.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Consult<span className="text-amber">Ease</span> Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Faculty Member</h1>
          <p className="mt-2 text-gray-600">Create a new faculty account with temporary credentials</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  placeholder="Dr. John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="jsmith@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="tempPassword" className="block text-sm font-medium text-gray-700">
                Temporary Password (Auto-generated)
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="tempPassword"
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent font-mono"
                  required
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                This password will be displayed in a modal after creation. Share it securely with the faculty member.
              </p>
            </div>

            <button
              type="submit"
              className="w-full gradient-amber text-white font-semibold shadow-amber border-0 hover:opacity-90 transition-opacity gap-2 flex items-center justify-center py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Faculty Account'
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseModal}></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Faculty Account Created!
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                The temporary password below will be used for the faculty member's initial login. 
                Please share this password securely with them.
              </p>

              <div className="bg-gray-100 rounded-md p-4 mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Temporary Password
                </label>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-900">{tempPassword}</code>
                  <button
                    onClick={handleCopyPassword}
                    className="flex items-center gap-1 text-sm text-amber hover:text-amber-600"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                The faculty member will be prompted to change their password upon first login.
              </p>

              <button
                onClick={handleCloseModal}
                className="w-full gradient-amber text-white font-semibold shadow-amber border-0 hover:opacity-90 transition-opacity py-2.5 rounded-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFacultyPage;
