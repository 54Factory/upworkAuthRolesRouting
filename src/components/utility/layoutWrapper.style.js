import styled from "styled-components";

const LayoutContentWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;

  @media only screen and (max-width: 720px) {
    padding: 16px;
  }
`;

export { LayoutContentWrapper };
