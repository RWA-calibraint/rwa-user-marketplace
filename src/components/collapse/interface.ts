import { Dispatch, SetStateAction } from 'react';

import { DOCUMENT_TYPE } from '@helpers/constants/document-types';

import { AssetData, Document } from '../asset-details/interface';

export interface Docs {
  key: DOCUMENT_TYPE;
  label: string;
}
export interface CollapseProps {
  assetData: AssetData;
  selectedDocument: Document | null;
  setSelectedDocument: Dispatch<SetStateAction<Document | null>>;
  accordionSections: Docs[];
  handlePreview?: (doc: Document) => void;
}
