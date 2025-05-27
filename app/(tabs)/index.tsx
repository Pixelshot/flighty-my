import { View } from "react-native";
import FlightList from "../../components/FlightList";
import ListHeader from "../../components/ListHeader";

export default function Index() {
  return (
    <View className="flex-1 pt-12 bg-gray-100">
      <ListHeader />
      <FlightList />
    </View>
  );
}