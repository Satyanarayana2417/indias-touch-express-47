import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { UserProfileModal } from '@/components/UserProfileModal';
import { GoogleUser } from '@/lib/googleIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { mapAuthError } from '@/lib/authErrors';

const Signup: React.FC = () => {
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newGoogleUser, setNewGoogleUser] = useState<User | null>(null);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<GoogleUser | null>(null);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(email, password);
      toast({ title: 'Account created', description: 'Welcome! Redirecting...' });
      navigate('/');
    } catch (err: any) {
      const code = err?.code || 'auth/unknown';
      setError(mapAuthError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (googleUser: GoogleUser) => {
    setIsGoogleLoading(true);
    setError('');
    setGoogleUserData(googleUser);

    try {
      // Attempt Google sign-in to check if user exists
      const { isNewUser, user } = await signInWithGoogle();
      
      if (!isNewUser) {
        // Existing user - direct login (shouldn't typically happen on signup page)
        toast({
          title: "Welcome back!",
          description: `You already have an account. Signing you in as ${user.displayName || user.email}.`,
        });
        navigate('/');
      } else {
        // New user - show profile completion modal
        setNewGoogleUser(user);
        setShowProfileModal(true);
        
        // Also auto-fill the form in case user wants to skip profile completion
        setEmail(googleUser.email);
        setIsGoogleSignup(true);
      }
    } catch (err: any) {
      // If Google sign-in fails, auto-fill the form for manual completion
      setEmail(googleUser.email);
      setIsGoogleSignup(true);
      
      toast({
        title: "Google Account Information Retrieved",
        description: `Email auto-filled from Google. Please set a password to complete signup.`,
      });
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
      <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-0">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                <p className="text-center text-gray-600">Sign up to start shopping</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}
                  
                  {isGoogleSignup && googleUserData && (
                    <div className="p-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                          {googleUserData.email_verified ? '✓' : '?'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-blue-800">Google Account Connected</div>
                          <div className="text-blue-600 mt-1">
                            <div><strong>Name:</strong> {googleUserData.name}</div>
                            <div><strong>Email:</strong> {googleUserData.email} {googleUserData.email_verified && <span className="text-green-600">(Verified ✓)</span>}</div>
                          </div>
                          <div className="text-xs text-blue-500 mt-2">
                            Your information has been auto-filled from your Google account
                          </div>
                        </div>
                        {googleUserData.picture && (
                          <img 
                            src={googleUserData.picture} 
                            alt={googleUserData.name}
                            className="w-10 h-10 rounded-full border-2 border-blue-200"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="you@example.com" 
                      required 
                      disabled={isGoogleSignup}
                      className={isGoogleSignup ? "bg-gray-50" : ""}
                    />
                    {isGoogleSignup && (
                      <p className="text-xs text-gray-500">This email is linked to your Google account</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat your password" required minLength={6} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading || isGoogleLoading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
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

                  {/* Google Sign-up Button */}
                  <GoogleSignInButton
                    onClick={handleGoogleSignUp}
                    isLoading={isGoogleLoading}
                    variant="signup"
                    disabled={loading || isGoogleLoading}
                    onError={handleGoogleError}
                  />

                  <p className="text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                  </p>
                </form>
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

export default Signup;