import styled from 'styled-components';

const LogsStyleWrapper = styled.div`
  width: 100%;

  .logs-top-bar {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .logs-top-bar-text {
      font-family: 'Roboto';
      font-weight: 400;
      line-height: 32px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
`;

export default LogsStyleWrapper;
