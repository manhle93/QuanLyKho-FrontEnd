<template>
  <div class="chart-container">
    <div :class="className" />
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
var debounce = require("debounce");

const animationDuration = 6000;

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    dataChart: {
      type: Array
    }
  },
  watch: {
    dataChart(val) {
      this.data = val;
      this.initChart();
    }
  },
  data() {
    return {
      chart: null,
      data: []
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

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ( phương tiện ) Chiếm {d}%"
        },
        legend: {
          orient: "vertical",
          left: "left"
          // data: ["Thiết bị SFUL 02", "Thiết bị SFUL 01", "Thiết bị SFUL 03"]
        },
        series: [
          {
            name: "Trạng thái hoạt động của phương tiện PCCC",
            data: this.data,
            type: "pie",
            radius: '90%',
          }
        ]
      });
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
