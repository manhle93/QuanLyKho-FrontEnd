<template>
  <div class="app-container" v-on:keyup.enter="searchData">
    <el-row :gutter="20" justify="space-around">
      <el-col :span="6">
        <el-date-picker
          style="width: 100%"
          v-model="form.date"
          type="daterange"
          range-separator="-"
          start-placeholder="Từ ngày"
          end-placeholder="Đến ngày"
          size="small"
          format="dd/MM/yyyy"
        ></el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="searchData()"
        >Tìm kiếm</el-button>
      </el-col>
    </el-row>
    <br />
    <h4><i style="color: green">DANH SÁCH ĐƠN ĐỔI TRẢ HÀNG</i></h4>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          style="width: 100%; font-size: 13px"
          border
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <h3>Chi tiết hàng đổi trả</h3>
              <el-table :data="props.row.tra_hang">
                <el-table-column sortable type="index" label="STT"></el-table-column>
                <el-table-column property="san_pham.ten_san_pham" label="Sản phẩm hàng hóa" min-width="125"></el-table-column>
                <el-table-column property="gia_ban" label="Giá bán" min-width="123">
                  <template slot-scope="scope">{{formate.formatCurrency(scope.row.gia_ban)}} đ</template>
                </el-table-column>
                <el-table-column property="so_luong" label="Số lượng" min-width="123">
                  <template slot-scope="scope">{{scope.row.so_luong}} {{scope.row.san_pham.don_vi_tinh}}</template>
                </el-table-column>
                <el-table-column property="doanh_thu" label="Thành tiền" min-width="123">
                  <template slot-scope="scope">{{formate.formatCurrency(scope.row.doanh_thu)}} đ</template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column sortable type="index" label="STT"></el-table-column>
          <el-table-column property="updated_at" label="Thời gian" min-width="125"></el-table-column>
          <el-table-column property="ma" label="Mã đơn hàng" min-width="123"></el-table-column>
          <el-table-column property="ten" label="Đơn hàng" min-width="123"></el-table-column>
          <!-- <el-table-column prop="doanh_thu" label="Số tiền">
            <template slot-scope="scope">{{formate.formatCurrency(scope.row.so_tien)}} đ</template>
          </el-table-column>-->
          <el-table-column prop="nguoi_mua_hang" label="Khách hàng"></el-table-column>
          <el-table-column label="Hành động" align="center" fixed="right" width="120">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="Xem đơn hàng" placement="top">
                <el-button
                  size="small"
                  @click="donHang(scope.row.id)"
                  class="primary-button"
                  icon="el-icon-view"
                  circle
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <br />
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
import { doiTraHang } from "@/api/donhangnhacungcap";

export default {
  data() {
    return {
      endPointImage: process.env.VUE_APP_BASE,
      page: 1,
      per_page: 10,
      total: 0,
      tableData: null,
      listLoading: true,
      loading: false,
      search: "",
      list: [],
      formate: formate,
      edit: false,
      form: {
        date: [],
        nha_cung_cap: [],
      },
    };
  },

  created() {
    this.getDonHang();
    // this.getKhachHang();
  },

  mounted() {},

  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },
    donHang(id){
      this.$router.push('/quanlydonhang/capnhatdondathang/' + id)
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.searchData(this.page, this.per_page);
    },
    searchData(page, per_page) {
      this.getDonHang();
    },
    async getDonHang() {
      this.listLoading = true;
      let data = await doiTraHang({
        per_page: this.per_page,
        page: this.page,
        nha_cung_cap: this.form.nha_cung_cap,
        date: this.form.date,
      });
      this.tableData = data.data.data;
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.listLoading = false;
    }
  },
};
</script>


<style lang="scss" scoped>
</style>
