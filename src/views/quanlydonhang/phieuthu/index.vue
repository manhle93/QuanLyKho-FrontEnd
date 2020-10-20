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
      <el-col :span="4">
        <el-input
          v-model="form.search"
          placeholder="Tìm kiếm"
          size="small"
          @keyup.enter.native="searchData"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="3">
          <el-select
            filterable
            clearable
            style="width: 100%; height: 33px !important;"
            v-model="form.hinh_thuc"
            placeholder="Phương thức thanh toán"
            size="small"
          >
          <el-option value="tra_truoc" label="Trả trước"></el-option>
            <el-option value="tien_mat" label="[Trả sau] Tiền mặt"></el-option>
            <el-option value="chuyen_khoan" label="[Trả sau] Chuyển khoản/Quẹt thẻ"></el-option>
            <el-option value="tai_khoan" label="[Trả sau] Tài khoản"></el-option>
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
      <el-col :span="11">
        <el-button
          style="float: right"
          size="small"
          class="primary-button"
          icon="el-icon-plus"
          @click="showFormAdd()"
          >TẠO PHIẾU THU</el-button
        >
      </el-col>
    </el-row>
    <br />
    <h4><i style="color: green">DANH SÁCH PHIẾU THU</i></h4>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          style="width: 100%; font-size: 13px"
          border
        >
          <el-table-column sortable type="index" label="STT" align="center"></el-table-column>
          <el-table-column property="created_at" label="Thời gian" min-width="75" align="center"></el-table-column>
          <el-table-column prop="so_tien" label="Số tiền" min-width="55" align="center">
            <template slot-scope="scope">{{formate.formatCurrency(scope.row.so_tien)}} đ</template>
          </el-table-column>
          <el-table-column property="noi_dung" label="Nội dung" min-width="200"></el-table-column>
          <el-table-column
            property="hinh_thuc"
            label="Hình thức"
            min-width="75"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                type="success"
                effect="plain"
                v-if="scope.row.hinh_thuc == null"
              >Thanh toán trước</el-tag>
              <el-tag
                type="primary"
                effect="plain"
                v-if="scope.row.hinh_thuc !== null && scope.row.hinh_thuc == 'chuyen_khoan'"
              >Thanh toán sau: Chuyển Khoản</el-tag>
              <el-tag
                type="primary"
                effect="plain"
                v-if="scope.row.hinh_thuc !== null && scope.row.hinh_thuc == 'tien_mat'"
              >Thanh toán sau: Tiền mặt</el-tag>
              <el-tag
                type="primary"
                effect="plain"
                v-if="scope.row.hinh_thuc !== null && scope.row.hinh_thuc == 'tai_khoan'"
              >Thanh toán sau: Tài Khoản</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="thong_tin_khach_hang" label="Thông tin khách hàng" min-width="120" align="center"></el-table-column>
          <el-table-column label="Hành động" align="center" fixed="right" width="120">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="Chi tiết"
                placement="top"
              >
                <el-button
                  size="small"
                  @click="showUpdate(scope.row)"
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
                  v-if="scope.row.type == 'tu_nhap'"
                  size="small"
                  @click="xoa(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="In phiếu thu"
                placement="top"
              >
                <el-button
                  size="small"
                  @click="inPhieuThu(scope.row.id)"
                  type="warning"
                  icon="el-icon-printer"
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
      :title="edit ? 'CẬP NHẬT PHIẾU THU' : 'TẠO PHIẾU THU'"
      center
      width="500px"
      :visible.sync="showCreate"
    >
      <el-form :model="formAdd" :rules="rules" ref="formAdd">
        <el-form-item label="Số tiền" prop="so_tien">
          <div
            v-if="formAdd.type != 'tu_nhap'"
            style="font-size: 13px; font-weight: bold"
          >{{formate.formatCurrency(formAdd.so_tien)}} đ</div>
          <el-input type="number" :min="0" v-model="formAdd.so_tien" v-else></el-input>
        </el-form-item>
        <el-form-item label="Nội dung" prop="noi_dung">
          <el-input
            :disabled="formAdd.type != 'tu_nhap'"
            v-model="formAdd.noi_dung"
            type="textarea"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="Thông tin giao dịch">
          <el-input
            v-model="formAdd.thong_tin_giao_dich"
            type="textarea"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="Khách hàng">
          <br />
          <el-select
            v-model="formAdd.user_id_khach_hang"
            placeholder="Chọn khách hàng"
            style="width: 90%"
            clearable
          >
            <el-option
              v-for="item in khachHang"
              :key="item.user_id"
              :label="item.ten"
              :value="item.user_id"
            ></el-option>
          </el-select>
          <el-tooltip
            effect="dark"
            v-if="formAdd.user_id_khach_hang"
            content="Chi tiết khách hàng"
            placement="top-start"
          >
            <el-button
              circle
              icon="el-icon-info"
              class="success-button"
              @click="showInfo"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            v-else
            effect="dark"
            content="Thêm mới khách hàng"
            placement="top-start"
          >
            <el-button
              circle
              icon="el-icon-plus"
              class="primary-button"
              @click="showAddKhachHang"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Thông tin khách hàng">
          <el-input
            v-model="formAdd.thong_tin_khach_hang"
            type="textarea"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="warning"
          icon="el-icon-close"
          @click="showCreate = false"
          >Hủy</el-button
        >
        <el-button
          v-if="edit"
          class="primary-button"
          size="small"
          icon="el-icon-check"
          @click="update()"
          >Cập nhật</el-button
        >
        <el-button
          v-else
          class="primary-button"
          size="small"
          icon="el-icon-plus"
          @click="add('formAdd')"
          >THÊM MỚI</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="THÔNG TIN KHÁCH HÀNG"
      :visible.sync="showUserDetail"
      width="600px"
      center
    >
      <div style="display: flex; align-items: center; flex-direction: column">
        <div v-if="UserInfo.user && UserInfo.user.avatar_url">
          <img
            :src="endPointImage + UserInfo.user.avatar_url"
            style="height: 100px; width: auto; border-radius: 10px"
          />
        </div>
        <div v-else>
          <img
            :src="endPointImage + 'images/avatar/avatar_for_none.png'"
            style="height: 100px; width: auto"
          />
        </div>

        <div>
          <el-rate
            disabled
            :value="+UserInfo.tin_nhiem"
            :colors="colors"
          ></el-rate>
        </div>
      </div>
      <el-row style="margin-top: 50px">
        <el-form label-position="left" label-width="110px" size="small">
          <el-col :span="14" :offset="1">
            <el-form-item label="Khách hàng: ">{{ UserInfo.ten }}</el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="Số điện thoại: ">{{
              UserInfo.so_dien_thoai
            }}</el-form-item>
          </el-col>
          <el-col :span="14" :offset="1">
            <el-form-item label="Địa chỉ Email: ">{{
              UserInfo.email
            }}</el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="Số dư TK: "
              >{{ formate.formatCurrency(UserInfo.so_du) }} đ</el-form-item
            >
          </el-col>
          <el-col :span="23" :offset="1">
            <el-form-item label="Địa chỉ: ">{{
              UserInfo.dia_chi
            }}</el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="primary-button"
          @click="showUserDetail = false"
          icon="el-icon-close"
          >Đóng</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="THÊM MỚI KHÁCH HÀNG"
      :visible.sync="showFormAddKhachHang"
      width="700px"
      center
    >
      <el-form :model="formKhaHang" :rules="rulesKhachHang" ref="formKhaHang">
        <el-steps :space="200" :active="next ? 1 : 2" simple>
          <el-step title="Thông tin khách hàng" icon="el-icon-info"></el-step>
          <el-step title="Tài khoản đăng nhập" icon="el-icon-user"></el-step>
        </el-steps>
        <br />
        <el-row :gutter="40" v-show="next">
          <el-col :span="12">
            <el-form-item label="Mã khách hàng" prop="ma">
              <el-input
                size="small"
                v-model="formKhaHang.ma"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Loại khách hàng">
              <br />
              <el-radio
                v-model="formKhaHang.ca_nhan"
                :label="true"
                border
                size="small"
                >Cá nhân</el-radio
              >
              <el-radio
                v-model="formKhaHang.ca_nhan"
                :label="false"
                border
                size="small"
                >Tổ chức</el-radio
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tên khách hàng" prop="ten">
              <el-input size="small" v-model="formKhaHang.ten"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Mã số thuế">
              <el-input
                size="small"
                v-model="formKhaHang.ma_so_thue"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Số điện thoại" prop="so_dien_thoai">
              <el-input
                size="small"
                v-model="formKhaHang.so_dien_thoai"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Giới tính">
              <br />
              <el-radio
                v-model="formKhaHang.gioi_tinh"
                :label="true"
                border
                size="small"
                >Nam</el-radio
              >
              <el-radio
                v-model="formKhaHang.gioi_tinh"
                :label="false"
                border
                size="small"
                >Nữ</el-radio
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ngày sinh">
              <br />
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="formKhaHang.ngay_sinh"
                type="date"
                placeholder="Chọn ngày sinh"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ email">
              <el-input size="small" v-model="formKhaHang.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ">
              <el-input size="small" v-model="formKhaHang.dia_chi"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ghi chú">
              <el-input
                size="small"
                type="textarea"
                v-model="formKhaHang.mo_ta"
                :rows="2"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-show="!next">
          <el-col :span="14" :offset="5">
            <el-form-item label="Tên đăng nhập" prop="username">
              <el-input v-model="formKhaHang.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14" :offset="5">
            <el-form-item label="Mật khẩu" prop="password">
              <el-input
                type="password"
                v-model="formKhaHang.password"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14" :offset="5">
            <el-form-item
              label="Nhập lại mật khẩu"
              prop="password_confirmation"
            >
              <el-input
                type="password"
                v-model="formKhaHang.password_confirmation"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="primary-button"
          :disabled="
            !formKhaHang.ma || !formKhaHang.ten || !formKhaHang.so_dien_thoai
          "
          size="small"
          v-if="next"
          icon="el-icon-right"
          @click="next = !next"
          >Tiếp theo</el-button
        >
        <el-button
          type="warning"
          size="small"
          v-if="!next"
          icon="el-icon-back"
          @click="next = !next"
          >Quay lại</el-button
        >
        <el-button
          class="primary-button"
          size="small"
          v-if="!next"
          icon="el-icon-plus"
          @click="addKhachHang('formKhaHang')"
          >THÊM MỚI</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPhieuThu,
  updatePhieuThu,
  addPhieuThu,
  xoaPhieuThu,
} from "@/api/donhangnhacungcap";
import { getKhachHang, addKhachHang } from "@/api/khachhang";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập mật khẩu mới"));
      } else {
        if (this.formKhaHang.password_confirmation !== "") {
          this.$refs.formKhaHang.validateField("password_confirmation");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập lại mật khẩu mới"));
      } else if (value !== this.formKhaHang.password) {
        callback(new Error("Mật khẩu hai lần nhập không trùng khớp"));
      } else {
        callback();
      }
    };
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
      isInputActive: null,
      edit: false,
      form: {
        date: [],
        nha_cung_cap: [],
        search: ""
      },
      next: true,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      showFormAddKhachHang: false,
      formKhaHang: {
        id: null,
        ten: null,
        ma: "KH" + new Date().getTime(),
        so_dien_thoai: null,
        dia_chi: null,
        ngay_sinh: null,
        ghi_chu: null,
        ca_nhan: false,
        ma_so_thue: null,
        gioi_tinh: true,
        email: null,
        username: null,
        password: null,
        password_confirmation: null,
        anh_dai_dien: null,
        facebook: null,
        trang_thai: null,
        so_tai_khoan: null,
        so_du: null,
        chuyen_khoan_cuoi: null,
        giao_dich_cuoi: null,
        nhom_id: null,
        loai_thanh_vien_id: null,
        tin_nhiem: null,
        diem_quy_doi: null,
        tien_vay: null,
      },
      showUserDetail: false,
      rulesKhachHang: {
        ten: [
          {
            required: true,
            message: "Tên khách hàng không thể bỏ trống",
            trigger: "blur",
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" },
        ],
        ma: [
          {
            required: true,
            message: "Mã khách hàng không thể bỏ trống",
            trigger: "blur",
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" },
        ],
        so_dien_thoai: [
          {
            required: true,
            message: "Số điện thoại không thể bỏ trống",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Email không được bỏ trống",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Hãy nhập một địa chỉ email hợp lệ",
            trigger: ["blur", "change"],
          },
        ],
        username: [
          {
            required: true,
            message: "Tên đăng nhập không thể bỏ trống",
            trigger: "blur",
          },
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          {
            min: 6,
            message: "Độ dài tối thiểu 6 kí tự",
            trigger: "blur",
          },
        ],
        password_confirmation: [{ validator: validatePass2, trigger: "blur" }],
      },
      formAdd: {
        id: null,
        so_tien: "",
        noi_dung: null,
        thong_tin_giao_dich: null,
        user_id_khach_hang: null,
        thong_tin_khach_hang: null,
        type: null,
      },
      khachHang: [],
      nhaCungCaps: [],
      showCreate: false,
      rules: {
        so_tien: [
          {
            required: true,
            message: "Số tiền không thể bỏ trống",
            trigger: "blur",
          },
        ],
        noi_dung: [
          {
            required: true,
            message: "Nội dung không thể bỏ trống",
            trigger: "blur",
          },
        ],
      },
      UserInfo: {},
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
          return this.formAdd.so_tien.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.formAdd.so_tien).replace(
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
        this.formAdd.so_tien = newValue;
      },
    },
  },
  mounted() {},

  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },
    inPhieuThu(id) {
      window.open(process.env.VUE_APP_BASE_API + "inphieuthu/" + id, "_blank");
    },
    showInfo() {
      this.UserInfo = this.khachHang.find(
        (el) => el.user_id == this.formAdd.user_id_khach_hang
      );
      if (this.UserInfo) {
        this.showUserDetail = true;
      } else this.UserInfo = {};
    },

    async getKhachHang() {
      let data = await getKhachHang({
        per_page: 999999,
      });
      this.khachHang = data.data.data;
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
      let data = await getPhieuThu({
        per_page: this.per_page,
        page: this.page,
        nha_cung_cap: this.form.nha_cung_cap,
        date: this.form.date,
        hinh_thuc: this.form.hinh_thuc
      });
      this.tableData = data.data.data;
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.listLoading = false;
    },
    async update() {
      let data = await updatePhieuThu(this.formAdd.id, this.formAdd);
      this.showCreate = false;
      this.getDonHang();
      this.$message({
        type: "success",
        message: "Cập nhật thành công",
      });
    },
    async xoa(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa phiếu thu " +
            "<strong>" +
            data.noi_dung +
            "</strong>" +
            " Số tiền: " +
            "<strong>" +
            this.formate.formatCurrency(data.so_tien) +
            " đ" +
            "</strong>",
          "Xóa phiếu thu",
          {
            confirmButtonText: "Đồng ý",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        let status = await xoaPhieuThu(data.id);
        this.getDonHang();
        this.$message({
          message: "Thành công",
          type: "success",
        });
      } catch (error) {}
    },
    async showAddKhachHang() {
      this.resetFormKhaHang();
      this.showFormAddKhachHang = true;
    },
    addKhachHang(formKhaHang) {
      this.$refs[formKhaHang].validate((valid) => {
        if (valid) {
          addKhachHang(this.formKhaHang).then((res) => {
            this.resetFormKhaHang();
            this.getKhachHang();
            this.$message({
              type: "success",
              message: "Thêm mới thành công",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showUpdate(data) {
      this.edit = true;
      this.showCreate = true;
      this.formAdd.id = data.id;
      this.formAdd.so_tien = data.so_tien;
      this.formAdd.noi_dung = data.noi_dung;
      this.formAdd.thong_tin_giao_dich = data.thong_tin_giao_dich;
      this.formAdd.user_id_khach_hang = data.user_id_khach_hang;
      this.formAdd.thong_tin_khach_hang = data.thong_tin_khach_hang;
      this.formAdd.type = data.type;
    },
    resetFormKhaHang() {
      this.showFormAddKhachHang = false;
      (this.next = true),
        (this.formKhaHang = {
          id: null,
          ten: null,
          ma: "KH" + new Date().getTime(),
          so_dien_thoai: null,
          dia_chi: null,
          ngay_sinh: null,
          ghi_chu: null,
          ca_nhan: false,
          ma_so_thue: null,
          gioi_tinh: true,
          email: null,
          username: null,
          password: null,
          password_confirmation: null,
          anh_dai_dien: null,
          facebook: null,
          so_tai_khoan: null,
          so_du: null,
          chuyen_khoan_cuoi: null,
          giao_dich_cuoi: null,
          nhom_id: null,
          loai_thanh_vien_id: null,
          tin_nhiem: null,
          diem_quy_doi: null,
          tien_vay: null,
          trang_thai: null,
        });
    },
    showFormAdd() {
      this.edit = false;
      this.showCreate = true;
      this.formAdd.id = null;
      this.formAdd.so_tien = "";
      this.formAdd.noi_dung = null;
      this.formAdd.thong_tin_giao_dich = null;
      this.formAdd.user_id_khach_hang = null;
      this.formAdd.thong_tin_khach_hang = null;
      this.formAdd.type = "tu_nhap";
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addPhieuThu(this.formAdd).then((res) => {
            this.showCreate = false;
            this.getDonHang();
            this.$message({
              type: "success",
              message: "Thêm mới thành công",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
