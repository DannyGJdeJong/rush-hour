import React, { FunctionComponent } from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #___gatsby {
    padding: 0;
    top: 0;
    margin: 0 auto;
  }

  body {
    background-color: #F7F7F7;
    /*
      Disable pull down to refresh and drag from side to go back so touch support works
      This is definitely not the ideal solution, but using event.preventDefault() did not work
    */
    overscroll-behavior-y: contain;
    overscroll-behavior-x: contain;
  }

  p, h1 {
    font-family: 'Inter';
  }
`;

const Layout: FunctionComponent = ({ children }) => (
  <>
    <GlobalStyle />
    {children}
  </>
);

export default Layout;
