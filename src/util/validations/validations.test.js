import {
  isFQON,
  isPhoneNumber,
  isUsername,
  isLambdaName,
  isContainerName,
  isCommaDelimited,
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
    it('should validate if not a user', () => {
      expect(isUsername('This is Not a User')).to.equal(false);
    });

    it('should validate if is a user', () => {
      expect(isUsername('iamauser')).to.equal(true);
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
    it('should validate if not a container name', () => {
      expect(isContainerName('This Container')).to.equal(false);
    });

    it('should validate if is a container name', () => {
      expect(isContainerName('this-container')).to.equal(true);
    });

    it('should return the original value if arg is not a string', () => {
      expect(isContainerName({})).to.deep.equal({});
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
});
