<template>
  <div class="app-container">
    <h3>Báo cáo trạng thái xử lý cháy</h3>
    <el-row>
      <el-col :span="4">
        <el-select
          v-model="filler.tinh_thanh"
          clearable
          filterable
          placeholder="Tỉnh thành"
          style="width: 95%"
          size="small"
        >
          <el-option v-for="item in tinh_thanhs" :key="item.id" :label="item.name" :value="item.id">
            <div @click="tinhThanh = item.name">{{item.name}}</div>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-date-picker
          v-model="filler.date"
          style="width: 100%"
          type="daterange"
          range-separator="-"
          start-placeholder="Từ ngày"
          end-placeholder="Đến ngày"
          size="small"
          format="dd/MM/yyyy"
        ></el-date-picker>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-document"
          @click="getDiemChayTheoTinh()"
        >LẤY DỮ LIỆU</el-button>
      </el-col>
    </el-row>
    <br />
    <br />
    <el-row>
      <el-col :span="12">
        <h5>Biểu đồ số liệu trên cả nước</h5>
        <chart :dataChart="dataChart" v-loading="listLoading" />
      </el-col>
      <el-col :span="12">
        <h5 v-if="chart">Biểu đồ số liệu tại {{tinhThanh}}</h5>
        <ChartTinhThanh v-loading="listLoading2" :dataChartTinhThanh="dataChartTinhThanh" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getTinhThanh, getDonViPccc } from "@/api/TinhThanh";
import { getToaNha } from "@/api/thietbi";
import { getToaNhaTheoTinh } from "@/api/toanha";
import { getListData } from "@/api/toanha";
import axios from "axios";
import { getToken } from "@/utils/auth";
import Chart from "./bieudo/PieChart";
import ChartTinhThanh from "./bieudo/PieChartTinhThanh";
import { getDiemChay } from "@/api/diemchay";

export default {
  components: { Chart, ChartTinhThanh },
  data() {
    return {
      filler: {
        tinh_thanh: null,
        toa_nha: null,
        don_vi: null,
        date: []
      },
      tinhThanh: "",
      chart: false,
      dataChart: [],
      listLoading: false,
      listLoading2: false,
      page: 1,
      per_page: 10,
      total: 0,
      toa_nhas: [],
      tinh_thanhs: [],
      don_vis: [],
      tableData: [],
      diem_chays: [],
      dataChartTinhThanh: []
    };
  },
  created() {
    let date = new Date();
    let start = "01/01/" + date.getUTCFullYear();
    let end = "12/31/" + date.getUTCFullYear();
    this.filler.date = [start, end];
    this.getAllDiemChay();
    this.getTinhThanh();
  },
  methods: {
    async getTinhThanh() {
      let data = await getTinhThanh();
      this.tinh_thanhs = data.data;
    },
    getDiemChayTheoTinh() {
      this.dataChartTinhThanh = [];
      this.listLoading2 = true;
      this.getAllDiemChay();
      getDiemChay({
        per_page: 999999999999999,
        tinh_thanh_id: this.filler.tinh_thanh,
        date: this.filler.date
      }).then(response => {
        this.diem_chays = response.data.data;
        var da_xu_ly = 0;
        var ket_thuc_xu_ly = 0;
        var canh_bao_sai = 0;
        var dang_chay = 0;
        for (var item of this.diem_chays) {
          if (item.trang_thai == "da_xu_ly") {
            da_xu_ly += 1;
          }
          if (item.trang_thai == "canh_bao_sai") {
            canh_bao_sai += 1;
          }
          if (item.trang_thai == "ket_thuc_xu_ly") {
            ket_thuc_xu_ly += 1;
          }
          if (item.trang_thai == "dang_chay") {
            dang_chay += 1;
          }
        }
        this.chart = true;
        this.listLoading2 = false;
        this.dataChartTinhThanh = [
          { value: da_xu_ly, name: "Đang xử lý" },
          { value: canh_bao_sai, name: "Cảnh báo sai" },
          { value: ket_thuc_xu_ly, name: "Kết thúc xử lý" },
          { value: dang_chay, name: "Đang cháy" }
        ];
      });
    },
    getAllDiemChay() {
      this.listLoading = true;
      getDiemChay({
        per_page: 999999999999999,
        date: this.filler.date
      }).then(response => {
        this.diem_chays = response.data.data;
        var da_xu_ly = 0;
        var ket_thuc_xu_ly = 0;
        var canh_bao_sai = 0;
        var dang_chay = 0;
        for (var item of this.diem_chays) {
          if (item.trang_thai == "da_xu_ly") {
            da_xu_ly += 1;
          }
          if (item.trang_thai == "canh_bao_sai") {
            canh_bao_sai += 1;
          }
          if (item.trang_thai == "ket_thuc_xu_ly") {
            ket_thuc_xu_ly += 1;
          }
          if (item.trang_thai == "dang_chay") {
            dang_chay += 1;
          }
        }
        this.listLoading = false;
        this.dataChart = [
          { value: da_xu_ly, name: "Đang xử lý" },
          { value: canh_bao_sai, name: "Cảnh báo sai" },
          { value: ket_thuc_xu_ly, name: "Kết thúc xử lý" },
          { value: dang_chay, name: "Đang cháy" }
        ];
      });
    }
  }
};
</script>
<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(80vh - 84px);
}
</style>