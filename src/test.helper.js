import 'babel-polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

chai.use(sinonChai);
global.sinon = sinon;
global.expect = expect;

const context = require.context('./', true, /test\.(js|jsx)$/);
context.keys().forEach(context);
