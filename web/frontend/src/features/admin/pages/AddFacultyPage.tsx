import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Lock, Mail, User, X, Check, Copy } from 'lucide-react';
import authService from '../../auth/services/authService';

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
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Faculty Account</h1>
          <p className="text-gray-600 mb-6">Create a new faculty account with a temporary password.</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  placeholder="Dr. Jane Smith"
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
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="jane.smith@university.edu"
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
                Temporary Password
              </label>
              <div className="relative mt-1.5 flex gap-2">
                <div className="relative flex-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="tempPassword"
                    type="text"
                    value={tempPassword}
                    readOnly
                    className="pl-10 w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 font-mono text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                  title="Copy password"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                  <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Randomly generated secure password. Faculty will be asked to change on first login.</p>
            </div>

            <button
              type="submit"
              className="w-full gradient-amber text-white font-semibold shadow-amber border-0 hover:opacity-90 transition-opacity py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Faculty Account'}
            </button>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Faculty Account Created</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">Faculty account has been successfully created!</p>
            </div>

            <div className="space-y-4 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <p className="text-sm font-medium text-gray-900">{fullName}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <p className="text-sm font-medium text-gray-900">{email}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Temporary Password</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempPassword}
                    readOnly
                    className="flex-1 border border-gray-300 rounded px-2 py-1 font-mono text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-6">
              Share the temporary password with the faculty member. They will be required to change it on their first login.
            </p>

            <button
              onClick={handleCloseModal}
              className="w-full gradient-amber text-white font-semibold rounded-md py-2 hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFacultyPage;
