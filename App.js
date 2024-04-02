import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";
import Button from "./components/Button";

//zajmuje się ustaleniem daty przesuniętej o offset
function getPastDay(offset) {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - offset);
  return pastDate;
}

//formatuje date na potrzeby api https://api.currencyapi.com
function formatDate(timeStamp) {
  return (
    timeStamp.getFullYear() +
    "-" +
    timeStamp.getDate() +
    "-" +
    timeStamp.getMonth()
  );
}

//pozwolala na dostęp do danych z api (w aktualnej formie nie postawia danych pod tabele data dla chartu)
function getCurrencyRates(currency, formatedTime) {
  const apiKey = "Your Key";
  const apiUrl =
    "https://api.currencyapi.com/v3/historical?apikey=" +
    apiKey +
    "&currencies=" +
    currency +
    "&base_currency=PLN&date=" +
    formatedTime;
  fetch(apiUrl, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      return res.data.USD.value;
    });
}

export default function App() {
  const screenWidth = Dimensions.get("window").width;

  //dane dla chartu
  const data = {
    labels: [
      getPastDay(3).toDateString(),
      getPastDay(2).toDateString(),
      getPastDay(1).toDateString(),
      getPastDay(0).toDateString(),
    ],
    datasets: [
      {
        data: [0.6, 0.2, 0.24, 0.4],
      },
    ],
  };

  //staty które pozwalają na śledzienie wybranego pola, nazw i wartości oraz otwarcie dropdown pickera
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "US Dolar", value: "USD" },
    { label: "UK pound", value: "GBP" },
    { label: "Euro", value: "EUR" },
  ]);
  //struktura aplikacji
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.text}>Currency Exchange Chart</Text>
        </View>
        <View style={styles.chartContainer}>
          <LineChart
            data={data}
            width={screenWidth - 50}
            height={220}
            yAxisSuffix="PLN"
            chartConfig={{
              backgroundGradientFrom: "#1e1b4b",
              backgroundGradientTo: "#0F172A",
              color: () => `#64748b`,
              labelColor: () => `#FAFAF9`,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#f8fafc",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        <View style={styles.footerContainer}>
          <DropDownPicker
            style={styles.picker}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
          <Button label="Exchange" />
        </View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      "linear-gradient(180deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 100%)",
    alignItems: "center",
  },
  headerContainer: {
    marginTop: 50,
  },
  chartContainer: {
    marginTop: 25,
    marginBottom: 25,
  },
  footerContainer: {
    alignItems: "center",
  },

  text: {
    color: "#FAFAF9",
    fontSize: "25px",
  },
  picker: {
    marginBottom: 25,
  },
});
