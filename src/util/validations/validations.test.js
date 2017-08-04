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
});
