import { validateField, validateForm, VALIDATION_RULES, VALIDATION_PATTERNS } from '../FormValidation';

describe('FormValidation', () => {
  describe('validateField', () => {
    it('validates required fields', () => {
      const result = validateField('', { required: true });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Bu alan zorunludur');
    });

    it('validates minLength', () => {
      const result = validateField('abc', { minLength: 5 });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('En az 5 karakter olmalıdır');
    });

    it('validates maxLength', () => {
      const result = validateField('abcdefghij', { maxLength: 5 });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('En fazla 5 karakter olmalıdır');
    });

    it('validates pattern', () => {
      const result = validateField('invalid-email', { pattern: VALIDATION_PATTERNS.email });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Geçersiz format');
    });

    it('validates custom validation', () => {
      const customValidation = (value: string) => value === 'valid';
      const result = validateField('invalid', { custom: customValidation });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Geçersiz değer');
    });

    it('returns valid for valid input', () => {
      const result = validateField('valid@email.com', { 
        required: true, 
        pattern: VALIDATION_PATTERNS.email 
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateForm', () => {
    it('validates multiple fields', () => {
      const data = {
        email: 'test@example.com',
        password: 'weak'
      };
      
      const schema = {
        email: VALIDATION_RULES.email,
        password: VALIDATION_RULES.password
      };

      const results = validateForm(data, schema);
      
      expect(results.email.isValid).toBe(true);
      expect(results.password.isValid).toBe(false);
    });

    it('returns empty results for empty schema', () => {
      const data = { email: 'test@example.com' };
      const schema = {};
      
      const results = validateForm(data, schema);
      expect(Object.keys(results)).toHaveLength(0);
    });
  });

  describe('VALIDATION_PATTERNS', () => {
    it('validates email pattern', () => {
      expect(VALIDATION_PATTERNS.email.test('test@example.com')).toBe(true);
      expect(VALIDATION_PATTERNS.email.test('invalid-email')).toBe(false);
    });

    it('validates phone pattern', () => {
      expect(VALIDATION_PATTERNS.phone.test('+905551234567')).toBe(true);
      expect(VALIDATION_PATTERNS.phone.test('05551234567')).toBe(true);
      expect(VALIDATION_PATTERNS.phone.test('invalid')).toBe(false);
    });

    it('validates password pattern', () => {
      expect(VALIDATION_PATTERNS.password.test('Password123')).toBe(true);
      expect(VALIDATION_PATTERNS.password.test('weak')).toBe(false);
      expect(VALIDATION_PATTERNS.password.test('nouppercase123')).toBe(false);
    });

    it('validates numeric pattern', () => {
      expect(VALIDATION_PATTERNS.numeric.test('123')).toBe(true);
      expect(VALIDATION_PATTERNS.numeric.test('12.34')).toBe(false);
      expect(VALIDATION_PATTERNS.numeric.test('abc')).toBe(false);
    });

    it('validates decimal pattern', () => {
      expect(VALIDATION_PATTERNS.decimal.test('123')).toBe(true);
      expect(VALIDATION_PATTERNS.decimal.test('12.34')).toBe(true);
      expect(VALIDATION_PATTERNS.decimal.test('12.345')).toBe(false);
      expect(VALIDATION_PATTERNS.decimal.test('abc')).toBe(false);
    });
  });

  describe('VALIDATION_RULES', () => {
    it('has required rule', () => {
      expect(VALIDATION_RULES.required.required).toBe(true);
    });

    it('has email rule with pattern', () => {
      expect(VALIDATION_RULES.email.required).toBe(true);
      expect(VALIDATION_RULES.email.pattern).toBe(VALIDATION_PATTERNS.email);
    });

    it('has password rule with pattern', () => {
      expect(VALIDATION_RULES.password.required).toBe(true);
      expect(VALIDATION_RULES.password.pattern).toBe(VALIDATION_PATTERNS.password);
    });
  });
});
