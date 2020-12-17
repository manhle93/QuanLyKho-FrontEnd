<template>
  <div class="app-container">
    <h4><i style="color: green">BÁO CÁO NHÂN VIÊN</i></h4>
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
          v-model="form.nhan_vien"
          placeholder="Chọn nhân viên"
          style="width: 100%"
        >
          <el-option
            v-for="item in nhanVien"
            :key="item.id"
            :label="item.ten"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item>
          <el-select
            size="small"
            style="width: 100%"
            clearable
            remote
            reserve-keyword
            v-model="form.idSanPham"
            :remote-method="remoteMethod"
            placeholder="Hàng hóa, sản phẩm"
            filterable
            @change="doiSanPham(form.idSanPham)"
          >
            <el-option
              :disabled="kiemTraDaChon(item.id)"
              v-for="item in hangHoas"
              :key="item.id"
              :label="item.ten_san_pham"
              :value="item.id"
            >
              <span style="float: left">{{ item.ten_san_pham }}</span>
              <span
                style="float: right; color: #8492a6; font-size: 13px"
                >{{
                  item.thuong_hieu
                    ? 'Thương hiệu: '+ item.thuong_hieu.ten
                    : "Danh mục: " + item.danh_muc.ten_danh_muc
                }}</span
              >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
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
          {{
            form.don_hang == "hoa_don"
              ? "Tổng doanh thu bán hàng: "
              : "Tổng doanh thu đặt hàng: "
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
      <el-table-column prop="created_at" label="Nhân viên"></el-table-column>
      <el-table-column prop="created_at" label="Số điện thoại"></el-table-column>
      <el-table-column prop="created_at" label="Số lượng hóa đơn"></el-table-column>
      <el-table-column prop="created_at" label="Số lượng sản phẩm đã bán"></el-table-column>
      <el-table-column prop="created_at" label="Tổng doanh thu"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { baoCaoNhanVien, downloadBaoCaoNhanVien } from "@/api/baocao";
import { listSanPham } from "@/api/sanpham";
import { getUser } from "@/api/user";
import { debounce } from "lodash";
export default {
  data: () => ({
    form: {
      date: [new Date(), new Date()],
      orderBy: "doanh_thu",
      don_hang: "hoa_don",
    },
    dataBanHang: [],
    dataDatHang: [],
    nhanVien: [],
    hangHoas: [],
    formate: formate,
    tableLoading: false,
    doanhThuBanHang: 0,
    doanhThuDatHang: 0,
  }),
  created() {
    this.getData();
    this.getNhanVien();
    this.getSanPham();
  },
  methods: {
    async getData() {
      this.tableLoading = true;
      let data = await baoCaoNhanVien(this.form);
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
    async getNhanVien() {
      let data = await getUser({
        per_page: 999999,
        role: [2, 5]
      });
      this.nhanVien = data.data.data;
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 10,
        search: this.timKiem
      });
      this.hangHoas = data.data.data;
    },
    taiBaoCao() {
      let start = new Date(this.form.date[0]).toISOString()
      let end = new Date(this.form.date[1]).toISOString()
      window.location.assign(
        process.env.VUE_APP_BASE_API +
          "downloadbaocaobanhang?date[]=" +start + "&date[]=" + end + "&orderBy=" + this.form.orderBy + "&don_hang="+this.form.don_hang);
    },
    async remoteMethod(query) {
      this.loading = true;
      let data = await getKhachHang({
        per_page: 20,
        search: query,
      });
      this.nhaCungCaps = data.data.data;
      this.loading = false;
    },
  },
  watch: {
    timKiem: debounce(async function (val) {
      let data = await listSanPham({
        per_page: 12,
        search: val,
        danh_muc_id: this.danh_muc_id,
      });
      this.hangHoas = data.data.data;
    }, 300),
  }
};
</script>
<style scoped>
</style>