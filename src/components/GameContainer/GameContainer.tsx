import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import GameBoard from '../GameBoard';
import { Orientation } from '../../utils/Types';

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
               initialVehicles={[{ id: '0,0', coordinates: { x: 0, y: 0 }, orientation: Orientation.Horizontal, length: 2, color: 'green'  },
                                 { id: '0,1', coordinates: { x: 0, y: 1 }, orientation: Orientation.Vertical  , length: 3, color: 'purple' },
                                 { id: '0,4', coordinates: { x: 0, y: 4 }, orientation: Orientation.Vertical  , length: 2, color: 'orange' },
                                 { id: '1,2', coordinates: { x: 1, y: 2 }, orientation: Orientation.Horizontal, length: 2, color: 'red'    },
                                 { id: '5,0', coordinates: { x: 5, y: 0 }, orientation: Orientation.Vertical  , length: 3, color: 'yellow' },
                                 { id: '4,4', coordinates: { x: 4, y: 4 }, orientation: Orientation.Horizontal, length: 2, color: 'teal'   },
                                 { id: '2,5', coordinates: { x: 2, y: 5 }, orientation: Orientation.Horizontal, length: 3, color: 'green'  },
                                 { id: '3,1', coordinates: { x: 3, y: 1 }, orientation: Orientation.Vertical  , length: 3, color: 'blue'   }
                              ]}
               setMoveCount={setMoveCount}/>
    </StyledDiv>

  );
}

export default GameContainer;
