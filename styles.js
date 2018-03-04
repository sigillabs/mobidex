import { StyleSheet } from "react-native";

const colors = {
  primary: "#2089dc",
  secondary: "#8F0CE8",
  grey0: "#393e42",
  grey1: "#43484d",
  grey2: "#5e6977",
  grey3: "#86939e",
  grey4: "#bdc6cf",
  grey5: "#e1e8ee",
  greyOutline: "#bbb",
  searchBg: "#303337",
  error: "#ff190c",
};

const styles = {
  tinyheader: {
    textAlign: "center",
    color: "gray",
    flex: 1,
    fontSize: 10
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
};

export default styles;
export { colors };