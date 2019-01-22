import React from 'react';
import { render } from 'react-testing-library';
import USEnglishLangIcon from './USEnglishLangIcon';


describe('(Component) USEnglishLangIcon', () => {
  it('renders component without exploding', () => {
    const { container } = render(<USEnglishLangIcon />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
