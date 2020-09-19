import styled from 'styled-components';

import { Coordinates } from '../../utils/Types';

const GridSquare = styled.div<Coordinates>`
  display: grid;

  grid-column-start: ${({x}) => x + 1};
  grid-row-start: ${({y}) => y + 1};
`;

export default GridSquare;
