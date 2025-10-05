import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
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
import { updateUserDocument } from '@/lib/users';

const userProfileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number').optional(),
});

type UserProfileData = z.infer<typeof userProfileSchema>;

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onComplete: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onComplete
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserProfileData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      displayName: user.displayName || '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: UserProfileData) => {
    setIsLoading(true);

    try {
      // Update user profile with additional information
      await updateUserDocument(user.uid, {
        displayName: data.displayName,
        profile: {
          phone: data.phoneNumber,
        },
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Profile completed!",
        description: "Your profile has been set up successfully.",
      });

      onComplete();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Unable to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Profile setup skipped",
      description: "You can update your profile information later in your account settings.",
    });
    onComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary text-center">
            Complete Your Profile
          </DialogTitle>
        </DialogHeader>

        <div className="text-center text-sm text-muted-foreground mb-4">
          Welcome {user.displayName || user.email}! Please complete your profile to get started.
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Complete Profile'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="w-full"
                disabled={isLoading}
              >
                Skip for now
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
