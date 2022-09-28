import { Dimensions, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Book } from "../redux/services/bookApi";

interface LooperProps {
  item: Book;
  activeIndex: number;
  index: number;
}

const Looper: React.FC<LooperProps> = ({ item, activeIndex, index }) => {
  return (
    <View style={styles.container}>
      <Text style={[ styles.title, { color: activeIndex === index ? "red" : "black" },]}>

      </Text>

      <Image
        source={{ uri: item.thumbnail }}
        style={[
          styles.img, 
          { opacity: activeIndex === index ? 1 : 0.5 },
          { borderColor: activeIndex === index ? '#ccc' : undefined },
          { borderBottomWidth: activeIndex === index ? 2 : undefined },
          
        ]}
      />
    </View>
  );
};

export default Looper;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: Dimensions.get("window").width / 2 - 75,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
  },
  img:{
    width: 200, 
    height: 280, 
    borderRadius: 5
  }
});
