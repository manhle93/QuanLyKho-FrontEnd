<template>
  <div class="app-container">
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
            v-model="form.nha_cung_cap"
            placeholder="Lựa chọn nhà cung cấp"
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
        <el-col :span="4">
          <el-input v-model="form.search" placeholder="Tìm kiếm" size="small" @keyup.enter.native="getLichSuThanhToan"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="getLichSuThanhToan()"
          >Tìm kiếm</el-button>
          <el-button
            size="small"
            type="warning"
            icon="el-icon-view"
            @click="showFormCongNo"
          >Theo dõi công nợ</el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            style="float: right"
            size="small"
            class="primary-button"
            icon="el-icon-plus"
            @click="taoDon()"
          >TẠO ĐƠN</el-button>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <h4><i style="color: green">LỊCH SỬ THANH TOÁN CHO NHÀ CUNG CẤP</i></h4>
    <el-table
      v-loading="listLoading"
      element-loading-text="Đang tải dữ liệu"
      :data="tableData"
      style="width: 100%; font-size: 13px"
      border
    >
      <el-table-column sortable type="index" label="STT"></el-table-column>
      <el-table-column property="ma_don" label="Mã đơn hàng" min-width="125"></el-table-column>
      <el-table-column property="created_at" label="Thời gian tạo" min-width="125"></el-table-column>
      <el-table-column property="nhan_cung_cap.ten" label="Nhà cung cấp" min-width="125"></el-table-column>
      <el-table-column label="Phải thanh toán" min-width="115" prop="phai_thanh_toan">
        <template slot-scope="scope">{{formate.formatCurrency(scope.row.phai_thanh_toan)}} đ</template>
      </el-table-column>
      <el-table-column label="Số tiền thanh toán" min-width="115" prop="thanh_toan">
        <template slot-scope="scope">{{formate.formatCurrency(scope.row.thanh_toan)}} đ</template>
      </el-table-column>
      <el-table-column label="Còn phải thanh toán" min-width="115" prop="thanh_toan">
        <template
          slot-scope="scope"
        >{{formate.formatCurrency(scope.row.phai_thanh_toan - scope.row.thanh_toan)}} đ</template>
      </el-table-column>
      <el-table-column property="user.name" label="Người tạo" min-width="125"></el-table-column>
      <el-table-column label="Hành động" align="center" fixed="right" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chi tiết" placement="top">
            <el-button
              size="small"
              @click="showUpdate(scope.row)"
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
    <br />
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :page-sizes="[5, 10, 15, 20]"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="showCreate" title="THANH TOÁN ĐƠN HÀNG" width="900px">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-select
            filterable
            size="small"
            style="width: 100%"
            placeholder="Chọn nhà cung cấp"
            v-model="formAdd.nha_cung_cap_id"
            clearable
            @change="getDonHang(formAdd.nha_cung_cap_id)"
          >
            <el-option
              v-for="item in nhaCungCaps"
              :key="item.id"
              :label="item.ten"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <!-- <el-select
            size="small"
            style="width: 100%"
            placeholder="Chọn đơn hàng"
            v-model="don_hang_id"
          >
            <el-option
              v-for="item in donhangnhacungcaps"
              :key="item.id"
              :value="item.id"
              :label="item.ten"
              :disabled="checkDaChon(item)"
            >
              <span style="float: left">{{ item.ten }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ma }}</span>
            </el-option>
          </el-select>-->

          <el-select
            size="small"
            style="width: 100%"
            filterable
            placeholder="Chọn đơn hàng"
            v-model="don_hang_id"
          >
            <el-option-group label="Đơn mua hàng NCC">
              <el-option
                v-for="item in donhangnhacungcaps"
                :key="item.id"
                :value="item.id"
                :label="item.ten"
                :disabled="checkDaChon(item)"
                @click.native="chonDon('mua_hang')"
              >
                <span style="float: left">{{ item.ten }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ma }}</span>
              </el-option>
            </el-option-group>

            <el-option-group label="Đơn trả hàng NCC">
              <el-option
                v-for="item in traHangNhaCungCaps"
                :key="item.id"
                :value="item.id"
                :label="item.ma_don"
                :disabled="checkDaChonTraHang(item)"
                @click.native="chonDon('tra_hang')"
              >
                <span style="float: left">{{ item.ma_don }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">-{{ item.tong_tien }} đ</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button
            class="primary-button"
            size="small"
            circle
            icon="el-icon-plus"
            @click="themSanPham()"
          ></el-button>
        </el-col>
      </el-row>
      <br />
      <el-table :data="dataDonHang" height="350px">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column label="Ngày nhập" prop="updated_at"></el-table-column>
        <el-table-column label="Tên đơn hàng" prop="ten" min-width="100">
          <template slot-scope="scope">
            {{scope.row.ten}}
            <br />
            {{scope.row.ma}}
          </template>
        </el-table-column>
        <el-table-column label="Tổng thanh toán" prop="da_thanh_toan">
          <template
            slot-scope="scope"
            v-if="scope.row.loai == 'mua_hang'"
          >{{formate.formatCurrency(scope.row.tong_tien)}} đ</template>
        </el-table-column>
        <el-table-column label="Đã thanh toán" prop="da_thanh_toan">
          <template
            slot-scope="scope"
            v-if="scope.row.loai == 'mua_hang'"
          >{{formate.formatCurrency(scope.row.da_thanh_toan)}} đ</template>
        </el-table-column>
        <el-table-column label="Phải thanh toán" prop="so_luong">
          <template
            slot-scope="scope"
          >{{formate.formatCurrency(scope.row.tong_tien - scope.row.da_thanh_toan)}} đ</template>
        </el-table-column>
        <el-table-column label="Xóa" width="80">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              type="danger"
              circle
              size="mini"
              @click="xoaSanPham(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <span>
        Tổng tiền phải thanh toán:
        <label>{{formate.formatCurrency(tongTienPhaiThanhToan)}} đ</label>
      </span>
      <br />
      <br />
      <span style="margin-right: 20px">Số tiền thanh toán</span>
      <el-input
        @blur="isInputActive = false"
        @focus="isInputActive = true"
        style="width: 150px"
        size="small"
        v-model="displayValue"
        :min="0"
        :step="100"
        :max="tongTienPhaiThanhToan"
      ></el-input>
      <label style="margin-left: 10px">đ</label>
      <br />
      <br />
      <span>
        Còn phải thanh toán:
        <label>{{formate.formatCurrency(tongTienPhaiThanhToan - formAdd.thanh_toan)}} đ</label>
      </span>
      <span slot="footer" class="dialog-footer" align="right">
        <el-button 
          size="small"
          type="warning" 
          icon="el-icon-close" 
          padding-right="20px"
          @click="showCreate = false"
        >Hủy</el-button>

        <el-button
          class="primary-button"
          size="small"
          v-if="!edit"
          icon="el-icon-plus"
          @click="submit()"
        >TẠO ĐƠN</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-else
          icon="el-icon-check"
          @click="update()"
        >CẬP NHẬT</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="showCongNo" title="THEO DÕI CÔNG NỢ" width="900px" center>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-date-picker
            style="width: 100%"
            v-model="dateCongNo"
            type="daterange"
            range-separator="-"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            size="small"
            format="dd/MM/yyyy"
            @change="changeTimeCongNo()"
          ></el-date-picker>
        </el-col>
        <el-col :span="10">
          <el-select
            size="small"
            style="width: 100%"
            filterable
            placeholder="Chọn nhà cung cấp"
            v-model="nha_cung_cap_id"
            clearable
            @change="getCongNo(nha_cung_cap_id)"
          >
            <el-option
              v-for="item in nhaCungCaps"
              :key="item.id"
              :label="item.ten"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <br />
      <br />
      <span>
        Công nợ đầu kỳ:
        <label>{{formate.formatCurrency(this.no_dau_ky)}} đ</label>
      </span>
      <br />
      <el-table :data="tableCongNo" height="350px">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column label="Thời gian" prop="thoi_gian"></el-table-column>
        <el-table-column label="Tên đơn" prop="ten" min-width="100">
          <template slot-scope="scope">
            {{scope.row.ten}}
            <br />
            {{scope.row.ma}}
          </template>
        </el-table-column>
        <el-table-column label="Hành động" prop="hanh_dong">
          <template slot-scope="scope">
            <el-tag effect="plain" v-if="scope.row.hanh_dong == 'nhap_hang'">Nhập hàng</el-tag>
            <el-tag
              effect="plain"
              type="success"
              v-if="scope.row.hanh_dong == 'thanh_toan'"
            >Thanh toán</el-tag>
            <el-tag effect="plain" type="warning" v-if="scope.row.hanh_dong == 'tra_hang'">Trả hàng</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Nợ phát sinh" prop="so_tien">
          <template
            slot-scope="scope"
          >{{scope.row.hanh_dong == 'nhap_hang' ? '+ ' : '- ' }} {{formate.formatCurrency(scope.row.so_tien)}} đ</template>
        </el-table-column>
        <el-table-column label="Nợ cuối" prop="no_cuoi">
          <template slot-scope="scope">{{formate.formatCurrency(scope.row.no_cuoi)}} đ</template>
        </el-table-column>
      </el-table>
      <br />
      <br />
      <span>
        Phát sinh trong kỳ:
        <label>{{formate.formatCurrency(tong_phat_sinh)}} đ</label>
      </span>
      <br />
      <br />
      <span>
        Công nợ cuối kỳ:
        <label>{{formate.formatCurrency(no_cuoi_ky)}} đ</label>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" icon="el-icon-close" @click="showCongNo = false">Đóng</el-button>
        <!-- <el-button class="primary-button" size="small" icon="el-icon-download">Xuất file</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  donHangNhapKho,
  thanhToanDonNCC,
  getLichSuThanhToan,
  updateThanhToanDonNCC,
  xoaThanhToanDonNCC,
  theoDoiCongNo,
} from "@/api/donhangnhacungcap";
import { getNhaCungCap } from "@/api/khachhang";

