import { MenuProps } from 'antd';
import { JSX, KeyboardEvent, MouseEvent } from 'react';

export interface DropdownInterface {
  menuItems: MenuProps['items'];
  label: JSX.Element;
  triggerAction?: Array<'click' | 'hover' | 'contextMenu'>;
  dropdownPlacement: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom';
  handleClick: MenuClickEventHandler;
  className?: string;
  disabled?: boolean;
}

export interface MenuInfo {
  key: string;
  keyPath: string[];
  domEvent: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;
}

export type MenuClickEventHandler = (info: MenuInfo) => void;
