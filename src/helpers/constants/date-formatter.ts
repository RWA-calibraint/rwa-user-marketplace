export const dateFormatter = (dateString: string): string => {
  if (dateString === null || dateString === '') return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const isoDateFormatter = (date: string): string => new Date(date).toISOString().split('T')[0];

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-Us', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export const toLocalISOString = (localDate: Date | null) => {
  if (localDate) {
    const date = new Date(localDate);
    const isoString =
      date.getFullYear().toString().padStart(4, '0') +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0') +
      'T' +
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0') +
      ':' +
      date.getSeconds().toString().padStart(2, '0') +
      '.' +
      date.getMilliseconds().toString().padStart(3, '0') +
      'Z';

    return isoString;
  }
};
