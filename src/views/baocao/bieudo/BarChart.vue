<template>
  <div class="chart-container">
    <div :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
var debounce = require('debounce');

const animationDuration = 4000;

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100px"
    },
    dataX: {
      type: Array
    },
    dataY: {
      type: Array
    }
  },
  watch: {
    dataX(val) {
      this.X = val;
      this.initChart();
    },
    dataY(val) {
      this.Y = val;
      this.initChart();
    }
  },
  data() {
    return {
      chart: null,
      X: [],
      Y: []
    };
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      if(this.chart){
        this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: 10,
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.X,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        dataZoom: [
          {
            type: "inside"
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1
          }
        ],
        series: [
          {
            name: "Thiết bị",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: this.Y,
            animationDuration
          }
        ]
      });
      }
      
    }
  }
};
</script>
<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(60vh - 84px);
}
</style>
