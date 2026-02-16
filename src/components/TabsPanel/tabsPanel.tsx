// TabsPanel.tsx
'use client';

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { CSSProperties, FC } from 'react';

import './Tabs.css';
import { COLLECTION_TABS } from '@/helpers/constants/constants';

interface TabsPanelProps {
  tabs: TabsProps['items'];
  style?: CSSProperties;
  activeKey: string | COLLECTION_TABS;
  className?: string;
  onTabChange: (key: string) => void;
}

const TabsPanel: FC<TabsPanelProps> = ({ tabs, style, activeKey, onTabChange, className }) => {
  return (
    <div style={style}>
      <Tabs
        activeKey={activeKey}
        onChange={onTabChange}
        items={tabs}
        // tabBarStyle={{
        //   fontSize: '0.9375rem',
        //   lineHeight: '1.125rem',
        //   color: '#3F3F46',
        //   fontWeight: '500',
        // }}
        className={className}
      />
    </div>
  );
};

export default TabsPanel;
