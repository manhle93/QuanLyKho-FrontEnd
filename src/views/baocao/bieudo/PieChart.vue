<template>
  <div class="chart-container">
    <div :class="className" />
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
var debounce = require("debounce");

const animationDuration = 5000;

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
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["Kết thúc xử lý", "Cảnh báo sai", "Đang xử lý", "Đang cháy"]
        },
        series: [
          {
            name: "Số điểm cháy",
            type: "pie",
            radius: "55%",
            data: this.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
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
