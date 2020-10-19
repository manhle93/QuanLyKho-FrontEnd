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
          <el-input
            v-model="form.search"
            placeholder="Tìm kiếm"
            size="small"
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
        <el-col :span="7">
          <el-button
            @click="taoDon"
            style="float: right"
            size="small"
            class="primary-button"
            icon="el-icon-plus"
            >TẠO ĐƠN</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <br />
    <h4><i style="color: green">LỊCH SỬ TRẢ HÀNG CHO NHÀ CUNG CẤP</i></h4>
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
          <el-table-column
            property="ma_don"
            label="Mã đơn hàng"
            min-width="125"
          ></el-table-column>
          <el-table-column
            property="created_at"
            label="Thời gian tạo"
            min-width="125"
          ></el-table-column>
          <el-table-column
            property="nha_cung_cap.ten"
            label="Nhà cung cấp"
            min-width="125"
          ></el-table-column>
          <el-table-column label="Tổng tiền" min-width="115" prop="tong_tien">
            <template slot-scope="scope"
              >{{ formate.formatCurrency(scope.row.tong_tien) }} đ</template
            >
          </el-table-column>
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
    <el-dialog :visible.sync="showCreate" title="TRẢ HÀNG NHẬP" width="800px">
      <el-row>
        <el-select
          size="small"
          style="width: 100%"
          placeholder="Lựa chọn nhà cung cấp"
          v-model="formAdd.nha_cung_cap_id"
          filterable
          clearable
          @change="changeNhaCungCap(formAdd.nha_cung_cap_id)"
        >
          <el-option
            v-for="item in nhaCungCaps"
            :key="item.id"
            :label="item.ten"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-row>
      <br />
      <el-row :gutter="20">
        <el-col :span="8">
          <el-select
            size="small"
            style="width: 100%"
            placeholder="Chọn hàng hóa"
            filterable
            v-model="addSanPham.hang_hoa_id"
            @change="getDonGia(addSanPham.hang_hoa_id)"
          >
            <el-option
              v-for="item in hangHoas"
              :key="item.san_pham.id"
              :label="item.san_pham.ten_san_pham"
              :value="item.san_pham.id"
              :disabled="checkDaChon(item.san_pham.id)"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-input
            v-model="addSanPham.so_luong"
            placeholder="Số lượng trả"
            type="number"
            size="small"
            :min="0"
          ></el-input>
        </el-col>
        <el-col :span="7">
          <el-input
            placeholder="Đơn giá trả hàng"
            size="small"
            :min="0"
            v-model="displayValue"
            @blur="isInputActive = false"
            @focus="isInputActive = true"
          ></el-input>
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
      <el-table :data="dataHangTra" height="400px">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column label="Hàng hóa" prop="ten_san_pham"></el-table-column>
        <el-table-column label="Số lượng" prop="so_luong"></el-table-column>
        <el-table-column label="Đơn giá" prop="don_gia">
          <template slot-scope="scope"
            >{{ formate.formatCurrency(scope.row.don_gia) }} đ/{{
              scope.row.don_vi_tinh
            }}</template
          >
        </el-table-column>
        <el-table-column label="Thành tiền">
          <template slot-scope="scope"
            >{{
              formate.formatCurrency(scope.row.don_gia * scope.row.so_luong)
            }}
            đ</template
          >
        </el-table-column>
        <el-table-column label="Xóa">
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
      <div style="margin-bottom: 10px">
        <el-input
          v-model="formAdd.ly_do"
          placeholder="Lý do trả hàng"
        ></el-input>
      </div>
      <div>Tổng tiền: {{ formate.formatCurrency(tongTien) }} đ</div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="warning"
          icon="el-icon-close"
          @click="showCreate = false"
          >Hủy</el-button
        >
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit"
          icon="el-icon-plus"
          @click="submit()"
          >Xuất trả</el-button
        >
        <el-button
          class="primary-button"
          size="small"
          v-else
          icon="el-icon-check"
          @click="update()"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDonTraHang,
  xoaDonTraHang,
  traHangNhaCungCap,
  updateDonTraHang,
  getSanPhamNhaCungCap,
} from "@/api/donhangnhacungcap";
import { getNhaCungCap } from "@/api/khachhang";
import { listSanPham } from "@/api/sanpham";

