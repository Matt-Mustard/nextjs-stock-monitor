import * as d3 from "d3";
import { index } from "d3";
import { useState, useEffect, useRef } from "react";


const App = () => {
  const [ticker, setTicker] = useState("");
  const [stockData, setStockData] = useState({});
  const svgRef = useRef();

  useEffect(() => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${process.env.AV_API_KEY}`;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        const datapoints = Object.values(json)[1];
        datapoints = Object.values(json)[1];
        var timeseries = Object.keys(datapoints);
        var data_objects = Object.values(datapoints);

        const new_timeseries = timeseries.map(date => new Date(date))

        const stockDataArr = []

        for (var i = 0; i < new_timeseries.length; i++) {
          stockDataArr.push({
            time: new_timeseries[i],
            open: Number(data_objects[i]["1. open"]),
            high: Number(data_objects[0]["2. high"]),
            low: Number(data_objects[0]["3. low"]),
            close: Number(data_objects[0]["4. close"]),
            volume: Number(data_objects[0]["5. volume"])
          })
        }

        setStockData(stockDataArr);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [ticker]);

  useEffect(() => {
    if (stockData != null) {
      const svg = d3.select(svgRef.current);
      const data = stockData;
      console.log(stockData)
      // console.log(d3.extent(data, (d) => d.time));
      // const x = d3
      //   .scaleUtc()
      //   .domain(d3.extent(data, d => d.time))
      //   .range([margin.left, width - margin.right]);
      // const y = d3
      //   .scaleLinear()
      //   .domain([0, d3.max(data, d => d.open)])
      //   .range([height - margin.bottom, margin.top]);
      // const generateLine = d3
      //   .line()
      //   .x((d) => x(d.time))
      //   .y((d) => y(d.open));

      // svg
      //   .selectAll("path")
      //   .data([data])
      //   .join("path")
      //   .attr("d", generateLine(d));
    }
  }, [stockData]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <p>
        <input
          type="text"
          value={ticker}
          placeholder="Enter a stock ticker"
          onChange={(event) => setTicker(event.target.value)}
        />
      </p>
      <p>
        <strong>{ticker}</strong>
      </p>
    </div>
  );
};

export default App;
