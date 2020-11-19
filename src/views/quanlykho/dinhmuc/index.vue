<template>
  <div class="app-container">
    <h4>
      <i style="color: green">ĐỊNH MỨC SẢN XUẤT</i>
    </h4>
    <el-row :gutter="20" justify="space-around">
      <el-col :span="9">
        <el-input
          size="small"
          placeholder="Thông tin tìm kiếm"
          v-model="search"
          suffix-icon="el-icon-search"
          @keyup.enter.native="getData()"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="getData()"
        >Tìm kiếm</el-button>
      </el-col>
      <el-col :span="10">
        <el-button
          style="float: right"
          @click="showFormAdd"
          size="small"
          icon="el-icon-plus"
          class="primary-button"
        >THÊM MỚI</el-button>
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
          <chi-tiet :data="props.row.nguyen_lieus"></chi-tiet>
        </template>
      </el-table-column>
      <el-table-column label="STT" min-width="55" type="index" align="center"></el-table-column>
      <el-table-column label="Hình ảnh" width="200" align="center">
        <template slot-scope="scope">
          <img
            :src="
              scope.row.anh_dai_dien
                ? endPointImage + scope.row.anh_dai_dien
                : src
            "
            style="max-height: 90px; max-width: 90px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="ten_san_pham" min-width="160" label="Tên sản phẩm"></el-table-column>
      <el-table-column prop="gia_ban" min-width="160" label="Giá bán">
        <template slot-scope="scope">
          {{
          formate.formatCurrency(scope.row.gia_ban) + " đ"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="don_vi_tinh" min-width="160" label="Đơn vị tính"></el-table-column>
      <el-table-column label="Mô tả" prop="mo_ta_san_pham" min-width="157">
        <template slot-scope="scope" v-if="scope.row.mo_ta_san_pham">
          {{
          scope.row.mo_ta_san_pham.length > 70
          ? scope.row.mo_ta_san_pham.substr(0, 70) + "..."
          : scope.row.mo_ta_san_pham
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="110" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
            <el-button
              size="small"
              style="background-color: #2E86C1; color: white"
              icon="el-icon-edit"
              circle
              @click="showUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Khóa tài khoản" placement="top">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteAppUserID(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      :title="edit ? 'CẬP NHẬT ĐỊNH MỨC SẢN XUẤT' :'NGUYÊN LIỆU SẢN XUẤT'"
      :visible.sync="showForm"
      width="700px"
      center
    >
      <el-select
        size="small"
        style="width: 100%"
        v-model="form.san_pham_id"
        placeholder="Lựa chọn món ăn"
        filterable
        remote
        reserve-keyword
        :remote-method="remoteMethodSanPham"
        :loading="loading"
      >
        <el-option
          v-for="item in thanhPhams"
          :key="item.id"
          :label="item.ten_san_pham"
          :value="item.id"
          :disabled="checkSanPhamDaChon(item.id)"
        ></el-option>
      </el-select>
      <br />
      <h4>Nguyên liệu sản xuất</h4>
      <el-row :gutter="24">
        <el-col :span="14">
          <el-select
            size="small"
            style="width: 100%"
            v-model="nguyen_lieu_id"
            placeholder="Lựa chọn món ăn"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodNguyenLieu"
            :loading="loading"
            @change="chonNguyenLieu"
          >
            <el-option
              v-for="item in nguyenLieus"
              :key="item.id"
              :label="item.ten_san_pham"
              :value="item.id"
              :disabled="checkNguyenLieuDaChon(item.id)"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input-number
            style="width: 90%"
            aria-placeholder="Số lượng"
            v-model="so_luong"
            size="small"
          ></el-input-number>
          {{don_vi}}
        </el-col>
        <el-col :span="2">
          <el-button
            size="small"
            type="warning"
            icon="el-icon-plus"
            circle
            @click="addNguyenLieu()"
          ></el-button>
        </el-col>
      </el-row>
      <br />
      <el-table :data="dataNguyenLieu" border max-height="400px">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column prop="ten" label="Nguyên liệu"></el-table-column>
        <el-table-column label="Số lượng" prop="so_luong" width="200">
          <template slot-scope="scope">{{scope.row.so_luong}} {{scope.row.don_vi}}</template>
        </el-table-column>
        <el-table-column label="Xóa" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              circle
              type="danger"
              icon="el-icon-delete"
              @click="xoaSanPham(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit"
          icon="el-icon-plus"
          @click="create()"
        >THÊM MỚI</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-if="edit"
          icon="el-icon-check"
          @click="update()"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSanPham,
  getNguyenLieu,
  taoDinhMuc,
  dsDinhMuc,
  editDinhMuc,
  xoaDinhMuc,
} from "@/api/dinhmuc";
import ChiTiet from "./chitiet";
export default {
  components: { ChiTiet },
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/product.png",
      endPointImage: process.env.VUE_APP_BASE,
      loading: false,
      thanhPhams: [],
      nguyenLieus: [],
      list: [],
      showForm: false,
      edit: false,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      formate: formate,
      nguyen_lieu_id: null,
      so_luong: null,
      don_vi: null,
      dataNguyenLieu: [],
      form: {
        id: null,
        san_pham_id: null,
        nguyen_lieus: [],
      },
    };
  },
  created() {
    this.getData();
    this.getSanPham();
    this.getNguyenLieu();
  },
  methods: {
    async getSanPham(search) {
      let data = await getSanPham({ search: search });
      this.loading = false;
      this.thanhPhams = data;
    },
    chonNguyenLieu() {
      let nguyenLieu = this.nguyenLieus.find(
        (el) => el.id == this.nguyen_lieu_id
      );
      this.don_vi = nguyenLieu.don_vi_tinh;
    },
    remoteMethodNguyenLieu(query) {
      this.loading = true;
      this.getNguyenLieu(query);
    },
    remoteMethodSanPham(query) {
      this.loading = true;
      this.getSanPham(query);
    },
    xoaSanPham(index) {
      this.dataNguyenLieu.splice(index, 1);
    },
    addNguyenLieu() {
      if (!this.nguyen_lieu_id || !this.so_luong) {
        this.$message({
          message: "Hãy nhập nguyên liệu và số lượng",
          type: "warning",
        });
        return;
      }
      let nguyenLieu = this.nguyenLieus.find(
        (el) => el.id == this.nguyen_lieu_id
      );
      let nl = {};
      nl.don_vi = this.don_vi;
      nl.nguyen_lieu_id = this.nguyen_lieu_id;
      nl.so_luong = this.so_luong;
      nl.ten = nguyenLieu.ten_san_pham;
      this.dataNguyenLieu.push(nl);
      this.nguyen_lieu_id = null;
      this.so_luong = null;
    },
    checkNguyenLieuDaChon(id) {
      let check = this.dataNguyenLieu.find((el) => el.nguyen_lieu_id == id);
      if (!check) {
        return false;
      }
      return true;
    },
    async getNguyenLieu(search = null) {
      let data = await getNguyenLieu({ search: search });
      this.loading = false;
      this.nguyenLieus = data;
    },
    showUpdate(data) {
      this.resetForm();
      this.edit = true;
      this.showForm = true;
      this.form.san_pham_id = data.id;
      data.nguyen_lieus.forEach((el) => {
        let nl = {};
        (nl.don_vi = el.nguyen_lieus.don_vi_tinh),
          (nl.nguyen_lieu_id = el.nguyen_lieus.id);
        nl.so_luong = el.so_luong;
        nl.ten = el.nguyen_lieus.ten_san_pham;
        this.dataNguyenLieu.push(nl);
      });
    },
    async getData(page, per_page) {
      this.listLoading = true;
      let data = await dsDinhMuc({
        page: this.page,
        per_page: this.per_page,
        search: this.search,
      });
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.list = data.data.data;
      this.listLoading = false;
    },
    async create() {
      if (!this.form.san_pham_id) {
        this.$message({
          message: "Chưa chọn sản phẩm sản xuất",
          type: "warning",
        });
        return;
      }
      if (!this.dataNguyenLieu.length) {
        this.$message({
          message: "Chưa chọn nguyên liệu sản xuất",
          type: "warning",
        });
        return;
      }
      this.form.nguyen_lieus = this.dataNguyenLieu;
      let data = await taoDinhMuc(this.form);
      this.$message({
        message: "Tạo định mức thành công",
        type: "success",
      });
      this.showForm = false;
      this.getData();
      this.getSanPham();
    },
    checkSanPhamDaChon(id) {
      let check = this.list.find((el) => el.id == id);
      if (!check) {
        return false;
      }
      return true;
    },
    async update() {
      if (!this.form.san_pham_id) {
        this.$message({
          message: "Chưa chọn sản phẩm sản xuất",
          type: "warning",
        });
        return;
      }
      if (!this.dataNguyenLieu.length) {
        this.$message({
          message: "Chưa chọn nguyên liệu sản xuất",
          type: "warning",
        });
        return;
      }
      this.form.nguyen_lieus = this.dataNguyenLieu;
      let data = await editDinhMuc(this.form);
      this.$message({
        message: "Tạo định mức thành công",
        type: "success",
      });
      this.showForm = false;
      this.getData();
      this.getSanPham();
    },
    searchData() {
      this.listLoading = true;
      getKhachHang({ search: this.search }).then((response) => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa định mức nguyên vật liệu cho sản phẩm: " +
          "<strong>" +
          item.ten_san_pham +
          "</strong>",

        "Xóa định mức nguyên vật liệu sản xuất",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          xoaDinhMuc({ san_pham_id: item.id }).then((res) => {
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.getData();
            this.getSanPham();
          });
        })
        .catch((_) => {});
    },
    showFormAdd() {
      this.resetForm();
      this.edit = false;
      this.showForm = true;
    },
    resetForm() {
      this.showForm = false;
      this.form = {
        id: null,
        san_pham_id: null,
        nguyen_lieus: [],
      };
      this.dataNguyenLieu = [];
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.getData();
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
.el-form-item__label {
  line-height: 30px;
}
</style>
