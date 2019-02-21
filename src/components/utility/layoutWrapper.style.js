import styled from "styled-components";

const LayoutContentWrapper = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;

  @media only screen and (max-width: 767px) {
    padding: 50px 20px;
  }

  @media only screen and (max-width: 580px) {
    padding: 15px;
  }

  @media only screen and (max-width: 400px) {
    padding: 0;
  }
`;

export { LayoutContentWrapper };
