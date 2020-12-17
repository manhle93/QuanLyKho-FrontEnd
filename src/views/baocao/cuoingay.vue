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
          placeholder="Loại đơn hàng"
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
        <span style="color: red;">
          {{ formate.formatCurrency(doanhThu) }}</span
        >
        (VND)
      </el-col>
      <el-col :span="5">
        <span style="color: green;">
          Số lượng đơn:
        </span>
        <span style="color: red;">
          {{ formate.formatCurrency(total) }}</span
        >
        (Đơn)
      </el-col>
      <!-- <el-col :span="5">
        <span style="color: green;">
          Số lượng sản phẩm
        </span>
        <span style="color: red;">
          {{ formate.formatCurrency(doanhThuDatHang) }}</span
        >
        (Sản phẩm)
      </el-col> -->
      <br />
      <br />
    </el-row>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index" label="STT" min-width="65" align="center">
      </el-table-column>
      <el-table-column label="Mã HĐ" min-width="65" prop="ma">
      </el-table-column>
      <el-table-column
        prop="ten"
        label="Tên hóa đơn"
        min-width="85"
      ></el-table-column>
      <!-- <el-table-column prop="so_luong" label="Số lượng sản phẩm" min-width="45">
        <template slot-scope="scope">
          {{ formate.formatCurrency(scope.row.so_luong) + " "
          }}{{ scope.row.san_pham ? scope.row.san_pham.don_vi_tinh : "" }}
        </template>
      </el-table-column> -->
      <el-table-column prop="tong_tien" label="Thành tiền" min-width="45">
        <template slot-scope="scope">
          {{ formate.formatCurrency(scope.row.tong_tien) + " đ" }}
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
    <br>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { baoCaoCuoiNgay, downloadBaoCaoCuoiNgay } from "@/api/baocao";

export default {
  data: () => ({
    form: {
      date: [new Date(), new Date()],
      orderBy: null,
      don_hang: "hoa_don"
    },
    page: 1,
    per_page: 10,
    total: 0,
    tableData: [],
    doanhThu: 0,
    formate: formate,
    tableLoading: false,
  }),
  created() {
    this.getData();
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.getData();
    },
    async getData() {
      this.tableLoading = true;
      let data = await baoCaoCuoiNgay({
        page: this.page,
        per_page: this.per_page,
        date: this.form.date,
        don_hang: this.form.don_hang
      });
      this.doanhThu = data.tong_tien
      this.per_page = data.data.per_page;
      this.page = data.data.page;
      this.tableData = data.data.data;
      this.total = data.data.total;
      this.tableLoading = false;
    },
    taiBaoCao() {
      let start = new Date(this.form.date[0]).toISOString();
      let end = new Date(this.form.date[1]).toISOString();
      window.location.assign(
        process.env.VUE_APP_BASE_API +
          "downloadbaocaobanhang?date[]=" +
          start +
          "&date[]=" +
          end +
          "&orderBy=" +
          this.form.orderBy +
          "&don_hang=" +
          this.form.don_hang
      );
    }
  }
};
</script>
<style scoped></style>
