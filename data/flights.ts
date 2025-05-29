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
    airline: 'Malaysia Airlines',
    flightNumber: 'MH 132',
    origin: {
      code: 'KUL',
      city: 'Kuala Lumpur',
      gate: 'C1',
      terminal: 'M',
      latitude: 2.75,
      longitude: 101.75,
    },
    destination: {
      code: 'SYD',
      city: 'Sydney',
      gate: 'E8',
      terminal: '1',
      latitude: -33.86,
      longitude: 151.21,
    },
    departureTime: '2024-08-15T10:00:00Z',
    arrivalTime: '2024-08-15T20:00:00Z',
    status: 'On Time',
    timeToEventMajor: '2h',
    timeToEventMinor: '15 MINUTES',
    airlineLogoChar: '✈️',
    duration: '8h 0m',
  },
  {
    id: '2',
    airline: 'AirAsia',
    flightNumber: 'AK 703',
    origin: {
      code: 'KUL',
      city: 'Kuala Lumpur',
      gate: 'L3',
      terminal: '2',
      latitude: 2.75,
      longitude: 101.75,
    },
    destination: {
      code: 'BKK',
      city: 'Bangkok',
      gate: 'F5',
      terminal: 'International',
      latitude: 13.68,
      longitude: 100.75,
    },
    departureTime: '2024-08-15T13:30:00Z',
    arrivalTime: '2024-08-15T15:00:00Z',
    status: 'Delayed',
    timeToEventMajor: '1h',
    timeToEventMinor: '30 MINUTES',
    airlineLogoChar: '✈️',
    duration: '2h 30m',
  },
  {
    id: '3',
    airline: 'Singapore Airlines',
    flightNumber: 'SQ 12',
    origin: {
      code: 'SIN',
      city: 'Singapore',
      gate: 'A10',
      terminal: '3',
      latitude: 1.36,
      longitude: 103.99,
    },
    destination: {
      code: 'LAX',
      city: 'Los Angeles',
      gate: 'B24',
      terminal: 'B',
      latitude: 33.94,
      longitude: -118.40,
    },
    departureTime: '2024-08-15T16:00:00Z',
    arrivalTime: '2024-08-15T23:00:00Z',
    status: 'On Time',
    timeToEventMajor: '5h',
    timeToEventMinor: '0 MINUTES',
    airlineLogoChar: '✈️',
    duration: '15h 0m',
  },
  {
    id: '4',
    airline: 'Emirates',
    flightNumber: 'EK 202',
    origin: {
      code: 'DXB',
      city: 'Dubai',
      gate: 'F7',
      terminal: '3',
      latitude: 25.25,
      longitude: 55.36,
    },
    destination: {
      code: 'JFK',
      city: 'New York',
      gate: 'A6',
      terminal: '4',
      latitude: 40.64,
      longitude: -73.78,
    },
    departureTime: '2024-08-15T08:00:00Z',
    arrivalTime: '2024-08-15T16:00:00Z',
    status: 'Landed',
    timeToEventMajor: 'Landed',
    timeToEventMinor: '8:00 AM',
    airlineLogoChar: '✈️',
    duration: '14h 0m',
  },
  {
    id: '5',
    airline: 'Batik Air',
    flightNumber: 'ID 7153',
    origin: {
      code: 'CGK',
      city: 'Jakarta',
      gate: 'D2',
      terminal: '1',
      latitude: -6.13,
      longitude: 106.68,
    },
    destination: {
      code: 'KUL',
      city: 'Kuala Lumpur',
      gate: 'C5',
      terminal: 'M',
      latitude: 2.75,
      longitude: 101.75,
    },
    departureTime: '2024-08-15T11:00:00Z',
    arrivalTime: '2024-08-15T14:00:00Z',
    status: 'On Time',
    timeToEventMajor: '3h',
    timeToEventMinor: '10 MINUTES',
    airlineLogoChar: '✈️',
    duration: '2h 0m',
  },
]; 