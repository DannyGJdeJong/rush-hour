// Import libraries
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

type ModalProps = {
  title: string
  message: string
  visible: boolean
}

type BackgroundProps = {
  visible: boolean
}

const Background = styled.div<BackgroundProps>`
  display: ${({visible}) => visible ? 'block' : 'none'};
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000000BF;
`;

const DialogBox = styled.div`
  width: 500px;
  height: 200px;
  border-radius: 5px;
  margin: auto;
  margin-top: 10%;
  padding: 15px;
  background-color: #F7F7F7;
`;

const StyledHeader = styled.h1`
  margin: auto;
`;

const Modal: FunctionComponent<ModalProps> = ({title, message, visible}) => {
  const [isOpen, setIsOpen] = useState<boolean>(visible);

  const handleClick = () => {
    setIsOpen(false)
  }

  return (
    <Background visible={isOpen} onClick={handleClick}>
      <DialogBox>
        <StyledHeader>{title}</StyledHeader>
        <hr />
        <p>{message}</p>
      </DialogBox>
    </Background>
  );
}

export default Modal;
