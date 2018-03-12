import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';
import 'jest-styled-components';

/*
  The following is here for back compat with mocha chai based tests from the original karma/mocha test suite
*/

// Make sure chai and jasmine ".not" play nice together
const originalNot = Object.getOwnPropertyDescriptor(chai.Assertion.prototype, 'not').get;
Object.defineProperty(chai.Assertion.prototype, 'not', {
  get() {
    Object.assign(this, this.assignedNot);
    return originalNot.apply(this);
  },
  set(newNot) {
    this.assignedNot = newNot;
    return newNot;
  },
});

// Combine both jest and chai matchers on expect
const originalExpect = global.expect;

global.expect = (actual) => {
  const originalMatchers = originalExpect(actual);
  const chaiMatchers = chai.expect(actual);
  const combinedMatchers = Object.assign(chaiMatchers, originalMatchers);
  return combinedMatchers;
};

global.context = describe;
global.before = beforeAll;
global.after = afterEach;

global.mount = mount;
global.shallow = shallow;
chai.use(sinonChai);
global.sinon = sinon;
global.expect = expect;

/**
 * This set of beforeEach/afterEach functions serve to prevent code from
 * being accidentally run outside of a test's context.
 *
 * Basically we catch all intervals and timeouts set during a test, and
 * then clear them when the test is done running.
 */
const setTimeouts = [];
const setIntervals = [];
const originalSetTimeout = setTimeout;
const originalSetInterval = setInterval;

beforeEach(() => {
  global.setTimeout = function wrappedSetTimeout(...args) {
    const id = originalSetTimeout.apply(this, args);
    setTimeouts.push(id);
    return id;
  };

  global.setInterval = function wrappedSetInterval(...args) {
    const id = originalSetInterval.apply(this, args);
    setIntervals.push(id);
    return id;
  };
});

afterEach(() => {
  while (setTimeouts.length) { clearTimeout(setTimeouts.pop()); } // clear timeouts
  while (setIntervals.length) { clearInterval(setIntervals.pop()); } // clear intervals
  global.setTimeout = originalSetTimeout;
  global.setInterval = originalSetInterval;
});
