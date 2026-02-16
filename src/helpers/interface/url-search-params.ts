export interface SearchParamsType {
  page?: string | number;
  size?: string | number;
  status?: string;
  search?: string;
  [key: string]: string | number | undefined;
}
