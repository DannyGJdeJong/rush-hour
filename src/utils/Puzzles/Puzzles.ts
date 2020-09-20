// Import utils
import { ConstructGrid, IsValidPosition, SolveBoard } from '../GameLogic';
import { Orientation, VehicleData, Coordinates } from "../Types";

export type Puzzle = {
  name: string
  width: number
  height: number
  vehicles: VehicleData[]
}

export const HardCodedPuzzles: Puzzle[] = [
  {
    name: '1. (Beginner)',
    width: 6,
    height: 6,
    vehicles: [
      { id: '0,0', coordinates: { x: 0, y: 0 }, orientation: Orientation.Horizontal, length: 2, color: 'green'  },
      { id: '0,1', coordinates: { x: 0, y: 1 }, orientation: Orientation.Vertical  , length: 3, color: 'purple' },
      { id: '0,4', coordinates: { x: 0, y: 4 }, orientation: Orientation.Vertical  , length: 2, color: 'orange' },
      { id: '1,2', coordinates: { x: 1, y: 2 }, orientation: Orientation.Horizontal, length: 2, color: 'red'    },
      { id: '5,0', coordinates: { x: 5, y: 0 }, orientation: Orientation.Vertical  , length: 3, color: 'yellow' },
      { id: '4,4', coordinates: { x: 4, y: 4 }, orientation: Orientation.Horizontal, length: 2, color: 'teal'   },
      { id: '2,5', coordinates: { x: 2, y: 5 }, orientation: Orientation.Horizontal, length: 3, color: 'lime'   },
      { id: '3,1', coordinates: { x: 3, y: 1 }, orientation: Orientation.Vertical  , length: 3, color: 'blue'   }
    ]
  },
  {
    name: '15. (Intermediate)',
    width: 6,
    height: 6,
    vehicles: [
      { id: '1,0', coordinates: { x: 1, y: 0 }, orientation: Orientation.Horizontal, length: 2, color: 'green'  },
      { id: '3,0', coordinates: { x: 3, y: 0 }, orientation: Orientation.Horizontal, length: 2, color: 'orange' },
      { id: '0,1', coordinates: { x: 0, y: 1 }, orientation: Orientation.Horizontal, length: 2, color: 'teal'   },
      { id: '2,1', coordinates: { x: 2, y: 1 }, orientation: Orientation.Horizontal, length: 2, color: 'pink'   },
      { id: '4,1', coordinates: { x: 4, y: 1 }, orientation: Orientation.Vertical  , length: 3, color: 'yellow' },
      { id: '5,1', coordinates: { x: 5, y: 1 }, orientation: Orientation.Vertical  , length: 3, color: 'purple' },
      { id: '0,2', coordinates: { x: 0, y: 2 }, orientation: Orientation.Vertical  , length: 3, color: 'blue'   },
      { id: '1,2', coordinates: { x: 1, y: 2 }, orientation: Orientation.Vertical  , length: 3, color: 'lime'   },
      { id: '2,2', coordinates: { x: 2, y: 2 }, orientation: Orientation.Horizontal, length: 2, color: 'red'    },
      { id: '2,3', coordinates: { x: 2, y: 3 }, orientation: Orientation.Vertical  , length: 2, color: 'navy'   },
      { id: '3,3', coordinates: { x: 3, y: 3 }, orientation: Orientation.Vertical  , length: 2, color: 'olive'  },
      { id: '4,4', coordinates: { x: 4, y: 4 }, orientation: Orientation.Horizontal, length: 2, color: 'grey'   },
      { id: '1,5', coordinates: { x: 1, y: 5 }, orientation: Orientation.Horizontal, length: 2, color: 'brown'  },
      { id: '3,5', coordinates: { x: 3, y: 5 }, orientation: Orientation.Horizontal, length: 2, color: 'maroon' }
    ]
  },
  {
    name: '40. (Expert)',
    width: 6,
    height: 6,
    vehicles: [
      { id: '2,0', coordinates: { x: 2, y: 0 }, orientation: Orientation.Vertical  , length: 2, color: 'pink'   },
      { id: '3,0', coordinates: { x: 3, y: 0 }, orientation: Orientation.Horizontal, length: 2, color: 'teal'   },
      { id: '5,0', coordinates: { x: 5, y: 0 }, orientation: Orientation.Vertical  , length: 3, color: 'purple' },
      { id: '4,1', coordinates: { x: 4, y: 1 }, orientation: Orientation.Vertical  , length: 2, color: 'orange' },
      { id: '1,2', coordinates: { x: 1, y: 2 }, orientation: Orientation.Horizontal, length: 2, color: 'red'    },
      { id: '0,3', coordinates: { x: 0, y: 3 }, orientation: Orientation.Vertical  , length: 3, color: 'yellow' },
      { id: '1,3', coordinates: { x: 1, y: 3 }, orientation: Orientation.Vertical  , length: 2, color: 'blue'   },
      { id: '2,3', coordinates: { x: 2, y: 3 }, orientation: Orientation.Vertical  , length: 2, color: 'green'  },
      { id: '3,3', coordinates: { x: 3, y: 3 }, orientation: Orientation.Horizontal, length: 3, color: 'navy'   },
      { id: '3,4', coordinates: { x: 3, y: 4 }, orientation: Orientation.Vertical  , length: 2, color: 'silver' },
      { id: '4,4', coordinates: { x: 4, y: 4 }, orientation: Orientation.Horizontal, length: 2, color: 'aqua'   },
      { id: '1,5', coordinates: { x: 1, y: 5 }, orientation: Orientation.Horizontal, length: 2, color: 'brown'  },
      { id: '4,5', coordinates: { x: 4, y: 5 }, orientation: Orientation.Horizontal, length: 2, color: 'maroon' }
    ]
  }
];

