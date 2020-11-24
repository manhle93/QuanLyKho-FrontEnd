<template>
  <div class="app-container">
    <h4>
      <i style="color: green">HÔM NAY ĂN GÌ</i>
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
      <el-col :span="8">
        <el-button
          size="small"
          class="primary-button"
          icon="el-icon-search"
          @click="getData()"
        >Tìm kiếm</el-button>
      </el-col>
      <el-col :span="7">
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
          <chi-tiet :data="JSON.parse(props.row.nguyen_lieu)"></chi-tiet>
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
      <el-table-column prop="ten" min-width="160" label="Món ăn"></el-table-column>
      <el-table-column prop="so_nguoi_an" min-width="160" label="Số người ăn">
        <template slot-scope="scope">
          {{
          formate.formatCurrency(scope.row.so_nguoi_an) + " người"
          }}
        </template>
      </el-table-column>
      <el-table-column label="Mô tả" prop="mo_ta" min-width="157">
        <template slot-scope="scope" v-if="scope.row.mo_ta">
          {{
          scope.row.mo_ta.length > 70
          ? scope.row.mo_ta.substr(0, 70) + "..."
          : scope.row.mo_ta
          }}
        </template>
      </el-table-column>
      <el-table-column label="Hiển thị trên trang chủ" align="center">
        <template slot-scope="scope">
           <el-checkbox v-model="scope.row.hien_thi" label="Hiển thị" size="small" border @change="hienThi(scope.row.id, scope.row.hien_thi)"></el-checkbox>
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
      :title="edit ? 'THÊM MỚI MÓN ĂN' :'CẬP NHẬT MÓN ĂN'"
      :visible.sync="showForm"
      width="800px"
      center
    >
      <el-row :gutter="24">
        <el-col style="text-align: center" :span="10">
          <img style="widht: 150px; height: 150px" :src="srcForm" />
          <input ref="upload-image" class="upload-image" type="file" @change="handleChange($event)" />
          <br />
          <el-tooltip class="item" effect="dark" content="Thay đổi ảnh đại diện" placement="top">
            <el-button
              size="small"
              class="primary-button block"
              style="margin-top: 20px"
              @click="handleUpload"
              icon="el-icon-edit"
              circle
            ></el-button>
          </el-tooltip>
          <!-- <img :src="src" > -->
        </el-col>
        <el-col :span="14">
          <el-form>
            <el-row :gutter="24">
              <el-col :span="14">
                <el-form-item label="Tên món ăn">
                  <el-input size="small" v-model="form.ten"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="Số người ăn">
                  <el-input type="number" size="small" v-model="form.so_nguoi_an"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Mô tả">
              <el-input type="textarea" :rows="2" size="small" v-model="form.mo_ta"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
      <el-table :data="dataNguyenLieu" border max-height="250px">
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
import { getMonAn, addMonAn, editMonAn, xoaMonAn, hienThiTT } from "@/api/homnayangi";
import { upAnhDanhMuc } from "@/api/danhmucsanpham";
import ChiTiet from "./chitiet";
import { getNguyenLieu } from "@/api/dinhmuc";
export default {
  components: { ChiTiet },
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/product.png",
      srcForm: process.env.VUE_APP_BASE + "images/avatar/product.png",
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
        ten: null,
        so_nguoi_an: null,
        mo_ta: null,
        nguyen_lieus: [],
        anh_dai_dien: null,
      },
    };
  },
  created() {
    this.getData();
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
      this.form.ten = data.ten;
      (this.form.id = data.id), (this.form.anh_dai_dien = data.anh_dai_dien);

      if (this.form.anh_dai_dien) {
        this.srcForm = process.env.VUE_APP_BASE + this.form.anh_dai_dien;
      } else {
        this.srcForm = process.env.VUE_APP_BASE + "images/avatar/product.png";
      }

      this.form.so_nguoi_an = data.so_nguoi_an;
      this.form.mo_ta = data.mo_ta;
      this.dataNguyenLieu = JSON.parse(data.nguyen_lieu);
    },
    async getData(page, per_page) {
      this.listLoading = true;
      let data = await getMonAn({
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
    async hienThi(id, hienThi){
       let data = {id: id, hien_thi: hienThi}
       await hienThiTT(data);
    },
    async create() {
      if (!this.form.ten) {
        this.$message({
          message: "Hãy nhập tên món ăn",
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
      let data = await addMonAn(this.form);
      this.$message({
        message: "Thành công",
        type: "success",
      });
      this.showForm = false;
      this.getData();
    },
    checkSanPhamDaChon(id) {
      let check = this.list.find((el) => el.id == id);
      if (!check) {
        return false;
      }
      return true;
    },
    async update() {
      if (!this.form.ten) {
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
      let data = await editMonAn(this.form);
      this.$message({
        message: "Cập nhật thành công",
        type: "success",
      });
      this.showForm = false;
      this.getData();
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
        "Bạn chắc chắn muốn xoá món ăn " + "<strong>" + item.ten + "</strong>",

        "Xóa món ăn",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          xoaMonAn(item.id).then((res) => {
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
      this.edit = false;
      this.showForm = true;
    },
    resetForm() {
      this.showForm = false;
      this.form = {
        id: null,
        ten: null,
        mo_ta: null,
        so_nguoi_an: null,
        nguyen_lieus: [],
        anh_dai_dien: null,
      };
      (this.srcForm = process.env.VUE_APP_BASE + "images/avatar/product.png"),
        (this.dataNguyenLieu = []);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.getData();
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      upAnhDanhMuc(data)
        .then((res) => {
          this.form.anh_dai_dien = res;
          this.srcForm = process.env.VUE_APP_BASE + res;
        })
        .catch((error) => {});
    },
    handleUpload() {
      this.$refs["upload-image"].click();
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
