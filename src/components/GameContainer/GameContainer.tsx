// Import libraries
import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

// Import components
import NumberInput from '../NumberInput';
import GameBoard from '../GameBoard';

// Import utils
import { Puzzle, HardCodedPuzzles, GeneratePuzzle } from '../../utils/Puzzles';
import { SolveBoard } from '../../utils/GameLogic';

const StyledDiv = styled.div`
  display: grid;
  width: 100%;

  @media (orientation: landscape) {
    grid-template-columns: 50% 50%;
  }

  @media (orientation: portrait) {
    grid-template-columns: 100%;
  }
`;

const StyledGameBoard = styled(GameBoard)`
  @media (orientation: landscape) {
    grid-column-start: 2;
    grid-row-start: 1;
  }

  @media (orientation: portrait) {
    grid-column-start: 1;
    grid-row-start: 2;
  }
`;

const SettingsDiv = styled.div`
  padding: 20px;
  grid-column-start: 1;
  grid-row-start: 1;

  @media (orientation: landscape) {
    grid-row-end: 5;
  }
`;

const GameContainer: FunctionComponent = () => {
  // Various states
  const [moveCount, setMoveCount] = useState<number>(0);
  const [optimalMoveCount, setOptimalMoveCount] = useState<number>();
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle>(HardCodedPuzzles[0]);

  // Solve button handlers that can be set by GameBoard
  const [handleSolveButtonClick, setHandleSolveButtonClick] = useState<() => void>();
  const [handleHintButtonClick, setHandleHintButtonClick] = useState<() => void>();

  // Reset variable
  const [reset, setReset] = useState<boolean>(false);

  // Puzzle generator input state
  const [generatedPuzzleWidth, setGeneratedPuzzleWidth] = useState<number>(6);
  const [generatedPuzzleHeight, setGeneratedPuzzleHeight] = useState<number>(6);
  const [generatedPuzzleCarLength, setGeneratedPuzzleCarLength] = useState<number>(2);
  const [generatedPuzzleCarCount, setGeneratedPuzzleCarCount] = useState<number>(4);
  const [generatedPuzzleTruckLength, setGeneratedPuzzleTruckLength] = useState<number>(3);
  const [generatedPuzzleTruckCount, setGeneratedPuzzleTruckCount] = useState<number>(4);
  const [generatedPuzzleMinMoves, setGeneratedPuzzleMinMoves] = useState<number>(20);
  const [generatedPuzzleTries, setGeneratedPuzzleTries] = useState<number>(500);

  // When the selected puzzle changes, update optimal move count
  useEffect(() => {
    setOptimalMoveCount(SolveBoard(selectedPuzzle.width, selectedPuzzle.height, selectedPuzzle.vehicles).length);
  }, [selectedPuzzle]);

  // When the puzzle selector changes, update selected level and reset movecount
  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPuzzle(HardCodedPuzzles.find(({ name }) => name === event.target.value));
    setMoveCount(0);
  };

  // When the reset button is clicked, re-mount GameBoard and reset movecount
  const handleResetButtonClick = () => {
    setReset((reset) => !reset);
    setMoveCount(0);
  };

  // When the generate button is clicked, generate a random puzzle, re-mount GameBoard and reset movecount
  const handleGenerateButtonClick = () => {
    setSelectedPuzzle({
      name: 'Random',
      width: generatedPuzzleWidth,
      height: generatedPuzzleHeight,
      vehicles: GeneratePuzzle(
        generatedPuzzleWidth,
        generatedPuzzleHeight,
        generatedPuzzleMinMoves,
        generatedPuzzleTries,
        generatedPuzzleCarLength,
        generatedPuzzleCarCount,
        generatedPuzzleTruckLength,
        generatedPuzzleTruckCount
      )
    });
    setReset((reset) => !reset);
    setMoveCount(0);
  };

  return (
    <StyledDiv>
      <SettingsDiv>
        <p>
          {' '}
          {moveCount} / {optimalMoveCount}{' '}
        </p>
        <button onClick={handleHintButtonClick}>Hint</button>
        <button onClick={handleSolveButtonClick}>Solve</button>
        <button onClick={handleResetButtonClick}>Reset</button>
        <hr></hr>
        <p> Select a default level: </p>
        <select onChange={onSelectChange} value={selectedPuzzle.name}>
          {HardCodedPuzzles.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <hr></hr>
        <p>
          {' '}
          Generate a random level (experimental, keep console open for generation progress, may take a long time):{' '}
        </p>
        <p> Width: </p>
        <NumberInput min={5} max={10} value={generatedPuzzleWidth} onChangeCallback={setGeneratedPuzzleWidth} />
        <p> Height: </p>
        <NumberInput min={5} max={10} value={generatedPuzzleHeight} onChangeCallback={setGeneratedPuzzleHeight} />
        <p> Car length: </p>
        <NumberInput
          min={1}
          // Makes sure the red car can still be placed since it'll be at most in x = 2
          max={Math.min(generatedPuzzleWidth, generatedPuzzleHeight) - 2}
          value={generatedPuzzleCarLength}
          onChangeCallback={setGeneratedPuzzleCarLength}
        />
        <p> Car count: </p>
        <NumberInput min={0} max={10} value={generatedPuzzleCarCount} onChangeCallback={setGeneratedPuzzleCarCount} />
        <p> Truck length: </p>
        <NumberInput
          min={1}
          // Makes sure the truck can still move at least one tile
          max={Math.min(generatedPuzzleWidth, generatedPuzzleHeight) - 1}
          value={generatedPuzzleTruckLength}
          onChangeCallback={setGeneratedPuzzleTruckLength}
        />
        <p> Truck count: </p>
        <NumberInput
          min={0}
          max={10}
          value={generatedPuzzleTruckCount}
          onChangeCallback={setGeneratedPuzzleTruckCount}
        />
        <p> Minimum moves to solve: </p>
        <NumberInput min={1} max={100} value={generatedPuzzleMinMoves} onChangeCallback={setGeneratedPuzzleMinMoves} />
        <p> Amount of times to try generating a puzzle before giving up: </p>
        <NumberInput min={1} max={1000} value={generatedPuzzleTries} onChangeCallback={setGeneratedPuzzleTries} />
        <p></p>
        <button onClick={handleGenerateButtonClick}>Generate</button>
      </SettingsDiv>
      <StyledGameBoard
        key={selectedPuzzle.name + reset} // Force re-mount on selectedPuzzle change
        width={selectedPuzzle.width}
        height={selectedPuzzle.height}
        initialVehicles={selectedPuzzle.vehicles}
        setMoveCount={setMoveCount}
        setSolveClickHandler={setHandleSolveButtonClick}
        setHintClickHandler={setHandleHintButtonClick}
      />
    </StyledDiv>
  );
};

export default GameContainer;
