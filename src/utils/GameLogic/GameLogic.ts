import { GridCell, VehicleData, Orientation, Coordinates, Direction, Move } from '../Types';

export const SolveBoard = (width: number, height: number, vehicles: VehicleData[]): Move[] => {
  // Save all 'visited' grids so we don't return to the same state
  let visitedGrids = new Set();

  // Keep track of all game states
  let queue: { moves: Move[], vehicles: VehicleData[] }[] = [{ moves: [], vehicles: vehicles }]

  while (queue.length > 0) {
    const { moves, vehicles } = queue.shift();

    if (HasWinningCondition(width, height, vehicles)) {
      console.log(JSON.parse(JSON.stringify(moves)));
      return moves;
    }

    GetAllGameStates(width, height, vehicles).forEach(({ move, vehicles }) => {
      // Calculate the ""hashed"" grid for this game state to use for set comparison
      let hashedGrid = JSON.stringify(ConstructGrid(width, height, vehicles));

      // If this grid has not been visited, add it to the queue
      if (!visitedGrids.has(hashedGrid)) {
        visitedGrids.add(hashedGrid);
        queue.push({ moves: [...moves, move], vehicles: vehicles });
      }
    });
  }

  console.log("No winning condition could be found for this game");
  return [];
}

export const HasWinningCondition = (width: number, height: number, vehicles: VehicleData[]): boolean => {
  // Find the objective vehicle, marked by its color, red
  // This assumes there's just a single red car at all times
  let redVehicle = vehicles.find(vehicle => vehicle.color === 'red');

  // Determine whether the red car is in a winning position
  // This assumes the winning position is either on the right or at the bottom of the grid
  // The latter should never occur in a normal game of rush-hour, but it's possible to still win if the car is somehow rotated
  if ((redVehicle.orientation == Orientation.Horizontal && redVehicle.coordinates.x == width - redVehicle.length) ||
      (redVehicle.orientation == Orientation.Vertical   && redVehicle.coordinates.y == height - redVehicle.length)) {
    return true;
  }

  return false;
}

const GetAllGameStates = (width: number, height: number, vehicles: VehicleData[]): { move: Move, vehicles: VehicleData[] }[] => {
  // Declare a return variable
  let retval: { move: Move, vehicles: VehicleData[] }[] = [];

  // Calculate grid for current game state
  let grid = ConstructGrid(width, height, vehicles);

  // For each vehicle in the current game state ...
  vehicles.forEach((vehicle) => {
    // Get all directions the vehicle can move based on its orientation
    let directions = [];

    switch (vehicle.orientation) {
      case Orientation.Horizontal:
        directions = [Direction.Left, Direction.Right];
        break;
      case Orientation.Vertical:
        directions = [Direction.Up, Direction.Down];
        break;
    }

    // For each direction ...
    directions.forEach((direction) => {
      // Check if the new position is valid
      let newVehicle = MoveVehicle(vehicle, direction);

      if (IsValidPosition(grid, newVehicle)) {
        // Create an updated game state that includes the moved vehicle
        let newVehicles = vehicles.map((vehicle) => {
          if (vehicle.id === newVehicle.id) {
            return newVehicle;
          } else {
            return vehicle;
          }
        });

        // Add the move and updated game state to the return value
        retval.push({ move: { vehicle: vehicle, direction: direction }, vehicles: newVehicles })
      }
    });
  });

  // Finally return all possible game states that can be made from the current game state
  return retval
}

export const IsValidPosition = (grid: GridCell[][], vehicle: VehicleData): boolean => {
  let gridWidth = grid[0].length;
  let gridHeight = grid.length;

  let isValid = true;

  // Loop through vehicle coordinates
  GetVehicleCoordinates(vehicle).forEach(({ x, y }) => {
    // Check if placement is out of bounds
    if ( x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) {
      isValid = false;
      // Break out of the loop
      return;
    }

    // Check if another vehicle is already in the same spot
    if (!(grid[y][x] == null || grid[y][x] === vehicle.id)) {
      isValid = false;
      // Break out of the loop
      return;
    }
  });

  return isValid;
}

const GetVehicleCoordinates = ({ coordinates, orientation, length }: VehicleData): Coordinates[]  => {
  // Loop through a range from 0 to length
  let allCoordinates: Coordinates[] = [...Array(length).keys()].map((i) => {
    let _x = coordinates.x;
    let _y = coordinates.y;

    // Adjust the coordinates according to the orientation
    switch (orientation) {
      case Orientation.Horizontal:
        _x += i;
        break;
      case Orientation.Vertical:
        _y += i;
        break;
    }

    return { x: _x, y: _y }
  });

  return allCoordinates;
}

export const MoveVehicle = (vehicle: VehicleData, direction: Direction) => {
  // Create a temporary new vehicle
  let newVehicle: VehicleData = JSON.parse(JSON.stringify(vehicle));

  // Adjust the new vehicle's position
  switch(direction) {
    case Direction.Up:
      if (newVehicle.orientation == Orientation.Vertical) {
        newVehicle.coordinates.y -= 1;
      }
      break;
    case Direction.Down:
      if (newVehicle.orientation == Orientation.Vertical) {
        newVehicle.coordinates.y += 1;
      }
      break;
    case Direction.Left:
      if (newVehicle.orientation == Orientation.Horizontal) {
        newVehicle.coordinates.x -= 1;
      }
      break;

    case Direction.Right:
      if (newVehicle.orientation == Orientation.Horizontal) {
        newVehicle.coordinates.x += 1;
      }
      break;
  }

  return newVehicle;
}

export const ConstructGrid = (width: number, height: number, vehicles: VehicleData[]) => {
  let grid: GridCell[][] = Array(height).fill(null).map(() => Array(width).fill(null));

  // For each vehicle, reserve the squares it occupies
  vehicles.forEach((vehicle) => {
    // Check if vehicle is able to be placed
    if (!IsValidPosition(grid, vehicle)) {
      throw Error('Vehicle ' + vehicle.id + ' was not able to be placed.');
    }

    // Loop through vehicle coordinates
    GetVehicleCoordinates(vehicle).forEach(({ x, y }) => {
      // Reserve spot for current vehicle
      grid[y][x] = vehicle.id;
    });
  });

  return grid;
}
