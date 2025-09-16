import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { UserProfileModal } from '@/components/UserProfileModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, signup, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newGoogleUser, setNewGoogleUser] = useState<User | null>(null);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        await login(data.email, data.password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        await signup(data.email, data.password);
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      }

      form.reset();
      onClose();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      const { isNewUser, user } = await signInWithGoogle();
      
      if (isNewUser) {
        // Show profile completion modal for new users
        setNewGoogleUser(user);
        setShowProfileModal(true);
        onClose(); // Close auth modal
      } else {
        // Existing user - show welcome back message and complete flow
        toast({
          title: "Welcome back!",
          description: `Successfully signed in as ${user.displayName || user.email}.`,
        });
        onClose();
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Google Sign-in failed",
        description: error.message || "Unable to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
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
    onSuccess();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-primary text-center">
              Authentication Required
            </DialogTitle>
          </DialogHeader>

          <div className="text-center text-sm text-muted-foreground mb-4">
            Please log in or create an account to submit product requests.
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

          <TabsContent value="login" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            </Form>

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
              disabled={isLoading || isGoogleLoading}
            />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password (min 6 characters)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </Form>

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
              variant="signup"
              disabled={isLoading || isGoogleLoading}
            />
          </TabsContent>
        </Tabs>

        <Button
          variant="outline"
          onClick={onClose}
          className="w-full mt-4"
          disabled={isLoading || isGoogleLoading}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>

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
