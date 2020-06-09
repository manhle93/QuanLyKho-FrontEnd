<template>
  <div class="app-container">
    <h4>Báo cáo kết quả kiểm tra an toàn PCCC</h4>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-select
          v-model="filler.tinh_thanh"
          clearable
          filterable
          placeholder="Tỉnh thành"
          style="width: 95%"
          size="small"
        >
          <el-option v-for="item in tinhThanhs" :key="item.id" :label="item.name" :value="item.id">
            <div @click="tenTinh(item.name)">{{item.name}}</div>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button size="small" class="primary-button" icon="el-icon-document" @click="getData()">LẤY DỮ LIỆU</el-button>
      </el-col>
    </el-row>
    <br />
    <br />
    <el-row v-if="chart">
      <h4>Biểu đồ tỷ trọng {{don_vi}} {{tinh_thanh}}</h4>
      <chart :dataChart="dataChart" v-loading="listLoading" />
    </el-row>
    <h4 v-if="chart">Danh sách quyết định kiểm tra AT PCCC {{don_vi}} {{tinh_thanh}}</h4>
    <el-table :data="tableData" v-if="chart" v-loading="listLoading">
      <el-table-column type="index" label="STT"></el-table-column>
      <el-table-column prop="toa_nha.ten" label="Tên tòa nhà"></el-table-column>
      <el-table-column prop="ngay_kiem_tra" label="Ngày kiểm tra"></el-table-column>
      <el-table-column prop="quyet_dinh_kiem_tra" label="Quyết định kiểm tra"></el-table-column>
      <el-table-column prop="can_bo_kiem_tra" label="Cán bộ kiểm tra"></el-table-column>
      <el-table-column prop="thong_tin" label="Nội dung kiểm tra"></el-table-column>
      <el-table-column prop="danh_gia" label="Kết quả kiểm tra">
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="plain"
            v-if="scope.row.danh_gia == 'Đảm bảo yêu cầu PCCC' "
          >{{scope.row.danh_gia}}</el-tag>
          <el-tag
            type="danger"
            effect="plain"
            v-if="scope.row.danh_gia == 'Chưa đảm bảo' "
          >{{scope.row.danh_gia}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllDonViPccc } from "@/api/phuongtienpccc";
import { index } from "@/api/kiemtratoanha";
import { getTinhThanh } from "@/api/TinhThanh";
import Chart from "./bieudo/PieTrangThaiKT";
import { getToaNhaSearch } from "@/api/toanha";
import { getTrangThai } from "@/api/kiemtratoanha";

export default {
  components: { Chart },
  data() {
    return {
      tableData: [],
      filler: {
        tinh_thanh: "",
        don_vi: ""
      },
      tinhThanhs: [],
      donViPccc: [],
      listLoading: false,
      dataChart: [],
      tinhThanh: "",
      tinh_thanh: "",
      don_vi: "",
      donVi: "",
      chart: false,
      toanhas: [],
      trang_thai: []
    };
  },
  methods: {
    async getData() {
      this.chart = true;
      this.tinh_thanh = this.tinhThanh;
      if (this.tinh_thanh === "" || this.tinh_thanh == null) {
        this.tinh_thanh = "Trên cả nước";
      }
      this.don_vi = this.donVi;
      this.listLoading = true;
      this.trang_thai = await getTrangThai();
      let data = await index({
        tinh_thanh_id: this.filler.tinh_thanh,
        per_page: 9999999
      });
      this.tableData = data.data.data;
      this.dataChart = [];
      for (var item of this.trang_thai) {
        var value = 0;
        var name = "";
        for (var item2 of this.tableData) {
          if (item.noi_dung == item2.danh_gia) {
            value = value + 1;
            name = item.noi_dung;
          }
        }
        this.dataChart.push({ value: value, name: name });
      }
      this.listLoading = false;
    },
    async getTinhThanh() {
      let data = await getTinhThanh();
      this.tinhThanhs = data.data;
    },
    tenTinh(e) {
      this.tinhThanh = e;
    },
    tenDonVi(e) {
      this.donVi = e;
    },
    async getDonVi(tinh_thanh_id) {
      this.filler.don_vi = "";
      this.donViPccc = [];
      let data = await getAllDonViPccc({
        tinh_thanh_id: tinh_thanh_id,
        per_page: 9999999
      });
      this.donViPccc = data.data.data;
    }
  },
  created() {
    this.getTinhThanh();
    this.getData();
  }
};
</script>