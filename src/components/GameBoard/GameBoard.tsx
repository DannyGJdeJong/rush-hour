// Import libraries
import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

// Import components
import SquareContainer from '../SquareContainer';
import Vehicle from '../Vehicle';
import Modal from '../Modal';
import Grid from '../Grid';

// Import utils
import { VehicleData, GridCell, Orientation, Direction } from '../../utils/Types';
import { IsValidPosition, ConstructGrid, MoveVehicle } from '../../utils/GameLogic';

type GameBoardProps = {
  width: number
  height: number
  initialVehicles: VehicleData[]
  setMoveCount: React.Dispatch<React.SetStateAction<number>>
}

const StyledGrid = styled(Grid)`
  width: 100%;
  height: 100%;
`;

const GameBoard: FunctionComponent<GameBoardProps> = ({ width, height, initialVehicles, setMoveCount }) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>(initialVehicles);
  const [grid, setGrid] = useState<GridCell[][]>(ConstructGrid(width, height, vehicles));
  const [won, setWon] = useState<boolean>(false);

  // Update grid whenever a vehicle changes
  useEffect(() => {
    setGrid(ConstructGrid(width, height, vehicles));
  }, [vehicles]);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(null);

  // Globally register a keydown handler for handling keyboard input
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

  const moveVehicle = (id: string, direction: Direction) => {
    // Search for vehicle by id
    let vehicle = vehicles.find((vehicle) => vehicle.id === id);

    // Create a temporary new vehicle
    let newVehicle: VehicleData = MoveVehicle(vehicle, direction);

    // If nothing changed, don't update vehicles
    if (JSON.stringify(newVehicle) === JSON.stringify(vehicle)) { return }

    // If vehicle position is invalid, return
    if (!IsValidPosition(grid, newVehicle)) { return; }

    // If the code hasn't returned by now the vehicle must be placeable
    setVehicles((vehicles) => {
      return vehicles.map((vehicle) => {
        if (vehicle.id === id) {
          return newVehicle;
        } else {
          return vehicle;
        }
      });
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
        moveVehicle(selectedVehicleId, Direction.Up);
        break;
      case 'ArrowLeft': case 'KeyA':
        moveVehicle(selectedVehicleId, Direction.Left);
        break;
      case 'ArrowDown': case 'KeyS':
        moveVehicle(selectedVehicleId, Direction.Down);
        break;
      case 'ArrowRight': case 'KeyD':
        moveVehicle(selectedVehicleId, Direction.Right);
        break;
    }
  };

  // Check if the red car is in a winning position
  useEffect(() => {
    // Find the objective vehicle, marked by its color, red
    // This assumes there's just a single red car at all times
    let redVehicle = vehicles.find(vehicle => vehicle.color === 'red');

    // Determine whether the red car is in a winning position
    // This assumes the winning position is either on the right or at the bottom of the grid
    // The latter should never occur in a normal game of rush-hour, but it's possible to still win if the car is somehow rotated
    if ((redVehicle.orientation == Orientation.Horizontal && redVehicle.coordinates.x == width - redVehicle.length) ||
        (redVehicle.orientation == Orientation.Vertical   && redVehicle.coordinates.y == height - redVehicle.length)) {
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
            vehicles.map(vehicle =>
              <Vehicle key={vehicle.id} {...vehicle} selected={vehicle.id == selectedVehicleId} onClickCallback={handleVehicleClick} moveVehicle={moveVehicle}/>
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
