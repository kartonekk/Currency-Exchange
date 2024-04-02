import { StyleSheet, View, Pressable, Text } from "react-native";

export default function Button({ label }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        onPress={() => console.log("kliknięto przycisk")}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#000",
    fontSize: 16,
  },
});
