import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Form validation schema
const productRequestSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  productLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  recipientName: z.string().min(1, 'Recipient name is required'),
  shippingAddress: z.string().min(10, 'Please provide a complete shipping address'),
  country: z.string().min(1, 'Country is required'),
});

type ProductRequestFormData = z.infer<typeof productRequestSchema>;

interface ProductRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// List of countries for the dropdown
const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'India',
  'Brazil',
  'Mexico',
  'Italy',
  'Spain',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Switzerland',
  'Belgium',
  'Austria',
  'Ireland',
  'New Zealand',
  'South Korea',
  'Singapore',
  'Hong Kong',
  'UAE',
  'South Africa',
  'Other'
];

export const ProductRequestModal: React.FC<ProductRequestModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if we're in development mode
  const isDevMode = import.meta.env.VITE_FIREBASE_API_KEY === undefined || 
                    import.meta.env.VITE_FIREBASE_API_KEY === "placeholder-api-key";

  const form = useForm<ProductRequestFormData>({
    resolver: zodResolver(productRequestSchema),
    defaultValues: {
      productName: '',
      description: '',
      productLink: '',
      recipientName: '',
      shippingAddress: '',
      country: '',
    },
  });

  const onSubmit = async (data: ProductRequestFormData) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a product request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isDevMode) {
        // Mock submission for development mode
        console.log('Mock product request submission:', {
          ...data,
          userId: currentUser.uid,
          userEmail: currentUser.email,
          requestTimestamp: new Date().toISOString(),
          status: 'pending',
        });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Submit to Firestore
        await addDoc(collection(db, 'product_requests'), {
          ...data,
          userId: currentUser.uid,
          userEmail: currentUser.email,
          requestTimestamp: serverTimestamp(),
          status: 'pending', // For tracking request status
        });
      }

      toast({
        title: "Request submitted!",
        description: isDevMode 
          ? "Demo mode: Request logged to console. In production, we will email you a quote shortly."
          : "We will email you a quote shortly.",
      });

      // Reset form and close modal
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting product request:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary">
            Product Request Form
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter the product name you're looking for"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide detailed information about the product including brand, size, color, quantity, and any other specifications..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link to Product (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/product"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient's Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the full name for shipping"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complete Shipping Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the complete shipping address including street, city, state/province, postal code..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

