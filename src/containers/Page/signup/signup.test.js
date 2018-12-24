import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

import { SignIn } from './signin';

Enzyme.configure({ adapter: new Adapter() });


describe('<SignIn />', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<SignIn />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  })
})
