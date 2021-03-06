import * as colors from 'constants/colors'
import {mobileMedia} from 'constants/media'
import styled from 'styled-components'

export default styled.div`
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  float: left;
  font-size: 20px;
  height: 300px;
  width: 100%;
  background: white;
  position: relative;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  }

  > p {
    clear: both;
    float: left;
    margin: 0 20px;
    &.price {
      font-size: 24px;
      font-weight: 300;
      margin-top: 18px;
    }
    &.street {
      color: ${colors.mediumDarkGray};
      font-size: 14px;
      margin-bottom: 4px;
      margin-top: 2px;
    }
    &.neighborhood {
      color: ${colors.mediumDarkGray};
      font-size: 14px;
      text-transform: uppercase;
    }
  }
  > .image-container {
    border-radius: 8px 8px 0 0;
    background-position: center;
    background-size: cover;
    height: 180px;
    width: 100%;
  }

  @media ${mobileMedia} {
    margin-bottom: 30px;
    width: 100%;
  }
`
