<template>
  <div class="app-container">
    <h4><i style="color: green">BÁO CÁO NHÀ CUNG CẤP</i></h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="6">
        <el-date-picker
          @change="getData()"
          style="width: 100%"
          size="small"
          v-model="form.date"
          format="dd/MM/yyyy"
          type="daterange"
          range-separator="-"
          start-placeholder="Từ ngày"
          end-placeholder="Đến ngày"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-select
          filterable
          clearable
          size="small"
          v-model="form.nha_cung_cap"
          placeholder="Chọn nhà cung cấp"
          style="width: 100%"
        >
          <el-option
            v-for="item in nhaCungCaps"
            :key="item.id"
            :label="item.ten"
            :value="item.user_id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          @change="getData()"
          v-model="form.orderBy"
          placeholder="Select"
          size="small"
          style="width: 100%"
        >
          <el-option value="doanh_thu" label="Doanh thu cao nhất"></el-option>
          <el-option value="so_luong" label="Sản phẩm bán chạy"></el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-button
          style="float: right"
          class="primary-button"
          icon="el-icon-download"
          size="small"
          @click="taiBaoCao"
          >Tải báo cáo</el-button
        >
      </el-col>
    </el-row>
    <br />
    <el-row :gutter="20" justify="space-around">
      <el-col :span="5">
        <span style="color: black; font-weight: bold;">
          Chi nhánh RBT
        </span>
      </el-col>
      <el-col :span="5">
        <span style="color: green;">
          Tổng chi nhập hàng:
        </span>
        <span style="color: red;">  {{formate.formatCurrency(doanhThuDatHang)}}</span>
          (VND)
      </el-col>
      <el-col :span="5">
        <span style="color: green;">
          Số lượng đơn nhập:
        </span>
        <span style="color: red;">  {{formate.formatCurrency(doanhThuDatHang)}}</span>
          (Đơn)
      </el-col>
      <el-col :span="5">
        <span style="color: green;">
          Số lượng sản phẩm
        </span>
        <span style="color: red;">  {{formate.formatCurrency(doanhThuDatHang)}}</span>
          (Sản phẩm)
      </el-col>
      <br>
      <br>
    </el-row>
    <el-table
      :data="form.don_hang == 'hoa_don' ? dataBanHang : dataDatHang"
      v-loading="tableLoading"
      border
      fit
    >
      <el-table-column type="index" label="STT"></el-table-column>
      <el-table-column prop="created_at" label="Tên nhà cung cấp"></el-table-column>
      <el-table-column prop="created_at" label="Mã nhà cung cấp"></el-table-column>
      <el-table-column prop="created_at" label="SL nhập"></el-table-column>
      <el-table-column prop="created_at" label="Giá trị nhập"></el-table-column>
      <el-table-column prop="created_at" label="SL trả"></el-table-column>
      <el-table-column prop="created_at" label="Giá trị trả"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { baoCaoNhaCungCap, downloadBaoCaoNhaCungCap } from "@/api/baocao";
import { getNhaCungCap } from "@/api/khachhang";
export default {
  data: () => ({
    form: {
      date: [new Date(), new Date()],
      orderBy: "doanh_thu",
      don_hang: "hoa_don",
    },
    dataBanHang: [],
    dataDatHang: [],
    nhaCungCaps: [],
    formate: formate,
    tableLoading: false,
    doanhThuBanHang: 0,
    doanhThuDatHang: 0,
  }),
  created() {
    this.getData();
    this.getNhaCungCap();
  },
  methods: {
    async getData() {
      this.tableLoading = true;
      let data = await baoCaoNhaCungCap(this.form);
      this.dataBanHang = data.ban_hang;
      this.dataDatHang = data.dat_hang;
      this.tableLoading = false;
      this.doanhThuBanHang = 0;
      this.doanhThuDatHang = 0;
      this.dataBanHang.forEach(
        (el) =>
          (this.doanhThuBanHang =
            +this.doanhThuBanHang + el.gia_ban * el.so_luong)
      );
      this.dataDatHang.forEach(
        (el) =>
          (this.doanhThuDatHang =
            +this.doanhThuDatHang + el.gia_ban * el.so_luong)
      );
    },
    async getNhaCungCap() {
      let data = await getNhaCungCap({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },
    taiBaoCao() {
      let start = new Date(this.form.date[0]).toISOString()
      let end = new Date(this.form.date[1]).toISOString()
      window.location.assign(
        process.env.VUE_APP_BASE_API +
          "downloadbaocaobanhang?date[]=" +start + "&date[]=" + end + "&orderBy=" + this.form.orderBy + "&don_hang="+this.form.don_hang);
    },
  },
};
</script>
<style scoped>
</style>