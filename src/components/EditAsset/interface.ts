import { FormInstance, UploadFile } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { Descendant } from 'slate';

export interface AssetHistoryType {
  key: number;
  listedDate: string | null;
  price: number;
  hasAddedRow: boolean;
}

export interface EditAssetHistoryProps {
  form?: FormInstance<unknown>;
  rows: AssetHistoryType[];
  setRows: Dispatch<SetStateAction<AssetHistoryType[]>>;
}

export interface CategoryOptions {
  label: string;
  value: string;
  key: string;
}
export interface EditAssetDetailsProps {
  form?: FormInstance<unknown>;
  categoryOptions: CategoryOptions[];
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  setCategory?: Dispatch<SetStateAction<string>>;
  description: Descendant[];
  setDescription: Dispatch<SetStateAction<Descendant[]>>;
  setHasFormUpdated: Dispatch<SetStateAction<boolean>>;
  hasFormUpdated: boolean;
}
export interface UploadDocInterface extends UploadFile {
  uploadedS3Url?: string;
  isError?: boolean;
  statusExternal?: string;
}
