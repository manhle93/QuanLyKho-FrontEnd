<template>
  <div class="app-container">
    <h3>Báo cáo số lượng cán bộ chiến sĩ tham gia chữa cháy</h3>
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
        <el-button size="small" class="primary-button" icon="el-icon-document" @click="getData()">LẤY DỮ LIỆU</el-button>
      </el-col>
      <el-col :span="4">
        <el-button
          v-if="chart"
          class="primary-button"
          icon="el-icon-download"
          size="small"
          @click="exportExcel()"
        >Xuất báo cáo</el-button>
      </el-col>
    </el-row>
    <br />
    <h4 v-if="chart">Biểu đồ số cán bộ chiến sĩ tham gia chữa cháy / Vụ cháy tại {{tinhThanh}}</h4>
    <br />
    <el-row>
      <chart
        v-if="chart"
        :dataX="dataChartX"
        :dataY="dataChartY"
        height="100%"
        width="100%"
        v-loading="listLoadingChart"
      />
    </el-row>
    <br />
    <br />
    <h4 v-if="chart">Số liệu chi tiết</h4>
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
          <el-table-column sortable property="ten" label="Tên vụ cháy" min-width="123"></el-table-column>
          <el-table-column sortable property="dia_chi" label="Địa chỉ" min-width="143"></el-table-column>
          <el-table-column label="Thời gian báo cháy" min-width="100" prop="thoi_gian_bao_chay"></el-table-column>
          <el-table-column property="toa_nha.ten" label="Tòa nhà" min-width="100"></el-table-column>
          <el-table-column property="tinh_thanh.name" label="Tỉnh thành" min-width="95"></el-table-column>
          <el-table-column
            label="Số cán bộ tham gia chữa cháy"
            prop="so_nguoi_tham_gia_chua_chay"
            min-width="90"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.so_nguoi_tham_gia_chua_chay == null">0 người</span>
              <span v-else>{{scope.row.so_nguoi_tham_gia_chua_chay}} (người)</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="block" v-if="chart" style="margin-top: 20px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getTinhThanh, getDonViPccc } from "@/api/TinhThanh";
import { getToaNha } from "@/api/thietbi";
import { getToaNhaTheoTinh } from "@/api/toanha";
import { getListData } from "@/api/toanha";
import axios from "axios";
import { getToken } from "@/utils/auth";
import Chart from "./bieudo/BarChartCBCS";
import { getDiemChay } from "@/api/diemchay";

export default {
  components: { Chart },
  data() {
    return {
      filler: {
        tinh_thanh: null,
        toa_nha: null,
        don_vi: null
      },
      tinhThanh: "Hà nội",
      chart: false,
      dataChartX: [],
      dataChartY: [],
      listLoading: false,
      page: 1,
      per_page: 10,
      total: 0,
      listLoadingChart: false,
      tinh_thanhs: [],
      don_vis: [],
      tableData: [],
      diemchays: []
    };
  },
  created() {
    this.getTinhThanh();
    this.filler.tinh_thanh = 23;
    this.getData()
  },
  methods: {
    async getTinhThanh() {
      let data = await getTinhThanh();
      this.tinh_thanhs = data.data;
    },
    exportExcel() {
      axios({
        url:
          process.env.VUE_APP_BASE_API +
          "baocaosochiensi/" +
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
      this.getData(this.page, this.per_page, 1);
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    async getData(page = 1, per_page = 10, update) {
      if (this.filler.tinh_thanh != null && this.filler.tinh_thanh != "") {
        this.listLoading = true;
        this.chart = true;
        if (update != 1) {
          this.listLoadingChart = true;
          this.dataChartX = [];
          this.dataChartY = [];
          let data = await getDiemChay({
            per_page: 999999,
            tinh_thanh_id: this.filler.tinh_thanh
          });
          this.listLoadingChart = false;
          this.diemchays = data.data.data;
          for (var item of this.diemchays) {
            this.dataChartX.push(item.ten);
            this.dataChartY.push(item.so_nguoi_tham_gia_chua_chay);
          }
        }
        let response = await getDiemChay({
          page: this.page,
          per_page: this.per_page,
          tinh_thanh_id: this.filler.tinh_thanh
        });
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
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