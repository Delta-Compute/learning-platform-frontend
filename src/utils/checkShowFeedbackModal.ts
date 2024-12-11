export const checkAndShowModal = (count: number): boolean => {
  return count > 0 && (count === 1 || count % 3 === 0);
};