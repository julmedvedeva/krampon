import { describe, it, expect } from 'vitest';
import { isValidName, isValidPhone, isValidEmail } from '../common/validation';

/**
 * Эти тесты проверяют корректность регулярных выражений,
 * используемых для валидации полей формы заказа в OrderModal.vue.
 */

describe('Validation patterns', () => {
  it('accepts valid names', () => {
    const valid = ['Иван', 'John', 'Анна-Мария', 'Peter3', 'A-Б'];
    valid.forEach(v => expect(isValidName(v)).toBe(true));
  });

  it('rejects invalid names', () => {
    const invalid = ['John#', 'Anna@', 'Peter!', '***', ''];
    invalid.forEach(v => expect(isValidName(v)).toBe(false));
  });

  it('accepts valid phones', () => {
    const valid = ['+71234567890', '+79998887766'];
    valid.forEach(v => expect(isValidPhone(v)).toBe(true));
  });

  it('rejects invalid phones', () => {
    const invalid = [
      '+7123456789',
      '81234567890',
      '+7abcdefghij',
      '+700000000000',
      '+7123456789a',
    ];
    invalid.forEach(v => expect(isValidPhone(v)).toBe(false));
  });

  it('accepts valid emails', () => {
    const valid = ['user@example.com', 'test.user123@mail.ru', 'a@b.cd'];
    valid.forEach(v => expect(isValidEmail(v)).toBe(true));
  });

  it('rejects invalid emails', () => {
    const invalid = [
      'invalid@@example.com',
      'user@',
      'user@domain',
      'plainaddress',
      'user@.com',
    ];
    invalid.forEach(v => expect(isValidEmail(v)).toBe(false));
  });
});
