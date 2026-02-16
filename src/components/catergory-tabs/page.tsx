'use client';

import { Tabs } from 'antd';
import { Sparkles, Paintbrush, Building2, Stamp, Car, Watch, Gem, Sofa, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const categories = [
  { label: 'For you', icon: <Sparkles /> },
  { label: 'Art', icon: <Paintbrush /> },
  { label: 'Real Estate', icon: <Building2 /> },
  { label: 'Coins & Stamps', icon: <Stamp /> },
  { label: 'Cars', icon: <Car /> },
  { label: 'Luxury', icon: <Watch /> },
  { label: 'Jewellery', icon: <Gem /> },
  { label: 'Furniture', icon: <Sofa /> },
  { label: 'More', icon: <ChevronDown /> },
];

const CategoryTabs = () => {
  const [activeKey, setActiveKey] = useState('For you');

  const items = categories.map(({ label, icon }) => ({
    key: label,
    label: (
      <div className="d-flex align-center justify-center gap-2 p-y-10 p-x-16">
        {label === 'More' ? (
          <>
            <span>{label}</span>
            {icon}
          </>
        ) : (
          <>
            {icon}
            <span>{label}</span>
          </>
        )}
      </div>
    ),
    children: null,
  }));

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      items={items}
      tabBarGutter={32}
      className="d-flex align-center justify-center p-t-10 p-r-80 p-l-80 border-tertiary-1"
    />
  );
};

export default CategoryTabs;
