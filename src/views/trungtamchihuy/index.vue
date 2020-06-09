<template>
  <el-tabs
    v-model="activeName"
    class="container c-flex"
    @tab-click="tapClick"
    type="border-card"
    :style="style"
  >
    <el-tab-pane label="Cả nước" name="first">
      <Dashboard ref="dashboard" @chiTietTinhThanh="chiTiet" />
    </el-tab-pane>
    <el-tab-pane label="Chi tiết theo tỉnh" name="second">
      <Chitiet ref="chiTiet" :chiTiet="tinh_thanh_id" @chiTiet="chiTietDashboard" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { getTinhThanh, getDonViPccc } from "@/api/TinhThanh";
import { getToaNha } from "@/api/thietbi";
import { getToaNhaTheoTinh } from "@/api/toanha";
import { getListData } from "@/api/toanha";
import axios from "axios";
import { getToken } from "@/utils/auth";
import Dashboard from "./dashboard/DashBoard";
import Chitiet from "./chitiet/index";

export default {
  components: { Dashboard, Chitiet },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    });
  },
  data() {
    return {
      filler: {
        tinh_thanh: null,
        toa_nha: null,
        don_vi: null
      },
      tinh_thanh_id: null,
      activeName: "first",
      tinhThanh: "",
      chart: false,
      dataChartX: [],
      dataChartY: [],
      listLoading: false,
      page: 1,
      per_page: 10,
      total: 0,
      toa_nhas: [],
      tinh_thanhs: [],
      don_vis: [],
      tableData: [],
      style: {
        background: "rgba(225, 245, 254, 0.3)"
      }
    };
  },
  created() {
    this.getTinhThanh();
  },
  methods: {
    chiTiet(id, e) {
      this.tinh_thanh_id = id;
      this.$refs['chiTiet'].scroll(this.tinh_thanh_id)
      if (e) {
        this.activeName = "second";
        this.style = {
          height: "100%",
          overflow: "auto"
        };
      }
    },
    chiTietDashboard(tinh_thanh_id){
      this.$refs.dashboard.receiveData(tinh_thanh_id)
    },
    async getTinhThanh() {
      let data = await getTinhThanh();
      this.tinh_thanhs = data.data;
    },
    tapClick(tab, event) {
      if (tab.index == 1) {
        this.$refs['chiTiet'].scroll(this.tinh_thanh_id)
        this.style = {
          height: "100%",
          overflow: "auto"
        };
      }
      if (tab.index == 0) {
        this.$refs['dashboard'].scroll(this.tinh_thanh_id)
        this.style = { background: "#D6EAF8" };
        
      }
    },
    exportExcel() {
      axios({
        url:
          process.env.VUE_APP_BASE_API +
          "baocaothietbi/" +
          this.filler.tinh_thanh,
        method: "GET",
        headers: { ["Authorization"]: "Bearer " + getToken() },
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.xlsx");
        document.body.appendChild(link);
        link.click();
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getData(this.page, this.per_page);
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    async getData(page = 1, per_page = 10) {
      if (this.filler.tinh_thanh != null && this.filler.tinh_thanh != "") {
        this.listLoading = true;
        this.chart = true;
        this.dataChartX = [];
        this.dataChartY = [];
        getListData({
          page: this.page,
          per_page: this.per_page,
          tinh_thanh_id: this.filler.tinh_thanh
        }).then(response => {
          this.tableData = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.listLoading = false;
          for (var item of this.toa_nhas) {
            this.dataChartX.push(item.ten);
            this.dataChartY.push(item.thiet_bi.length);
          }
        });
      }
    },
    async getToaNhaTheoTinh(id) {
      this.filler.toa_nha = null;
      if (id != null && id != "") {
        let data = await getToaNhaTheoTinh(id);
        this.toa_nhas = data.data;
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
.container {
  height: calc(100vh - 50px);
  overflow: hidden;
}
/* .el-tabs__header is-top {
  background-color: black;
} */
</style>
