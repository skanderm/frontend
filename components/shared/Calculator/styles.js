import styled from 'styled-components'
import {mobileMedia} from 'constants/media'
import * as colors from 'constants/colors'

export default styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const SliderContainer = styled.div`
  width: 792px;
  margin: 50px 20px;
`

export const Description = styled.p`
  color: ${colors.mediumDarkGray};
  font-size: 14px;
  line-height: 28px;
  text-align: center;
  padding: 0 20px;
  margin: 0;
`

export const InfoContainer = styled.div`
  padding: 15px 60px;
  height: 122px;
  border-radius: 10px;
  margin: 20px 20px 40px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

export const Info = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px;
  p {
    font-size: 14px;
    letter-spacing: 0.2px;
    line-height: 19px;
    text-align: center;
    color: ${({secondary}) =>
      secondary ? colors.mediumDarkGray : colors.text};
    margin: 0;
  }

  span {
    color: ${colors.blue.medium};
    font-size: 40px;
    font-weight: ${({secondary}) => (secondary ? 300 : 600)};
    letter-spacing: -0.4px;
    line-height: 55px;
    text-align: center;

    :before {
      content: 'R$';
      font-size: 18px;
      letter-spacing: 0.54px;
      line-height: 24px;
      text-align: center;
      font-weight: normal;
      margin-right: 5px;
    }
  }
`

export const Table = styled.div`
  box-sizing: border-box;
  display: flex;
  margin: 40px 0;
  padding: 0 40px;
  border: 1px solid ${colors.lightestGray};
  border-radius: 10px;
  box-shadow: inset 0 2px 2px 0 #ffffff, 0 4px 10px 0 rgba(38, 38, 38, 0.15);
  position: relative;
  min-width: 1050px;
  justify-content: space-between;
`
export const Column = styled.div`
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${({secondary}) => (secondary ? colors.blue.medium : colors.text)};
  h4 {
    font-size: 18px;
    font-weight: bold;
    line-height: 24px;
  }
  p {
    margin: 0;
    padding: 20px 0;
    border-bottom: 1px solid
      ${({secondary}) => (secondary ? colors.blue.light2 : colors.offWhite)};

    font-size: 16px;

    :last-of-type {
      border: none;
    }
  }

  ${({secondary}) =>
    secondary &&
    `
      min-width: 300px;
      margin: 0 30px;
      border: 1px solid ${colors.blue.light2};
      border-radius: 12px;
      background-color: ${colors.blue.light};
      box-shadow: 0 6px 16px 0 rgba(9,65,86,0.2);
      position: absolute;
      height: calc(100% + 25px);
      top: -13px;
      left: calc(50% - 150px);

      :after{
        content: "*comissão reduzida de apenas 3%";
        position: absolute;
        bottom: -50px;
        font-size: 12px;
        color: ${colors.mediumDarkGray};
      }
      `};

  :last-of-type {
    :after {
      content: '**comissão de 5% cobrada no mercado';
      position: absolute;
      bottom: -61px;
      font-size: 12px;
      color: ${colors.mediumDarkGray};
    }
  }
`

export const DescriptionColumn = Column.extend`
  padding: 0 30px;
  color: ${colors.mediumDarkGray};
  h4 {
    opacity: 0;
  }
  p {
    font-size: 14px;
  }
`
