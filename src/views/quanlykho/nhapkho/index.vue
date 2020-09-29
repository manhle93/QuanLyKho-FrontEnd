<template>
  <div class="app-container">
    <h4><i style="color: green">DANH SÁCH MUA HÀNG NHẬP KHO</i></h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="6">
        <el-date-picker
          style="width: 100%"
          v-model="date"
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
          size="small"
          placeholder="Thông tin tìm kiếm"
          v-model="search"
          suffix-icon="el-icon-search"
          @keyup.enter.native="searchData()"
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="searchData()"
        >Tìm kiếm</el-button>
      </el-col>
      <el-col :span="6">
        <el-button
          style="float: right"
          size="small"
          class="primary-button"
          icon="el-icon-plus"
          @click="showNhapKho()"
        >Nhập kho ngoài</el-button>
      </el-col>
    </el-row>
    <br />
    <br />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="font-size: 13px"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.don_hang ? props.row.don_hang.san_phams: []"
            style="width: 60%;"
          >
            <el-table-column label="STT" type="index"></el-table-column>
            <el-table-column label="Sản phẩm" prop="san_pham.ten_san_pham"></el-table-column>
            <el-table-column label="Số lượng" prop="so_luong"></el-table-column>
            <el-table-column label="Đơn giá" prop="don_gia">
              <template slot-scope="scope">{{formate.formatCurrency(scope.row.don_gia)}} đ</template>
            </el-table-column>
            <el-table-column label="Thành tiền">
              <template
                slot-scope="scope"
              >{{formate.formatCurrency(scope.row.so_luong * scope.row.don_gia)}} đ</template>
            </el-table-column>
          </el-table>
          <br />
          <div
            v-if="props.row.don_hang"
            style="margin-top: 15px; font-size: 16px; font-family: time new roman"
          >Chiết khấu: {{formate.formatCurrency(props.row.don_hang.chiet_khau)}} đ</div>
          <div
            v-if="props.row.don_hang"
            style="margin-top: 15px; font-size: 17px; font-family: time new roman; font-weight: bold"
          >Tổng tiền: {{formate.formatCurrency(props.row.don_hang.tong_tien)}} đ</div>
        </template>
      </el-table-column>
      <el-table-column label="STT" width="100px" type="index" align="center"></el-table-column>
      <el-table-column label="Mã phiếu nhập" align="center" prop="ma"></el-table-column>
      <el-table-column label="Mã đơn hàng" align="center" prop="don_hang.ma"></el-table-column>
      <el-table-column label="Thời gian nhập" align="center" prop="created_at"></el-table-column>
      <el-table-column label="Tổng tiền" prop="don_hang.tong_tien">
        <template
          v-if="scope.row.don_hang"
          slot-scope="scope"
        >{{formate.formatCurrency(scope.row.don_hang.tong_tien)}} đ</template>
      </el-table-column>
      <el-table-column label="Ghi chú" align="center">
        <template slot-scope="scope">
          <el-tag type="success" effect="plain" v-if="scope.row.don_hang_id && scope.row.don_hang && scope.row.don_hang.trang_thai == 'nhap_kho'">Nhập từ nhà cung cấp</el-tag>
          <el-tag type="success" effect="plain" v-if="scope.row.don_hang && scope.row.don_hang.trang_thai == 'nhap_kho_ngoai'">Nhập kho ngoài</el-tag>
          <el-tag type="warning" effect="plain" v-if="!scope.row.don_hang_id">Hoàn hàng</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Chi tiết đơn hàng">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Xem đơn hàng" placement="top">
            <el-button
              v-if="scope.row.don_hang_id"
              size="small"
              class="primary-button"
              icon="el-icon-view"
              circle
              @click="showUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog :visible.sync="showCreate" title="NHẬP HÀNG HÓA MUA NGOÀI" width="600px" center>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-select
            size="small"
            style="width: 100%"
            placeholder="Chọn hàng hóa"
            v-model="addSanPham.hang_hoa_id"
          >
            <el-option
              v-for="item in hangHoas"
              :key="item.id"
              :label="item.ten_san_pham"
              :value="item.id"
              :disabled="checkDaChon(item.id)"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-input
            v-model="addSanPham.so_luong"
            placeholder="Số lượng mua"
            type="number"
            size="small"
            :min="0"
          ></el-input>
        </el-col>
        <el-col :span="7">
          <el-input
            v-model="addSanPham.don_gia"
            placeholder="Đơn giá nhập"
            type="number"
            size="small"
            :min="0"
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
      <el-table :data="dataMuaHang" height="400px">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column label="Hàng hóa" prop="ten_san_pham"></el-table-column>
        <el-table-column label="Số lượng" prop="so_luong"></el-table-column>
        <el-table-column label="Đơn giá" prop="don_gia">
          <template
            slot-scope="scope"
          >{{formate.formatCurrency(scope.row.don_gia)}} đ/{{scope.row.don_vi_tinh}}</template>
        </el-table-column>
        <el-table-column label="Thành tiền">
          <template
            slot-scope="scope"
          >{{formate.formatCurrency(scope.row.don_gia * scope.row.so_luong)}} đ</template>
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
      <span>Tổng tiền: {{formate.formatCurrency(tongTien)}} đ</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" icon="el-icon-close" @click="showCreate = false">Hủy</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit"
          icon="el-icon-plus"
          @click="submit()"
        >Thêm mới</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-else
          icon="el-icon-check"
          @click="update()"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPhieuNhap, nhapKhoNgoai } from "@/api/quanlykho";
