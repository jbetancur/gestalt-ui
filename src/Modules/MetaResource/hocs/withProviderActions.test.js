import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import withProviderActions from './withProviderActions';

describe('withProviderActions Hoc', () => {
  const Hoc = withProviderActions(<MemoryRouter><div /></MemoryRouter>)({ filter: 'test' });

  it('renders component without exploding', () => {
    // const wrapper = shallow(<Hoc match={{}} />);
    // console.log(wrapper.props().render().dive());
    // expect(wrapper.dive().dive()).toHaveLength(1);
    // expect(wrapper.props().render()).toMatchSnapshot();
  });
});
