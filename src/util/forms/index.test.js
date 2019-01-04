import {
  composeValidators,
  unixPattern,
  required,
  validator,
  hasSpaces,
  min,
  max,
  mod,
  maxLen,
  // parsers
  lowercase,
  formatName,
  fixInputNumber,
  fixInputDecimal,
} from './index';

describe('Form Validators Helpers', () => {
  describe('composeValidators', () => {
    it('should call a composed validator function', () => {
      const mockValidator = jest.fn();
      composeValidators(mockValidator());

      expect(mockValidator).toBeCalled();
    });

    it('should call multiple a composed validator function', () => {
      const mockValidator1 = jest.fn();
      const mockValidator2 = jest.fn();
      const mockValidator3 = jest.fn();
      composeValidators(mockValidator1(), mockValidator3(), mockValidator2());

      expect(mockValidator1).toBeCalled();
      expect(mockValidator2).toBeCalled();
      expect(mockValidator3).toBeCalled();
    });

    it('should handle if any of the arguments are not a function', () => {
      expect(composeValidators(true, false, 'cheeseburger')).toThrow('composeValidators: validator must be a function');
    });
  });

  describe('unixPattern', () => {
    it('should return false if the value is a unix pattern', () => {
      expect(unixPattern()('UNIX_NESS')).toBe(false);
    });

    it('should return a message string if the value is NOT a unix pattern', () => {
      expect(unixPattern()('UNIX!! _@ dmNESS')).toBe('invalid unix variable');
    });

    it('should return a CUSTOM message string if the value is NOT a unix pattern', () => {
      expect(unixPattern('i am a custom message')('UNIX!! _@ dmNESS')).toBe('i am a custom message');
    });
  });

  describe('validator', () => {
    const saysHello = value => value === 'hello';

    it('should return false if the value is provided', () => {
      const didYouSayHello = validator(saysHello, 'must say hello')('hello');

      expect(didYouSayHello).toBe(false);
    });

    it('should return a default message if value from the function is not met', () => {
      const didYouSayHello = validator(saysHello)('jerk');

      expect(didYouSayHello).toBe('invalid pattern');
    });

    it('should return a custom message if value from the function is not mets', () => {
      const didYouSayHello = validator(saysHello, 'must say hello')('jerk');

      expect(didYouSayHello).toBe('must say hello');
    });
  });

  describe('required', () => {
    it('should return undefined if the value is provided', () => {
      expect(required()('hey i am here')).toBeUndefined();
    });

    it('should return a default message if the value is not provided', () => {
      expect(required()()).toBe('required');
    });

    it('should return a custom message if the value is not provided', () => {
      expect(required('whatevs...')()).toBe('whatevs...');
    });

    it('should return a message if the allowZeros option is set and no value is provided', () => {
      expect(required(undefined, true)()).toBe('required');
    });

    it('should return undefined if the allowZeros option is set and a value is provided', () => {
      expect(required(undefined, true)(5)).toBeUndefined();
    });

    it('should return undefined if the allowZeros option is set and a value of 0 is provided', () => {
      expect(required(undefined, true)(0)).toBeUndefined();
    });

    it('should return undefined if the allowZeros option is set and a number is passed as a string', () => {
      expect(required(undefined, true)('123')).toBeUndefined();
    });
  });

  describe('hasSpaces', () => {
    it('should return undefined if there are no spaces in the value', () => {
      expect(hasSpaces()('no.spaces.here')).toBeUndefined();
    });

    it('should return a default message if there are spaces in the value', () => {
      expect(hasSpaces()('hey there are spaces here')).toBe('spaces not allowed');
    });

    it('should return a custom message if there are spaces in the value', () => {
      expect(hasSpaces('no spaces!!!')('hey there are spaces here')).toBe('no spaces!!!');
    });
  });

  describe('min', () => {
    it('should return undefined if the value is greater than', () => {
      expect(min(1)(3)).toBeUndefined();
    });

    it('should return a default message if the value is not greater than', () => {
      expect(min(4)(2)).toBe('must be greater than 4');
    });

    it('should return a custom message if the value is not greater than', () => {
      expect(min(4, 'dude')(2)).toBe('dude');
    });
  });

  describe('max', () => {
    it('should return undefined if the value is less than', () => {
      expect(max(4)(2)).toBeUndefined();
    });

    it('should return a default message if the value is not less than', () => {
      expect(max(2)(4)).toBe('must be less than 2');
    });

    it('should return a custom message if the value is not less than', () => {
      expect(max(2, 'dude')(4)).toBe('dude');
    });
  });

  describe('mod', () => {
    it('should return undefined if the value is divisible', () => {
      expect(mod(2)(4)).toBeUndefined();
    });

    it('should return a default message if the value is not divisible', () => {
      expect(mod(2)(5)).toBe('must be divisible by 2');
    });

    it('should return a custom message if the value is not divisible', () => {
      expect(mod(2, 'dude')(5)).toBe('dude');
    });
  });

  describe('maxLen', () => {
    it('should return undefined if the value is less than maxLen', () => {
      expect(maxLen(60)('bow wow wow yippe yo yippe yay')).toBeUndefined();
    });

    it('should return a undefined if the value is exactly at maxLen', () => {
      expect(maxLen(10)('1234567890')).toBeUndefined();
    });

    it('should return a default message if the value is greater than maxLen', () => {
      expect(maxLen(10)('bow wow wow yippe yo yippe yay')).toBe('must be less than 10 characters');
    });

    it('should return a custom message if the value is greater than maxLen', () => {
      expect(maxLen(10, 'really???')('bow wow wow yippe yo yippe yay')).toBe('really???');
    });
  });
});

describe('Form parsers', () => {
  describe('lowercase', () => {
    it('should convert a string to lowercase', () => {
      expect(lowercase('HEYHEYHEY')).toBe('heyheyhey');
    });
  });

  describe('formatName', () => {
    it('should propertly format string', () => {
      expect(formatName('!HeyThere!$$#@-whatup ')).toBe('heythere-whatup');
    });
  });

  describe('fixInputNumber', () => {
    it('parse a string "number" to a number', () => {
      expect(fixInputNumber('42')).toBe(42);
    });
  });

  describe('fixInputDecimal', () => {
    it('parse a string "decimal" to a decimal', () => {
      expect(fixInputDecimal('4.2')).toBe(4.2);
    });
  });
});
