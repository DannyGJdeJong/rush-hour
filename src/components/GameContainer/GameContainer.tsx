import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import GameBoard from '../GameBoard';

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

const GameContainer: FunctionComponent = () => {
  const [moveCount, setMoveCount] = useState<number>(0);

  return (
    <StyledDiv>
      <p> {moveCount} </p>

      <StyledGameBoard width={6}
               height={6}
               initialVehicles={[{x: 0, y: 0, orientation: 'horizontal', length: 2, color: 'green'},
                                 {x: 0, y: 1, orientation: 'vertical', length: 3, color: 'purple'},
                                 {x: 0, y: 4, orientation: 'vertical', length: 2, color: 'orange'},
                                 {x: 1, y: 2, orientation: 'horizontal', length: 2, color: 'red'},
                                 {x: 5, y: 0, orientation: 'vertical', length: 3, color: 'yellow'},
                                 {x: 4, y: 4, orientation: 'horizontal', length: 2, color: 'teal'},
                                 {x: 2, y: 5, orientation: 'horizontal', length: 3, color: 'green'},
                                 {x: 3, y: 1, orientation: 'vertical', length: 3, color: 'blue'}
                              ]}
               setMoveCount={setMoveCount}/>
    </StyledDiv>

  );
}

export default GameContainer;
