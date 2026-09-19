export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPasswordLength = (value: string): boolean =>
  value.length >= 8;

export const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const isValidDays = (value: number): boolean =>
  Number.isInteger(value) && value >= 1 && value <= 60;

export const MIN_DAYS = 1;
export const MAX_DAYS = 60;
