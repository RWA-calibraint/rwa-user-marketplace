import { Menu as AntdMenu, MenuProps } from 'antd';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { FC } from 'react';

interface MenuProp {
  items: ItemType<MenuItemType>[];
  onClick: MenuProps['onClick'];
  defaultSelectedKeys: string;
  mode?: 'vertical' | 'horizontal' | 'inline';
}

const Menu: FC<MenuProp> = ({ items, onClick, defaultSelectedKeys, mode = 'inline' }) => {
  return (
    <AntdMenu
      className="ant-menu"
      items={items}
      mode={mode}
      onClick={onClick}
      defaultSelectedKeys={[defaultSelectedKeys]}
    />
  );
};

export default Menu;
