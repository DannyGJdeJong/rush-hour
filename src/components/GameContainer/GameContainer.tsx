import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import GameBoard from '../GameBoard';
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
`;

const GameContainer: FunctionComponent = () => {
  const [moveCount, setMoveCount] = useState<number>(0);
  const [handleSolveButtonClick, setHandleSolveButtonClick] = useState<() => void>();
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle>(HardCodedPuzzles[0]);
  const [optimalMoveCount, setOptimalMoveCount] = useState<number>();
  const [reset, setReset] = useState<boolean>(false);
  const [generatedPuzzleWidth, setGeneratedPuzzleWidth] = useState<number>(6);
  const [generatedPuzzleHeight, setGeneratedPuzzleHeight] = useState<number>(6);
  const [generatedPuzzleMinMoves, setGeneratedPuzzleMinMoves] = useState<number>(20);
  const [generatedPuzzleTries, setGeneratedPuzzleTries] = useState<number>(500);

  useEffect(() => {
    setOptimalMoveCount(SolveBoard(selectedPuzzle.width, selectedPuzzle.height, selectedPuzzle.vehicles).length);
  }, [selectedPuzzle]);

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPuzzle(HardCodedPuzzles.find(({ name }) => name === event.target.value));
    setMoveCount(0);
  }

  const handleResetButtonClick = () => {
    setReset((reset) => !reset);
    setMoveCount(0);
  }

  const handleGenerateButtonClick = () => {
    setSelectedPuzzle({ name: "Random", width: generatedPuzzleWidth, height: generatedPuzzleHeight, vehicles: GeneratePuzzle(generatedPuzzleWidth, generatedPuzzleHeight, generatedPuzzleMinMoves, generatedPuzzleTries) });
    setReset((reset) => !reset);
    setMoveCount(0);
  }

  const handleGeneratedPuzzleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Parse input value
    let value = parseInt(event.target.value);
    // Enforce lower limit
    value = Math.max(value, 5);
    // Enforce upper limit
    value = Math.min(value, 10);
    setGeneratedPuzzleWidth(value);
  }

  const handleGeneratedPuzzleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Parse input value
    let value = parseInt(event.target.value);
    // Enforce lower limit
    value = Math.max(value, 5);
    // Enforce upper limit
    value = Math.min(value, 10);
    setGeneratedPuzzleHeight(value);
  }

  const handleGeneratedPuzzleMinMovesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Parse input value
    let value = parseInt(event.target.value);
    // Enforce lower limit
    value = Math.max(value, 5);
    // Enforce upper limit
    value = Math.min(value, 100);
    setGeneratedPuzzleMinMoves(value);
  }

  const handleGeneratedPuzzleTriesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Parse input value
    let value = parseInt(event.target.value);
    // Enforce lower limit
    value = Math.max(value, 1);
    // Enforce upper limit
    value = Math.min(value, 1000);
    setGeneratedPuzzleTries(value);
  }

  return (
    <StyledDiv>
      <SettingsDiv>
        <p> { moveCount } / { optimalMoveCount } </p>
        <button onClick={ handleSolveButtonClick }>
          Solve
        </button>
        <button onClick={ handleResetButtonClick }>
          Reset
        </button>
        <hr></hr>
        <p> Select a default level: </p>
        <select onChange={ onSelectChange } value={ selectedPuzzle.name }>
          {
            HardCodedPuzzles.map(({ name }) =>
              <option key={ name } value={ name }>{ name }</option>
            )
          }
        </select>
        <hr></hr>
        <p> Generate a random level (experimental, keep console open for generation progress, may take a long time): </p>
        <p> Width: </p>
        <input min={ 5 } max={ 10 }  type="number" value={ generatedPuzzleWidth }    onChange={ handleGeneratedPuzzleWidthChange } />
        <p> Height: </p>
        <input min={ 5 } max={ 10 }  type="number" value={ generatedPuzzleHeight }   onChange={ handleGeneratedPuzzleHeightChange } />
        <p> Minimum moves to solve: </p>
        <input min={ 5 } max={ 100 } type="number" value={ generatedPuzzleMinMoves } onChange={ handleGeneratedPuzzleMinMovesChange } />
        <p> Amount of times to try generating a puzzle before giving up: </p>
        <input min={ 1 } max={ 1000 } type="number" value={ generatedPuzzleTries } onChange={ handleGeneratedPuzzleTriesChange } />
        <p></p>
        <button onClick={ handleGenerateButtonClick }>
          Generate
        </button>
      </SettingsDiv>
      <StyledGameBoard
        key={ selectedPuzzle.name + reset } // Force re-mount on selectedPuzzle change
        width={ selectedPuzzle.width }
        height={ selectedPuzzle.height }
        initialVehicles={ selectedPuzzle.vehicles }
        setMoveCount={ setMoveCount }
        setSolveClickHandler={ setHandleSolveButtonClick }/>
    </StyledDiv>
  );
}

export default GameContainer;
