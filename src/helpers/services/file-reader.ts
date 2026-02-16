import { ERROR_MESSAGE } from '../constants/error-message';

export const readFileAsArrayBuffer = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => resolve(e.target?.result);
    reader.onerror = () => reject(new Error(ERROR_MESSAGE.FAILED_TO_READ_FILE));
    reader.readAsArrayBuffer(file);
  });
};

export const loadPdfDocument = async (file: ArrayBuffer) => {
  const loadingTask = window.pdfjsLib.getDocument({
    data: file,
  });

  return loadingTask.promise;
};
