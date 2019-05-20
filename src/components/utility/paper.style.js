import styled from 'styled-components';
import { palette } from 'styled-theme';

const PaperStyle = styled.div`
  background: #fff;
  border: 1px solid ${palette("border", 0)};

  .paper-title {
    width: 100%;
    padding: 0 16px;
    height: 55px;
    border-bottom: 1px solid ${palette("border", 0)};
    > h3 {
      float: left;
      line-height: 55px;
      color: #000;
    }
    display: ${props => props.title ? 'block' : 'none'};

    .paper-title-right {
      display: inline-block;
      float: right;
      height: 55px;
      line-height: 55px;
    }
  }

  .paper-content {
    width: 100%;
    padding: 16px;
    margin: 0;
  }
`;

export default PaperStyle;
