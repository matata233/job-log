export const chartSpec = {
  type: "pie",
  outerRadius: 0.8,
  innerRadius: 0.5,
  padAngle: 0.6,
  valueField: "value",
  categoryField: "type",
  pie: {
    style: {
      cornerRadius: 10,
    },
    state: {
      hover: {
        outerRadius: 0.85,
        stroke: "#000",
        lineWidth: 1,
      },
      selected: {
        outerRadius: 0.85,
        stroke: "#000",
        lineWidth: 1,
      },
    },
  },
  legends: {
    visible: true,
    orient: "left",
  },
  label: {
    visible: true,
  },
  tooltip: {
    mark: {
      content: [
        {
          key: (datum) => datum["type"],
          value: (datum) => datum["value"],
        },
      ],
    },
  },
};

export const lineChartSpec = {
  type: "line",
  stack: true,
  xField: "type",
  yField: "value",
  seriesField: "country",
  lineLabel: { visible: true },
  legends: [{ visible: true, position: "middle", orient: "bottom" }],
};

export const wordCloudSpec = {
  type: "wordCloud",
  nameField: "challenge_name",
  valueField: "sum_count",
  seriesField: "challenge_name",
};

export const barChartSpec = {
  type: "bar",
  xField: "title",
  yField: "count",
};
