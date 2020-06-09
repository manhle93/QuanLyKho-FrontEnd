<template>
  <div class="app-container">
    <h3>Báo cáo tỷ trọng thiết bị lắp đặt</h3>
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
          @click="getDataTheoTinh()"
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
      <el-col :span="12" v-if="chart">
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
import Chart from "./bieudo/PieChartTyTrong";
import ChartTinhThanh from "./bieudo/PieChartTyTrongTinhThanh";
import { getDiemChay } from "@/api/diemchay";
import { getDanhMucCon } from "@/api/danhmuc";
import { getThietBi } from "@/api/thietbi";
import { index } from "@/api/thietbi";
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
      dataChartTinhThanh: [],
      thietbis: [],
      loaiThietBi: [],
      thietbiTheoTinh: []
    };
  },
  created() {
    let date = new Date();
    let start = "01/01/" + (date.getUTCFullYear()-1);
    let end = "12/31/" + (date.getUTCFullYear()-1);
    this.filler.date = [start, end];
    this.getTinhThanh();
    this.getLoaiThietBi();
    this.getData();
  },
  methods: {
    async getTinhThanh() {
      let data = await getTinhThanh();
      this.tinh_thanhs = data.data;
    },
    async getLoaiThietBi() {
      let data = await getDanhMucCon({ ma: "LTB" });
      this.loaiThietBi = data.data;
    },
    async getDataTheoTinh(
      per_page = 999999999,
      page = null,
      ma = null,
      tinh_thanh = this.filler.tinh_thanh,
      don_vi_pccc = null,
      toa_nha = null,
      date = this.filler.date
    ) {
      if ((this.filler.tinh_thanh != null && this.filler.tinh_thanh != "")) {
        try {
          this.dataChartTinhThanh = [];
          this.chart = true;
          this.listLoading2 = true;
          let data = await index({
            per_page,
            page,
            ma,
            tinh_thanh,
            don_vi_pccc,
            toa_nha,
            date
          });
          this.thietbiTheoTinh = data.data;
          for (var item of this.loaiThietBi) {
            var value = 0;
            var name = "";
            for (var item2 of this.thietbiTheoTinh) {
              if (item.id == item2.loai_thiet_bi_id) {
                value = value + 1;
                name = item.ten;
              }
            }
            this.dataChartTinhThanh.push({ value: value, name: name });
          }
          this.getData()
          this.listLoading2 = false;
        } catch (error) {
          console.log(error);
        }
      }
    },
    async getData(
      per_page = 999999999,
      page = null,
      ma = null,
      tinh_thanh = null,
      don_vi_pccc = null,
      toa_nha = null,
      date = this.filler.date
    ) {
      try {
        this.dataChart = []
        this.listLoading = true;
        let data = await index({
          per_page,
          page,
          ma,
          tinh_thanh,
          don_vi_pccc,
          toa_nha,
          date
        });
        this.thietbis = data.data;
        this.listLoading = false;
        for (var item of this.loaiThietBi) {
          var value = 0;
          var name = "";
          for (var item2 of this.thietbis) {
            if (item.id == item2.loai_thiet_bi_id) {
              value = value + 1;
              name = item.ten;
            }
          }
          this.dataChart.push({ value: value, name: name });
        }
      } catch (error) {
        console.log(error);
      }
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