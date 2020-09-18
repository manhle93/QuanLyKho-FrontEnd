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
      <el-col :span="15">
        <el-button
          style="float: right"
          size="small"
          class="primary-button"
          icon="el-icon-plus"
          @click="showFormAdd()"
        >Tạo phiếu thu</el-button>
      </el-col>
    </el-row>
    <br />
    <h4>Danh sách phiếu thu</h4>
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
          <el-table-column property="created_at" label="Thời gian" min-width="125"></el-table-column>
          <el-table-column property="noi_dung" label="Nội dung" min-width="123"></el-table-column>
          <el-table-column prop="so_tien" label="Số tiền">
            <template slot-scope="scope">{{formate.formatCurrency(scope.row.so_tien)}} đ</template>
          </el-table-column>
          <el-table-column prop="thong_tin_khach_hang" label="Thông tin khách hàng"></el-table-column>
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
                  v-if="scope.row.type == 'tu_nhap'"
                  size="small"
                  @click="xoa(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
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
      :title="edit ? 'CẬP NHẬT PHIẾU THU': 'TẠO PHIẾU THU' "
      center
      width="30%"
      :visible.sync="showCreate"
    >
      <el-form :model="formAdd" :rules="rules" ref="formAdd">
        <el-form-item label="Số tiền" prop="so_tien">
          <div
            v-if="formAdd.type != 'tu_nhap'"
            style="font-size: 15px; font-weight: bold"
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
          <el-input v-model="formAdd.thong_tin_giao_dich" type="textarea" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="Khách hàng">
          <el-select
            v-model="formAdd.user_id_khach_hang"
            placeholder="Chọn khách hàng"
            style="width: 100%"
          >
            <el-option
              v-for="item in khachHang"
              :key="item.user_id"
              :label="item.ten"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Thông tin khách hàng">
          <el-input v-model="formAdd.thong_tin_khach_hang" type="textarea" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" icon="el-icon-close" @click="showCreate = false">Hủy</el-button>
        <el-button
          v-if="edit"
          class="primary-button"
          size="small"
          icon="el-icon-check"
          @click="update()"
        >Cập nhật</el-button>
        <el-button
          v-else
          class="primary-button"
          size="small"
          icon="el-icon-plus"
          @click="add('formAdd')"
        >Thêm mới</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPhieuThu,
  updatePhieuThu,
  addPhieuThu,
  xoaPhieuThu
} from "@/api/donhangnhacungcap";
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
      formate: formate,
      edit: false,
      form: {
        date: [],
        nha_cung_cap: [],
      },
      formAdd: {
        id: null,
        so_tien: null,
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
            this.formate.formatCurrency(data.so_tien) + ' đ' +
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
    showFormAdd() {
      this.edit = false;
      this.showCreate = true;
      this.formAdd.id = null;
      this.formAdd.so_tien = null;
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