export default {
  data() {
    return {
      dataHangTra: [],
      endPointImage: process.env.VUE_APP_BASE,
      page: 1,
      per_page: 10,
      total: 0,
      tableData: null,
      listLoading: true,
      loading: false,
      search: "",
      isInputActive: null,
      edit: false,
      tongTien: 0,
      addSanPham: {
        hang_hoa_id: null,
        so_luong: null,
        don_gia: "",
        search: ""
      },
      list: [],
      formate: formate,
      form: {
        date: [],
        nha_cung_cap: null,
      },
      formAdd: {
        nha_cung_cap_id: null,
        hangHoas: [],
        tong_tien: 0,
        ly_do: null,
      },
      hangHoas: [],
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
  computed: {
    displayValue: {
      get() {
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          return this.addSanPham.don_gia.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.addSanPham.don_gia).replace(
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
        this.addSanPham.don_gia = newValue;
      },
    },
  },
  created() {
    this.getDonHang();
    this.getNhaCungCap();
    // this.getSanPham();
  },

  mounted() {},

  methods: {
    taoDon() {
      this.dataHangTra = [];
      this.showCreate = true;
      this.edit = false;
      this.formAdd.nha_cung_cap_id = null;
      this.formAdd.ly_do = null;
      this.tongTien = 0;
      this.hangHoas = [];
    },
    async changeNhaCungCap(id) {
      let user_id = this.nhaCungCaps.find((el) => el.id == id).user_id;
      let data = await getSanPhamNhaCungCap({ nha_cung_cap_id: user_id });
      this.hangHoas = data.filter((el) => el.san_pham);
    },
    async update() {
      if (!this.formAdd.nha_cung_cap_id) {
        this.$message({
          message: "Hãy chọn một nhà cung cấp",
          type: "warning",
        });
        return;
      }
      this.formAdd.hangHoas = this.dataHangTra;
      this.formAdd.tong_tien = this.tongTien;
      if (!this.formAdd.hangHoas || this.formAdd.hangHoas.length == 0) {
        this.$message({
          message: "Chưa chọn sản phẩm hàng hóa",
          type: "warning",
        });
        return;
      }
      try {
        await updateDonTraHang(this.don_id, this.formAdd);
        this.getDonHang();
        this.showCreate = false;
        this.$message({
          message: "Thành công",
          type: "success",
        });
      } catch (error) {}
    },
    getDonGia(id) {
      this.addSanPham.don_gia = this.hangHoas.find(
        (el) => el.san_pham_id == id
      ).don_gia;
    },
    async submit() {
      if (!this.formAdd.nha_cung_cap_id) {
        this.$message({
          message: "Hãy chọn một nhà cung cấp",
          type: "warning",
        });
        return;
      }
      this.formAdd.hangHoas = this.dataHangTra;
      this.formAdd.tong_tien = this.tongTien;
      if (!this.formAdd.hangHoas || this.formAdd.hangHoas.length == 0) {
        this.$message({
          message: "Chưa chọn sản phẩm hàng hóa",
          type: "warning",
        });
        return;
      }
      try {
        await traHangNhaCungCap(this.formAdd);
        this.getDonHang();
        this.showCreate = false;
        this.$message({
          message: "Thành công",
          type: "success",
        });
      } catch (error) {}
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 999888,
      });
      this.hangHoas = data.data.data;
    },
    xoaSanPham(index) {
      this.tongTien =
        this.tongTien -
        this.dataHangTra[index].so_luong * this.dataHangTra[index].don_gia;
      this.dataHangTra.splice(index, 1);
    },
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
      this.getDonHang(this.page, this.per_page);
    },
    themSanPham() {
      if (this.addSanPham.don_gia == 0 || this.addSanPham.so_luong == 0) {
        this.$message({
          message: "Số lượng và đơn giá phải lớn hơn 0",
          type: "warning",
        });
        return;
      }
      if (
        !this.addSanPham.don_gia ||
        !this.addSanPham.so_luong ||
        !this.addSanPham.hang_hoa_id
      ) {
        this.$message({
          message: "Sản phẩm, số lượng và đơn giá không thể bỏ trống",
          type: "warning",
        });
        return;
      }
      let sanPham = {};
      sanPham.san_pham_id = this.addSanPham.hang_hoa_id;
      sanPham.ten_san_pham = this.hangHoas.find(
        (el) => el.san_pham_id == this.addSanPham.hang_hoa_id
      ).san_pham.ten_san_pham;
      sanPham.don_vi_tinh = this.hangHoas.find(
        (el) => el.san_pham_id == this.addSanPham.hang_hoa_id
      ).san_pham.don_vi_tinh;
      sanPham.so_luong = this.addSanPham.so_luong;
      sanPham.don_gia = this.addSanPham.don_gia;
      this.tongTien =
        +this.tongTien + this.addSanPham.don_gia * this.addSanPham.so_luong;
      this.dataHangTra.push(sanPham);
      this.addSanPham.hang_hoa_id = null;
      this.addSanPham.so_luong = null;
      this.addSanPham.don_gia = "";
    },
    checkDaChon(id) {
      let check = this.dataHangTra.find((el) => el.san_pham_id == id);
      if (check) return true;
      return false;
    },
    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa đơn trả hàng: " +
            "<strong>" +
            data.ma_don +
            "</strong>",
          "Xóa đơn trả hàng",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        this.listLoading = true;
        let status = await xoaDonTraHang(data.id);
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
      let data = await getDonTraHang({
        per_page: this.per_page,
        page: this.page,
        nha_cung_cap: this.form.nha_cung_cap,
        date: this.form.date,
        search: this.form.search
      });
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.tableData = data.data;
      this.listLoading = false;
    },
    async showUpdate(data) {
      this.don_id = data.id;
      this.edit = true;
      this.showCreate = true;
      this.tongTien = data.tong_tien;
      this.formAdd.nha_cung_cap_id = data.nha_cung_cap_id;
      this.formAdd.ly_do = data.ly_do;
      await this.changeNhaCungCap(data.nha_cung_cap_id);
      this.dataHangTra = [];
      this.dataHangTra = data.san_phams.map((el) => {
        var { created_at, updated_at, ...rest } = el;
        var exist = this.hangHoas.find(
          (item) => item.san_pham_id == el.san_pham_id
        ).san_pham;
        return {
          ...rest,
          ten_san_pham: exist ? exist.ten_san_pham : "",
        };
      });
      this.formAdd.donHangCu = JSON.parse(JSON.stringify(this.dataHangTra));
    },
    async getNhaCungCap() {
      let data = await getNhaCungCap({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },
  },
};
</script>


<style lang="scss" scoped>
</style>
