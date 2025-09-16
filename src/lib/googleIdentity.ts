// Google Identity Services configuration and utilities

// Environment-specific configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "470308597957-demo-client-id.apps.googleusercontent.com";

// Check if we're in development mode
const isDevMode = import.meta.env.VITE_FIREBASE_API_KEY === undefined || 
                  import.meta.env.VITE_FIREBASE_API_KEY === "placeholder-api-key" ||
                  import.meta.env.VITE_FIREBASE_API_KEY === "demo" ||
                  import.meta.env.VITE_FIREBASE_PROJECT_ID === "demo";

interface GoogleUser {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email_verified: boolean;
  sub: string; // Google user ID
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: any) => void;
      prompt: (callback?: (notification: any) => void) => void;
      renderButton: (element: HTMLElement, config: any) => void;
      disableAutoSelect: () => void;
      cancel: () => void;
    };
  };
}

declare global {
  interface Window {
    google: GoogleIdentityServices;
  }
}

// Decode JWT token to extract user information
export const decodeGoogleJWT = (token: string): GoogleUser | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as GoogleUser;
  } catch (error) {
    console.error('Error decoding Google JWT:', error);
    return null;
  }
};

// Initialize Google Identity Services
export const initializeGoogleIdentityServices = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isDevMode) {
      console.log('🔧 Development mode: Google Identity Services will be mocked');
      resolve();
      return;
    }

    console.log('🚀 Initializing Google Identity Services...');
    
    const checkGoogleLoaded = (attempts = 0) => {
      const maxAttempts = 50; // 5 seconds max wait time
      
      if (window.google?.accounts?.id) {
        try {
          console.log('✅ Google Identity Services loaded successfully');
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: () => {}, // This will be overridden by individual components
            auto_select: false,
            cancel_on_tap_outside: true,
            ux_mode: 'popup'
          });
          resolve();
        } catch (error) {
          console.error('❌ Error initializing Google Identity Services:', error);
          reject(error);
        }
      } else if (attempts < maxAttempts) {
        console.log(`⏳ Waiting for Google Identity Services... (${attempts + 1}/${maxAttempts})`);
        setTimeout(() => checkGoogleLoaded(attempts + 1), 100);
      } else {
        const error = new Error('Google Identity Services failed to load. Please check your internet connection and try again.');
        console.error('❌ Google Identity Services timeout:', error);
        reject(error);
      }
    };

    checkGoogleLoaded();
  });
};

// Create a Google Sign-In popup
export const signInWithGooglePopup = (): Promise<GoogleUser> => {
  return new Promise((resolve, reject) => {
    if (isDevMode) {
      // Mock Google sign-in for development
      setTimeout(() => {
        const mockUser: GoogleUser = {
          email: 'demo@google.com',
          name: 'Demo User',
          given_name: 'Demo',
          family_name: 'User',
          picture: 'https://lh3.googleusercontent.com/a/default-user',
          email_verified: true,
          sub: 'mock-google-user-id-' + Date.now()
        };
        resolve(mockUser);
      }, 1000); // Simulate network delay
      return;
    }

    if (!window.google?.accounts?.id) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }

    try {
      // Configure the callback for this specific sign-in attempt
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: GoogleCredentialResponse) => {
          const userInfo = decodeGoogleJWT(response.credential);
          if (userInfo) {
            resolve(userInfo);
          } else {
            reject(new Error('Failed to decode Google user information'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup'
      });

      // Trigger the sign-in popup
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: try to show the One Tap dialog
          console.log('Google One Tap not displayed, user might need to sign in manually');
          reject(new Error('Google sign-in was cancelled or not available'));
        }
      });
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      reject(error);
    }
  });
};

