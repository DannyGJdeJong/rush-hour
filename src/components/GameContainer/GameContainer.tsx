import React, { FunctionComponent } from 'react';
import GameBoard from '../GameBoard'

const GameContainer: FunctionComponent = () => {
  return (
    <GameBoard width={6} height={6} initialVehicles={[{x: 0, y: 0, orientation: 'horizontal', length: 2, selected: false, color: 'green'}, {x: 0, y: 1, orientation: 'vertical', length: 3, selected: false, color: 'purple'}, {x: 0, y: 4, orientation: 'vertical', length: 2, selected: false, color: 'orange'}]}/>
  );
}

export default GameContainer;
