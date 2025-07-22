export const NAME_REGEX = /^[A-Za-zА-Яа-яЁё0-9-]+$/;
export const PHONE_REGEX = /^\+7\d{10}$/;
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Utility helpers for test cases (optional)
export const isValidName = (value: string) => NAME_REGEX.test(value);
export const isValidPhone = (value: string) => PHONE_REGEX.test(value);
export const isValidEmail = (value: string) => EMAIL_REGEX.test(value);
