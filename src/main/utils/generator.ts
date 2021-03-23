type GeneratorLength = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const generateID = (length: GeneratorLength = 7) =>
  Math.trunc(Math.abs(Math.random()) * 10 ** (length * 2)).toString(36).slice(0, length);
