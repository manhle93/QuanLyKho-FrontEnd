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
import { topSanPham } from "@/api/bieudo";

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
  },
  watch: {},
  data() {
    return {
      chart: null,
      sanPhams: [],
      doanhThus: [],
      date: null,
    };
  },
  mounted() {
    this.getData(null);
    // this.initChart();
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
    async getData(date) {
      let res = await topSanPham({ date: date });
      this.sanPhams = res.map((el) => el.san_pham.ten_san_pham);
      this.doanhThus = res.map((el) => el.tong_doanh_thu);
      this.initChart();
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      if (this.chart) {
        this.chart.setOption({
          // title: {
          //   text: "SẢN PHẨM BÁN CHẠY",
          //   subtext: "DOANH THU",
          // },
          tooltip: {
            trigger: "axis",
            formatter: "Doanh thu <br>{b} : {c} ( đồng )",
            axisPointer: {
              type: "shadow",
            },
          },

          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
          },
          yAxis: {
            type: "category",
            data: this.sanPhams,
          },
          series: [
            {
              type: "bar",
              data: this.doanhThus,
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
  height: 100%;
  top: -40px;
  z-index: 0;
}
</style>
