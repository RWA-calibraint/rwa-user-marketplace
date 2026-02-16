export interface PaginationInterface {
  updatePagination: ({ page, size }: { page: number; size: number }) => void;
  totalDataCount: number | undefined;
  className?: string;
  page: string;
  size: string;
}

export interface PageDetails {
  currentPage: number;
  pageSize: number;
}
