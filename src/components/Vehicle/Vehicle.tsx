import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import GridSquare from '../GridSquare';
import Swipeable from '../Swipeable';

type VehicleProps = {
  id: string
  x: number
  y: number
  orientation: 'vertical' | 'horizontal'
  length: number
  selected: boolean
  color: string
  onClickCallback: (event: React.MouseEvent, id: string) => void
  moveVehicle: (id: string, direction: string) => void
};

type StyledGridSquareProps = {
  orientation: 'vertical' | 'horizontal'
  length: number
}

const StyledGridSquare = styled(GridSquare)<StyledGridSquareProps>`
  z-index: 1;

  grid-column-end: ${({orientation, x, length}) => orientation === 'horizontal' ? x + 1 + length : x + 1};
  grid-row-end: ${({orientation, y, length}) => orientation === 'vertical' ? y + 1 + length : y + 1};

  background-color: ${({color}) => color};

  &.selected {
    border-style: solid;
    border-color: white;
  }
`;

const Vehicle: FunctionComponent<VehicleProps> = ({id, x, y, color, orientation, length, selected, onClickCallback, moveVehicle}) => {
  const onClick = (event: React.MouseEvent) => onClickCallback(event, id);

  const onSwipe = (direction: string) => {
    console.log(id)
    console.log(direction)
    moveVehicle(id, direction);
  }

  return (
    <StyledGridSquare x={x} y={y} orientation={orientation} length={length} color={color} onMouseDown={onClick} className={selected ? 'selected' : ''}>
      <Swipeable swipeCallback={onSwipe}></Swipeable>
    </StyledGridSquare>
  );
};

export default Vehicle;
