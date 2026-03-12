export default {
  backend: {
    'crypto/bcrypt: hashedPassword is not the hash of the given password':
      'Password error',
    'record not found': 'Not registered',
    'sms code is wrong': 'Verification code wrong',
    'redis: nil': 'Verification code expired',
    'ERROR: duplicate key value violates unique constraint "idx_user_phone" (SQLSTATE 23505)':
      'Phone number already registered',
    'unauthenticated': 'Unauthenticated',
    'validate code wrong': 'Verification code wrong',
  },
};
