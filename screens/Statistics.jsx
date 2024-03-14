import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, DataTable, List } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const Statistics = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  // console.log("route666 = ", route?.params?.metadata);
  const [items, setItems] = React.useState([]);
  useEffect(() => {
    if (route?.params?.metadata) {
      let { markDatas } = JSON.parse(route?.params?.metadata);
      setItems(markDatas);
    }
  }, []);

  const convertToCSV = () => {
    const csvContent =
      "name,timestamp,sc\n" +
      items.map((row) => Object.values(row).join(",")).join("\n");
    console.log("csvContent = ", csvContent);
    saveCSV(csvContent);
  };

  const saveCSV = async (content) => {
    const fileUri = FileSystem.documentDirectory + "data.csv";

    try {
      await FileSystem.writeAsStringAsync(fileUri, content);
      await shareAsync(fileUri, { UTI: ".csv", mimeType: "application/text" });
      console.log("CSV file saved:", fileUri);
    } catch (error) {
      console.error("Error saving CSV file:", error);
    }
  };

  const exportPdf = async () => {
    let item1Html = "";
    items.forEach((item, index) => {
      item1Html += `
        <tr>
          <td>${item.name}</td>
          <td>${item.timestamp / 1000}</td>
        </tr>
      `;
    });
    let item2Html = "";
    items.forEach((item, index) => {
      item2Html += `
        <tr>
          <td>${item.name}</td>
          <td>${item.sc}</td>
        </tr>
      `;
    });
    let xData = items.map((v) => {
      return v.name;
    });

    let y1Data = items.map((v) => {
      return v.timestamp / 1000;
    });

    let y2Data = items.map((v) => {
      return v.sc;
    });

    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Statistics</title>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <style>
        body {
            text-align: center;
        }
        .main {
            width: 500px;
            height: 250px;
        }

        .itemBox {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            margin-bottom: 30px;
        }

        table {
            width: 350px;
            border-collapse: collapse;
        }

        th,
        td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>Statistics</h1>
    <div class="itemBox">
        <table>
            <thead>
                <tr>
                    <th>Distance(M)</th>
                    <th>Time(seconds)</th>
                </tr>
            </thead>
            <tbody>
                ${item1Html}
            </tbody>
        </table>
        <div id="main1" class="main"></div>
    </div>
    <div class="itemBox">
        <table>
            <thead>
                <tr>
                    <th>Distance(M)</th>
                    <th>Stoke Count</th>
                </tr>
            </thead>
            <tbody>
                ${item2Html}
            </tbody>
        </table>
        <div id="main2" class="main"></div>
    </div>
    <script>

        initChart('main1', ${JSON.stringify(xData)}, ${JSON.stringify(y1Data)});
        initChart('main2', ${JSON.stringify(xData)}, ${JSON.stringify(y2Data)});
        function initChart(id, xData, yData) {
          var options = {
              chart: {
                  type: 'line' 
              },
              title: {
                text: '' 
            },
              xAxis: {
                  categories: xData
              },
              yAxis: {
                title: {
                    text: '' 
                }
            },
              series: [{
                  data: yData 
              }],
              credits: {
                enabled: false 
            },
            legend: {
              enabled: false 
          },
            plotOptions: {
              series: {
                  color: 'black', 
                  marker: {
                      fillColor: 'black' 
                  }
              }
            },
          };

          // 在容器中初始化折线图
          Highcharts.chart(id, options);
        }
   
    </script>
</body>
</html>
`;

    const { uri } = await Print.printToFileAsync({ html: html });
    console.log("File has been saved to:", uri);

    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  return (
    <View style={styles.box}>
      <View
        style={{
          height: 90,
          paddingHorizontal: 50,
          paddingTop: insets.top,
          backgroundColor: "#fff",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <Image
            source={require("../assets/home-dark.png")}
            style={{
              width: 46,
              height: 41,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              exportPdf();
            }}
            style={{
              marginRight: 30,
            }}
          >
            <Image
              source={require("../assets/export.png")}
              style={{
                width: 50,
                height: 44,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              convertToCSV();
            }}
          >
            <Image
              source={require("../assets/cloud.png")}
              style={{
                width: 54,
                height: 38,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colors={["#a8edea", "#fed6e3"]}
        style={styles.gradientBg}
      >
        <ScrollView
          style={{
            paddingVertical: 50,
            width: "100%",
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Card
              style={{
                width: 800,
                marginBottom: 50,
              }}
            >
              <Card.Title title="Distance - Time" />
              <Card.Content
                style={{
                  flexDirection: "row",
                }}
              >
                <DataTable
                  style={{
                    width: 300,
                  }}
                >
                  <DataTable.Header>
                    <DataTable.Title>Distance(M)</DataTable.Title>
                    <DataTable.Title>Time(seconds)</DataTable.Title>
                  </DataTable.Header>

                  {items.map((item, index) => (
                    <DataTable.Row key={`a${index}`}>
                      <DataTable.Cell>{item.name}</DataTable.Cell>
                      <DataTable.Cell>{item.timestamp / 1000}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
                {items.length !== 0 && (
                  <LineChart
                    data={{
                      labels: items.map((v) => {
                        return v.name;
                      }),
                      datasets: [
                        {
                          data: items.map((v) => {
                            return v.timestamp / 1000;
                          }),
                        },
                      ],
                    }}
                    width={470}
                    height={220}
                    yAxisSuffix="(s)"
                    yAxisInterval={1}
                    chartConfig={{
                      backgroundColor: "red",
                      backgroundGradientFrom: "#fff",
                      backgroundGradientTo: "#fff",
                      color: (opacity = 1) => `rgba(0, 0, 0, 1)`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 6,
                      },
                      propsForDots: {
                        r: "2",
                        strokeWidth: "2",
                        stroke: "#000",
                      },
                    }}
                    style={{
                      borderRadius: 8,
                    }}
                  />
                )}
              </Card.Content>
            </Card>

            <Card
              style={{
                width: 800,
                marginBottom: 50,
              }}
            >
              <Card.Title title="Distance - Stoke Count" />
              <Card.Content
                style={{
                  flexDirection: "row",
                }}
              >
                <DataTable
                  style={{
                    width: 300,
                  }}
                >
                  <DataTable.Header>
                    <DataTable.Title>Distance(M)</DataTable.Title>
                    <DataTable.Title>Stoke Count</DataTable.Title>
                  </DataTable.Header>

                  {items.map((item, index) => (
                    <DataTable.Row key={`a${index}`}>
                      <DataTable.Cell>{item.name}</DataTable.Cell>
                      <DataTable.Cell>{item.sc}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
                {items.length !== 0 && (
                  <LineChart
                    data={{
                      labels: items.map((v) => {
                        return v.name;
                      }),
                      datasets: [
                        {
                          data: items.map((v) => {
                            return v.sc;
                          }),
                        },
                      ],
                    }}
                    width={470}
                    height={220}
                    yAxisInterval={1}
                    chartConfig={{
                      backgroundColor: "red",
                      backgroundGradientFrom: "#fff",
                      backgroundGradientTo: "#fff",
                      color: (opacity = 1) => `rgba(0, 0, 0, 1)`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 6,
                      },
                      propsForDots: {
                        r: "2",
                        strokeWidth: "2",
                        stroke: "#000",
                      },
                    }}
                    style={{
                      borderRadius: 8,
                    }}
                  />
                )}
              </Card.Content>
            </Card>
          </View>
          <View
            style={{
              height: 100,
            }}
          ></View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientBg: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 80,
    marginBottom: 100,
  },
  itemBox: {
    flexDirection: "row",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: 40,
  },
});

export default Statistics;
