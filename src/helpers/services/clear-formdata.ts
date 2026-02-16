export const clearFormData = (formData: FormData) => {
  for (const [key] of formData) {
    formData.delete(key);
  }
};
