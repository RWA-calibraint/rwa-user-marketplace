import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { FC } from 'react';

export type ReactComponent = FC<{ className?: string }>;

export type IconName = keyof typeof dynamicIconImports;

export type DynamicIconProps = {
  name: IconName;
  className?: string;
};
