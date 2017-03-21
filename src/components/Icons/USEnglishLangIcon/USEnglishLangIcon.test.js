import React from 'react';
import { shallow } from 'enzyme';
import USEnglishLangIcon from './index';

const wrapper = shallow(<USEnglishLangIcon />);

describe('(Component) USEnglishLangIcon', () => {
  it('renders component without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});
