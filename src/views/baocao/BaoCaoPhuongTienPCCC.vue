<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-select
          size="small"
          v-model="filler.tinh_thanh"
          clearable
          filterable
          placeholder="Tỉnh thành"
          style="width: 95%"
          @change="getDonVi(filler.tinh_thanh)"
        >
          <el-option v-for="item in tinhThanhs" :key="item.id" :label="item.name" :value="item.id">
            <div @click="tenTinh(item.name)">{{item.name}}</div>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="filler.don_vi"
          placeholder="Đơn vị PCCC"
          clearable
          size="small"
          style="width: 95%"
        >
          <el-option v-for="item in donViPccc" :key="item.id" :label="item.ten" :value="item.id">
            <div @click="tenDonVi(item.ten)">{{item.ten}}</div>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-document"
          @click="getData()"
        >LẤY DỮ LIỆU</el-button>
      </el-col>
    </el-row>
    <br />
    <br />
    <el-row v-if="chart">
      <h4>Biểu đồ tỷ trọng {{don_vi}} {{tinh_thanh}}</h4>
      <chart :dataChart="dataChart" v-loading="listLoading" />
    </el-row>
    <h4 v-if="chart">Danh sách phương tiện PCCC {{don_vi}} {{tinh_thanh}}</h4>
    <el-table :data="tableData" v-if="chart" v-loading="loadingTable">
      <el-table-column prop="ten" label="Tên xe"></el-table-column>
      <el-table-column prop="bien_so" label="Biển số"></el-table-column>
      <el-table-column prop="loai_phuong_tien_pccc.ten" label="Loại phương tiện"></el-table-column>
      <el-table-column label="Đơn vị quản lý">
        <template slot-scope="scope">
          <span v-if="scope.row.don_vi_pccc">{{scope.row.don_vi_pccc.ten}}</span>
          <span v-if="scope.row.quan_huyen">{{scope.row.quan_huyen.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái">
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="plain"
            v-if="scope.row.trang_thai_hoat_dong == 'Tốt' "
          >{{scope.row.trang_thai_hoat_dong}}</el-tag>
          <el-tag
            type="danger"
            effect="plain"
            v-if="scope.row.trang_thai_hoat_dong == 'Cần thay thế' "
          >{{scope.row.trang_thai_hoat_dong}}</el-tag>
          <el-tag
            type="warning"
            effect="plain"
            v-if="scope.row.trang_thai_hoat_dong == 'Cần sửa chữa, bảo dưỡng' "
          >{{scope.row.trang_thai_hoat_dong}}</el-tag>
          <el-tag
            type="danger"
            effect="plain"
            v-if="scope.row.trang_thai_hoat_dong == 'Kém' "
          >{{scope.row.trang_thai_hoat_dong}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
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
import { index, getAllDonViPccc } from "@/api/phuongtienpccc";
import { getTinhThanh } from "@/api/TinhThanh";
import Chart from "./bieudo/PieTrangThaiPT";
import { getPT } from "@/api/qlchung";

export default {
  components: { Chart },
  data() {
    return {
      tableData: [],
      filler: {
        tinh_thanh: "",
        don_vi: ""
      },
      page: 1,
      per_page: 10,
      total: 0,
      tinhThanhs: [],
      donViPccc: [],
      listLoading: false,
      dataChart: [],
      tinhThanh: "",
      tinh_thanh: "",
      don_vi: "",
      donVi: "",
      chart: false,
      loadingTable: false
    };
  },
  methods: {
    async getData() {
      this.chart = true;
      this.tinh_thanh = this.tinhThanh;
      if (this.tinh_thanh == "" || this.tinh_thanh == null) {
        this.tinh_thanh = "Trên cả nước";
      }
      this.don_vi = this.donVi;
      this.listLoading = true;
      this.getTableData();
      let data = await index({
        tinh_thanh: this.filler.tinh_thanh,
        don_vi: this.filler.don_vi
      });
      // this.tableData = data.data;
      var kem = 0;
      var tot = 0;
      var sua_chua = 0;
      var thay_the = 0;
      for (var item of data.data) {
        if (item.trang_thai_hoat_dong == "Tốt") {
          tot++;
        }
        if (item.trang_thai_hoat_dong == "Kém") {
          kem++;
        }
        if (item.trang_thai_hoat_dong == "Cần sửa chữa, bảo dưỡng") {
          sua_chua++;
        }
        if (item.trang_thai_hoat_dong == "Cần thay thế") {
          thay_the++;
        }
      }
      this.dataChart = [
        { name: "Tốt", value: tot },
        { name: "Kém", value: kem },
        { name: "Cần sửa chữa, bảo dưỡng", value: sua_chua },
        { name: "Cần thay thế", value: thay_the }
      ];
      this.listLoading = false;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getTableData(this.page, this.per_page);
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    async getTableData() {
      this.loadingTable = true;
      let data = await getPT({
        page: this.page,
        per_page: this.per_page,
        tinh_thanh_id: this.filler.tinh_thanh,
        don_vi_pcc_id: this.filler.don_vi
      });
      this.loadingTable = false;
      this.tableData = data.data.data;
      this.page = data.data.current_page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
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