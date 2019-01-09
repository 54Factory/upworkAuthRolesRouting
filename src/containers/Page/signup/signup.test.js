import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

import { SignUp } from './signup';

Enzyme.configure({ adapter: new Adapter() });


describe('<SignUp />', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<SignUp />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  })
})
