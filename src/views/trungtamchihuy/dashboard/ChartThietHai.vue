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
import { getDataBieuDoThietHai } from "@/api/baocao";

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
    render() {
      this.chart.resize();
    },
    async initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      let res = await getDataBieuDoThietHai();
      this.data = res[0];
      this.data = [...this.data, ["", null]];
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
              name: "Thiệt hại",
              type: "line",
              symbol: "circle",
              symbolSize: 10,
              lineStyle: {
                color: "red",
                width: 2
              },

              stack: "vistors",
              barWidth: "60%",
              data: this.data,
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
