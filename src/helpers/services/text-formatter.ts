export const capitalizeFirstLetter = (data: string) => `${data.charAt(0).toUpperCase()}${data.slice(1)}`;

export const truncateString = (fullString: string, stringLength: number, separator = '****') => {
  if (!fullString || fullString.length <= stringLength) {
    return fullString || '';
  }

  const charsToShow = stringLength - separator.length;
  const startChars = Math.ceil(charsToShow / 2);
  const endChars = charsToShow - startChars;

  return `${fullString.slice(0, startChars)}${separator}${fullString.slice(-endChars)}`;
};
