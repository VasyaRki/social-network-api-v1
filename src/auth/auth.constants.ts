export const AUTH_CONSTANTS = Object.freeze({
  SIGN_UP: {
    CACHE: {
      TTL: 2 * 60000,
      PREFIX: 'sign-up',
    },
    EMAIL_CONFIRMATION: {
      MAX_REQUESTS: 3,
      TTL: 24 * 60 * 60000,
      PREFIX: 'email-confirmation',
    },
  },
  PASSWORD_RESET: {
    CACHE: {
      TTL: 5 * 60000,
      PREFIX: 'password-reset',
    },
    PASSWORD_RESET_REQUEST: {
      MAX_REQUESTS: 3,
      TTL: 24 * 60 * 60000,
      PREFIX: 'password-reset-request',
    },
  },
});
