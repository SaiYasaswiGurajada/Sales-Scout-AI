import { GOOGLE_CLIENT_ID, GOOGLE_SCOPES } from '../config';

declare global {
  interface Window {
    google?: any;
  }
}

export interface GoogleAuthResponse {
  accessToken: string;
  userProfile: {
    email: string;
    name: string;
    picture?: string;
  };
}

/**
 * Initializes and launches Google Identity Services Token Client popup.
 */
export async function requestGoogleToken(): Promise<GoogleAuthResponse> {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      // Fallback: If GIS script failed or is blocked in iframe sandbox, return simulated Google auth profile
      console.warn('Google Identity Services script not ready. Falling back to demo mode profile.');
      return resolve(getDemoGoogleProfile());
    }

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID") {
      console.info('GOOGLE_CLIENT_ID is not configured. Returning simulated Google account.');
      return resolve(getDemoGoogleProfile());
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_SCOPES,
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }

          const accessToken = tokenResponse.access_token;
          
          // Fetch user profile info from Google OAuth2 API
          try {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userInfo = await userInfoRes.json();

            resolve({
              accessToken,
              userProfile: {
                email: userInfo.email || 'user@company.com',
                name: userInfo.name || 'Sales Representative',
                picture: userInfo.picture,
              },
            });
          } catch (err) {
            // Fallback if userinfo fails
            resolve({
              accessToken,
              userProfile: {
                email: 'user@company.com',
                name: 'Sales Representative',
              },
            });
          }
        },
        error_callback: (err: any) => {
          reject(new Error(err.message || 'Google Auth error'));
        },
      });

      client.requestAccessToken();
    } catch (err: any) {
      console.error('Error initializing Google OAuth Token Client:', err);
      reject(err);
    }
  });
}

export function getDemoGoogleProfile(): GoogleAuthResponse {
  return {
    accessToken: 'demo_access_token_' + Date.now(),
    userProfile: {
      email: 'alex.rivera@salesscout.ai',
      name: 'Alex Rivera',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  };
}
