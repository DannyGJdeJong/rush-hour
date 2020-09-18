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


  // Update squares whenever a vehicle changes
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
            _x += i;
          } else if (orientation === 'vertical') {
            _y += i;
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

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(null);

  useEffect(() => {
    // Register keydown handler
    document.addEventListener('keydown', handleKeyDown);

    // De-register keydown handler
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleVehicleClick = (_: React.MouseEvent, id: string) => {
    // Update selected vehicle
    setSelectedVehicleId(id);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    // Ignore repeat keypresses
    if (event.repeat) { return }

    // Ignore keypress when no vehicle is selected
    if (selectedVehicleId == null) { return }

    // Create a temporary new vehicle
    let newVehicle: VehicleData = {...vehicles[selectedVehicleId]};

    // Adjust the new vehicle's position
    switch(event.code) {
      case 'ArrowUp': case 'KeyW':
        if (newVehicle.orientation === 'vertical') {
          newVehicle.y -= 1;
        }
        break;
      case 'ArrowLeft': case 'KeyA':
        if (newVehicle.orientation === 'horizontal') {
          newVehicle.x -= 1;
        }
        break;
      case 'ArrowDown': case 'KeyS':
        if (newVehicle.orientation === 'vertical') {
          newVehicle.y += 1;
        }
        break;
      case 'ArrowRight': case 'KeyD':
        if (newVehicle.orientation === 'horizontal') {
          newVehicle.x += 1;
        }
        break;
    }

    // If nothing changed, don't update vehicles
    if (newVehicle.x == vehicles[selectedVehicleId].x && newVehicle.y == vehicles[selectedVehicleId].y) { return }

    let vehiclePositionValid = true;

    // Check constraints for moving vehicle
    [...Array(newVehicle.length).keys()].forEach((i) => {
      let _x = newVehicle.x;
      let _y = newVehicle.y;

      // Adjust the coordinates according to the orientation
      if (newVehicle.orientation === 'horizontal') {
        _x += i;
      } else if (newVehicle.orientation === 'vertical') {
        _y += i;
      } else {
        vehiclePositionValid = false;
        return;
      }

      // Check if placement is within bounds
      if (_x >= width || _y >= height) {
        vehiclePositionValid = false;
        return;
      }

      // Check if spot is available (either null or itself)
      if (!(squares[_y][_x] == null || squares[_y][_x] === selectedVehicleId)) {
        vehiclePositionValid = false;
        return;
      }
    });

    // If vehicle position is invalid, return
    if (!vehiclePositionValid) { return; }

    // If the code hasn't returned by now the vehicle must be placeable
    setVehicles((vehicles) => {
      let newVehicles = {...vehicles};
      newVehicles[selectedVehicleId] = newVehicle;

      return newVehicles;
    });
  };

  return (
    <StyledGrid width={width} height={height}>
      {
        Object.keys(vehicles).map(id =>
          <Vehicle key={id} id={id} {...vehicles[id]} selected={id == selectedVehicleId} onClickCallback={handleVehicleClick}/>
        )
      }
    </StyledGrid>
  );
};

export default GameBoard;