// Alternative method using a more reliable popup trigger with account selection
export const triggerGoogleSignInPopup = (): Promise<GoogleUser> => {
  return new Promise((resolve, reject) => {
    if (isDevMode) {
      // Mock Google sign-in for development with realistic delay and account selection simulation
      console.log('🚀 Development Mode: Simulating Google account selection popup...');
      console.log('📱 In a real environment, this would open Google\'s account picker');
      setTimeout(() => {
        console.log('✅ Mock Google authentication successful');
        const mockUser: GoogleUser = {
          email: 'demo@google.com',
          name: 'Demo User',
          given_name: 'Demo',
          family_name: 'User',
          picture: 'https://lh3.googleusercontent.com/a/default-user',
          email_verified: true,
          sub: 'mock-google-user-id-' + Date.now()
        };
        resolve(mockUser);
      }, 1500); // Realistic delay for account selection
      return;
    }

    console.log('🎯 Attempting to trigger Google sign-in popup...');

    // First, ensure Google Identity Services is loaded
    if (!window.google?.accounts?.id) {
      console.error('❌ Google Identity Services not available');
      reject(new Error('Google Identity Services not loaded. Please refresh the page and try again.'));
      return;
    }

    try {
      // Re-initialize to ensure proper configuration
      console.log('🔧 Configuring Google Identity Services...');
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: GoogleCredentialResponse) => {
          console.log('✅ Google authentication callback received');
          const userInfo = decodeGoogleJWT(response.credential);
          if (userInfo) {
            console.log('📋 User information extracted:', {
              email: userInfo.email,
              name: userInfo.name,
              verified: userInfo.email_verified
            });
            resolve(userInfo);
          } else {
            console.error('❌ Failed to decode user information');
            reject(new Error('Failed to decode Google user information'));
          }
        },
        auto_select: false, // Force account selection
        cancel_on_tap_outside: true,
        ux_mode: 'popup',
        context: 'signup', // Provide context for better UX
        state_cookie_domain: window.location.hostname
      });

      // Method 1: Try using the One Tap prompt
      console.log('🎪 Attempting One Tap prompt...');
      window.google.accounts.id.prompt((notification) => {
        console.log('One Tap notification:', notification);
        
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('📝 One Tap not available, trying alternative method...');
          
          // Method 2: Create a temporary button and click it
          setTimeout(() => {
            console.log('🔘 Creating temporary Google button...');
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'fixed';
            tempContainer.style.top = '-1000px';
            tempContainer.style.left = '-1000px';
            tempContainer.style.visibility = 'hidden';
            tempContainer.style.pointerEvents = 'none';
            tempContainer.style.zIndex = '-1';
            document.body.appendChild(tempContainer);

            try {
              // Render the Google button
              window.google.accounts.id.renderButton(tempContainer, {
                theme: 'outline',
                size: 'large',
                type: 'standard',
                shape: 'rectangular',
                text: 'signup_with',
                logo_alignment: 'left',
                width: 250
              });

              // Try to click the rendered button
              setTimeout(() => {
                const googleButton = tempContainer.querySelector('[role="button"]') as HTMLElement;
                if (googleButton) {
                  console.log('🖱️ Clicking temporary Google button...');
                  googleButton.click();
                } else {
                  console.error('❌ Could not find Google button to click');
                  document.body.removeChild(tempContainer);
                  reject(new Error('Google sign-in popup could not be triggered. Please enable popups and try again.'));
                }
              }, 200);

              // Cleanup after 30 seconds
              setTimeout(() => {
                if (document.body.contains(tempContainer)) {
                  document.body.removeChild(tempContainer);
                }
              }, 30000);

            } catch (buttonError) {
              console.error('❌ Error creating Google button:', buttonError);
              document.body.removeChild(tempContainer);
              reject(new Error('Failed to create Google sign-in button. Please try again.'));
            }
          }, 500);
        }
      });

    } catch (error) {
      console.error('❌ Error during Google sign-in setup:', error);
      reject(error);
    }
  });
};

// Initialize when the module is loaded
if (typeof window !== 'undefined') {
  initializeGoogleIdentityServices().catch(console.error);
}

export { GOOGLE_CLIENT_ID, isDevMode };
export type { GoogleUser };