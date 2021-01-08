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
      data: [],
      time: []
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
    async initChart(type) {
      this.chart = echarts.init(this.$el, "macarons");
      console.log(type);
      let res = await getDoanhThu({ type: type });
      console.log(res);
      this.data = res.data;
      this.time = res.time;
      if (this.chart) {
        this.chart.setOption({
          color: ["#3398DB"],
          tooltip: {
            trigger: "axis",
            formatter: "{a} <br/>{b} : {c} ( đồng )",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          dataZoom: [
            {
              type: "inside"
            }
          ],
          xAxis: [
            {
              type: "category",
              name: "Thời gian",
              data: this.time,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "Doanh thu (VnĐ)"
            }
          ],
          series: [
            {
              name: "Doanh thu",
              type: "bar",
              barWidth: "60%",
              data: this.data
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
  height: 100%;
  /* padding-top: 10px; */
  top: -20px;
}
</style>
