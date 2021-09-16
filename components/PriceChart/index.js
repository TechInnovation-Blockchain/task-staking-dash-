import { useMemo } from "react";
import { chartOptions, parseOptions } from "../../variables/charts.js";
import { Line } from "react-chartjs-2";
import {
  getFormattedDate,
  getFormattedNumber,
} from "../../utils/formatters.js";
import { toFraction } from "../../utils/balance.js";

const lineChartOptions = (activeCurrency) => {
  return {
    width: 100,
    hover: {
      intersect: false,
    },
    scales: {
      xAxes: [
        {
          ticks: {
            callback: function (label, index, labels) {
              return "";
            },
            maxTicksLimit: 100,
            maxRotation: 0,
            minRotation: 0,
          },
        },
      ],
      yAxes: [
        {
          position: "right",
          ticks: {
            display: true,
            beginAtZero: true,
            maxTicksLimit: 6,
          },
          gridLines: {
            display: false,
            drawBorder: false,
            //   color: "rgba(47, 54, 65, 0.24)",
            //   dashOffset: 10,
            //   tickBorderDash: 100,
          },
        },
      ],
    },
    tooltips: {
      // custom: function (tooltip) {
      //   if (!tooltip) return;
      //   // disable displaying the color box;
      //   tooltip.displayColors = false;
      // },

      custom: function (tooltip) {
        tooltip.titleFontColor = "#888A8F";
        tooltip.titleFontSize = 10;
        tooltip.labelFontSize = 14;
      },
      callbacks: {
        label: function (item) {
          return getFormattedNumber(item.yLabel, activeCurrency);
        },
        title: function (item) {
          return getFormattedDate(item[0].label);
        },

        labelTextColor: function () {
          return "#fff";
        },
        titleTextColor: function () {
          return "#888A8F";
        },
      },
      backgroundColor: "#2F3641",
      displayColors: false,
      titleColor: "#0f0",
      bodyColor: "#f00",
    },
  };
};

let width, height, gradient;

function getGradient(ctx, chartArea) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (gradient === null || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(1, "rgba(0, 204, 106, 0.4)");
    gradient.addColorStop(0, "rgba(26, 32, 41, 0)");
  }

  return gradient;
}

const PriceChart = ({ snapshots, activeCurrency, tokenPrice }) => {
  if (typeof window !== "undefined" && window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const lineChartData = useMemo(
    (canvas) => {
      //   const ctx = canvas.getContext("2d"),
      //     gradient = ctx.createLinearGradient(0, 0, 0, 400);

      //   gradient.addColorStop(0, "rgba(0, 0,255, 0.5)");
      //   gradient.addColorStop(0.5, "rgba(0, 0, 255, 0.25)");
      //   gradient.addColorStop(1, "rgba(0, 0, 255, 0)");

      const labels = [],
        data = [];

      const length = snapshots.length;

      for (let i = 0; i < length; i++) {
        const date = new Date(snapshots[i].date * 1000);
        labels.push(date);

        data.push(
          toFraction(
            1 === activeCurrency
              ? snapshots[i].totalStakingVolume * tokenPrice
              : snapshots[i].totalStakingVolume
          )
        );
      }

      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;

              if (!chartArea) {
                // This case happens on initial chart load
                return null;
              }
              return getGradient(ctx, chartArea);
            },
            borderWidth: 2,
            // pointRadius: 0,
            // pointHoverRadius: 5,
            // pointHoverBackgroundColor: "#fff",
            // pointHoverBorderColor: "rgba(23,43,77,0.5)",
            // pointHoverBorderWidth: 2,
            // pointBorderColor: "rgba(75,192,192,1)",
            // pointBackgroundColor: "#fff",
            // pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#1AD3B2",
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 3,
            pointRadius: 0,
            pointHitRadius: 10,
            lineTension: 0,
            fill: "start",
            borderColor: "#1AD37A",
          },
        ],
      };
    },
    [snapshots, activeCurrency]
  );

  return (
    <Line
      data={lineChartData}
      options={lineChartOptions(activeCurrency)}
      className="chart-canvas"
    />
  );
};

export default PriceChart;
