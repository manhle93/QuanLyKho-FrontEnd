<template>
  <div class="app-container">
    <h4><i style="color: green">BÁO CÁO ĐẶT HÀNG</i></h4>
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
      <el-col :span="3">
        <el-select
          v-model="form.don_hang"
          placeholder="Lựa chọn kiểu đặt hàng"
          clearable
          size="small"
          style="width: 100%"
          @change="getData()"
        >
          <el-option value="dat_hang_tai_quay" label="Đặt hàng tại quầy"></el-option>
          <el-option value="dat_hang_online" label="Đặt hàng Online"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          @change="getData()"
          v-model="form.orderBy"
          placeholder="Trạng thái đặt hàng"
          size="small"
          style="width: 100%"
        >
          <el-option value="moi_tao" label="Mới tạo"></el-option>
          <el-option value="da_chuyen_hoa_don" label="Đã chuyển hóa đơn"></el-option>
          <el-option value="huy_dat_hang" label="Hủy đặt hàng"></el-option>
        </el-select>
      </el-col>
      <el-col :span="13">
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
    <br>
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
      <el-table-column
        prop="san_pham.ten_san_pham"
        label="Sản phẩm"
      ></el-table-column>
      <el-table-column prop="gia_ban" label="Giá bán">
        <template slot-scope="scope">
          {{ formate.formatCurrency(scope.row.gia_ban) + " đ/ "
          }}{{ scope.row.san_pham ? scope.row.san_pham.don_vi_tinh : "" }}
        </template>
      </el-table-column>
      <el-table-column prop="so_luong" label="Số lượng">
        <template slot-scope="scope">
          {{ formate.formatCurrency(scope.row.so_luong) + " "
          }}{{ scope.row.san_pham ? scope.row.san_pham.don_vi_tinh : "" }}
        </template>
      </el-table-column>
      <el-table-column label="Doanh thu">
        <template slot-scope="scope">
          {{
            scope.row.doanh_thu
              ? formate.formatCurrency(scope.row.doanh_thu) + " đ"
              : formate.formatCurrency(scope.row.gia_ban * scope.row.so_luong) +
                " đ"
          }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { baoCaoDatHang, downloadBaoCaoDatHang } from "@/api/baocao";
import { getKhachHang } from "@/api/khachhang";
export default {
  data: () => ({
    form: {
      date: [new Date(), new Date()],
      orderBy: null,
      don_hang: null,
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
      let data = await baoCaoDatHang(this.form);
      this.dataBanHang = data.data;
      this.dataDatHang = data.data;
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