/*export interface ApexOptions {
  chart?: {
    type?:
      | "donut"
      | "area"
      | "candlestick"
      | "line"
      | "bar"
      | "pie"
      | "donut"
      | "radialBar"
      | "scatter"
      | "bubble"
      | "heatmap"
      | "treemap"
      | "boxPlot"
      | "radar"
      | "polarArea"
      | "rangeBar"
      | "rangeArea";
    height?: number;
    zoom?: {
      enabled: boolean;
    };
  };

  colors?: string[];

  responsive?: [
    {
      breakpoint?: number;
      options: {
        chart: {
          width: number;
        };
        legend: {
          position: string;
        };
      };
    }
  ];

  dataLabels?: {
    enabled: boolean;
  };
  stroke?: {
    curve: "straight";
  };
  title?: {
    text: string;
    align: "left";
  };
  subtitle?: {
    text: string;
    align: "left";
  };
  labels?: string[];
  xaxis?: {
    type: "datetime";
  };
  yaxis?: {
    opposite: boolean;
  };
  legend?: {
    horizontalAlign?: string;
    show?: boolean;
  };
} */

export interface ApexOptions {
  chart: {
    type:
      | "donut"
      | "pie"
      | "line"
      | "area"
      | "bar"
      | "radialBar"
      | "scatter"
      | "bubble"
      | "heatmap"
      | "candlestick"
      | "boxPlot"
      | "radar"
      | "polarArea"
      | "rangeBar"
      | "rangeArea"
      | "treemap"
      | undefined;
  };

  title: {
    text: string;
    align: string;
  };

  labels: string[];
  colors: string[];
  responsive: [
    {
      breakpoint: number;
      options: {
        chart: {
          width: number;
        };
        legend: {
          position: string;
        };
      };
    }
  ];
  legend: {
    show: boolean;
  };
}
