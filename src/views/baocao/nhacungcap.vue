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
    <h4>
      {{
        form.don_hang == "hoa_don"
          ? "Danh sản phẩm đã bán"
          : "Danh sách sản phẩm đặt hàng"
      }}
    </h4>
    <h5>
      {{
        form.don_hang == "hoa_don"
          ? "Doanh thu bán hàng: " +
            formate.formatCurrency(doanhThuBanHang) +
            " đ"
          : "Doanh thu đặt hàng: " +
            formate.formatCurrency(doanhThuDatHang) +
            " đ"
      }}
    </h5>
    <el-table
      :data="form.don_hang == 'hoa_don' ? dataBanHang : dataDatHang"
      v-loading="tableLoading"
    >
      <el-table-column type="index" label="STT"></el-table-column>
      <el-table-column prop="created_at" label="Thời gian"></el-table-column>
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
import { baoCaoNhaCungCap, downloadBaoCaoNhaCungCap } from "@/api/baocao";

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