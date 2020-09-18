import styled from 'styled-components';

type GridSquareProps = {
  x: number
  y: number
}

const GridSquare = styled.div<GridSquareProps>`
  display: grid;

  grid-column-start: ${({x}) => x + 1};
  grid-row-start: ${({y}) => y + 1};
`;

export default GridSquare;
