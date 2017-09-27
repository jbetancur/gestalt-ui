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
      expect(isFQON('This Test')).to.equal(false);
    });

    it('should validate if is an fqon', () => {
      expect(isFQON('this-test')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isFQON({})).to.deep.equal({});
    });
  });

  describe('isPhoneNumber', () => {
    it('should validate if not a phone number', () => {
      expect(isPhoneNumber('This Test')).to.equal(false);
    });

    it('should validate if is a phone number', () => {
      expect(isPhoneNumber('+12334567890')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isPhoneNumber({})).to.deep.equal({});
    });
  });

  describe('isUsername', () => {
    it('should not validate if not a user', () => {
      expect(isUsername('This is Not a User')).to.equal(false);
    });

    it('should not validate of special chars before ', () => {
      expect(isUsername('.iamauser')).to.equal(false);
    });

    it('should not validate of special chars before after ', () => {
      expect(isUsername('iamauser.')).to.equal(false);
    });

    it('should validate if is a user', () => {
      expect(isUsername('iamauser')).to.equal(true);
    });

    it('should validate if is a user with .', () => {
      expect(isUsername('iamauser.useriam')).to.equal(true);
    });

    it('should validate if is a user with _', () => {
      expect(isUsername('iamauser_useriam')).to.equal(true);
    });

    it('should validate if is a user with -', () => {
      expect(isUsername('iamauser-seriam')).to.equal(true);
    });

    it('should validate if is a user with mixed allowd chars', () => {
      expect(isUsername('iamauser-seriam.hehehe_hohoho')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isUsername({})).to.deep.equal({});
    });
  });

  describe('isLambdaName', () => {
    it('should validate if not a lambda name', () => {
      expect(isLambdaName('Not a Lambda ahahaha')).to.equal(false);
    });

    it('should validate if is lambda name', () => {
      expect(isLambdaName('i-love-lambda')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isLambdaName({})).to.deep.equal({});
    });
  });

  describe('isContainerName', () => {
    it('should not validate if there are spaces in a container name', () => {
      expect(isContainerName('This Container')).to.equal(false);
    });

    it('should not validate if container name ends with -', () => {
      expect(isContainerName('this-container-')).to.equal(false);
    });

    it('should not validate if container name starts with -', () => {
      expect(isContainerName('-this-container')).to.equal(false);
    });

    it('should not validate if lambda name contains --', () => {
      expect(isContainerName('this--container')).to.equal(false);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isContainerName({})).to.deep.equal({});
    });

    it('should validate if is a valid container where it contains a number in the name', () => {
      expect(isContainerName('this4-container')).to.equal(true);
    });

    it('should validate if is a valid container name', () => {
      expect(isContainerName('this-container')).to.equal(true);
    });

    it('should validate if container name is only a number ', () => {
      expect(isContainerName('8080')).to.equal(true);
    });
  });

  describe('isContainerServicePortName', () => {
    it('should not validate if there are spaces in a service port name', () => {
      expect(isContainerServicePortName('This Container')).to.equal(false);
    });

    it('should not validate if service port name ends with -', () => {
      expect(isContainerServicePortName('this-container-')).to.equal(false);
    });

    it('should not validate if service port name starts with -', () => {
      expect(isContainerServicePortName('-this-container')).to.equal(false);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isContainerServicePortName({})).to.deep.equal({});
    });

    it('should validate if lambda name contains --', () => {
      expect(isContainerServicePortName('this--container')).to.equal(true);
    });

    it('should validate if is a valid container where it contains a number in the name', () => {
      expect(isContainerServicePortName('this4-container')).to.equal(true);
    });

    it('should validate if is a valid service port name', () => {
      expect(isContainerServicePortName('this-container')).to.equal(true);
    });

    it('should validate if service port name is only a number ', () => {
      expect(isContainerServicePortName('8080')).to.equal(true);
    });
  });

  describe('isCommaDelimited', () => {
    it('should validate if not comma delimited', () => {
      expect(isCommaDelimited('this | is  [ not ] comma.delimited')).to.equal(false);
    });

    it('should validate if is comma delimited', () => {
      expect(isCommaDelimited('this,test,is,comma,delimited.com')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isCommaDelimited({})).to.deep.equal({});
    });
  });

  describe('isCommaDelimitedConstraints', () => {
    it('should validate if not comma delimited', () => {
      expect(isCommaDelimitedConstraints('this | is  [ not ] comma.delimited')).to.equal(false);
    });

    it('should validate if comma delimited, but not constraint', () => {
      expect(isCommaDelimitedConstraints('this,test,is,comma,delimited.com')).to.equal(false);
    });

    it('should validate if is comma delimited', () => {
      expect(isCommaDelimitedConstraints('hostname:LIKE:test,hostname:UNIQUE')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isCommaDelimitedConstraints({})).to.deep.equal({});
    });
  });

  describe('isKubernetesVolumeName', () => {
    it('should validate if not a volume name (has spaces)', () => {
      expect(isKubernetesVolumeName('Not a volume ahahaha')).to.equal(false);
    });

    it('should validate if not volume name (invalid chars)', () => {
      expect(isKubernetesVolumeName('i_love_volumes')).to.equal(false);
    });

    it('should validate if is volume name with -', () => {
      expect(isKubernetesVolumeName('i-love-volumes')).to.equal(true);
    });

    it('should validate if is volume name with .', () => {
      expect(isKubernetesVolumeName('i.love.volumes')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isKubernetesVolumeName({})).to.deep.equal({});
    });
  });

  describe('isUnixVariable', () => {
    it('should not validate if not a variable name has spaces', () => {
      expect(isUnixVariable('Not a variable ahahaha')).to.equal(false);
    });

    it('should not validate if variable name has invalid chars', () => {
      expect(isUnixVariable('$%^i_love_variables')).to.equal(false);
    });

    it('should not validate if is variable name with .', () => {
      expect(isUnixVariable('i.love.variables')).to.equal(false);
    });

    it('should not validate if is variable name with -', () => {
      expect(isUnixVariable('i-love-variables')).to.equal(false);
    });

    it('should validate if is variable name seperated by _', () => {
      expect(isUnixVariable('i_love_variables')).to.equal(true);
    });

    it('should validate if is variable name', () => {
      expect(isUnixVariable('ilovevariables')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isUnixVariable({})).to.deep.equal({});
    });
  });

  describe('isSecretKeyValidation', () => {
    it('should not validate if not a secret key has spaces', () => {
      expect(isSecretKeyValidation('Not a key ahahaha')).to.equal(false);
    });

    it('should not validate if secret key has invalid chars', () => {
      expect(isSecretKeyValidation('$%^i_love_keys')).to.equal(false);
    });

    it('should validate if is secret key with -', () => {
      expect(isSecretKeyValidation('i-love-keys')).to.equal(true);
    });

    it('should validate if is secret key seperated by _', () => {
      expect(isSecretKeyValidation('i_love_keys')).to.equal(true);
    });

    it('should validate if is secret key with .', () => {
      expect(isSecretKeyValidation('i.love.keys')).to.equal(true);
    });

    it('should validate if is secret key', () => {
      expect(isSecretKeyValidation('ilovekeys')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isSecretKeyValidation({})).to.deep.equal({});
    });
  });

  describe('isSecretNameValidation', () => {
    it('should not validate if not a secret name has spaces', () => {
      expect(isSecretNameValidation('Not a key ahahaha')).to.equal(false);
    });

    it('should not validate if secret name has invalid chars', () => {
      expect(isSecretNameValidation('$%^i_love_names')).to.equal(false);
    });

    it('should not validate if is secret name seperated by _', () => {
      expect(isSecretNameValidation('i_love_names')).to.equal(false);
    });

    it('should not validate if is secret name with .', () => {
      expect(isSecretNameValidation('i.love.names')).to.equal(false);
    });

    it('should validate if is secret name with -', () => {
      expect(isSecretNameValidation('i-love-names')).to.equal(true);
    });

    it('should validate if is secret name', () => {
      expect(isSecretNameValidation('ilovenames')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isSecretNameValidation({})).to.deep.equal({});
    });
  });

  describe('isBase64', () => {
    it('should validate if the string is base64', () => {
      expect(isBase64('ABwwGgQUVS9uKF73AyeP06JhgH17LNOBxB8CAgQAPEWRItlr1xdoJnalqW2vcmujpdB2WfCG3ShwuovCtFO/mhMmhktOwYDl6xBKihC8lBhwLeAtyi61R2b6UwTSkMiRqyIdcRMGc+Eqozm3XanhVpCXATsUawQFfqGdu/rUVFCGRq1J129gwJ1EVVtYab1GvFjib30c8ZInWLI0PBazyZZyda9f5xdys2mqeLtSJDI3960c1xwBQJyRvXIG9ZZgceU0koG/5kF8+I/4fUrkjzSKdcy6iXgTIDyC+i3bictfaT2X3Yhoo63PSlXU4IFrZ8CMtWOmffpahmuwCBGPq0VIuvSVnZzYNw8yN/d8lbMarXp2wjU/Kd2HRP1nZ57l8GXF2H2iKj4rPGLAtNn8XYFPh7jviWD8RSS8eeeWMVPCaHsza10G8jhonLZEsAB+fkQdmb5R')).to.equal(true);
    });


    it('should validate if the string is base64', () => {
      expect(isBase64('UmljayBhbmQgTW9ydHk=')).to.equal(true);
    });

    it('should validate if the string is base64 without "-"', () => {
      expect(isBase64('Umlja2FuZE1vcnR5')).to.equal(true);
    });

    it('should not validate if the string is not base64', () => {
      expect(isBase64('this- no is --base64')).to.equal(false);
    });

    it('should not validate if the string is not base64', () => {
      expect(isBase64('this is certainly not base64')).to.equal(false);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isBase64({})).to.deep.equal({});
    });
  });
});
