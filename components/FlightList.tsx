import React from 'react';
import { FlatList } from 'react-native';
import { dummyFlights } from '../data/flights';
import FlightItem from './FlightItem'; // Import the standalone FlightItem

const FlightList: React.FC = () => {
  return (
    <FlatList
      data={dummyFlights}
      renderItem={({ item }) => <FlightItem item={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
};

export default FlightList; 