import dynamicIconImports from 'lucide-react/dynamicIconImports';
import dynamic from 'next/dynamic';

import { IconName, ReactComponent } from '@components/dynamic-lucide-icons/dynamic-lucide-icons.interface';

export const ICONS = Object.keys(dynamicIconImports) as IconName[];

const ICONS_COMPONENT = {} as Record<IconName, ReactComponent>;

for (const name of ICONS) {
  const newIcon = dynamic(dynamicIconImports[name], {
    ssr: false,
  }) as ReactComponent;

  ICONS_COMPONENT[name] = newIcon;
}

export { ICONS_COMPONENT };
