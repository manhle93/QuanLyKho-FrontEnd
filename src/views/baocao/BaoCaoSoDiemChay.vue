<template>
  <div class="app-container">
    <h3>Báo cáo số điểm cháy</h3>
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
      <el-col :span="3">
        <el-select v-model="filler.year" placeholder="Chọn năm" size="small">
          <el-option
            v-for="item in years"
            :key="item.value"
            :label="'Năm '+item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-button size="small" class="primary-button" icon="el-icon-document" @click="getData()">LẤY DỮ LIỆU</el-button>
      </el-col>
      <el-col :span="4">
        <el-button
          v-if="chart"
          type="success"
          icon="el-icon-download"
          @click="exportExcel()"
           v-loading="listLoading"
        >Xuất báo cáo</el-button>
      </el-col>
    </el-row>
    <br />
    <h4>Biểu đố số vụ cháy năm {{filler.year}}</h4>
    <el-row style="background:#fff;padding:10px 10px 0;margin-bottom:15px;">
      <chart :chart-data="lineChartData" />
    </el-row>
    <h4 v-if="chart">Số liệu chi tiết tại {{this.tinhThanh}}</h4>
    <el-row v-if="chart">
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          style="width: 100%"
          border
        >
          <el-table-column type="index" label="STT"></el-table-column>
          <el-table-column property="ten" label="Điểm cháy" min-width="150"></el-table-column>
          <el-table-column property="dia_chi" label="Địa chỉ" min-width="150"></el-table-column>
          <el-table-column sortable property="so_dien_thoai" label="Số điện thoại" min-width="143"></el-table-column>
          <el-table-column prop="ten_nguoi_bao" min-width="120" label="Tên người báo"></el-table-column>
          <el-table-column property="toa_nha.ten" label="Tòa nhà" min-width="160"></el-table-column>
          <el-table-column label="Trạng thái" min-width="160" prop="trang_thai_diem_chay.ten"></el-table-column>
          <el-table-column label="Thời gian báo cháy" min-width="160" prop="thoi_gian_bao_chay"></el-table-column>
          <el-table-column
            label="Thời gian bắt đầu xử lý"
            min-width="160"
            prop="thoi_gian_bat_dau_xu_ly"
          ></el-table-column>
          <el-table-column
            label="Thời gian kết thúc"
            min-width="160"
            prop="thoi_gian_bat_dau_xu_ly"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="block" v-if="chart">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getTinhThanh, getDonViPccc } from "@/api/TinhThanh";
import { getToaNha } from "@/api/thietbi";
import { getDiemChay } from "@/api/diemchay";
import axios from "axios";
import { getToken } from "@/utils/auth";
import Chart from "./bieudo/LineChartDiemChay";

export default {
  components: { Chart },
  data() {
    return {
      filler: {
        tinh_thanh: null,
        year: new Date().getUTCFullYear() - 1
      },
      lineChartData: {
        dataCaNuoc: [],
        dataTinhThanh: [],
        tinhThanh: ""
      },
      tinhThanh: "",
      chart: false,
      years: [],
      dataChartX: [],
      dataChartY: [],
      listLoading: false,
      page: 1,
      per_page: 10,
      total: 0,
      diem_chays: [],
      tinh_thanhs: [],
      don_vis: [],
      tableData: [],
      loadChart: false
    };
  },
  created() {
    this.getTinhThanh();
    this.getYear();
    this.getAllDiemChay();
  },
  methods: {
    async getTinhThanh() {
      let data = await getTinhThanh();
      this.tinh_thanhs = data.data;
    },
    exportExcel() {
      axios({
        url: process.env.VUE_APP_BASE_API + "baocaodiemchay/" + this.filler.tinh_thanh,
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
    getAllDiemChay() {
      getDiemChay({
        per_page: 999999999999999,
        year: this.filler.year
      }).then(response => {
        this.diem_chays = response.data.data;
        this.setDataChar(this.diem_chays, 0);
        this.loadChart = false;
      });
    },
    getDiemChayTinhThanh() {
      getDiemChay({
        per_page: 999999999999999,
        year: this.filler.year,
        tinh_thanh_id: this.filler.tinh_thanh
      }).then(response => {
        this.setDataChar(response.data.data, 1);
      });
    },
    getYear() {
      var y = new Date();
      var now = y.getUTCFullYear();
      for (var i = 2019; i <= now; i++) {
        this.years.push({ value: i });
      }
    },
    getData(page = 1, per_page = 10) {
      if (this.filler.tinh_thanh != null && this.filler.tinh_thanh != "") {
        this.listLoading = true;
        this.chart = true;
        this.getDiemChayTinhThanh();
        this.getAllDiemChay();
        getDiemChay({
          page: this.page,
          per_page: this.per_page,
          tinh_thanh_id: this.filler.tinh_thanh,
          year: this.filler.year
        }).then(response => {
          this.tableData = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.listLoading = false;
        });
      }
      else {
        this.getAllDiemChay()
      }
    },
    setDataChar(chartData, e) {
      this.loadChart = true;
      const monthData = chartData.reduce((acc, el) => {
        const currentMonth = new Date(el.created_at).getMonth();
        if (acc[currentMonth])
          return {
            ...acc,
            [currentMonth]: acc[currentMonth] + 1
          };
        return {
          ...acc,
          [currentMonth]: 1
        };
      }, {});
      const data = new Array(12).fill(0);
      Object.entries(monthData).map(([key, value]) => {
        data[key] = value;
      });
      this.loadChart = false
      if (e == 0) {
        this.lineChartData.dataCaNuoc = data;
      }
      if (e == 1) {
        this.lineChartData.dataTinhThanh = data;
        this.lineChartData.tinhThanh = this.tinhThanh;
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
</style>
