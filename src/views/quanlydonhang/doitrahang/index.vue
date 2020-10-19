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
      <el-col :span="5">
        <el-input
          v-model="form.search"
          size="small"
          placeholder="Tìm kiếm: Mã, tên đơn hàng, SĐT khách hàng ..."
          @keyup.enter.native="searchData()"
        ></el-input>
      </el-col>
      <el-col :span="3">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="searchData()"
          >Tìm kiếm</el-button
        >
      </el-col>
      <el-col :span="8">
        <el-button
          size="small"
          type="warning"
          icon="el-icon-plus"
          @click="traHang()"
          >TRẢ HÀNG</el-button
        >
        <el-button
          size="small"
          type="danger"
          icon="el-icon-plus"
          @click="doiHang()"
          >ĐỔI HÀNG</el-button
        >
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
                <el-table-column type="index" label="STT"></el-table-column>
                <el-table-column
                  property="san_pham.ten_san_pham"
                  label="Sản phẩm hàng hóa"
                  min-width="125"
                ></el-table-column>
                <el-table-column
                  prop="created_at"
                  label="Thời gian đổi trả"
                ></el-table-column>
                <el-table-column label="Loại">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.type == 'doi_hang'" type="warning"
                      >Đổi hàng</el-tag
                    >
                    <el-tag v-if="scope.row.type == 'tra_hang'" type="danger"
                      >Trả hàng</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="nguyen_nhan"
                  label="Nguyên nhân"
                ></el-table-column>
                <el-table-column
                  property="gia_ban"
                  label="Giá bán"
                  min-width="123"
                >
                  <template slot-scope="scope"
                    >{{ formate.formatCurrency(scope.row.gia_ban) }} đ</template
                  >
                </el-table-column>
                <el-table-column
                  property="so_luong"
                  label="Số lượng"
                  min-width="123"
                >
                  <template slot-scope="scope"
                    >{{ scope.row.so_luong }}
                    {{ scope.row.san_pham.don_vi_tinh }}</template
                  >
                </el-table-column>
                <el-table-column
                  property="doanh_thu"
                  label="Số tiền"
                  min-width="123"
                >
                  <template slot-scope="scope"
                    >{{
                      formate.formatCurrency(scope.row.doanh_thu)
                    }}
                    đ</template
                  >
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column sortable type="index" label="STT"></el-table-column>
          <el-table-column
            property="updated_at"
            label="Thời gian"
            min-width="125"
          ></el-table-column>
          <el-table-column
            property="ma"
            label="Mã đơn hàng"
            min-width="123"
          ></el-table-column>
          <el-table-column
            property="ten"
            label="Đơn hàng"
            min-width="123"
          ></el-table-column>
          <!-- <el-table-column prop="doanh_thu" label="Số tiền">
            <template slot-scope="scope">{{formate.formatCurrency(scope.row.so_tien)}} đ</template>
          </el-table-column>-->
          <el-table-column
            prop="user.name"
            label="Khách hàng"
          ></el-table-column>
          <el-table-column
            label="Hành động"
            align="center"
            fixed="right"
            width="120"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="Xem đơn hàng"
                placement="top"
              >
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
    <el-dialog
      title="CHỌN HÓA ĐƠN"
      :visible.sync="showHoaDon"
      width="850px"
      center
    >
      <el-row :gutter="20" justify="space-around">
        <el-col :span="8">
          <el-input
            v-model="formHoaDon.search"
            size="small"
            icon="el-icon-search"
            placeholder="Tìm mã đơn, SĐT, email khách hàng"
            @change="getHoaDon()"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            style="width: 100%"
            v-model="formHoaDon.date"
            type="daterange"
            range-separator="-"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            size="small"
            format="dd/MM/yyyy"
            @change="getHoaDon()"
          ></el-date-picker>
        </el-col>
        <el-col :span="8">
          <el-select
            filterable
            clearable
            size="small"
            v-model="formHoaDon.khach_hang"
            placeholder="Chọn khách hàng"
            style="width: 100%"
            @change="getHoaDon()"
          >
            <el-option
              v-for="item in khachHangs"
              :key="item.id"
              :label="item.ten"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <br />
      <el-table :data="hoaDons">
        <el-table-column prop="ma" label="Mã đơn" width="180"></el-table-column>
        <el-table-column prop="ten" label="Tên đơn hàng"></el-table-column>
        <el-table-column
          prop="created_at"
          label="Thời gian tạo"
        ></el-table-column>
        <el-table-column prop="user.name" label="Khách hàng"></el-table-column>
        <el-table-column label="Tổng tiền">
          <template slot-scope="scope"
            >{{ formate.formatCurrency(scope.row.tong_tien) }} đ</template
          >
        </el-table-column>
        <el-table-column label="Chọn" width="100">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="Chọn hóa đơn này"
              placement="top"
            >
              <el-button
                type="warning"
                size="small"
                @click="doiTraHang(scope.row.id)"
                >Chọn</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          @click="showHoaDon = false"
          icon="el-icon-close"
          >Đóng</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { doiTraHang } from "@/api/donhangnhacungcap";
import { getDonDathang } from "@/api/dondathang";
import { getKhachHang } from "@/api/khachhang";

export default {
  data() {
    return {
      showHoaDon: false,
      endPointImage: process.env.VUE_APP_BASE,
      page: 1,
      per_page: 10,
      total: 0,
      tableData: null,
      listLoading: true,
      hoaDons: [],
      loading: false,
      search: "",
      list: [],
      formate: formate,
      khachHangs: [],
      edit: false,
      formate: formate,
      doi: false,
      tra: false,
      formHoaDon: {
        date: [],
        khach_hang: [],
        search: "",
      },
      form: {
        date: [],
        nha_cung_cap: [],
        search: "",
      },
    };
  },

  created() {
    this.getDonHang();
    this.getHoaDon();
    this.getKhachHang();
  },

  mounted() {},

  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },
    async getKhachHang() {
      let data = await getKhachHang({
        per_page: 999999,
      });
      this.khachHangs = data.data.data;
    },
    doiHang() {
      this.doi = true;
      this.tra = false;
      this.showHoaDon = true;
    },
    traHang() {
      this.doi = false;
      this.tra = true;
      this.showHoaDon = true;
    },
    donHang(id) {
      this.$router.push("/quanlydonhang/capnhatdondathang/" + id);
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
        search: this.form.search,
      });
      this.tableData = data.data.data;
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.listLoading = false;
    },
    doiTraHang(id) {
      if (this.doi) {
        this.$router.push("doihang/" + id);
      }
      if (this.tra) {
        this.$router.push("khachtrahang/" + id);
      }
    },
    async getHoaDon() {
      let data = await getDonDathang({
        khach_hang: this.formHoaDon.khach_hang,
        date: this.formHoaDon.date,
        search: this.formHoaDon.search,
        hoa_don: true,
      });
      this.hoaDons = data.data.data;
      console.log("csa", this.hoaDons);
    },
  },
};
</script>


<style lang="scss" scoped>
</style>
