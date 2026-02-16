'use client';
import { Dropdown } from 'antd';

import { DropdownInterface } from './drop-down.interface';

export default function DropdownComponent({
  menuItems,
  triggerAction = ['click'],
  dropdownPlacement,
  label,
  handleClick,
  className,
  disabled,
}: Readonly<DropdownInterface>) {
  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: (params) => {
          handleClick(params);
        },
      }}
      trigger={triggerAction}
      placement={dropdownPlacement}
      className={className}
      disabled={disabled}
    >
      {label}
    </Dropdown>
  );
}
