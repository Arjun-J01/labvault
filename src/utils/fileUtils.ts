export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const downloadFile = (base64Data: string, fileName: string): void => {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getFileType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension || '';
};

export const isValidFileType = (file: File): boolean => {
  const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  return validTypes.includes(file.type);
};