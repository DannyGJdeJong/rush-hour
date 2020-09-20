// Import libraries
import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// Import utils
import { Coordinates, Direction } from '../../utils/Types';

type SwipeableProps = {
  swipeCallback: (direction: Direction) => void;
};

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  touch-action: none;
`;

const Swipeable: FunctionComponent<SwipeableProps> = ({ children, swipeCallback }) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<Coordinates>();

  // Set a reference to the container div to get the element width/height to determine the grid size in px
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseDownHandler = (event: React.MouseEvent) => {
    let currentPosition: Coordinates = { x: event.pageX, y: event.pageY };
    setStartPosition(currentPosition);
    setDragging(true);
    event.preventDefault();
  };

  const mouseMoveHandler = (event: React.MouseEvent) => {
    let currentPosition: Coordinates = { x: event.pageX, y: event.pageY };
    // Call the swipeCallback when the element is clicked AND dragged for 0.8 * [grid size] amount of px
    // Here 0.8 is used to counter small errors and make it feel more smooth
    if (
      dragging &&
      getDistance(startPosition, currentPosition) >
        Math.min(containerRef.current.offsetWidth, containerRef.current.offsetHeight) * 0.8
    ) {
      swipeCallback(getDirection(startPosition, currentPosition));
      // Reset the startPosition to start dragging again
      setStartPosition(currentPosition);
    }

    event.preventDefault();
  };

  const mouseUpHandler = () => {
    // Stop dragging when the mouse is released
    setDragging(false);
  };

  useEffect(() => {
    // Register keydown handler
    document.addEventListener('mouseup', mouseUpHandler);

    // De-register keydown handler
    return () => {
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  });

  const touchStartHandler = (event: React.TouchEvent) => {
    // Determine the last touch
    let lastTouch = event.changedTouches[0];
    // Retrieve the current touch position
    let currentPosition: Coordinates = { x: lastTouch.pageX, y: lastTouch.pageY };

    // (re)set the start position
    setStartPosition(currentPosition);
    setDragging(true);
    event.preventDefault();
  };

  const touchMoveHandler = (event: React.TouchEvent) => {
    // Determine the last touch
    let lastTouch = event.changedTouches[0];
    // Retrieve the current touch position
    let currentPosition: Coordinates = { x: lastTouch.pageX, y: lastTouch.pageY };

    // Call the swipeCallback when the element is clicked AND dragged for 0.3 * [grid size] amount of px
    // Here 0.3 is used to counter small errors and make it feel more smooth
    if (
      dragging &&
      getDistance(startPosition, currentPosition) >
        Math.min(containerRef.current.offsetWidth, containerRef.current.offsetHeight) * 0.3
    ) {
      swipeCallback(getDirection(startPosition, currentPosition));
      // Reset the startPosition to start dragging again
      setStartPosition({ x: lastTouch.pageX, y: lastTouch.pageY });
    }
    event.preventDefault();
  };

  const touchEndHandler = (event: React.TouchEvent) => {
    // Stop dragging when touch is released
    setDragging(false);
    event.preventDefault();
  };

  const getDistance = (oldLoc: Coordinates, newLoc: Coordinates): number => {
    return Math.max(Math.abs(newLoc.x - oldLoc.x), Math.abs(newLoc.y - oldLoc.y));
  };

  const getDirection = (oldLoc: Coordinates, newLoc: Coordinates) => {
    let deltaX = newLoc.x - oldLoc.x;
    let deltaY = newLoc.y - oldLoc.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? Direction.Right : Direction.Left;
    } else {
      return deltaY > 0 ? Direction.Down : Direction.Up;
    }
  };

  return (
    <StyledDiv
      ref={containerRef}
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
      onTouchStart={touchStartHandler}
      onTouchMove={touchMoveHandler}
      onTouchEnd={touchEndHandler}>
      {children}
    </StyledDiv>
  );
};

export default Swipeable;
