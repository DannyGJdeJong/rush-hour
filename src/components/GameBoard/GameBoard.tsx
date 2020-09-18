import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import Vehicle from '../Vehicle';
import Grid from '../Grid';

type GameBoardProps = {
  width: number
  height: number
  initialVehicles: VehicleData[]
}

type VehicleData = {
  x: number
  y: number
  orientation: 'vertical' | 'horizontal'
  length: number
  selected: boolean
  color: string
}

type SquareData = string | null

const StyledGrid = styled(Grid)`
  width: 50vw;
  height: 50vw;
  margin: auto;
`;

const GameBoard: FunctionComponent<GameBoardProps> = ({ width, height, initialVehicles }) => {
  const [squares, setSquares] = useState<SquareData[][]>(Array(height).fill(null).map(() => Array(width).fill(null)));
  const [vehicles, setVehicles] = useState<{[id: string] : VehicleData}>(Object.assign({}, ...initialVehicles.map((vehicle) => ({[vehicle.x + ',' + vehicle.y]: vehicle}))));


  useEffect(() => {
    setSquares(() => {
      let newSquares: SquareData[][] = Array(height).fill(null).map(() => Array(width).fill(null));

      // For each vehicle, reserve the squares it occupies
      Object.keys(vehicles).forEach((id) => {
        let { x, y, orientation, length } = vehicles[id];

        // Loop through a range from 0 to length
        [...Array(length).keys()].forEach((i) => {
          let _x = x;
          let _y = y;

          // Adjust the coordinates according to the orientation
          if (orientation === 'horizontal') {
            _x += i
          } else if (orientation === 'vertical') {
            _y += i
          } else {
            throw Error('Vehicle ' + id + ' has invalid orientation');
          }

          // Check if placement is within bounds
          if (_x >= width || _y >= height) {
            throw Error('Vehicle ' + id + ' went out of bounds');
          }

          // Check if another vehicle is already in the same spot
          if (newSquares[_y][_x] != null) {
            throw Error('Vehicle ' + id + ' collides with ' + newSquares[_y][_x]);
          }

          // If everything checks out, reserve spot for current vehicle
          newSquares[_y][_x] = id;
        });
      });

      return newSquares;
    });
  }, [vehicles]);

  const handleVehicleClick = (_, x: number, y: number) => {
    setVehicles((vehicles) => {
      let newVehicles: {[id: string] : VehicleData} = {};
      let selectedId = x + ',' + y;

      // Set selected to false for every vehicle except the selected one
      Object.keys(vehicles).forEach((id) => {
        newVehicles[id] = { ... vehicles[id], selected: id === selectedId};
      });

      return newVehicles;
    });
  };

  return (
    <StyledGrid width={width} height={height}>
      {
        Object.values(vehicles).map(vehicle =>
          <Vehicle key={vehicle.x + ',' + vehicle.y} {...vehicle} onClickCallback={handleVehicleClick}/>
        )
      }
    </StyledGrid>
  );
};

export default GameBoard;
