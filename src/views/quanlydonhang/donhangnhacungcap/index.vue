<template>
  <div class="app-container" v-on:keyup.enter="searchData">
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
          <el-select
            size="small"
            v-model="form.nha_cung_cap"
            placeholder="Chọn nhà cung cấp"
            style="width: 100%"
          >
            <el-option
              v-for="item in nhaCungCaps"
              :key="item.id"
              :label="item.ten"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="11">
          <router-link to="/quanlydonhang/taodonnhacungcap">
            <el-button
              style="float: right"
              size="small"
              class="primary-button"
              icon="el-icon-plus"
            >Tạo đơn</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <h4>Danh sách đơn hàng nhà cung cấp</h4>
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
          <el-table-column property="ma" label="Mã đơn hàng" min-width="125"></el-table-column>
          <el-table-column property="ten" label="Tên đơn hàng" min-width="123"></el-table-column>
          <el-table-column prop="thoi_gian" label="Thời gian giao dự kiến">
            <!-- <template slot-scope="scope">{{formatDate(scope.row.thoi_gian)}}</template> -->
          </el-table-column>
          <el-table-column property="ghi_chu" label="Ghi chú" min-width="123"></el-table-column>
          <el-table-column label="Chiết khấu" min-width="115" prop="chiet_khau"></el-table-column>
          <el-table-column label="Tổng tiền" min-width="115" prop="tong_tien"></el-table-column>
          <el-table-column property="trang_thai" label="Trạng thái" min-width="125">
            <template slot-scope="scope">
              <el-tag effect="plain" v-if="scope.row.trang_thai == 'moi_tao'">Mới tạo</el-tag>
              <el-tag effect="plain" type="danger" v-if="scope.row.trang_thai == 'huy_bo'">Hủy bỏ</el-tag>
              <el-tag
                effect="plain"
                type="success"
                v-if="scope.row.trang_thai == 'da_duyet'"
              >Đã duyệt đơn</el-tag>
              <el-tag
                effect="dark"
                type="success"
                v-if="scope.row.trang_thai == 'nhap_kho'"
              >Đã nhập kho</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Đơn tạo bởi" min-width="95" prop="user.name"></el-table-column>
          <el-table-column label="Hành động" align="center" fixed="right" width="120">
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

              <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
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
        nha_cung_cap: []
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
        hinh_anhs: []
      },
      nhaCungCaps: [],
      showCreate: false,
      rules: {
        ten: [
          {
            required: true,
            message: "Hãy nhập tên đơn hàng",
            trigger: "blur"
          }
        ],
        ma: [
          {
            required: true,
            message: "Mã đơn hàng không thể bỏ trống",
            trigger: "blur"
          }
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Hãy chọn một tỉnh thành",
            trigger: "blur"
          }
        ],
        toa_nha_id: [
          {
            required: true,
            message: "Hãy chọn một tòa nhà",
            trigger: "blur"
          }
        ],
        thoi_gian: [
          {
            required: true,
            message: "Thời gian không thể bỏ trống",
            trigger: "blur"
          }
        ],
        trang_thai: [
          {
            required: true,
            message: "Trạng thái không thể bỏ trống",
            trigger: "blur"
          }
        ]
      }
    };
  },

  created() {
    this.getDonHang();
  },

  mounted() {},

  methods: {
    duyetDon() {},
    huyDon() {},
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
      this.searchData(this.page, this.per_page);
    },

    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa đơn hàng: " +
            "<strong>" +
            data.ten +
            "</strong>",
          "Xóa đơn hàng",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        this.listLoading = true;
        let status = await xoaDonHang(data.id);
        this.getDonHang();
        this.$message({
          message: "Xóa thành công",
          type: "success"
        });
      } catch (error) {
        this.listLoading = false;
      }
    },
    async getDonHang() {
      this.listLoading = true;
      let data = await listDonHang();
      this.tableData = data.data.data;
      console.log(this.tableData)
      this.listLoading = false;
    },
    edit(id) {
      this.$router.push("/quanlydonhang/capnhatdonhang/" + id);
    }
  }
};
</script>


<style lang="scss" scoped>
</style>
