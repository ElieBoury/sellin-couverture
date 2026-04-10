import styled from "styled-components";

export const HeaderWrapper = styled.header`
  position: fixed;
  z-index: 1000;
  width: 100vw;
  display: flex;
  justify-content: center;
  > div {
    position: relative;
    width: 90%;
    margin: 20px;
    border-radius: 30px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    padding: 0 24px;
    box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
    a {
      color: black;
    }

    .name {
      position: absolute;
      left: 20px;
    }

    > div {
      width: 100%;
      justify-content: center;
      .ant-anchor-wrapper-horizontal::before {
        display: none;
      }
      .ant-anchor-link {
        font-size: 1.1rem;
        padding: 10px !important;
        width: 160px;
        text-align: center;
        border: none !important;
        &:not(:last-child) {
          border-right: 1px solid gainsboro !important;
        }
        &:not(:first-child) {
          border-left: 1px solid gainsboro;
        }
      }
    }
  }

  @media (max-width: 1300px) {
    .name {
      left: 10px;
      font-size: 1.5rem;
    }
    > div {
      > div {
        justify-content: flex-end;
      }
    }
  }
`;

export const DrawerWrapper = styled.div`
  .ant-anchor-link {
    font-size: 1.2rem;
    padding: 20px;
    height: 60px;
  }
`;
