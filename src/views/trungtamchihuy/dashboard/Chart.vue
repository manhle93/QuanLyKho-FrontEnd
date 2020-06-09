<template>
  <div class="chart-container">
    <div :class="className" :style="{ height: height, width: width }" />
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
var debounce = require("debounce");
const animationDuration = 4000;
import { getDataBieuDoThietBi } from "@/api/baocao";

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
    }
  },
  watch: {},
  data() {
    return {
      chart: null,
      dataVuChay: []
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
      let res = await getDataBieuDoThietBi();
      this.dataVuChay = res[0];
      this.dataVuChay = [...this.dataVuChay, ["", null]];
      if (this.chart) {
        this.chart.setOption({
          tooltip: {
            trigger: "axis"
            // axisPointer: {
            //   type: "cross"
            // }
          },
          grid: {
            top: 10,
            left: "2%",
            right: "2%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          series: [
            {
              name: "Thiết bị",
              type: "line",
              symbol: "circle",
              symbolSize: 10,
              lineStyle: {
                color: "red",
                width: 2
              },

              stack: "vistors",
              barWidth: "60%",
              data: this.dataVuChay,
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
  min-height: 130px;
  padding-top: 10px;
}
</style>