const availableColors = ['silver', 'gray', 'maroon', 'yellow', 'olive', 'lime', 'green', 'aqua', 'teal', 'blue', 'navy', 'fuchsia', 'purple', 'azure', 'coral', 'cyan', 'deeppink', 'hotpink', 'khaki', 'ivory', 'orchid', 'peachpuff', 'wheat', 'tan'];

// Very experimental puzzle generator
// Apparently generating puzzles is quite hard
export const GeneratePuzzle = (width: number, height: number, minMoveCount: number, tries: number, carLength: number, carCount: number, truckLength: number, truckCount: number) => {
  // Keep a list of all placed vehicles
  let vehicles: VehicleData[] = [];

  // Keep track of how many times we've tried to generate a puzzle
  let tryCount = 0;

  do {
    // Reset the list of placed vehicles
    vehicles = [];

    // Get the vehicle count
    let vehicleCount = carCount + truckCount;

    // Decide where the red car will be placed
    // Red car always goes in the center or one above the center row
    let red_y = Math.ceil(height / 2) - 1;
    // Red car goes in one of the first three columns
    let red_x = Math.floor(Math.random() * 3);
    vehicles.push({ id: red_x + ',' + red_y, coordinates: { x: red_x, y: red_y }, orientation: Orientation.Horizontal, length: carLength, color: 'red' });

    let colors = [...availableColors];

    // Set adjustable truck count
    let truckCountThisRound = truckCount;

    // Now add vehicleCount vehicles to the grid
    Array(vehicleCount).fill(0).forEach(() => {
      // Set vehicle length to a default of carLength
      let vehicleLength = carLength;

      // First generate trucks, if all trucks are generated the vehicle length will stay 2
      if (truckCountThisRound > 0) {
        truckCountThisRound--;
        vehicleLength = truckLength;
      }

      // Get a random vehicle orientation
      let vehicleOrientation: Orientation = Math.floor(Math.random() * 2);// Object.keys(Orientation).length);

      // Get a random vehicle color and make sure the color can't be picked again
      let colorIndex = Math.floor(Math.random() * colors.length)
      let vehicleColor: string = colors[colorIndex];
      colors.splice(colorIndex, 1);

      let grid = ConstructGrid(width, height, vehicles);

      let possibleCoordinates: Coordinates[] = [];

      grid.forEach((row, y) => {
        // Make sure the red vehicle is the only horizontal vehicle in its row
        if (vehicleOrientation == Orientation.Horizontal && y == red_y) { return; }

        row.forEach((_, x) => {
          if (IsValidPosition(grid, { id: width + ',' + height, coordinates: { x: x, y: y }, orientation: vehicleOrientation, length: vehicleLength, color: vehicleColor })) {
            possibleCoordinates.push({ x: x, y: y });
          }
        });
      });

      // If no possible coordinates were found, skip this vehicle
      if (possibleCoordinates.length == 0) {
        return;
      }

      // Add vehicle to vehicles list with one of the possible coordinates
      let { x, y } = possibleCoordinates[Math.floor(Math.random() * possibleCoordinates.length)];
      vehicles.push({ id: x + ',' + y, coordinates: { x: x, y: y }, orientation: vehicleOrientation, length: vehicleLength, color: vehicleColor });
    });

    tryCount++;
    console.log(tryCount);
  } while (SolveBoard(width, height, vehicles).length < minMoveCount && tryCount <= tries)

  return vehicles;
}
