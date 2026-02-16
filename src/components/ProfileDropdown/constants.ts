export const PROFILE_CONTEXT = [
  {
    TITLE: 'ACCOUNT',
    CHILDREN: [
      {
        LUCIDE_ICON: 'user',
        NAME: 'Profile',
        PATH: '/profile?target=account',
      },
      {
        LUCIDE_ICON: 'badge-percent',
        NAME: 'Submit New Asset',
        PATH: '/sell',
      },
      {
        LUCIDE_ICON: 'images',
        NAME: 'My Collections',
        PATH: '/collections',
      },
    ],
  },
  {
    TITLE: 'EXPLORE',
    CHILDREN: [
      {
        LUCIDE_ICON: 'shopping-bag',
        NAME: 'Orders',
        PATH: '/orders',
      },
      {
        LUCIDE_ICON: 'package',
        NAME: 'My Listings',
        PATH: '/submission',
      },
    ],
  },
  {
    TITLE: 'STRIPE',
    CHILDREN: [
      {
        LUCIDE_ICON: 'credit-card',
        NAME: 'My Stripe Account',
        PATH: '/login-to-stripe',
      },
    ],
  },
];
