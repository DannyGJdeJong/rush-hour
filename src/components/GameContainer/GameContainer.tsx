import React, { FunctionComponent } from 'react';
import GameBoard from '../GameBoard'

const GameContainer: FunctionComponent = () => {
  return (
    <GameBoard width={6} height={6} initialVehicles={[{x: 0, y: 0, orientation: 'horizontal', length: 2, color: 'green'},
                                                      {x: 0, y: 1, orientation: 'vertical', length: 3, color: 'purple'},
                                                      {x: 0, y: 4, orientation: 'vertical', length: 2, color: 'orange'},
                                                      {x: 1, y: 2, orientation: 'horizontal', length: 2, color: 'red'},
                                                      {x: 5, y: 0, orientation: 'vertical', length: 3, color: 'yellow'},
                                                      {x: 4, y: 4, orientation: 'horizontal', length: 2, color: 'teal'},
                                                      {x: 2, y: 5, orientation: 'horizontal', length: 3, color: 'green'},
                                                      {x: 3, y: 1, orientation: 'vertical', length: 3, color: 'blue'}
                                                    ]}/>
  );
}

export default GameContainer;
