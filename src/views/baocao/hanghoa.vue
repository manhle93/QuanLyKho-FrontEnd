<template>
  <div class="app-container">
    <h4><i style="color: green">BÁO CÁO HÀNG HÓA</i></h4>
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
          v-model="form.don_hang"
          placeholder="Select"
          size="small"
          style="width: 100%"
        >
          <el-option value="hoa_don" label="Hóa đơn"></el-option>
          <el-option value="don_dat_hang" label="Đơn đặt hàng"></el-option>
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
      <el-table-column prop="created_at" label="Mã hàng hóa"></el-table-column>
      <el-table-column
        prop="san_pham.ten_san_pham"
        label="Tên hàng hóa"
      ></el-table-column>
      <el-table-column prop="gia_ban" label="số lượng bán">
        <template slot-scope="scope">
          {{ formate.formatCurrency(scope.row.gia_ban) + " đ/ "
          }}{{ scope.row.san_pham ? scope.row.san_pham.don_vi_tinh : "" }}
        </template>
      </el-table-column>
      <el-table-column prop="so_luong" label="Số lượng trả">
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
import { baoCaoHangHoa, downloadBaoCaoHangHoa } from "@/api/baocao";

export default {
  data: () => ({
    form: {
      date: [new Date(), new Date()],
      orderBy: "doanh_thu",
      don_hang: "hoa_don",
    },
    dataBanHang: [],
    dataDatHang: [],
    formate: formate,
    tableLoading: false,
    doanhThuBanHang: 0,
    doanhThuDatHang: 0,
  }),
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.tableLoading = true;
      let data = await baoCaoHangHoa(this.form);
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