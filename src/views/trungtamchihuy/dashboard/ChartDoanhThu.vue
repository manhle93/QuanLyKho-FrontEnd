<template>
  <div class="chart-container">
    <div :class="className" :style="{ height: height, width: width }" />
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
var debounce = require("debounce");
const animationDuration = 6000;
import { getDoanhThu } from "@/api/bieudo";

export default {
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100px",
    },
    dataX: {
      type: Array,
    },
    dataY: {
      type: Array,
    },
  },
  watch: {
    dataX(val) {
      this.X = val;
      this.initChart();
    },
    dataY(val) {
      this.Y = val;
      this.initChart();
    },
  },
  data() {
    return {
      chart: null,
      data: [],
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
    render() {
      this.chart.resize();
    },
    async initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      let res = await getDoanhThu();
      this.data = res;
      if (this.chart) {
        this.chart.setOption({
          color: ["#3398DB"],
          tooltip: {
            trigger: "axis",
            formatter: "{a} <br/>{b} : {c} ( đồng )",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "Doanh thu",
              type: "bar",
              barWidth: "60%",
              data: this.data,
            },
          ],
        });
      }
    },
  },
};
</script>
<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  min-height: 500px;
  /* padding-top: 10px; */
  top: -20px
}
</style>
