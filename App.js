import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";
import currencyapi from "@everapi/currencyapi-js";

//Function to get the date of the past day based on the given offset
function getPastDay(offset) {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - offset);
  return pastDate;
}

//Function to format a given timestamp into a string in 'YYYY-MM-DD' format
function formatDate(timeStamp) {
  const year = timeStamp.getFullYear();
  const month = (timeStamp.getMonth() + 1).toString().padStart(2, "0");
  const day = timeStamp.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

//Function to fetch currency rates for a specific currency and date
async function getCurrencyRates(currency, formatedTime) {
  try {
    const client = new currencyapi(
      "cur_live_CsRYtsNNoc4Al4ig6pvjo3FBhrPYXz8C1BUjEclm"
    );
    const response = await client.historical({
      base_currency: "PLN",
      date: formatedTime,
    });
    console.log("API Response:", response);
    if (response && response.data && response.data[currency]) {
      return response.data[currency].value;
    } else {
      console.error("Invalid API response:", response);
      return null;
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Validation error:", error.response.data.message);
      console.error("Error details:", error.response.data.errors);
    } else {
      console.error("Error fetching currency rates:", error);
    }
    return null;
  }
}

//Main component for the application
export default function App() {
  const screenWidth = Dimensions.get("window").width;

  const [exchangeRates, setExchangeRates] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  useEffect(() => {
    async function fetchData() {
      const rates = [];
      for (let i = 4; i > 0; i--) {
        const date = formatDate(getPastDay(i));
        const rate = await getCurrencyRates(selectedCurrency, date);
        rates.push(rate);
      }
      setExchangeRates(rates);
    }
    fetchData();
  }, [selectedCurrency]);

  const data = {
    labels: [
      getPastDay(4).toDateString(),
      getPastDay(3).toDateString(),
      getPastDay(2).toDateString(),
      getPastDay(1).toDateString(),
    ],
    datasets: [
      {
        data: exchangeRates,
      },
    ],
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "US Dollar", value: "USD" },
    { label: "UK Pound", value: "GBP" },
    { label: "Euro", value: "EUR" },
  ]);

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
            setValue={(currency) => {
              setValue(currency);
              setSelectedCurrency(currency);
            }}
            setItems={setItems}
          />
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
    fontSize: 25,
  },
  picker: {
    marginBottom: 25,
  },
});
