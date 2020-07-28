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
            filterable
            clearable
            size="small"
            v-model="form.khach_hang"
            placeholder="Chọn khách hàng"
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
            @click="getDonHang()"
          >Tìm kiếm</el-button>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <h4>Danh sách đơn trả hàng nhập kho</h4>
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
            <template slot-scope="scope">
              <el-table :data="scope.row.san_phams">
                <el-table-column sortable type="index" label="STT"></el-table-column>
                <el-table-column
                  property="san_pham.ten_san_pham"
                  label="Tên sản phẩm"
                  min-width="123"
                ></el-table-column>
                <el-table-column prop="san_pham.don_vi_tinh" label="Đơn vị tính"></el-table-column>
                <el-table-column prop="so_luong" label="Số lượng"></el-table-column>
                <el-table-column prop="gia_ban" label="Giá bán">
                  <template slot-scope="scope">{{formate.formatCurrency(scope.row.gia_ban)}} đ</template>
                </el-table-column>
                <el-table-column label="Thành tiền">
                  <template
                    slot-scope="cope"
                  >{{formate.formatCurrency(cope.row.so_luong * cope.row.gia_ban)}} đ</template>
                </el-table-column>
              </el-table>
              <p>Tổng tiền: {{formate.formatCurrency(scope.row.tong_tien)}} đ</p>
              <p>Giảm giá: {{formate.formatCurrency(scope.row.giam_gia)}} đ</p>
              <p>Đã thanh toán: {{formate.formatCurrency(scope.row.da_thanh_toan)}} đ</p>
              <p>Phải thanh toán: {{formate.formatCurrency(scope.row.con_phai_thanh_toan)}} đ</p>
            </template>
          </el-table-column>
          <el-table-column sortable type="index" label="STT"></el-table-column>
          <el-table-column property="ma" label="Mã đơn hàng" min-width="125"></el-table-column>
          <el-table-column property="ten" label="Tên đơn hàng" min-width="123"></el-table-column>
          <el-table-column prop="created_at" label="Thời gian tạo"></el-table-column>
          <el-table-column property="ghi_chu" label="Ghi chú" min-width="123"></el-table-column>
          <el-table-column label="Đã thanh toán" min-width="115" prop="da_thanh_toan">
            <template slot-scope="scope">{{formate.formatCurrency(scope.row.da_thanh_toan)}} đ</template>
          </el-table-column>
          <el-table-column label="Còn phải thanh toán" min-width="115" prop="con_phai_thanh_toan">
            <template slot-scope="scope">{{formate.formatCurrency(scope.row.con_phai_thanh_toan)}} đ</template>
          </el-table-column>
          <el-table-column property="trang_thai" label="Trạng thái" min-width="125">
            <template slot-scope="scope">
              <el-tag effect="plain" v-if="scope.row.trang_thai == 'moi_tao'">Mới tạo</el-tag>
              <el-tag effect="plain" type="danger" v-if="scope.row.trang_thai == 'huy_bo'">Hủy bỏ</el-tag>
              <el-tag
                effect="plain"
                v-if="scope.row.trang_thai == 'huy_hoa_don'"
                type="warning"
              >Hủy hóa đơn</el-tag>
              <el-tag
                effect="plain"
                type="success"
                v-if="scope.row.trang_thai == 'hoa_don'"
              >Đã chuyển hóa đơn</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Khách hàng" min-width="95" prop="user.name"></el-table-column>
          <el-table-column label="Hành động" align="center" fixed="right" width="200">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="Hủy đơn" placement="top">
                <el-button
                  v-if="scope.row.trang_thai != 'huy_bo' && scope.row.trang_thai != 'huy_hoa_don'"
                  size="small"
                  type="warning"
                  icon="el-icon-refresh-left"
                  circle
                  @click="hoanDon(scope.row)"
                ></el-button>
              </el-tooltip>

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
import { listDonHang, xoaDonHang } from "@/api/donhangnhacungcap";
import {
  getBangGia,
  getDonDathang,
  xoaDonDathang,
  huyDon,
  chuyenHoaDon,
} from "@/api/dondathang";
import { getKhachHang } from "@/api/khachhang";

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
      formate: formate,
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
          "Bạn có chắc chắn muốn xóa đơn đặt hàng hàng: " +
            "<strong>" +
            data.ten +
            "</strong>",
          "Xóa đơn đặt hàng",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        this.listLoading = true;
        let status = await xoaDonDathang(data.id);
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
      let data = await getDonDathang({
        per_page: this.per_page,
        page: this.page,
        khach_hang: this.form.khach_hang,
        date: this.form.date,
        tra_hang: true,
      });
      this.tableData = data.data.data;
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.listLoading = false;
    },
    edit(id) {
      this.$router.push("/quanlydonhang/capnhatdondathang/" + id);
    },
    async hoanDon(data) {
      try {
        let comfirm = await this.$confirm(
          "<strong>" +
            data.ten +
            "</strong>" +
            " sẽ bị hủy, và hoàn tiền vào tài khoản khách hàng nếu có",
          "Hủy đơn hàng",
          {
            confirmButtonText: "Đồng ý",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        let status = await huyDon(data.id);
        this.getDonHang();
        this.$message({
          message: "Thành công",
          type: "success",
        });
      } catch (error) {}
    },
    async hoaDon(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn chuyển hóa đơn cho đơn đặt hàng hàng: " +
            "<strong>" +
            data.ten +
            "</strong>",
          "Xóa đơn đặt hàng",
          {
            confirmButtonText: "Đồng ý",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        let status = await chuyenHoaDon(data.id);
        this.getDonHang();
        this.$message({
          message: "Hủy đơn thành công",
          type: "success",
        });
      } catch (error) {}
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
