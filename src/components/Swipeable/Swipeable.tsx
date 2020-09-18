import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

type SwipeableProps = {
  swipeCallback: (direction: string) => void
}

type Location = {
  x: number
  y: number
}

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const Swipeable: FunctionComponent<SwipeableProps> = ({children, swipeCallback}) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<Location>();

  // Set a reference to the container div to get the element width/height to determine the grid size in px
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseDownHandler = (event: React.MouseEvent) => {
    let currentPosition: Location = {x: event.pageX, y: event.pageY};
    setStartPosition(currentPosition)
    setDragging(true);
    event.preventDefault()
  }

  const mouseMoveHandler = (event: React.MouseEvent) => {
    let currentPosition: Location = {x: event.pageX, y: event.pageY};
    // Call the swipeCallback when the element is clicked AND dragged for 0.8 * [grid size] amount of px
    // Here 0.8 is used to counter small errors and make it feel more smooth
    if (dragging && getDistance(startPosition, currentPosition) > Math.min(containerRef.current.offsetWidth, containerRef.current.offsetHeight) * 0.8) {
      swipeCallback(getDirection(startPosition, currentPosition))
      // Reset the startPosition to start dragging again
      setStartPosition(currentPosition)
    }

    event.preventDefault()
  }

  const mouseUpHandler = (event: React.MouseEvent | MouseEvent) => {
    // Stop dragging when the mouse is released
    setDragging(false);
    event.preventDefault()
  }

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
    let currentPosition: Location = {x: lastTouch.pageX, y: lastTouch.pageY};

    // (re)set the start position
    setStartPosition(currentPosition)
    setDragging(true);
    event.preventDefault();
  }

  const touchMoveHandler = (event: React.TouchEvent) => {
    // Determine the last touch
    let lastTouch = event.changedTouches[0];
    // Retrieve the current touch position
    let currentPosition: Location = {x: lastTouch.pageX, y: lastTouch.pageY};

    // Call the swipeCallback when the element is clicked AND dragged for 0.3 * [grid size] amount of px
    // Here 0.3 is used to counter small errors and make it feel more smooth
    if (dragging && getDistance(startPosition, currentPosition) > Math.min(containerRef.current.offsetWidth, containerRef.current.offsetHeight) * 0.3) {
      swipeCallback(getDirection(startPosition, currentPosition))
      // Reset the startPosition to start dragging again
      setStartPosition({x: lastTouch.pageX, y: lastTouch.pageY})
    }
    event.preventDefault();
  }

  const touchEndHandler = (event: React.TouchEvent) => {
    // Stop dragging when touch is released
    setDragging(false);
    event.preventDefault()
  }

  const getDistance = (oldLoc: Location, newLoc: Location): number => {
    return Math.max(Math.abs(newLoc.x - oldLoc.x), Math.abs(newLoc.y - oldLoc.y));
  }

  const getDirection = (oldLoc: Location, newLoc: Location) => {
    let deltaX = newLoc.x - oldLoc.x;
    let deltaY = newLoc.y - oldLoc.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  return (
    <StyledDiv ref={containerRef}
               onMouseDown={mouseDownHandler}
               onMouseMove={mouseMoveHandler}
               onMouseUp={mouseUpHandler}
               onTouchStart={touchStartHandler}
               onTouchMove={touchMoveHandler}
               onTouchEnd={touchEndHandler}>
      { children }
    </StyledDiv>
  );
}

export default Swipeable;
