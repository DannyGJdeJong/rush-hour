// Import libraries
import styled from 'styled-components';

type GridProps = {
  width: number;
  height: number;
};

const Grid = styled.div<GridProps>`
  display: grid;

  grid-template-columns: repeat(${({ width }) => width}, calc(100% / ${({ width }) => width}));
  grid-template-rows: repeat(${({ height }) => height}, calc(100% / ${({ height }) => height}));
`;

export default Grid;
