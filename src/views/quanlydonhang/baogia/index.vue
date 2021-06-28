<template>
  <div class="app-container" v-on:keyup.enter="searchData">
    <el-row :gutter="20" justify="space-around">
      <el-col :span="4">
        <el-input
           icon="el-icon-search"
          v-model="form.search"
          size="small"
          placeholder="Tìm kiếm"
        ></el-input>
      </el-col>

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
      <el-col :span="4">
        <el-select
          filterable
          clearable
          size="small"
          v-model="form.nha_cung_cap"
          placeholder="Lựa chọn nhà cung cấp"
          style="width: 100%"
        >
          <el-option
            v-for="item in nhaCungCaps"
            :key="item.id"
            :label="item.ten"
            :value="item.user_id"
          ></el-option>
        </el-select>
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
      <el-col :span="7">
        <router-link to="/quanlykho/taobaogia">
          <el-button
            style="float: right"
            size="small"
            class="primary-button"
            icon="el-icon-plus"
            >TẠO BÁO GIÁ</el-button
          >
        </router-link>
      </el-col>
    </el-row>
    <br />
    <h4><i style="color: green">DANH SÁCH BÁO GIÁ CỦA NHÀ CUNG CẤP</i></h4>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          style="width: 100%; font-size: 13px"
          border
        >
          <el-table-column
            sortable type="index"
            label="STT"
            align="center"
            width="85"
            >
            
          </el-table-column>
          <el-table-column
            property="ma"
            label="Mã báo giá"
            min-width="90"
          ></el-table-column>
          <el-table-column
            property="ten"
            label="Tên báo giá"
            min-width="123"
          ></el-table-column>
          <el-table-column
            prop="created_at"
            label="Thời gian gửi"
            align="center"
          ></el-table-column>
          <el-table-column
            property="ghi_chu"
            label="Ghi chú"
            min-width="123"
          ></el-table-column>
          <el-table-column
            label="Đơn tạo bởi"
            min-width="95"
            prop="user.name"
          ></el-table-column>
          <el-table-column
            label="Hành động"
            align="center"
            fixed="right"
            width="168"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="Chi tiết"
                placement="top"
              >
                <el-button
                  size="small"
                  @click="edit(scope.row.id)"
                  class="primary-button"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Xóa"
                placement="top"
              >
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="handleDelete(scope.row)"
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
import { listDonHang, xoaDonHang } from "@/api/donhangnhacungcap";
import { getBaoGia } from "@/api/baogia";
import { listSanPham } from "@/api/sanpham";
import { getNhaCungCap } from "@/api/khachhang";

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
      list: [],
      form: {
        date: [],
        nha_cung_cap: [],
        search: "",
      },
      formAdd: {
        id: null,
        ten: "",
        ma: "",
        tinh_thanh_id: null,
        toa_nha_id: null,
        ma_don_hang: "",
        ten_don_hang: "",
        thiet_bi: [],
        cam_bien: [],
        trang_thai: "moi_tao",
        nhan_vien_id: null,
        ghi_chu: "",
        thoi_gian: null,
        nguoi_mua_hang: "",
        tong_tien: 0,
        hinh_anhs: [],
      },
      nhaCungCaps: [],
      showCreate: false,
      rules: {
        ten: [
          {
            required: true,
            message: "Hãy nhập tên đơn hàng",
            trigger: "blur",
          },
        ],
        ma: [
          {
            required: true,
            message: "Mã đơn hàng không thể bỏ trống",
            trigger: "blur",
          },
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Hãy chọn một tỉnh thành",
            trigger: "blur",
          },
        ],
        toa_nha_id: [
          {
            required: true,
            message: "Hãy chọn một tòa nhà",
            trigger: "blur",
          },
        ],
        thoi_gian: [
          {
            required: true,
            message: "Thời gian không thể bỏ trống",
            trigger: "blur",
          },
        ],
        trang_thai: [
          {
            required: true,
            message: "Trạng thái không thể bỏ trống",
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    this.getDonHang();
    this.getNhaCungCap();
  },

  mounted() {},

  methods: {
    duyetDon() {},
    huyDon() {},
    handleCurrentChange(val) {
      this.page = val;
      this.getDonHang();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.getDonHang()
    },
    searchData() {
      this.getDonHang();
    },
    async getNhaCungCap() {
      let data = await getNhaCungCap({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },
    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa báo giá: " +
            "<strong>" +
            data.ten +
            "</strong>",
          "Xóa báo giá",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        this.listLoading = true;
        let status = await xoaDonHang(data.id);
        this.getDonHang();
        this.$message({
          message: "Xóa thành công",
          type: "success",
        });
      } catch (error) {
        this.listLoading = false;
      }
    },
    async getDonHang() {
      this.listLoading = true;
      let data = await getBaoGia({
        per_page: this.per_page,
        page: this.page,
        nha_cung_cap: this.form.nha_cung_cap,
        date: this.form.date,
        search: this.form.search
      });
      this.tableData = data.data.data;
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.listLoading = false;
    },
    edit(id) {
      this.$router.push("/quanlykho/capnhatbaogia/" + id);
    },
  },
};
</script>


<style lang="scss" scoped>
</style>
