<template>
  <div class="app-container">
    <h3>Báo cáo thiết bị lắp đặt theo tỉnh thành</h3>
    <el-row :gutter="20">
      <el-col :span="3">
        <el-select
          v-model="filler.tinh_thanh"
          @change="getToaNhaTheoTinh(filler.tinh_thanh)"
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
      <el-col :span="5">
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
      <el-col :span="4">
        <el-button
          class="primary-button"
          size="small"
          icon="el-icon-document"
          @click="getData()"
        >LẤY DỮ LIỆU</el-button>
      </el-col>
      <el-col :span="4">
        <el-button
          v-if="chart"
          size="small"
          class="primary-button"
          icon="el-icon-download"
          @click="exportExcel()"
        >Xuất báo cáo</el-button>
      </el-col>
    </el-row>
    <br />
    <h4 v-if="chart">Biểu đồ số thiết bị lắp đặt trong các cơ sở công trình tại {{tinhThanh}}</h4>
    <br />
    <el-row v-if="chart">
      <chart :dataX="dataChartX" :dataY="dataChartY" height="100%" width="100%" />
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
          style="width: 100%; font-size: 13px"
          border
        >
          <el-table-column type="index" label="STT"></el-table-column>
          <el-table-column sortable property="ten" label="Tên tòa nhà" min-width="123"></el-table-column>
          <el-table-column sortable property="dia_chi" label="Địa chỉ" min-width="143"></el-table-column>
          <el-table-column label="Số điện thoại" min-width="115">
            <template slot-scope="scope">
              <div v-for="phone in scope.row.so_dien_thoai">{{ phone.so_dien_thoai}}</div>
            </template>
          </el-table-column>
          <el-table-column property="don_vi_pccc.ten" label="Đơn vị PCCC" min-width="125"></el-table-column>
          <el-table-column property="loai_hinh_so_huu.ten" label="Loại hình sở hữu" min-width="95"></el-table-column>
          <el-table-column label="Số lượng thiết bị" align="center">
            <template slot-scope="scope">{{scope.row.thiet_bi.length}}</template>
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
import Chart from "./bieudo/BarChart";
import Dashboard from "./dashboardthietbi/DashBoardThietBi";
export default {
  components: { Chart, Dashboard },
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
        don_vi: null,
        date: []
      },
      activeName: "first",
      tinhThanh: "Hà Nội",
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
        background: "#17202A"
      }
    };
  },
  created() {
    this.getTinhThanh();
    this.filler.tinh_thanh = 23;
    let date = new Date();
    let start = "01/01/" + (date.getUTCFullYear()-1);
    let end = "12/31/" + (date.getUTCFullYear()-1);
    this.filler.date = [start, end];
    // this.getToaNhaTheoTinh(23);
    this.getData();
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
        await this.getToaNhaTheoTinh(this.filler.tinh_thanh)
        getListData({
          page: this.page,
          per_page: this.per_page,
          tinh_thanh_id: this.filler.tinh_thanh,
          date: this.filler.date
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
        let data = await getToaNhaTheoTinh(id, { date: this.filler.date });
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
</style>