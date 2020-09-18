// Import libraries
import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';

// Import components
import SquareContainer from '../SquareContainer';
import Vehicle from '../Vehicle';
import Modal from '../Modal';
import Grid from '../Grid';

type GameBoardProps = {
  width: number
  height: number
  initialVehicles: VehicleData[]
  setMoveCount: React.Dispatch<React.SetStateAction<number>>
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
  width: 100%;
  height: 100%;
`;

const GameBoard: FunctionComponent<GameBoardProps> = ({ width, height, initialVehicles, setMoveCount }) => {
  const [squares, setSquares] = useState<SquareData[][]>(Array(height).fill(null).map(() => Array(width).fill(null)));
  const [vehicles, setVehicles] = useState<{[id: string] : VehicleData}>(Object.assign({}, ...initialVehicles.map((vehicle) => ({[vehicle.x + ',' + vehicle.y]: vehicle}))));
  const [won, setWon] = useState<boolean>(false);

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
          if (_x >= width || _y >= height || _x < 0 || _y < 0) {
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

  const moveVehicle = (id: string, direction: 'up' | 'down' | 'left' | 'right') => {
     // Create a temporary new vehicle
     let newVehicle: VehicleData = {...vehicles[id]};

     // Adjust the new vehicle's position
     switch(direction) {
       case 'up':
         if (newVehicle.orientation === 'vertical') {
           newVehicle.y -= 1;
         }
         break;
       case 'left':
         if (newVehicle.orientation === 'horizontal') {
           newVehicle.x -= 1;
         }
         break;
       case 'down':
         if (newVehicle.orientation === 'vertical') {
           newVehicle.y += 1;
         }
         break;
       case 'right':
         if (newVehicle.orientation === 'horizontal') {
           newVehicle.x += 1;
         }
         break;
     }

    // If nothing changed, don't update vehicles
    if (newVehicle.x == vehicles[id].x && newVehicle.y == vehicles[id].y) { return }

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
      if (_x >= width || _y >= height || _x < 0 || _y < 0) {
        vehiclePositionValid = false;
        return;
      }

      // Check if spot is available (either null or itself)
      if (!(squares[_y][_x] == null || squares[_y][_x] === id)) {
        vehiclePositionValid = false;
        return;
      }
    });

    // If vehicle position is invalid, return
    if (!vehiclePositionValid) { return; }

    // If the code hasn't returned by now the vehicle must be placeable
    setVehicles((vehicles) => {
      let newVehicles = {...vehicles};
      newVehicles[id] = newVehicle;

      return newVehicles;
    });

    // Update moveCount
    setMoveCount((moveCount) => {
      return moveCount + 1;
    });
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    // Ignore repeat keypresses
    if (event.repeat) { return }

    // Ignore keypress when no vehicle is selected
    if (selectedVehicleId == null) { return }

    // Adjust the new vehicle's position
    switch(event.code) {
      case 'ArrowUp': case 'KeyW':
        moveVehicle(selectedVehicleId, 'up');
        break;
      case 'ArrowLeft': case 'KeyA':
        moveVehicle(selectedVehicleId, 'left');
        break;
      case 'ArrowDown': case 'KeyS':
        moveVehicle(selectedVehicleId, 'down');
        break;
      case 'ArrowRight': case 'KeyD':
        moveVehicle(selectedVehicleId, 'right');
        break;
    }
  };

  // Check if the red car is in a winning position
  useEffect(() => {
    // Find the objective vehicle, marked by its color, red
    // This assumes there's just a single red car at all times
    let redVehicle = Object.values(vehicles).find(vehicle => vehicle.color === 'red');

    // Determine whether the red car is in a winning position
    // This assumes the winning position is either on the right or at the bottom of the grid
    // The latter should never occur in a normal game of rush-hour, but it's possible to still win if the car is somehow rotated
    if ((redVehicle.orientation === 'horizontal' && redVehicle.x == width - redVehicle.length) ||
        (redVehicle.orientation === 'vertical'   && redVehicle.y == height - redVehicle.length)) {
      setWon(true);
    } else {
      setWon(false);
    }
  }, [vehicles]);

  return (
    <>
      <SquareContainer>
        <StyledGrid width={width} height={height}>
          {
            Object.keys(vehicles).map(id =>
              <Vehicle key={id} id={id} {...vehicles[id]} selected={id == selectedVehicleId} onClickCallback={handleVehicleClick} moveVehicle={moveVehicle}/>
            )
          }
        </StyledGrid>
      </SquareContainer>
      {
        won ? <Modal title="Congratulations!" message="You've won!" visible={won}/> : <></>
      }
    </>
  );
};

export default GameBoard;
