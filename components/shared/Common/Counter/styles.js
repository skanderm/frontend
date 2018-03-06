import styled from 'styled-components'
import * as colors from 'constants/colors'

export default styled.div`
  display: flex;
  box-sizing: border-box;
  > :nth-child(2) {
    user-select: none;
    width: 70px;
    text-align: center;
  }
`

export const CounterButton = styled.button`
  all: initial;
  border: solid 1px ${colors.blue};
  border-radius: 25px;
  color: ${colors.blue};
  font-size: 20px;
  font-weight: 800;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};

  &:hover {
    background-color: ${colors.blue};
    color: white;
  }
`