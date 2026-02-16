export type DateRange = [Date | null, Date | null] | null;

export interface DateRangeProps {
  onChange?: (value: DateRange) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  className?: string;
  value?: DateRange | null;
}
