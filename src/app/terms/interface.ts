export interface DataSectionItem {
  title?: string;
  heading?: string;
  content?: string;
  contentMiddle?: string;
  contentEnd?: string;
  listItems?: string[];
  listItems2?: string[];
  nested?: DataSectionItem[];
}

export interface Data {
  label: string;
  heading?: string;
  sections: DataSectionItem[];
}

export interface ToSData {
  buyer?: Data;
  seller?: Data;
}