export default {
  data() {
    return {
      thanh_toan: 0,
      showCongNo: false,
      endPointImage: process.env.VUE_APP_BASE,
      page: 1,
      per_page: 10,
      total: 0,
      tableData: [],
      nhaCungCaps: [],
      listLoading: true,
      loading: false,
      search: "",
      loai_don: null,
      showCreate: false,
      list: [],
      formate: formate,
      edit: false,
      don_thanh_toan_id: null,
      don_hang_id: null,
      dataDonHang: [],
      donhangnhacungcaps: [],
      traHangNhaCungCaps: [],
      nha_cung_cap_id: null,
      isInputActive: false,
      tongTienPhaiThanhToan: 0,
      tableCongNo: [],
      form: {
        date: [],
        nha_cung_cap: null,
        search: ""
      },
      listLoading: false,
      dateCongNo: [],
      no_dau_ky: 0,
      no_cuoi_ky: 0,
      tong_phat_sinh: 0,
      formAdd: {
        nha_cung_cap_id: null,
        thanh_toan: 0,
        hangHoas: [],
        phai_thanh_toan: 0,
      },
    };
  },
  computed: {
    displayValue: {
      get() {
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          return this.formAdd.thanh_toan.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.formAdd.thanh_toan).replace(
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
        this.formAdd.thanh_toan = newValue;
      },
    },
  },
  created() {
    this.getNhaCungCap()
    this.getLichSuThanhToan();
  },
  methods: {
        async getNhaCungCap() {
      let data = await getNhaCungCap({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },
    taoDon() {
      this.showCreate = true;
      this.resetForm();
    },
    chonDon(e) {
      this.loai_don = e;
    },
    async getLichSuThanhToan() {
      this.listLoading = true;
      let data = await getLichSuThanhToan({
        per_page: this.per_page,
        page: this.page,
        nha_cung_cap: this.form.nha_cung_cap,
        date: this.form.date,
        search: this.form.search
      });
      this.listLoading = false;
      this.tableData = data.data;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getLichSuThanhToan();
    },
    resetForm() {
      this.dataDonHang = [];
      this.thanh_toan = 0;
      this.tongTienPhaiThanhToan = 0;
      this.donhangnhacungcaps = []
      this.traHangNhaCungCaps = []
      this.don_hang_id = null;
      this.formAdd = {
        nha_cung_cap_id: null,
        thanh_toan: 0,
        hangHoas: [],
        phai_thanh_toan: 0,
      };
      this.don_thanh_toan_id = null;
    },
    async getDonHang(id) {
      this.dataDonHang = [];
      this.thanh_toan = 0;
      this.tongTienPhaiThanhToan = 0;
      this.don_hang_id = null;
      if (!id) {
        this.donhangnhacungcaps = [];
        return;
      }
      let user_nha_cung_cap = this.nhaCungCaps.find((el) => el.id == id)
        .user_id;
      let data = await donHangNhapKho(user_nha_cung_cap);
      this.donhangnhacungcaps = data.don_hang;
      this.traHangNhaCungCaps = data.tra_hang;
    },
    themSanPham() {
      if (!this.don_hang_id) {
        this.$message({
          message: "Chon một đơn hàng",
          type: "warning",
        });
        return;
      }
      let donHang = new Object();
      if (this.loai_don == "mua_hang") {
        donHang = this.donhangnhacungcaps.find(
          (el) => el.id == this.don_hang_id
        );
        donHang.loai = "mua_hang";
      }
      if (this.loai_don == "tra_hang") {
        donHang = this.traHangNhaCungCaps.find(
          (el) => el.id == this.don_hang_id
        );
        donHang.loai = "tra_hang";
        donHang.ten = "Trả hàng NCC";
        let tt = donHang.tong_tien;
        donHang.tong_tien = 0;
        donHang.da_thanh_toan = tt;
      }
      this.tongTienPhaiThanhToan =
        +this.tongTienPhaiThanhToan +
        (donHang.tong_tien - donHang.da_thanh_toan);
      this.don_hang_id = null;
      this.dataDonHang.push(donHang);
    },

    async showUpdate(data) {
      this.don_id = data.id;
      this.edit = true;
      this.showCreate = true;
      this.formAdd.nha_cung_cap_id = data.nha_cung_cap_id;
      await this.getDonHang(this.formAdd.nha_cung_cap_id);
      this.dataDonHang = [];
      let donHang = data.don_hangs.map((el) => {
        let sanPham = new Object();
        if (el.loai == "mua_hang") {
          sanPham = this.donhangnhacungcaps.find(
            (it) => it.id === el.don_hang_id
          );
          sanPham.loai = "mua_hang"
        }
        if (el.loai == "tra_hang") {
          sanPham = this.traHangNhaCungCaps.find(
            (it) => it.id === el.don_tra_hang_id
          );
          let tt = sanPham.tong_tien;
          sanPham.tong_tien = 0;
          sanPham.da_thanh_toan = tt;
          sanPham.ten = "Trả hàng NCC";
          sanPham.loai = "tra_hang"
        }

        return sanPham;
      });
      this.dataDonHang = donHang
      this.formAdd.donHangCus = JSON.parse(JSON.stringify(donHang));
      this.don_thanh_toan_id = data.id;
      this.formAdd.phai_thanh_toan = +data.phai_thanh_toan;
      this.tongTienPhaiThanhToan = +data.phai_thanh_toan;
      this.formAdd.thanh_toan = +data.thanh_toan;
    },
    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa thanh toán: " +
            "<strong>" +
            data.ma_don +
            "</strong>",
          "Xóa đơn thanh toán",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        this.listLoading = true;
        let status = await xoaThanhToanDonNCC(data.id);
        this.getLichSuThanhToan();
        this.$message({
          message: "Xóa thành công",
          type: "success",
        });
      } catch (error) {
        this.listLoading = false;
      }
    },
    async getCongNo(id) {
      let data = await theoDoiCongNo({
        date: this.dateCongNo,
        nha_cung_cap: id,
      });
      this.no_dau_ky = data.no_dau_ky;
      let newData = [];
      data.nhap_hang.map((nh) => {
        newData.push({
          ...nh,
          thoi_gian: nh.updated_at,
          hanh_dong: "nhap_hang",
          ma: nh.ma,
          so_tien:
            nh.tong_tien && nh.da_thanh_toan
              ? parseInt(nh.tong_tien) - parseInt(nh.da_thanh_toan)
              : 0,
        });
      });
      data.thanh_toan.map((tt) => {
        newData.push({
          ...tt,
          thoi_gian: tt.updated_at,
          hanh_dong: "thanh_toan",
          ma: tt.ma_don,
          ten: tt.ten,
          so_tien: parseInt(tt.thanh_toan),
        });
      });
      data.tra_hang.map((th) => {
        newData.push({
          ...th,
          thoi_gian: th.updated_at,
          hanh_dong: "tra_hang",
          ma: th.ma,
          ten: th.ten,
          so_tien: parseInt(th.tong_tien),
        });
      });
      newData = newData.sort((a, b) => a.thoi_gian < b.thoi_gian);
      let tempNoDauKy = this.no_dau_ky;
      let tempPhatSinh = 0;
      newData = newData.map((el) => {
        if (el.hanh_dong === "nhap_hang") {
          tempNoDauKy += el.so_tien;
          tempPhatSinh += el.so_tien;
        } else {
          tempNoDauKy -= el.so_tien;
          tempPhatSinh -= el.so_tien;
        }
        return {
          ...el,
          no_cuoi: tempNoDauKy,
        };
      });
      this.no_cuoi_ky = tempNoDauKy;
      this.tong_phat_sinh = tempPhatSinh;
      this.tableCongNo = newData;

    },
    changeTimeCongNo() {
      if (this.nha_cung_cap_id) {
        this.getCongNo(this.nha_cung_cap_id);
      }
    },
    xoaSanPham(index) {
      this.thanh_toan = 0;
      this.tongTienPhaiThanhToan =
        this.tongTienPhaiThanhToan -
        (this.dataDonHang[index].tong_tien -
          this.dataDonHang[index].da_thanh_toan);

      this.dataDonHang.splice(index, 1);
    },
    checkDaChon(item) {
      if (
        item.thanh_toan ||
        this.dataDonHang.find((el) => el.id == item.id && el.loai == "mua_hang")
      )
        return true;
      return false;
    },
    checkDaChonTraHang(item) {
      if (
        item.thanh_toan ||
        this.dataDonHang.find((el) => el.id == item.id && el.loai == "tra_hang")
      )
        return true;
      return false;
    },
    async submit() {
      if (!this.formAdd.nha_cung_cap_id) {
        this.$message({
          message: "Hãy chọn một nhà cung cấp",
          type: "warning",
        });
        return;
      }
      this.formAdd.hangHoas = this.dataDonHang;
      this.formAdd.phai_thanh_toan = this.tongTienPhaiThanhToan;
      if (!this.formAdd.hangHoas || this.formAdd.hangHoas.length == 0) {
        this.$message({
          message: "Chưa chọn đơn hàng nào",
          type: "warning",
        });
        return;
      }
      try {
        let data = await thanhToanDonNCC(this.formAdd);
        this.showCreate = false;
        this.resetForm();
        this.getLichSuThanhToan();
        this.$message({
          message: "Thành công",
          type: "success",
        });
      } catch (error) {}
    },
    showFormCongNo() {
      this.showCongNo = true;
      this.nha_cung_cap_id = null;
      this.tableCongNo = [];
      this.dateCongNo = null;
      this.no_dau_ky = 0;
    },
    async update() {
      if (!this.formAdd.nha_cung_cap_id) {
        this.$message({
          message: "Hãy chọn một nhà cung cấp",
          type: "warning",
        });
        return;
      }
      this.formAdd.hangHoas = this.dataDonHang;
      this.formAdd.phai_thanh_toan = this.tongTienPhaiThanhToan;
      if (!this.formAdd.hangHoas || this.formAdd.hangHoas.length == 0) {
        this.$message({
          message: "Chưa chọn đơn hàng nào",
          type: "warning",
        });
        return;
      }
      try {
        let data = await updateThanhToanDonNCC(
          this.don_thanh_toan_id,
          this.formAdd
        );
        this.showCreate = false;
        this.getLichSuThanhToan();
        this.resetForm();
        this.$message({
          message: "Thành công",
          type: "success",
        });
      } catch (error) {}
    },
  },
};
</script>