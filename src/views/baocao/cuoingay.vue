<template>
  <div class="app-container">
    <h4><i style="color: green;">BÁO CÁO CUỐI NGÀY</i></h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="4">
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
        @change="getData()"
          v-model="form.don_hang"
          placeholder="Select"
          size="small"
          style="width: 100%"
          clearable
        >
          <el-option value="hoa_don" label="Đơn bán hàng"></el-option>
          <el-option value="don_dat_hang" label="Đơn đặt hàng"></el-option>
        </el-select>
      </el-col>
      <!-- <el-col :span="3">
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
      <el-col :span="17">
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
      highlight-current-row
    >
      <el-table-column
        type="index" 
        label="STT"
        min-width="65"
        align="center"
        >
      </el-table-column>
      <el-table-column
        label="Mã HĐ"
        min-width="65"
        prop="ma"
        >
      </el-table-column>
      <el-table-column
        prop="ten"
        label="Tên hóa đơn"
        min-width="85"
      ></el-table-column>
      <el-table-column
        prop="so_luong"
        label="Số lượng sản phẩm"
        min-width="45"
        >
        <template slot-scope="scope">
          {{ formate.formatCurrency(scope.row.so_luong) + " "
          }}{{ scope.row.san_pham ? scope.row.san_pham.don_vi_tinh : "" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="tong_tien" 
        label="Thành tiền"
        min-width="45"
        >
        <template slot-scope="scope">
          {{ formate.formatCurrency(scope.row.tong_tien) + " đ"
          }}
        </template>
      </el-table-column>
      <el-table-column 
        prop="updated_at" 
        label="Thời gian"
        min-width="45"
        align="center"
        >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { baoCaoCuoiNgay, downloadBaoCaoCuoiNgay } from "@/api/baocao";

export default {
  data: () => ({
    form: {
      date: [new Date(), new Date()],
      orderBy: null,
      don_hang: null,
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
      let data = await baoCaoCuoiNgay(this.form);
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