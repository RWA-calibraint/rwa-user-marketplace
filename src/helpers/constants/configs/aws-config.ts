export const awsConfig = {
  region: 'ap-south-1',
  userPoolId: 'ap-south-1_qhumQpH8l',
  userPoolWebClientId: '4v9j8ekbac8vi78gv9vs73fpv5',
  oauth: {
    domain: 'https://ap-south-1qhumqph8l.auth.ap-south-1.amazoncognito.com',
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: 'http://localhost:3000/api/auth/callback/cognito',
    redirectSignOut: 'http://localhost:3000/',
    responseType: 'code',
  },
};
