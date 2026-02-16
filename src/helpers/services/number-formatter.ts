export const formatNumber = (num: number) =>
  num >= 1e6 ? (num / 1e6).toFixed(1) + 'M' : num >= 1e3 ? (num / 1e3).toFixed(1) + 'K' : num.toString();
