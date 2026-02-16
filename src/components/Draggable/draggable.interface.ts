import { ProgressAriaProps } from 'antd/es/progress';
import { RcFile, UploadFileStatus } from 'antd/es/upload/interface';
import { Dispatch, SetStateAction } from 'react';

export interface DraggableUploadListInterface {
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
}

export interface DraggableImageInterface {
  file: UploadFile;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  isFirst: boolean;
  onRemove: (index: number) => void;
}

export interface UploadFile<T = unknown> extends ProgressAriaProps {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>['crossOrigin'];
  originFileObj?: RcFile;
  response?: T;
  error?: unknown;
  linkProps?: unknown;
  type?: string;
  xhr?: T;
  preview?: string;
  isVideo?: boolean;
}
