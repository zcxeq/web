import styled from "styled-components";
import constants from "../constants";

export const StyledBody = styled.div<{
  customWidth?: number;
  hoverRowColumn?: boolean;
}>`
  table {
    table-layout: auto !important;
    font-family: ${constants.tableFontFamily} !important;
    box-sizing: border-box;

    a {
      font-family: ${constants.fontFamilyFuturistic};
      font-size: ${constants.fontSizeSmall};
    }

    ${(props) =>
      props.customWidth
        ? `
      table-layout: fixed !important;
      `
        : ""}

    thead {
      border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;

      & tr {
        background: ${constants.tableHeaderSurfaceColor};
      }
    }

    tr {
      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.045) !important;
      }
    }

    & tbody tr {
      transition: background 0.12s;

      &:hover {
        background: rgba(124, 156, 255, 0.06);
      }
    }

    & th {
      position: relative;
      font-family: Inter, Roboto, sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: rgba(255, 255, 255, 0.5);

      svg {
        position: absolute;
        bottom: 0px;
        left: 0px;
      }

      & svg {
        vertical-align: top;
        margin-left: 2px;

        &:hover {
          cursor: pointer;
        }
      }

      & div[data-id="tooltip"] {
        text-transform: none !important;
        font-weight: var(--fontWeightNormal);
        text-align: left;
      }
    }

    & tbody tr {
      & td {
        border-bottom-width: 0px !important;
        border-top-width: 0px !important;

        & img,
        object {
          opacity: 0.9;
        }
      }
    }

    & th,
    & td {
      overflow: visible !important;

      &:first-child {
        padding-left: 18px !important;
      }

      &:last-child {
        padding-right: 18px !important;
      }
    }
  }
  /* Override material-ui style */

  .innerContainer {
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    background: ${constants.primarySurfaceColor};
  }

  .innerContainer {
    overflow-y: hidden !important;
    overflow-x: auto !important;
    @media only screen and (min-width: 1200px) {
      overflow-x: hidden !important;
    }
  }

  .innerContainer.table-container-overflow-auto {
    overflow-x: auto !important;
  }

  @media only screen and (max-width: 960px) {
  }
  ${(props) =>
    props.hoverRowColumn
      ? `
  & tr {
    :hover {
      background: rgba(190, 190, 140, 0.07) !important;
    }   
  }

  & td.col_highlight, th.col_highlight {
     background: rgba(190, 190, 190, 0.07) !important;
     color: ${constants.textColorPrimary} !important;
  }
  `
      : ""};

  /* -- scrolling behavior -- */
  .scrolled.shrink .textContainer {
    width: 40px !important;
    margin-right: 0px !important;
    height: 32px !important;
  }

  .scrolled .textContainer span {
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
  }

  .scrolled .textContainer {
    & .registered {
      display: none !important;
    }

    & .badge {
      display: none !important;
    }

    & .rank {
      display: none !important;
    }

    & .contributor {
      display: none !important;
    }
  }

  .scrolled .guideContainer {
    & .moremmr-icon {
      display: none;
    }
  }

  .scrolled .imageContainer {
    & img {
      margin-right: 4px;
      height: 18px;
    }

    & .playerSlot {
      display: none;
    }
  }

  .scrolled th:first-child,
  .scrolled td:first-child {
    position: sticky !important;
    left: 0px !important;
  }

  .scrolled th:first-child {
    background-color: rgba(33, 34, 44, 0.8) !important;
    z-index: 100;
    transition: background-color 0.5s ease-out !important;
    width: 60px !important;
  }

  .scrolled tr {
    &:nth-child(odd) {
      & td:first-child {
        background-color: rgba(33, 34, 44, 0.8) !important;
        z-index: 100;
        transition: background-color 0.5s ease-out !important;
        padding-right: 0px !important;
        width: 60px !important;
      }
    }

    &:nth-child(even) {
      & td:first-child {
        background-color: rgba(33, 34, 44, 0.8) !important;
        z-index: 100;
        transition: background-color 0.5s ease-out !important;
        padding-right: 0px !important;
        width: 60px !important;
      }
    }
  }
`;
export const StyledContainer = styled.div`
  min-width: 100%;
  clear: both;
`;
export const StyledHeaderCell = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5) !important;
  font-weight: 700;
`;
