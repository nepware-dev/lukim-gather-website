export const b64toBlob = async (_dataURI: string) => {
  const res: Response = await fetch(_dataURI);
  const blob = await res.blob();
  return blob;
};
