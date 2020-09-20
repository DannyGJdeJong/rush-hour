// Import libraries
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

// Import components
import GridSquare from '../GridSquare';
import Swipeable from '../Swipeable';

// Import utils
import { VehicleData, Orientation, Direction } from '../../utils/Types';

type VehicleProps = VehicleData & {
  selected: boolean;
  onClickCallback: (event: React.MouseEvent, id: string) => void;
  moveVehicle: (id: string, direction: Direction) => void;
};

type StyledGridSquareProps = {
  orientation: Orientation;
  length: number;
};

const StyledGridSquare = styled(GridSquare)<StyledGridSquareProps>`
  z-index: 1;

  grid-column-end: ${({ orientation, x, length }) => (orientation == Orientation.Horizontal ? x + 1 + length : x + 1)};
  grid-row-end: ${({ orientation, y, length }) => (orientation == Orientation.Vertical ? y + 1 + length : y + 1)};

  background-color: ${({ color }) => color};

  &.selected {
    border-style: solid;
    border-color: black;
  }
`;

const Vehicle: FunctionComponent<VehicleProps> = ({
  id,
  coordinates,
  color,
  orientation,
  length,
  selected,
  onClickCallback,
  moveVehicle
}) => {
  const onClick = (event: React.MouseEvent) => onClickCallback(event, id);

  const onSwipe = (direction: Direction) => {
    moveVehicle(id, direction);
  };

  return (
    <StyledGridSquare
      x={coordinates.x}
      y={coordinates.y}
      orientation={orientation}
      length={length}
      color={color}
      onMouseDown={onClick}
      className={selected ? 'selected' : ''}>
      <Swipeable swipeCallback={onSwipe}></Swipeable>
    </StyledGridSquare>
  );
};

export default Vehicle;
