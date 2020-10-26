<template>
  <div class="app-container">
    <h4><i style="color: green">BÁO CÁO KHÁCH HÀNG</i></h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="5">
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
          v-model="form.khach_hang"
          placeholder="Chọn khách hàng"
          style="width: 100%"
        >
          <el-option
            v-for="item in khachHangs"
            :key="item.id"
            :label="item.ten"
            :value="item.user_id"
          ></el-option>
        </el-select>
      </el-col>
      <!-- <el-col :span="4">
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
      </el-col> -->
      <el-col :span="15">
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
          {{
            form.don_hang == "hoa_don"
              ? "Tổng doanh thu: "
              : "Tổng doanh thu: "
          }}
        </span>
        <span style="color: red;">  {{formate.formatCurrency(doanhThuDatHang)}}</span>
          (VND)
      </el-col>
      <el-col :span="5">
        <span style="color: green;">
          Số lượng đơn:
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
      <el-table-column prop="created_at" label="Họ và Tên"></el-table-column>
      <el-table-column prop="created_at" label="Số điện thoại"></el-table-column>
      <el-table-column
        prop="san_pham.ten_san_pham"
        label="Số lượng SP đã mua"
      ></el-table-column>
      <el-table-column prop="created_at" label="Giá trị mua hàng"></el-table-column>
      <el-table-column prop="created_at" label="Doanh số bán hàng"></el-table-column>
      <el-table-column prop="created_at" label="Số lượng HĐ trả hàng"></el-table-column>
      <el-table-column prop="created_at" label="Giá trị trả hàng"></el-table-column>
      <el-table-column prop="created_at" label="Tổng doanh thu"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { baoCaoKhachHang, downloadBaoCaoKhachHang } from "@/api/baocao";
import { getKhachHang } from "@/api/khachhang";
export default {
  data: () => ({
    form: {
      date: [new Date(), new Date()],
      orderBy: "doanh_thu",
      don_hang: "hoa_don",
    },
    dataBanHang: [],
    dataDatHang: [],
    khachHangs: [],
    formate: formate,
    tableLoading: false,
    doanhThuBanHang: 0,
    doanhThuDatHang: 0,
  }),
  created() {
    this.getData();
    this.getKhachHang();
  },
  methods: {
    async getData() {
      this.tableLoading = true;
      let data = await baoCaoKhachHang(this.form);
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
    async getKhachHang() {
      let data = await getKhachHang({
        per_page: 999999,
      });
      this.khachHangs = data.data.data;
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