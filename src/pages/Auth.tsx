import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, CheckCircle } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Features */}
        <div className="text-center lg:text-left space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              LegalDoc AI
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Advanced Document Verification & Legal Analysis
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Document Verification</h3>
                <p className="text-gray-600 text-sm">
                  Verify the authenticity of legal documents and detect potential fraud
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tampering Detection</h3>
                <p className="text-gray-600 text-sm">
                  Advanced analysis to detect document alterations and modifications
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Legal Assistant</h3>
                <p className="text-gray-600 text-sm">
                  Get instant answers about legal terms, clauses, and implications
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="font-semibold text-gray-900 mb-3">Why Create an Account?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Save your document verification history</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Access detailed analysis reports</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Export verification certificates</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Priority customer support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex justify-center">
          {mode === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToSignup={() => setMode('signup')}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <SignupForm
              onSignup={handleSignup}
              onSwitchToLogin={() => setMode('login')}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
};
