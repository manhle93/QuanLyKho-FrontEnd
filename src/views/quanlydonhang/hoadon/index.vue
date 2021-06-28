<template>
  <div class="app-container" v-on:keyup.enter="getDonHang">
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
          remote
          :remote-method="remoteMethodKH"
          reserve-keyword
        >
          <el-option
            v-for="item in nhaCungCaps"
            :key="item.id"
            :label="item.ten"
            :value="item.user_id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input
          v-model="form.search"
          size="small"
          placeholder="Tìm kiếm: Mã, tên đơn hàng, SĐT khách hàng ..."
          @keyup.enter.native="getDonHang()"
        ></el-input>
      </el-col>
      <el-col :span="3">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="getDonHang()"
          >Tìm kiếm</el-button
        >
      </el-col>
      <el-col :span="6">
        <router-link :to="'/quanlydonhang/taodondathang'">
          <el-button
            style="float: right"
            size="small"
            class="primary-button"
            icon="el-icon-plus"
            >HÓA ĐƠN</el-button
          >
        </router-link>
      </el-col>
    </el-row>
    <br />
    <div
      class="d-flex"
      style="align-items: center; justify-content: space-between"
    >
      <h4>
        <i style="color: green">DANH SÁCH HÓA ĐƠN XUẤT KHO</i>
      </h4>
      <el-dropdown trigger="click">
        <el-button
          class="el-dropdown-link primary-button"
          icon="el-icon-setting"
          circle
          size="mini"
        ></el-button>
        <el-dropdown-menu slot="dropdown" style="padding-right: 5px">
          <el-checkbox
            v-model="showColumn.stt"
            style="padding-left: 10px"
            align="center"
            >STT</el-checkbox
          >
          <el-checkbox v-model="showColumn.ma">Mã đơn hàng</el-checkbox>
          <el-checkbox v-model="showColumn.ten">Tên đơn hàng</el-checkbox>
          <el-checkbox v-model="showColumn.thoi_gian"
            >Thời gian tạo</el-checkbox
          >
          <el-checkbox v-model="showColumn.ghi_chu">Ghi chú</el-checkbox>
          <el-checkbox v-model="showColumn.da_tt">Đã thanh toán</el-checkbox>
          <el-checkbox v-model="showColumn.con_phai_tt"
            >Còn phải thanh toán</el-checkbox
          >
          <el-checkbox v-model="showColumn.trang_thai">Trạng thái</el-checkbox>
          <el-checkbox
            v-model="showColumn.khach_hang"
            style="padding-right: 10px"
            >Khách hàng</el-checkbox
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <br />
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
              <el-tabs type="border-card">
                <el-tab-pane label="Thông tin">
                  <el-table border :data="scope.row.san_phams">
                    <el-table-column
                      sortable
                      type="index"
                      label="STT"
                      align="center"
                    ></el-table-column>
                    <el-table-column
                      property="san_pham.ten_san_pham"
                      label="Tên sản phẩm"
                      min-width="123"
                    ></el-table-column>
                    <el-table-column
                      prop="san_pham.don_vi_tinh"
                      label="Đơn vị tính"
                    ></el-table-column>
                    <el-table-column
                      prop="so_luong"
                      label="Số lượng"
                    ></el-table-column>
                    <el-table-column prop="gia_ban" label="Giá bán">
                      <template slot-scope="scope">
                        {{ formate.formatCurrency(scope.row.gia_ban) }}
                        đ
                      </template>
                    </el-table-column>
                    <el-table-column label="Thành tiền">
                      <template slot-scope="cope">
                        {{
                          formate.formatCurrency(
                            cope.row.so_luong * cope.row.gia_ban
                          )
                        }}
                      </template>
                    </el-table-column>
                  </el-table>
                  <p>
                    Tổng tiền:
                    {{ formate.formatCurrency(scope.row.tong_tien) }} đ
                  </p>
                  <p>
                    Giảm giá: {{ formate.formatCurrency(scope.row.giam_gia) }} đ
                  </p>
                  <p>
                    Đã thanh toán:
                    {{ formate.formatCurrency(scope.row.da_thanh_toan) }} đ
                  </p>
                  <p>
                    Phải thanh toán:
                    {{ formate.formatCurrency(scope.row.con_phai_thanh_toan) }}
                    đ
                  </p>
                </el-tab-pane>
                <el-tab-pane label="Thanh toán">
                  <el-table border :data="scope.row.thanh_toan_bo_xung">
                    <el-table-column type="index" label="STT" align="center"></el-table-column>
                    <el-table-column
                      prop="created_at"
                      label="Thời tian"
                    ></el-table-column>
                    <el-table-column label="Hình thức">
                      <template slot-scope="scope">
                        <div v-if="scope.row.hinh_thuc == 'tien_mat'">
                          Tiền mặt
                        </div>
                        <div v-if="scope.row.hinh_thuc == 'chuyen_khoan'">
                          Chuyển khoản/Quẹt thẻ
                        </div>
                        <div v-if="scope.row.hinh_thuc == 'tai_khoan'">
                          Tài khoản
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="Số tiền">
                      <template slot-scope="scope">
                        {{ formate.formatCurrency(scope.row.so_tien) }}
                        đ
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            type="index"
            label="STT"
            align="center"
            v-if="showColumn.stt"
          ></el-table-column>
          <el-table-column
            property="ma"
            label="Mã đơn hàng"
            min-width="90"
            v-if="showColumn.ma"
          ></el-table-column>
          <el-table-column
            v-if="showColumn.ten"
            property="ten"
            label="Tên đơn hàng"
            min-width="123"
          ></el-table-column>
          <el-table-column
            v-if="showColumn.thoi_gian"
            prop="created_at"
            label="Thời gian tạo"
            min-width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="showColumn.ghi_chu"
            property="ghi_chu"
            label="Ghi chú"
            min-width="150"
          ></el-table-column>
          <el-table-column
            v-if="showColumn.da_tt"
            label="Đã thanh toán"
            min-width="80"
            prop="da_thanh_toan"
          >
            <template slot-scope="scope"
              >{{ formate.formatCurrency(scope.row.da_thanh_toan) }} đ</template
            >
          </el-table-column>
          <el-table-column
            v-if="showColumn.con_phai_tt"
            label="Còn phải thanh toán"
            min-width="90"
            prop="con_phai_thanh_toan"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.con_phai_thanh_toan == 0">
                {{ formate.formatCurrency(scope.row.con_phai_thanh_toan) }} đ
              </div>
              <el-tag type="danger" v-if="scope.row.con_phai_thanh_toan > 0">
                {{ formate.formatCurrency(scope.row.con_phai_thanh_toan) }}
                đ
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showColumn.trang_thai"
            property="trang_thai"
            label="Trạng thái"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-tag effect="plain" v-if="scope.row.trang_thai == 'moi_tao'"
                >Mới tạo</el-tag
              >
              <el-tag
                effect="plain"
                type="danger"
                v-if="scope.row.trang_thai == 'huy_bo'"
                >Hủy bỏ</el-tag
              >
              <el-tag
                effect="plain"
                v-if="scope.row.trang_thai == 'huy_hoa_don'"
                type="warning"
                >Hủy hóa đơn</el-tag
              >
              <el-tag
                effect="plain"
                type="success"
                v-if="scope.row.trang_thai == 'hoa_don'"
                >Đã chuyển hóa đơn</el-tag
              >
              
              <el-tag 
                effect="dark" 
                type="success"
                v-if="scope.row.trang_thai_giao_hang == null"
                >Không vận chuyển</el-tag
              >
              <el-tag
                effect="dark"
                type=""
                v-if="scope.row.trang_thai_giao_hang == 'nhan_don'"
                >Đang giao hàng</el-tag
              >
              <el-tag
                effect="dark"
                type=""
                v-if="scope.row.trang_thai_giao_hang == 'cho_xu_ly'"
                >Chờ xử lý</el-tag
              >
              <el-tag
                effect="dark"
                v-if="scope.row.trang_thai_giao_hang == 'tu_choi'"
                type="danger"
                >Từ chối giao hàng</el-tag
              >
              <el-tag
                effect="dark"
                type="success"
                v-if="scope.row.trang_thai_giao_hang == 'hoan_thanh'"
                >Giao hàng thành công</el-tag
              >
              <el-tag
                effect="dark"
                type="danger"
                v-if="scope.row.trang_thai_giao_hang == 'huy_don'"
                >Khách hủy đơn</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            v-if="showColumn.khach_hang"
            label="Khách hàng"
            min-width="95"
            prop="user.name"
          ></el-table-column>
          <el-table-column label="Hành động" align="center" width="200">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="Hủy đơn"
                placement="top"
              >
                <el-button
                  v-if="
                    scope.row.trang_thai != 'huy_bo' &&
                      scope.row.trang_thai != 'huy_hoa_don'
                  "
                  size="small"
                  type="warning"
                  icon="el-icon-refresh-left"
                  circle
                  @click="hoanDon(scope.row)"
                ></el-button>
              </el-tooltip>

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
              <!-- <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="handleDelete(scope.row)"
                ></el-button>
              </el-tooltip>-->
              <el-tooltip
                class="item"
                effect="dark"
                content="Thanh toán bổ sung"
                placement="top"
              >
                <el-button
                  v-if="scope.row.con_phai_thanh_toan > 0"
                  size="small"
                  type="primary"
                  icon="el-icon-postcard"
                  circle
                  @click="showThanhToanBoXung(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="In hóa đơn"
                placement="top"
              >
                <el-button
                  size="small"
                  type="info"
                  icon="el-icon-printer"
                  circle
                  @click="inHoaDon(scope.row)"
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
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="THANH TOÁN BỔ SUNG"
      width="450px"
      center
      :visible.sync="showThanhToan"
    >
      <el-form>
        <label>
          Số tiền còn phải thanh toán:
          {{
            formate.formatCurrency(
              formThanhToan.tong_tien - formThanhToan.thanh_toan
            )
          }}
          đ
        </label>
        <br />
        <br />
        <el-form-item label="Hình thức thanh toán">
          <el-select
            style="width: 100%"
            v-model="formThanhToan.hinh_thuc"
            placeholder="Phương thức thanh toán"
          >
            <el-option value="tien_mat" label="Tiền mặt"></el-option>
            <el-option
              value="chuyen_khoan"
              label="Chuyển khoản/Quẹt thẻ"
            ></el-option>
            <el-option
              value="tai_khoan"
              label="Tài khoản"
              :disabled="!thanhToanTaiKhoan"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Số tiền thanh toán">
          <el-input
            @blur="isInputActive = false"
            @focus="isInputActive = true"
            :min="0"
            :max="Number(formThanhToan.tong_tien)"
            v-model="displayValue"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          @click="showThanhToan = false"
          icon="el-icon-close"
          >Đóng</el-button
        >
        <el-button
          class="primary-button"
          @click="thanhToan()"
          icon="el-icon-close"
          >Thanh toán</el-button
        >
      </span>
    </el-dialog>
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
  thanhToanBoSung
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
      thanhToanTaiKhoan: false,
      showColumn: {
        stt: true,
        ma: true,
        ten: true,
        thoi_gian: true,
        ghi_chu: true,
        da_tt: true,
        con_phai_tt: true,
        trang_thai: true,
        khach_hang: true
      },
      list: [],
      showThanhToan: false,
      form: {
        date: [],
        khach_hang: null,
        search: null
      },
      formThanhToan: {
        id: null,
        hinh_thuc: null,
        tong_tien: 0,
        thanh_toan: 0
      },
      isInputActive: null,
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
      formate: formate,
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
    this.getKhachHang();
  },
  computed: {
    displayValue: {
      get() {
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          return this.formThanhToan.thanh_toan.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.formThanhToan.thanh_toan).replace(
            /(\d)(?=(\d{3})+(?:\.\d+)?$)/g,
            "$1."
          );
        }
      },
      set(modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        let newValue = parseFloat(
          String(modifiedValue).replace(/[^\d\.]/g, "")
        );
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        if (newValue > this.formThanhToan.tong_tien) {
          newValue = this.formThanhToan.tong_tien;
        }
        this.formThanhToan.thanh_toan = newValue;
      }
    }
  },
  mounted() {},

  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },
    inHoaDon(data) {
      window.open(
        process.env.VUE_APP_BASE_API + "inhoadon/" + data.id,
        "_blank"
      );
    },
    async remoteMethodKH(query) {
      let data = await getKhachHang({
        per_page: 10,
        search: query
      });
      this.nhaCungCaps = data.data.data;
    },

    showThanhToanBoXung(data) {
      this.thanhToanTaiKhoan = data.user_id;
      this.showThanhToan = true;
      this.formThanhToan.id = data.id;
      this.formThanhToan.tong_tien = data.con_phai_thanh_toan;
      this.formThanhToan.thanh_toan = 0;
    },
    async thanhToan() {
      if (!this.formThanhToan.hinh_thuc) {
        this.$message({
          message: "Hãy chọn hình thức thanh toán",
          type: "warning"
        });
        return;
      }
      if (this.formThanhToan.thanh_toan == 0) {
        this.$message({
          message: "Nhập số tiền thanh toán",
          type: "warning"
        });
        return;
      }
      let data = await thanhToanBoSung(this.formThanhToan);
      this.showThanhToan = false;
      this.getDonHang();
      this.$message({
        message: "Thành công",
        type: "success"
      });
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
            type: "warning"
          }
        );
        this.listLoading = true;
        let status = await xoaDonDathang(data.id);
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
      let data = await getDonDathang({
        per_page: this.per_page,
        page: this.page,
        khach_hang: this.form.khach_hang,
        date: this.form.date,
        hoa_don: true,
        search: this.form.search
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
            type: "warning"
          }
        );
        let status = await huyDon(data.id);
        this.getDonHang();
        this.$message({
          message: "Thành công",
          type: "success"
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
            type: "warning"
          }
        );
        let status = await chuyenHoaDon(data.id);
        this.getDonHang();
        this.$message({
          message: "Hủy đơn thành công",
          type: "success"
        });
      } catch (error) {}
    },
    async getKhachHang() {
      let data = await getKhachHang({
        per_page: 20
      });
      this.nhaCungCaps = data.data.data;
    }
  }
};
</script>

<style lang="scss" scoped>
.d-flex {
  display: flex;
  flex-direction: row;
}
</style>
