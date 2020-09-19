import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import GameBoard from '../GameBoard';
import { Puzzle, HardCodedPuzzles } from '../../utils/Puzzles';

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
  @media (orientation: landscape) {
    grid-column-start: 1;
    grid-row-start: 1;
  }

  @media (orientation: portrait) {
    grid-column-start: 1;
    grid-row-start: 1;
  }
`;

const GameContainer: FunctionComponent = () => {
  const [moveCount, setMoveCount] = useState<number>(0);
  const [handleSolveButtonClick, setHandleSolveButtonClick] = useState<() => void>();
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle>(HardCodedPuzzles[0]);

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPuzzle(HardCodedPuzzles.find(({ name }) => name === event.target.value));
    setMoveCount(0);
  }

  return (
    <StyledDiv>
      <SettingsDiv>
        <p> { moveCount } </p>
        <select onChange={ onSelectChange } value={ selectedPuzzle.name }>
          {
            HardCodedPuzzles.map(({ name }) =>
              <option value={ name }>{ name }</option>
            )
          }
        </select>
        <button onClick={ handleSolveButtonClick }>
          Solve!
        </button>
      </SettingsDiv>
      <StyledGameBoard
        key={ selectedPuzzle.name } // Force re-mount on selectedPuzzle change
        width={ selectedPuzzle.width }
        height={ selectedPuzzle.height }
        initialVehicles={ selectedPuzzle.vehicles }
        setMoveCount={ setMoveCount }
        setSolveClickHandler={ setHandleSolveButtonClick }/>
    </StyledDiv>

  );
}

export default GameContainer;
