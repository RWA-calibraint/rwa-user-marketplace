export interface SearchBoxProps {
  placeHolder: string;
  autoFocus?: boolean;
  className?: string;
  value?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onKeyDown?: (event: string) => void;
}
