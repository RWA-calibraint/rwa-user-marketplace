import { Bell, CircleDollarSign, Heart, Images, ListTodo, User } from 'lucide-react';

export const mobileSections = [
  {
    name: 'ACCOUNT',
    children: [
      { label: 'Profile', icon: <User size={20} />, href: '/profile' },
      { label: 'Rewards', icon: <CircleDollarSign size={20} />, href: '/rewards' },
    ],
  },
  {
    name: 'QUICK ACTIONS',
    children: [
      { label: 'Notifications', icon: <Bell size={20} />, href: '' },
      { label: 'Favourites', icon: <Heart size={20} />, href: '/favourites' },
    ],
  },
  {
    name: 'EXPLORE',
    children: [
      { label: 'My Colections', icon: <Images size={20} />, href: '/collections' },
      { label: 'My Listings', icon: <ListTodo size={20} />, href: '/submission' },
    ],
  },
];
