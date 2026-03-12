export default {
  backend: {
    'crypto/bcrypt: hashedPassword is not the hash of the given password':
      '密码错误',
    'record not found': '尚未注册',
    'sms code is wrong': '验证码错误',
    'redis: nil': '验证码已过期',
    'ERROR: duplicate key value violates unique constraint "idx_user_phone" (SQLSTATE 23505)':
      '手机号已注册',
    'unauthenticated': '未登录',
    'validate code wrong': '验证码错误',
  },
};
