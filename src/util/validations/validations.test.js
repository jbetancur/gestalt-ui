import {
  isFQON,
  isPhoneNumber,
  isUsername,
  isLambdaName,
  isContainerName,
  isContainerServicePortName,
  isCommaDelimited,
  isCommaDelimitedConstraints,
  isKubernetesVolumeName,
  isUnixVariable,
  isSecretKeyValidation,
  isSecretNameValidation,
  isBase64,
} from './index';

// TODO: pass arrays of validations for more thurough tests
describe('Validations', () => {
  describe('isFQON', () => {
    it('should validate if not an fqon', () => {
      expect(isFQON('This Test')).toBe(false);
    });

    it('should validate if is an fqon', () => {
      expect(isFQON('this-test')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isFQON({})).toEqual({});
    });
  });

  describe('isPhoneNumber', () => {
    it('should validate if not a phone number', () => {
      expect(isPhoneNumber('This Test')).toBe(false);
    });

    it('should validate if is a phone number', () => {
      expect(isPhoneNumber('+12334567890')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isPhoneNumber({})).toEqual({});
    });
  });

  describe('isUsername', () => {
    it('should not validate if not a user', () => {
      expect(isUsername('This is Not a User')).toBe(false);
    });

    it('should not validate of special chars before ', () => {
      expect(isUsername('.iamauser')).toBe(false);
    });

    it('should not validate of special chars before after ', () => {
      expect(isUsername('iamauser.')).toBe(false);
    });

    it('should validate if is a user', () => {
      expect(isUsername('iamauser')).toBe(true);
    });

    it('should validate if is a user with .', () => {
      expect(isUsername('iamauser.useriam')).toBe(true);
    });

    it('should validate if is a user with _', () => {
      expect(isUsername('iamauser_useriam')).toBe(true);
    });

    it('should validate if is a user with -', () => {
      expect(isUsername('iamauser-seriam')).toBe(true);
    });

    it('should validate if is a user with mixed allowd chars', () => {
      expect(isUsername('iamauser-seriam.hehehe_hohoho')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isUsername({})).toEqual({});
    });
  });

  describe('isLambdaName', () => {
    it('should validate if not a lambda name', () => {
      expect(isLambdaName('Not a Lambda ahahaha')).toBe(false);
    });

    it('should validate if is lambda name', () => {
      expect(isLambdaName('i-love-lambda')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isLambdaName({})).toEqual({});
    });
  });

  describe('isContainerName', () => {
    it('should not validate if there are spaces in a container name', () => {
      expect(isContainerName('This Container')).toBe(false);
    });

    it('should not validate if container name ends with -', () => {
      expect(isContainerName('this-container-')).toBe(false);
    });

    it('should not validate if container name starts with -', () => {
      expect(isContainerName('-this-container')).toBe(false);
    });

    it('should not validate if lambda name contains --', () => {
      expect(isContainerName('this--container')).toBe(false);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isContainerName({})).toEqual({});
    });

    it('should validate if is a valid container where it contains a number in the name', () => {
      expect(isContainerName('this4-container')).toBe(true);
    });

    it('should validate if is a valid container name', () => {
      expect(isContainerName('this-container')).toBe(true);
    });

    it('should validate if container name is only a number ', () => {
      expect(isContainerName('8080')).toBe(true);
    });
  });

  describe('isContainerServicePortName', () => {
    it('should not validate if there are spaces in a service port name', () => {
      expect(isContainerServicePortName('This Container')).toBe(false);
    });

    it('should not validate if service port name ends with -', () => {
      expect(isContainerServicePortName('this-container-')).toBe(false);
    });

    it('should not validate if service port name starts with -', () => {
      expect(isContainerServicePortName('-this-container')).toBe(false);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isContainerServicePortName({})).toEqual({});
    });

    it('should validate if lambda name contains --', () => {
      expect(isContainerServicePortName('this--container')).toBe(true);
    });

    it('should validate if is a valid container where it contains a number in the name', () => {
      expect(isContainerServicePortName('this4-container')).toBe(true);
    });

    it('should validate if is a valid service port name', () => {
      expect(isContainerServicePortName('this-container')).toBe(true);
    });

    it('should validate if service port name is only a number ', () => {
      expect(isContainerServicePortName('8080')).toBe(true);
    });
  });

  describe('isCommaDelimited', () => {
    it('should validate if not comma delimited', () => {
      expect(isCommaDelimited('this | is  [ not ] comma.delimited')).toBe(false);
    });

    it('should validate if is comma delimited', () => {
      expect(isCommaDelimited('this,test,is,comma,delimited.com')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isCommaDelimited({})).toEqual({});
    });
  });

  describe('isCommaDelimitedConstraints', () => {
    it('should validate if not comma delimited', () => {
      expect(isCommaDelimitedConstraints('this | is  [ not ] comma.delimited')).toBe(false);
    });

    it('should validate if comma delimited, but not constraint', () => {
      expect(isCommaDelimitedConstraints('this,test,is,comma,delimited.com')).toBe(false);
    });

    it('should validate if is comma delimited', () => {
      expect(isCommaDelimitedConstraints('hostname:LIKE:test,hostname:UNIQUE')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isCommaDelimitedConstraints({})).toEqual({});
    });
  });

  describe('isKubernetesVolumeName', () => {
    it('should validate if not a volume name (has spaces)', () => {
      expect(isKubernetesVolumeName('Not a volume ahahaha')).toBe(false);
    });

    it('should validate if not volume name (invalid chars)', () => {
      expect(isKubernetesVolumeName('i_love_volumes')).toBe(false);
    });

    it('should validate if is volume name with -', () => {
      expect(isKubernetesVolumeName('i-love-volumes')).toBe(true);
    });

    it('should validate if is volume name with .', () => {
      expect(isKubernetesVolumeName('i.love.volumes')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isKubernetesVolumeName({})).toEqual({});
    });
  });

  describe('isUnixVariable', () => {
    it('should not validate if not a variable name has spaces', () => {
      expect(isUnixVariable('Not a variable ahahaha')).toBe(false);
    });

    it('should not validate if variable name has invalid chars', () => {
      expect(isUnixVariable('$%^i_love_variables')).toBe(false);
    });

    it('should not validate if is variable name with .', () => {
      expect(isUnixVariable('i.love.variables')).toBe(false);
    });

    it('should not validate if is variable name with -', () => {
      expect(isUnixVariable('i-love-variables')).toBe(false);
    });

    it('should validate if is variable name seperated by _', () => {
      expect(isUnixVariable('i_love_variables')).toBe(true);
    });

    it('should validate if is variable name', () => {
      expect(isUnixVariable('ilovevariables')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isUnixVariable({})).toEqual({});
    });
  });

  describe('isSecretKeyValidation', () => {
    it('should not validate if not a secret key has spaces', () => {
      expect(isSecretKeyValidation('Not a key ahahaha')).toBe(false);
    });

    it('should not validate if secret key has invalid chars', () => {
      expect(isSecretKeyValidation('$%^i_love_keys')).toBe(false);
    });

    it('should validate if is secret key with -', () => {
      expect(isSecretKeyValidation('i-love-keys')).toBe(true);
    });

    it('should validate if is secret key seperated by _', () => {
      expect(isSecretKeyValidation('i_love_keys')).toBe(true);
    });

    it('should validate if is secret key with .', () => {
      expect(isSecretKeyValidation('i.love.keys')).toBe(true);
    });

    it('should validate if is secret key', () => {
      expect(isSecretKeyValidation('ilovekeys')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isSecretKeyValidation({})).toEqual({});
    });
  });

  describe('isSecretNameValidation', () => {
    it('should not validate if not a secret name has spaces', () => {
      expect(isSecretNameValidation('Not a key ahahaha')).toBe(false);
    });

    it('should not validate if secret name has invalid chars', () => {
      expect(isSecretNameValidation('$%^i_love_names')).toBe(false);
    });

    it('should not validate if is secret name seperated by _', () => {
      expect(isSecretNameValidation('i_love_names')).toBe(false);
    });

    it('should not validate if is secret name with .', () => {
      expect(isSecretNameValidation('i.love.names')).toBe(false);
    });

    it('should validate if is secret name with -', () => {
      expect(isSecretNameValidation('i-love-names')).toBe(true);
    });

    it('should validate if is secret name', () => {
      expect(isSecretNameValidation('ilovenames')).toBe(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isSecretNameValidation({})).toEqual({});
    });
  });

  describe('isBase64', () => {
    it('should validate if the string is base64', () => {
      expect(isBase64('ABwwGgQUVS9uKF73AyeP06JhgH17LNOBxB8CAgQAPEWRItlr1xdoJnalqW2vcmujpdB2WfCG3ShwuovCtFO/mhMmhktOwYDl6xBKihC8lBhwLeAtyi61R2b6UwTSkMiRqyIdcRMGc+Eqozm3XanhVpCXATsUawQFfqGdu/rUVFCGRq1J129gwJ1EVVtYab1GvFjib30c8ZInWLI0PBazyZZyda9f5xdys2mqeLtSJDI3960c1xwBQJyRvXIG9ZZgceU0koG/5kF8+I/4fUrkjzSKdcy6iXgTIDyC+i3bictfaT2X3Yhoo63PSlXU4IFrZ8CMtWOmffpahmuwCBGPq0VIuvSVnZzYNw8yN/d8lbMarXp2wjU/Kd2HRP1nZ57l8GXF2H2iKj4rPGLAtNn8XYFPh7jviWD8RSS8eeeWMVPCaHsza10G8jhonLZEsAB+fkQdmb5R')).toBe(true);
    });


    it('should validate if the string is base64', () => {
      expect(isBase64('UmljayBhbmQgTW9ydHk=')).toBe(true);
    });

    it('should validate if the string is base64 without "-"', () => {
      expect(isBase64('Umlja2FuZE1vcnR5')).toBe(true);
    });

    it('should not validate if the string is not base64', () => {
      expect(isBase64('this- no is --base64')).toBe(false);
    });

    it('should not validate if the string is not base64', () => {
      expect(isBase64('this is certainly not base64')).toBe(false);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isBase64({})).toEqual({});
    });
  });
});
