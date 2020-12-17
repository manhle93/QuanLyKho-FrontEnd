<template>
  <div class="app-container">
    <h4><i style="color: green">BÁO CÁO HÀNG HÓA</i></h4>
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
          v-model="form.danh_muc_id"
          placeholder="Lựa chọn danh mục"
          size="small"
          style="width: 100%"
          @change="getData()"
        >
          <el-option
            v-for="item in danhMucs"
            :key="item.id"
            :label="item.ten_danh_muc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="16">
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
        <span style="color: red;"> {{ formate.formatCurrency(doanhThu) }}</span>
        (VND)
      </el-col>
      <el-col :span="5">
        <span style="color: green;">
          Số lượng đơn:
        </span>
        <span style="color: red;"> {{ formate.formatCurrency(tongDon) }}</span>
        (Đơn)
      </el-col>
      <el-col :span="5">
        <span style="color: green;">
          Số lượng sản phẩm
        </span>
        <span style="color: red;">
          {{ formate.formatCurrency(tongSanPham) }}</span
        >
        (Sản phẩm)
      </el-col>
      <br />
      <br />
    </el-row>
    <el-table :data="tableData" v-loading="tableLoading" border fit>
      <el-table-column type="index" label="STT"></el-table-column>
      <el-table-column prop="ma" label="Mã hàng hóa"></el-table-column>
      <el-table-column
        prop="ten_san_pham"
        label="Tên hàng hóa"
      ></el-table-column>
      <el-table-column prop="so_luong_ban" label="số lượng bán">
      </el-table-column>
      <el-table-column prop="so_luong_tra" label="Số lượng trả">
      </el-table-column>
      <el-table-column label="Doanh thu">
        <template slot-scope="scope">
          {{ formate.formatCurrency(scope.row.doanh_thu) }}
        </template>
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
import { baoCaoHangHoa, downloadBaoCaoHangHoa } from "@/api/baocao";
import { index } from "@/api/danhmucsanpham";

export default {
  data: () => ({
    form: {
      date: [new Date(), new Date()],
      orderBy: null,
      don_hang: null,
      danh_muc_id: null
    },
    page: 1,
    per_page: 10,
    total: 0,
    tableData: [],
    formate: formate,
    tableLoading: false,
    danhMucs: [],
    tongDon: 0,
    doanhThu: 0,
    tongSanPham: 0
  }),
  created() {
    this.getData();
    this.getDanhMuc();
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
      let data = await baoCaoHangHoa({
        date: this.form.date,
        danh_muc_id: this.form.danh_muc_id,
        per_page: this.per_page,
        page: this.page
      });
      this.tableData = data.data.data;
      this.tableLoading = false;
      this.tongDon = data.tong_don;
      this.doanhThu = data.doanh_thu;
      this.tongSanPham = data.data.total;
      this.total = data.data.total
    },
    async getDanhMuc() {
      let data = await index();
      this.danhMucs = data.data;
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
