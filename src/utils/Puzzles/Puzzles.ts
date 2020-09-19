import { Orientation, VehicleData } from "../Types";

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
      { id: '2,5', coordinates: { x: 2, y: 5 }, orientation: Orientation.Horizontal, length: 3, color: 'green'  },
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
      { id: '1,2', coordinates: { x: 1, y: 2 }, orientation: Orientation.Vertical  , length: 3, color: 'green'  },
      { id: '2,2', coordinates: { x: 2, y: 2 }, orientation: Orientation.Horizontal, length: 2, color: 'red'    },
      { id: '2,3', coordinates: { x: 2, y: 3 }, orientation: Orientation.Vertical  , length: 2, color: 'blue'   },
      { id: '3,3', coordinates: { x: 3, y: 3 }, orientation: Orientation.Vertical  , length: 2, color: 'green'  },
      { id: '4,4', coordinates: { x: 4, y: 4 }, orientation: Orientation.Horizontal, length: 2, color: 'grey'   },
      { id: '1,5', coordinates: { x: 1, y: 5 }, orientation: Orientation.Horizontal, length: 2, color: 'brown'  },
      { id: '3,5', coordinates: { x: 3, y: 5 }, orientation: Orientation.Horizontal, length: 2, color: 'yellow' }
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
      { id: '3,3', coordinates: { x: 3, y: 3 }, orientation: Orientation.Horizontal, length: 3, color: 'blue'   },
      { id: '3,4', coordinates: { x: 3, y: 4 }, orientation: Orientation.Vertical  , length: 2, color: 'purple' },
      { id: '4,4', coordinates: { x: 4, y: 4 }, orientation: Orientation.Horizontal, length: 2, color: 'black'  },
      { id: '1,5', coordinates: { x: 1, y: 5 }, orientation: Orientation.Horizontal, length: 2, color: 'brown'  },
      { id: '4,5', coordinates: { x: 4, y: 5 }, orientation: Orientation.Horizontal, length: 2, color: 'yellow' }
    ]
  }
];
