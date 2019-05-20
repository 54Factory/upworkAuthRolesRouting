import { Button } from 'antd';
import { Buttons, ButtonsGroup } from './styles/button.style';

const AntButton = Buttons(Button);
const isoButton = AntButton;
const AntButtonGroup = ButtonsGroup(Button.Group);
const ButtonGroup = AntButtonGroup;

export default isoButton;
export { ButtonGroup };
