export interface AboutDataItem {
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  image?: string;
  features?: {
    icon: string;
    description: string;
  }[];
  cards?: {
    icon: string;
    title: string;
    points: string[];
  }[];
}

export interface AboutData {
  aboutUs?: {
    label: string;
    heading?: string;
    description?: string;
  };
  investSection?: {
    label: string;
    heading?: string;
    description?: string;
    sections: AboutDataItem[];
  };
  platformFeatures?: {
    label: string;
    heading?: string;
    description?: string;
    sections: AboutDataItem[];
  };
}
