import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { UserProfileModal } from '@/components/UserProfileModal';
import { GoogleUser } from '@/lib/googleIdentity';
import { mapAuthError } from '@/lib/authErrors';

const Login = () => {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newGoogleUser, setNewGoogleUser] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
      navigate('/');
    } catch (err: any) {
      const code = err?.code || 'auth/unknown';
      setError(mapAuthError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (googleUser: GoogleUser) => {
    setIsGoogleLoading(true);
    setError('');

    try {
      const { isNewUser, user } = await signInWithGoogle();
      
      if (isNewUser) {
        // This should rarely happen on the Login page, but handle it
        // For new users discovered during login, redirect to signup page instead
        toast({
          title: "New Account Detected",
          description: "Redirecting to signup page to complete your registration.",
        });
        navigate('/signup');
      } else {
        // Existing user - direct login (this is the main case for Login page)
        toast({
          title: "Welcome back!",
          description: `Successfully signed in as ${user.displayName || user.email}.`,
        });
        navigate('/');
      }
    } catch (err: any) {
      const code = err?.code || 'auth/unknown';
      setError(mapAuthError(code));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    setError(error);
    setIsGoogleLoading(false);
  };

  const handleProfileComplete = () => {
    if (newGoogleUser) {
      toast({
        title: "Welcome!",
        description: `Account created for ${newGoogleUser.email}. Welcome to India's Touch Express!`,
      });
    }
    setShowProfileModal(false);
    setNewGoogleUser(null);
    navigate('/');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Sign In
                </CardTitle>
                <p className="text-center text-gray-600">
                  Sign in to continue to checkout
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    disabled={loading || isGoogleLoading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  {/* OR Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500 font-medium">OR</span>
                    </div>
                  </div>

                  {/* Google Sign-in Button */}
                  <GoogleSignInButton
                    onClick={handleGoogleSignIn}
                    isLoading={isGoogleLoading}
                    variant="login"
                    disabled={loading || isGoogleLoading}
                    onError={handleGoogleError}
                  />

                  <p className="text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-primary hover:underline">Create one</Link>
                  </p>
                </form>
                
                <div className="text-center mt-6">
                  <Button type="button" variant="ghost" onClick={() => navigate('/cart')}>Continue as Guest</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>

      {/* User Profile Modal for new Google users */}
      {showProfileModal && newGoogleUser && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={newGoogleUser}
          onComplete={handleProfileComplete}
        />
      )}
    </>
  );
};

export default Login;
