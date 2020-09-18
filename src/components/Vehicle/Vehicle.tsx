import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import GridSquare from '../GridSquare';

type VehicleProps = {
  x: number
  y: number
  orientation: 'vertical' | 'horizontal'
  length: number
  selected: boolean
  color: string
  onClickCallback: (event: React.MouseEvent, x: number, y: number) => void
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

const Vehicle: FunctionComponent<VehicleProps> = ({x, y, color, orientation, length, selected, onClickCallback}) => {
  const onClick = (event: React.MouseEvent) => onClickCallback(event, x, y);

  return (
    <StyledGridSquare x={x} y={y} orientation={orientation} length={length} color={color} onClick={onClick} className={selected ? 'selected' : ''}>
    </StyledGridSquare>
  );
};

export default Vehicle;
