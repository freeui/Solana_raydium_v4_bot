export const getRandomRunTime = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomNumber = (min: number, max: number) => {
  const result = Math.random() * (max - min + 0.0001) + min;
  return result.toFixed(6);
};
