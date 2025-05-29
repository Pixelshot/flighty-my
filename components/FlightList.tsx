import React from 'react';
import { FlatList } from 'react-native';
import { Flight } from '../data/flights';
import FlightItem from './FlightItem'; // Import the standalone FlightItem

type FlightListProps = {
  searchQuery: string;
  flights: Flight[];
};

const FlightList: React.FC<FlightListProps> = ({ searchQuery, flights }) => {
  const filteredFlights = flights.filter(flight => {
    const q = searchQuery.toLowerCase();
    return (
      (flight.airline && flight.airline.toLowerCase().includes(q)) ||
      (flight.flightNumber && flight.flightNumber.toLowerCase().includes(q)) ||
      (flight.origin?.city && flight.origin.city.toLowerCase().includes(q)) ||
      (flight.destination?.city && flight.destination.city.toLowerCase().includes(q))
    );
  });

  return (
    <FlatList
      data={filteredFlights}
      renderItem={({ item }) => <FlightItem item={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 100 }}
      extraData={searchQuery}
    />
  );
};

export default FlightList; 