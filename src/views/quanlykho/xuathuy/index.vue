<template>
  <div class="app-container" v-on:keyup.enter="getDonHang">
    <el-form :model="form">
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
        <el-col :span="4">
          <el-input size="small" placeholder="Tìm kiếm" v-model="search"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="getDonHang"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="11">
          <router-link to="/quanlydonhang/taoxuathuy">
            <el-button
              style="float: right"
              size="small"
              class="primary-button"
              icon="el-icon-plus"
            >TẠO XUẤT HỦY</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <h4>Danh sách phiếu xuất hủy</h4>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          style="width: 100%; font-size: 13px"
          border
        >
          <el-table-column sortable type="index" label="STT"></el-table-column>
          <el-table-column property="ma" label="Mã đơn" min-width="125"></el-table-column>
          <el-table-column property="ten" label="Phiếu xuất hủy" min-width="123"></el-table-column>
          <el-table-column prop="created_at" label="Thời gian tạo"></el-table-column>
          <el-table-column property="ghi_chu" label="Ghi chú" min-width="123"></el-table-column>
           <el-table-column label="Người tạo" min-width="95" prop="nguoi_tao.name"></el-table-column>
          <el-table-column label="Hành động" align="center" fixed="right" width="200">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="Chi tiết" placement="top">
                <el-button
                  size="small"
                  @click="edit(scope.row.id)"
                  class="primary-button"
                  icon="el-icon-edit"
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
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getKhachHang } from "@/api/khachhang";
import { getXuatHuy, xoaKiemKho } from "@/api/kho";

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
      form: {
        date: [],
        khach_hang: null,
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
    this.getKhachHang();
  },

  mounted() {},

  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getDonHang();
    },

    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa phiếu kiểm kho: " +
            "<strong>" +
            data.ten +
            "</strong>",
          "Xóa phiếu kiểm kho",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        this.listLoading = true;
        let status = await xoaKiemKho(data.id);
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
      let data = await getXuatHuy({
        per_page: this.per_page,
        page: this.page,
        search: this.search
      });
      this.tableData = data.data.data;
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.listLoading = false;
    },
    edit(id) {
      this.$router.push("/quanlydonhang/chitietxuathuy/" + id);
    },
    async getKhachHang() {
      let data = await getKhachHang({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },
  },
};
</script>


<style lang="scss" scoped>
</style>
