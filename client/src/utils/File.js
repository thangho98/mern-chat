export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = error => reject(error);
    reader.onloadend = () => {
      resolve(reader.result);
    }
    reader.readAsDataURL(file)
  });
}