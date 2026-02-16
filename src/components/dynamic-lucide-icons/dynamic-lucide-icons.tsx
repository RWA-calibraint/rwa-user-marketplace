'use client';

import { BadgePercent, Images, LogOut, MapPin, Package, ShoppingBag, Tag, User, CreditCard } from 'lucide-react';
import { memo } from 'react';

import { DynamicIconProps } from './dynamic-lucide-icons.interface';

const DynamicIcon = memo(({ name, ...props }: DynamicIconProps) => {
  switch (name) {
    case 'user':
      return <User {...props} />;
    case 'map-pin':
      return <MapPin {...props} />;
    case 'log-out':
      return <LogOut {...props} />;
    case 'shopping-bag':
      return <ShoppingBag {...props} />;
    case 'package':
      return <Package {...props} />;
    case 'tag':
      return <Tag {...props} />;
    case 'badge-percent':
      return <BadgePercent {...props} />;
    case 'images':
      return <Images {...props} />;
    case 'credit-card':
      return <CreditCard {...props} />;
    default:
      return null;
  }
});

DynamicIcon.displayName = 'DynamicIcon';

export default DynamicIcon;
