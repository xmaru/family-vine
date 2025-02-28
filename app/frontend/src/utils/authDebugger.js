/**
 * Utility to help debug authentication issues
 */

export const debugAuthToken = () => {
    const token = localStorage.getItem('token');
    
    console.group('Auth Token Debugger');
    
    if (!token) {
      console.log('No token found in localStorage');
      console.groupEnd();
      return null;
    }
    
    console.log('Token found in localStorage');
    
    try {
      // For JWT tokens, they are base64 encoded with 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Token does not appear to be a valid JWT (should have 3 parts)');
        console.log('Raw token:', token);
      } else {
        // The middle part contains the payload
        const payload = JSON.parse(atob(parts[1]));
        console.log('Token payload:', payload);
        
        // Check expiration
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          const now = new Date();
          console.log('Token expires:', expDate.toLocaleString());
          if (expDate < now) {
            console.warn('TOKEN IS EXPIRED!');
          } else {
            console.log('Token is valid (not expired)');
          }
        } else {
          console.warn('Token does not have an expiration claim');
        }
        
        // Check subject (user ID)
        if (payload.sub) {
          console.log('Token subject (user ID):', payload.sub);
        } else {
          console.warn('Token does not have a subject claim');
        }
      }
    } catch (err) {
      console.error('Error parsing token:', err);
      console.log('Raw token:', token);
    }
    
    console.groupEnd();
    return token;
  };
  
  // Helper to decode base64 safely
  export const decodeJwtPayload = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (e) {
      console.error('Failed to decode JWT payload:', e);
      return null;
    }
  };
  
  // Export a function to check token expiration
  export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = decodeJwtPayload(token);
      if (!payload || !payload.exp) return true;
      
      const expTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expTime;
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return true;
    }
  };