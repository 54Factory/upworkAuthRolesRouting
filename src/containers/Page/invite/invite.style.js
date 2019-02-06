import styled from 'styled-components';
import { palette } from "styled-theme";
import WithDirection from "../../../settings/withDirection";
import bgImage from "../../../image/sign.jpg";

const InvitePageStyleWrapper = styled.div`
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

  .invite-page-content-wrapper {
    width: 500px;
    height: 100%;
    overflow-y: auto;
    z-index: 10;
    position: relative;
  }

  .invite-page-content {
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

    .invite-page-title-wrapper {
      width: 100%;
      display: flex;
      margin-bottom: 50px;
      justify-content: center;
      flex-shrink: 0;

      h1 {
        font-size: 24px;
        font-weight: 300;
        line-height: 1;
        text-transform: uppercase;
        color: ${palette("secondary", 2)};
      }
    }
  }

  .invite-page-loading-wrapper {
    text-align: center;
    margin-top: 50px;

    .invite-page-loading-text {
      font-size: 20px;
      font-weight: 300;
      color: black;
      margin-bottom: 20px;

      background: linear-gradient(
        to right,
        #DDD 20%,
        ${palette("primary", 1)} 40%,
        ${palette("primary", 2)} 60%,
        #DDD 80%
      );

      background-size: 200% auto;
      background-clip: text;
      text-fill-color: transparent;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine 3s linear infinite;
      @keyframes shine {
        to {
          background-position: 200% center;
        }
      }
    }

    .invite-page-loading-spinner {

    }
  }

  .invite-page-error-wrapper {
    display: table;
    width: auto;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;

    .invite-page-error-icon {
      color: ${palette("secondary", 3)};
      font-size: 50px;
    }

    .invite-page-error-header {
      margin: 0;
      text-align: justify;
      font-size: 24px;
    }

    p {
      font-size: 1rem;
      text-align: justify;
    }

    .invite-page-error-return {
      margin: 20px auto;
    }
  }

  .invite-page-success-wrapper {
    .invite-page-success-email {
      text-align: center;
      font-size: 16px;
      padding: 5px;
      margin-bottom: 20px;
      > h3 {
        font-weight: 500;
      }
    }

    .invite-page-success-form {
      margin-top: 10px;

      .invite-page-success-form-header {
        font-size: 18px;
      }

    }


    .invite-page-success-buttons {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .invite-page-success-button {

      }
    }
  }

`;

export default WithDirection(InvitePageStyleWrapper);