import { listSanPham } from "@/api/sanpham";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png",
      endPointImage: process.env.VUE_APP_BASE,
      list: [],
      showForm: false,
      addSanPham: {
        hang_hoa_id: null,
        so_luong: null,
        don_gia: null,
      },
      edit: false,
      dataMuaHang: [],
      showCreate: false,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      date: null,
      listLoading: true,
      labelPosition: "top",
      user: null,
      formate: formate,
      hangHoas: [],
      tongTien: 0,
      form: {
        id: null,
        anh_dai_dien: "",
        mo_ta: "",
        ten_danh_muc: "",
      },
      formAdd: {
        tong_tien: 0,
        hangHoas: [],
      },
      rules: {
        ten_danh_muc: [
          {
            required: true,
            message: "Tên danh mục không thể bỏ trống",
            trigger: "blur",
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getData();
    this.getSanPham();
  },
  methods: {
    showUpdate(data) {
      this.$router.push("/quanlydonhang/capnhatdonhang/" + data.don_hang_id);
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 999888,
      });
      this.hangHoas = data.data.data;
    },
    async getData() {
      this.listLoading = true;
      let data = await getPhieuNhap({
        page: this.page,
        per_page: this.per_page,
      });
      this.list = data.data.data;
      this.page = data.data.current_page;
      this.per_page = data.data.per_page;
      this.listLoading = false;
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
        (el) => el.id == this.addSanPham.hang_hoa_id
      ).ten_san_pham;
      sanPham.don_vi_tinh = this.hangHoas.find(
        (el) => el.id == this.addSanPham.hang_hoa_id
      ).don_vi_tinh;
      sanPham.so_luong = this.addSanPham.so_luong;
      sanPham.don_gia = this.addSanPham.don_gia;
      this.tongTien =
        +this.tongTien + this.addSanPham.don_gia * this.addSanPham.so_luong;
      this.dataMuaHang.push(sanPham);
      this.addSanPham.hang_hoa_id = null;
      this.addSanPham.so_luong = null;
      this.addSanPham.don_gia = null;
    },
    checkDaChon(id) {
      let check = this.dataMuaHang.find((el) => el.san_pham_id == id);
      if (check) return true;
      return false;
    },
    xoaSanPham(index) {
      this.tongTien =
        this.tongTien -
        this.dataMuaHang[index].so_luong * this.dataMuaHang[index].don_gia;
      this.dataMuaHang.splice(index, 1);
    },
    searchData() {
      this.listLoading = true;
      getPhieuNhap({ search: this.search, date: this.date }).then(
        (response) => {
          this.list = response.data.data;
          this.listLoading = false;
        }
      );
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa danh mục: " +
          "<strong>" +
          item.ten_danh_muc +
          "</strong>" +
          ", cùng toàn bộ sản phẩm bên trong",
        "Xóa danh mục sản phẩm",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          xoaDanhMuc(item.id).then((res) => {
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.getData();
          });
        })
        .catch((_) => {});
    },
    showFormAdd() {
      this.resetForm();
      this.showForm = true;
    },
    addDanhMuc(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addDanhMuc(this.form).then((res) => {
            this.resetForm();
            this.getData();
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
    async submit() {
      if (this.dataMuaHang.length == 0) {
        this.$message({
          type: "warning",
          message: "Chưa chọn hàng hóa",
        });
        return;
      }
      this.formAdd.hangHoas = this.dataMuaHang;
      this.formAdd.tong_tien = this.tongTien;
      try {
        let data = await nhapKhoNgoai(this.formAdd);
        this.getData();
        this.showCreate = false;
        this.$message({
          type: "success",
          message: "Thành công",
        });
      } catch (error) {}
    },
    updateDanhMuc(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateDanhMuc(this.form).then((res) => {
            this.resetForm();
            this.getData();
            this.$message({
              type: "success",
              message: "Cập nhật thành công",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.showForm = false;
      this.src = process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png";
      this.form = {
        id: null,
        anh_dai_dien: "",
        mo_ta: "",
        ten_danh_muc: "",
      };
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      upAnhDanhMuc(data)
        .then((res) => {
          this.form.anh_dai_dien = res;
          this.src = process.env.VUE_APP_BASE + res;
        })
        .catch((error) => {});
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },

    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.getData();
    },
    showNhapKho() {
      this.showCreate = true;
      this.dataMuaHang = [];
      this.addSanPham = {
        hang_hoa_id: null,
        so_luong: null,
        don_gia: null,
      };
    },
  },
};
</script>
<style>
.search {
  margin-bottom: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: inherit;
  color: #8c939d;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.avatar {
  width: 40px;
  height: 40px;
  display: block;
}
.upload-image {
  display: none;
  z-index: -9999;
}
</style>
