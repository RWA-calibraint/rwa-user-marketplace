import { Eye, Pencil, Trash2 } from 'lucide-react';

import { STATUS_TYPE, SUBMISSION_TYPE } from '../constants/asset-status';

export const getMenuItems = (status: STATUS_TYPE) => {
  const menuItems = [];

  if (
    status === STATUS_TYPE.REJECTED ||
    status === STATUS_TYPE.APPROVED ||
    status === STATUS_TYPE.SOLD ||
    status === STATUS_TYPE.DE_LIST ||
    status === STATUS_TYPE.HOLD
  ) {
    menuItems.push({
      label: 'View',
      key: SUBMISSION_TYPE.VIEW,
      icon: <Eye size={16} className="icon-16-primary" />,
    });
  } else {
    menuItems.push(
      {
        label: 'Edit',
        key: SUBMISSION_TYPE.EDIT,
        icon: <Pencil size={16} className="icon-16-primary" />,
      },
      {
        label: 'Delete',
        key: SUBMISSION_TYPE.DELETE,
        icon: <Trash2 size={16} className="icon-16-primary" />,
      },
    );
  }

  return menuItems;
};
