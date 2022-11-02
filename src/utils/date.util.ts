const padTo2Digits = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const today = (): string => {
  const date = new Date();

  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
};
