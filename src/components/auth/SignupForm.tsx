import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignupFormProps {
  onSignup: (name: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

export const SignupForm = ({ onSignup, onSwitchToLogin, isLoading, error }: SignupFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !agreedToTerms) return;
    if (password !== confirmPassword) return;
    await onSignup(name, email, password);
  };

  const isPasswordValid = password.length >= 8;
  const isEmailValid = email.includes('@') && email.includes('.');
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  return (
    <Card className="w-full max-w-md mx-auto p-8">
      <div className="text-center mb-8">
        <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-muted-foreground mt-2">
          Sign up to save your document verification history
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn("pl-10", isEmailValid && "border-green-500")}
              required
            />
          </div>
          {isEmailValid && (
            <p className="text-xs text-green-600 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Valid email format
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn("pl-10 pr-10", isPasswordValid && "border-green-500")}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password.length > 0 && (
            <p className={cn("text-xs flex items-center", isPasswordValid ? "text-green-600" : "text-red-600")}>
              {isPasswordValid ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Password is strong
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Password must be at least 8 characters
                </>
              )}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn("pl-10 pr-10", doPasswordsMatch && "border-green-500")}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && (
            <p className={cn("text-xs flex items-center", doPasswordsMatch ? "text-green-600" : "text-red-600")}>
              {doPasswordsMatch ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Passwords match
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Passwords do not match
                </>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="terms" className="text-sm text-muted-foreground">
            I agree to the{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !name || !email || !password || !confirmPassword || !agreedToTerms || !isPasswordValid || !doPasswordsMatch}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-3">Or continue as guest</p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Continue Without Account
          </Button>
        </div>
      </div>
    </Card>
  );
};
