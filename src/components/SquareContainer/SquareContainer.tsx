// Import libraries
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
`;

const Square = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
`;

const SquareContainer: FunctionComponent = ({children}) => {
  return (
    <Square>
      <Container>
        { children }
      </Container>
    </Square>
  );
}

export default SquareContainer;
