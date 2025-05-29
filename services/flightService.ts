import { Flight } from '../data/flights';

const AVIATIONSTACK_API_KEY = process.env.EXPO_PUBLIC_AVIATIONSTACK_API_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1';

interface AviationStackFlight {
  flight: {
    number: string;
    iata: string;
    icao: string;
  };
  departure: {
    airport: string;
    iata: string;
    scheduled: string;
    terminal: string;
    gate: string;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string;
    terminal: string;
    gate: string;
  };
  airline: {
    name: string;
    iata: string;
  };
  status: string;
}

const mapAviationStackToFlight = (apiFlight: any): Flight => {
  const now = new Date();
  const departureTime = new Date(apiFlight.departure?.scheduled || '');
  const arrivalTime = new Date(apiFlight.arrival?.scheduled || '');
  
  // Calculate time to event
  const timeDiff = departureTime.getTime() - now.getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  let timeToEventMajor = '';
  let timeToEventMinor = '';
  
  if (hours > 0) {
    timeToEventMajor = `${hours}h`;
    timeToEventMinor = `${minutes} MINUTES`;
  } else {
    timeToEventMajor = `${minutes}`;
    timeToEventMinor = 'MINUTES';
  }

  // Map status
  let status: Flight['status'] = 'On Time';
  if ((apiFlight.status || '').toLowerCase().includes('delayed')) {
    status = 'Delayed';
  } else if ((apiFlight.status || '').toLowerCase().includes('landed')) {
    status = 'Landed';
  } else if ((apiFlight.status || '').toLowerCase().includes('cancelled')) {
    status = 'Canceled';
  }

  return {
    id: apiFlight.flight?.iata || apiFlight.flight?.number || Math.random().toString(),
    airline: apiFlight.airline?.name || '',
    flightNumber: apiFlight.flight?.iata || apiFlight.flight?.number || '',
    origin: {
      code: apiFlight.departure?.iata || '',
      city: apiFlight.departure?.airport || '',
      gate: apiFlight.departure?.gate || 'N/A',
      terminal: apiFlight.departure?.terminal || 'N/A',
    },
    destination: {
      code: apiFlight.arrival?.iata || '',
      city: apiFlight.arrival?.airport || '',
      gate: apiFlight.arrival?.gate || 'N/A',
      terminal: apiFlight.arrival?.terminal || 'N/A',
    },
    departureTime: apiFlight.departure?.scheduled || '',
    arrivalTime: apiFlight.arrival?.scheduled || '',
    status,
    timeToEventMajor,
    timeToEventMinor,
    airlineLogoChar: '✈️', // We'll keep the placeholder for now
  };
};

export const fetchFlights = async (): Promise<Flight[]> => {
  try {
    console.log('Fetching flights from AviationStack...');
    // 1. Fetch 5 flights
    const response = await fetch(
      `${BASE_URL}/flights?access_key=${AVIATIONSTACK_API_KEY}&limit=5`
    );
    if (!response.ok) {
      console.error('API Response not OK:', response.status, response.statusText);
      throw new Error('Failed to fetch flights');
    }
    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format');
    }
    let mappedFlights: Flight[] = data.data
      .map((item: any) => mapAviationStackToFlight(item))
      .filter((f: Flight) => f.airline && f.flightNumber && f.origin?.city && f.destination?.city);

    // 2. Check if Malaysia Airlines is present
    const hasMalaysia = mappedFlights.some(f => f.airline.toLowerCase().includes('malaysia airlines'));
    if (!hasMalaysia) {
      // 3. Make a second call for Malaysia Airlines (limit 1)
      const malaysiaRes = await fetch(
        `${BASE_URL}/flights?access_key=${AVIATIONSTACK_API_KEY}&limit=1&airline_name=Malaysia%20Airlines`
      );
      if (malaysiaRes.ok) {
        const malaysiaData = await malaysiaRes.json();
        if (malaysiaData.data && Array.isArray(malaysiaData.data) && malaysiaData.data.length > 0) {
          const malaysiaFlight = mapAviationStackToFlight(malaysiaData.data[0]);
          // Avoid duplicate by id
          if (!mappedFlights.some(f => f.id === malaysiaFlight.id)) {
            mappedFlights = [malaysiaFlight, ...mappedFlights].slice(0, 5);
          }
        }
      }
    }
    // 4. Return up to 5 flights
    return mappedFlights.slice(0, 5);
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
}; 