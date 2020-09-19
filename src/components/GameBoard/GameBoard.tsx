// Import libraries
import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';

// Import components
import SquareContainer from '../SquareContainer';
import Vehicle from '../Vehicle';
import Modal from '../Modal';
import Grid from '../Grid';

// Import utils
import { VehicleData, GridCell, Direction, Move } from '../../utils/Types';
import { IsValidPosition, ConstructGrid, MoveVehicle, HasWinningCondition, SolveBoard } from '../../utils/GameLogic';

type GameBoardProps = {
  width: number
  height: number
  initialVehicles: VehicleData[]
  setMoveCount: React.Dispatch<React.SetStateAction<number>>
  setSolveClickHandler: React.Dispatch<React.SetStateAction<() => void>>
}

const StyledGrid = styled(Grid)`
  width: 100%;
  height: 100%;
`;

const GameBoard: FunctionComponent<GameBoardProps> = ({ width, height, initialVehicles, setMoveCount, setSolveClickHandler }) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>(initialVehicles);
  const [grid, setGrid] = useState<GridCell[][]>(ConstructGrid(width, height, vehicles));
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(null);
  const [won, setWon] = useState<boolean>(false);
  const [moves, setMoves] = useState<Move[]>([]);

  // Set solve button click handler on component mount
  useEffect(() => {
    setSolveClickHandler(() => { return startSolving });
  }, []);

  // Update grid whenever a vehicle changes
  useEffect(() => {
    setGrid(ConstructGrid(width, height, vehicles));
  }, [vehicles]);

  // Start moving vehicles when there's moves to be done
  useEffect(() => {
    if (moves.length == 0) { return; }

    const moveInterval = setInterval(() => {
      setMoves((moves) => {
        const { vehicle, direction } = moves.shift();
        moveVehicle(vehicle.id, direction);
        return moves;
      });
    }, 50);

    // Clear the interval every time useEffect runs
    return () => clearInterval(moveInterval);

  }, [grid, moves]);

  // Globally register a keydown handler for handling keyboard input
  useEffect(() => {
    // Register keydown handler
    document.addEventListener('keydown', handleKeyDown);

    // De-register keydown handler
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  // Check if the red car is in a winning position
  useEffect(() => {
    setWon(HasWinningCondition(width, height, vehicles));
  }, [vehicles]);

  const moveVehicle = (id: string, direction: Direction) => {
    // Search for vehicle by id
    let vehicle = vehicles.find((vehicle) => vehicle.id === id);

    // Create a temporary new vehicle
    let newVehicle: VehicleData = MoveVehicle(vehicle, direction);

    // If nothing changed, don't update vehicles
    if (JSON.stringify(newVehicle) === JSON.stringify(vehicle)) { console.log(newVehicle); return; }

    // If vehicle position is invalid, return
    if (!IsValidPosition(grid, newVehicle)) { console.log(newVehicle); return; }

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

  const startSolving = () => {
    console.log("Starting solving")
    setMoves(SolveBoard(width, height, vehicles));
  }

  const handleVehicleClick = (_: React.MouseEvent, id: string) => {
    // Update selected vehicle
    setSelectedVehicleId(id);
  };

  return (
    <>
      <SquareContainer>
        <StyledGrid width={width} height={height}>
          {
            vehicles.map(vehicle =>
              <Vehicle key={ vehicle.id } { ...vehicle } selected={ vehicle.id == selectedVehicleId } onClickCallback={ handleVehicleClick } moveVehicle={ moveVehicle }/>
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
