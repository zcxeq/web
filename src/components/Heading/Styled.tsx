import styled from "styled-components";
import constants from "../constants";

export const StyledDiv = styled.div`
  display: flex;
  align-items: center;

  /* Заголовок страницы: крупный, без полосы на всю ширину */
  &.top-heading {
    padding: 28px 0 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;

    .title {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    .subtitle {
      margin-left: 0;
      margin-top: 4px;
      font-size: 13px;
      text-transform: none !important;
    }
  }

  .winner {
    position: relative;
    bottom: 1px;
    color: ${constants.colorGreenDark};
    background: ${constants.colorGreen};
    border: 0px solid ${constants.colorGreen};
    font-size: 10px;
    font-weight: 600;
    padding: 1px;
    padding-right: 4px;
    margin-left: 10px;
    margin-right: 5px;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.6;
  }

  .winner:after {
    right: 100%;
    top: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-right-color: ${constants.colorGreen};
    border-width: 8px;
    margin-top: -8px;
  }

  & svg {
    height: 20px !important;
    width: 20px !important;
    opacity: 0.8;
    fill: ${constants.textColorPrimary};
  }

  & a {
    color: ${constants.primaryTextColor};
    text-decoration: none;

    &:hover {
      color: ${constants.primaryLinkColor};
    }
  }

  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Inter, Roboto, sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.005em;
    line-height: 1.6;

    &::before {
      margin-right: 8px;
      font-size: 1rem;
    }
  }

  .subtitle {
    margin-left: 8px;
    font-family: Inter, Roboto, sans-serif;
    font-size: ${constants.fontSizeSmall};
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: normal;
    font-weight: normal;
    overflow-wrap: normal;
    padding-right: 10px;
  }

  .sponsor-button {
    margin: 0px 5px;

    /* Material-ui buttons */
    @media only screen and (max-width: 620px) {
      & a {
        min-width: 24px !important;

        & span {
          font-size: 0 !important;
          padding-left: 0 !important;
          padding-right: 12px !important;
        }
      }
    }
  }

  & .info {
    margin-left: 5px;
    font-size: ${constants.fontSizeMedium};
    color: ${constants.colorMuted};
    border-bottom: 1px dotted ${constants.colorMuted};
  }
`;

export const TwoLineDiv = styled(StyledDiv)`
  padding: 10px 0 15px;

  & span:last-child {
    display: block;
  }
`;
