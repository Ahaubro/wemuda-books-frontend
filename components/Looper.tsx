import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Review } from "../redux/services/reviewApi";
import { Book } from "../redux/services/bookApi";

interface LooperProps {
  item: Book | Review ;
  activeIndex: number;
}

const Looper: React.FC<LooperProps> = ({ item, activeIndex }) => {
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {color: activeIndex === item.id ? "red" : "black" },
        ]}
      >
        {item.title}
      </Text>
    </View>
  );
};

export default Looper;

const styles = StyleSheet.create({
  container: {
    height: "200px",
    width: "150px",
    marginHorizontal: Dimensions.get("window").width / 2 - 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3B5323",
    borderColor: "#000",
    borderWidth: 2,
    alignSelf: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
  },
});
