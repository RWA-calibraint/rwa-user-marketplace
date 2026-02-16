import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { CSSProperties, FC } from 'react';
import './Tabs.css';

interface TabsPanelProps {
  tabs: TabsProps['items'];
  style?: CSSProperties;
  tabBarGutter?: number;
  onChange?: (key: string) => void;
  className?: string;
}

const TabsPanel: FC<TabsPanelProps> = ({ tabs, style, tabBarGutter, onChange, className }) => {
  return (
    <div style={style}>
      <Tabs
        onChange={onChange}
        defaultActiveKey="1"
        items={tabs}
        tabBarGutter={tabBarGutter}
        tabBarStyle={{
          fontSize: '0.9375rem',
          lineHeight: '1.125rem',
          color: '#3F3F46',
          fontWeight: '500',
        }}
        className={className}
      />
    </div>
  );
};

export default TabsPanel;
