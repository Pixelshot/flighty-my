export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: {
    code: string;
    city: string;
    gate: string;
    terminal: string;
    latitude?: number;
    longitude?: number;
  };
  destination: {
    code: string;
    city: string;
    gate: string;
    terminal: string;
    latitude?: number;
    longitude?: number;
  };
  departureTime: string; // ISO 8601 format e.g. "2024-08-15T10:47:00Z"
  arrivalTime: string;   // ISO 8601 format e.g. "2024-08-15T19:31:00Z"
  status: 'On Time' | 'Delayed' | 'Departed' | 'Landed' | 'Canceled' | 'Gate Changed' | 'Departs On Time';
  aircraftType?: string;
  duration?: string; 
  notes?: string[];
  timeToEventMajor: string; // e.g., "1h", "15"
  timeToEventMinor: string; // e.g., "7 MINUTES", "HOURS"
  airlineLogoChar: string; // Placeholder for logo, e.g., "✈️"
}

export const dummyFlights: Flight[] = [
  {
    id: '1',
    airline: 'American Airlines', // Matched from original screenshot, using AA for example
    flightNumber: 'AA 16',
    origin: {
      code: 'SFO',
      city: 'San Francisco',
      gate: 'C3',
      terminal: 'International',
    },
    destination: {
      code: 'JFK',
      city: 'New York',
      gate: 'B22',
      terminal: '4',
    },
    departureTime: '2024-08-15T10:47:00Z',
    arrivalTime: '2024-08-15T19:31:00Z',
    status: 'Departs On Time',
    timeToEventMajor: '1h',
    timeToEventMinor: '7 MINUTES',
    airlineLogoChar: '✈️', // Generic plane icon
    duration: '5h 44m',
  },
  {
    id: '2',
    airline: 'Delta',
    flightNumber: 'DL 668',
    origin: {
      code: 'SFO',
      city: 'San Francisco',
      gate: 'D10',
      terminal: '2',
    },
    destination: {
      code: 'JFK',
      city: 'New York',
      gate: 'C61',
      terminal: '4',
    },
    departureTime: '2024-08-15T19:30:00Z',
    arrivalTime: '2024-08-16T04:11:00Z',
    status: 'Delayed',
    timeToEventMajor: '1h',
    timeToEventMinor: '50 minutes',
    airlineLogoChar: '✈️', // Generic airplane, was 🔺
    duration: '5h 41m',
    notes: ['Previously on time'],
  },
  {
    id: '3',
    airline: 'United',
    flightNumber: 'UA 512',
    origin: {
      code: 'SFO',
      city: 'San Francisco',
      gate: 'F5',
      terminal: '3',
    },
    destination: {
      code: 'IAH',
      city: 'Houston',
      gate: 'E2',
      terminal: 'C',
    },
    departureTime: '2024-08-16T00:45:00Z', // Next day
    arrivalTime: '2024-08-16T06:41:00Z',
    status: 'Departs On Time',
    timeToEventMajor: '15',
    timeToEventMinor: 'HOURS',
    airlineLogoChar: '🌐', // United-like placeholder
    duration: '3h 56m',
  },
  // Adding a couple more to show variety, mimicking original screenshot details if possible
  {
    id: '4',
    airline: 'Alaska Airlines',
    flightNumber: 'AS 303',
    origin: {
      code: 'SEA',
      city: 'Seattle',
      gate: 'N10',
      terminal: 'North Satellite',
    },
    destination: {
      code: 'LAX',
      city: 'Los Angeles',
      gate: '65A',
      terminal: '6',
    },
    departureTime: '2024-08-15T14:15:00Z',
    arrivalTime: '2024-08-15T17:00:00Z',
    status: 'On Time',
    timeToEventMajor: '4h',
    timeToEventMinor: '22 MINUTES',
    airlineLogoChar: '🐻', // Alaska-like placeholder
    duration: '2h 45m',
  },
    {
    id: '5',
    airline: 'Southwest',
    flightNumber: 'WN 230',
    origin: {
      code: 'DAL',
      city: 'Dallas',
      gate: '10',
      terminal: 'Main',
    },
    destination: {
      code: 'ATL',
      city: 'Atlanta',
      gate: 'C21',
      terminal: 'North',
    },
    departureTime: '2024-08-15T09:05:00Z',
    arrivalTime: '2024-08-15T12:00:00Z',
    status: 'Landed',
    timeToEventMajor: 'Landed',
    timeToEventMinor: '9:05 AM',
    airlineLogoChar: '❤️', // Southwest-like placeholder
    duration: '1h 55m',
  }
]; 