import styled from 'styled-components';
import { palette } from 'styled-theme';

const LayoutContentStyle = styled.div`
  width: 100%;
  background-color: #ffffff;
  border: 1px solid ${palette('border', 0)};
  height: 100%;
  padding: 35px;
`;

export default LayoutContentStyle;
