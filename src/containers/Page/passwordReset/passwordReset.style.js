import styled from "styled-components";
import { palette } from "styled-theme";
import bgImage from "../../../image/sign.jpg";

const PasswordResetStyleWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  background: url(${bgImage}) no-repeat center center;
  background-size: cover;

  &:before {
    content: "";
    width: 100%;
    height: 100%;
    display: flex;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    z-index: 1;
    top: 0;
    left: ${props => (props["data-rtl"] === "rtl" ? "inherit" : "0")};
    right: ${props => (props["data-rtl"] === "rtl" ? "0" : "inherit")};
  }

  .passwordResetContentWrapper {
    width: 500px;
    height: 100%;
    overflow-y: auto;
    z-index: 10;
    position: relative;
  }

  .passwordResetContent {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 70px 50px;
    position: relative;
    background-color: #ffffff;

    @media only screen and (max-width: 767px) {
      width: 100%;
      padding: 70px 20px;
    }

    .logoWrapper {
      width: 100%;
      display: flex;
      margin-bottom: 50px;
      justify-content: center;
      flex-shrink: 0;

      a {
        font-size: 24px;
        font-weight: 300;
        line-height: 1;
        text-transform: uppercase;
        color: ${palette("secondary", 2)};
      }
    }

    .passwordResetForm {
      width: 100%;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;

      .inputWrapper {
        margin-bottom: 15px;

        &:last-of-type {
          margin-bottom: 0;
        }

        input {
          &::-webkit-input-placeholder {
            color: ${palette("grayscale", 0)};
          }

          &:-moz-placeholder {
            color: ${palette("grayscale", 0)};
          }

          &::-moz-placeholder {
            color: ${palette("grayscale", 0)};
          }
          &:-ms-input-placeholder {
            color: ${palette("grayscale", 0)};
          }
        }
      }

      .submitButton {
        button {
          height: 42px;
        }
      }

  }

`;

export default PasswordResetStyleWrapper;
