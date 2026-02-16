import { UploadFile } from 'antd';

export interface documentType {
  assetId: string;
  status: string;
  documentName: string;
  documentUrl: string;
  type: string;
}

export interface UploadDocInterface extends UploadFile {
  uploadedS3Url?: string;
  isError?: boolean;
}

export interface UpdatedDocsList {
  name: string;
  url: string;
}

export interface Optioninterface {
  label?: string;
  value?: string;
  key: string;
}

export interface priceHistoryInterface {
  assetId?: string;
  year: string;
  price: string;
}
