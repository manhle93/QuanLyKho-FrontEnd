<template>
  <div class="app-container">
    <el-row>
      <el-col :span="20" :offset="2">
        <h4><i style="color: green"> CẬP NHẬT THÔNG TIN SẢN PHẨM/ HÀNG HÓA</i></h4>
        <el-form :model="form" :rules="rules" ref="form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="Tên sản phẩm/ Hàng hóa" prop="ten_san_pham">
                <el-input v-model="form.ten_san_pham"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Nhóm hàng hóa" prop="danh_muc_id">
                <el-select
                  filterable
                  clearable
                  v-model="form.danh_muc_id"
                  placeholder="Chọn nhóm hàng hóa"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in danhMucS"
                    :key="item.id"
                    :label="item.ten_danh_muc"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Giá bán" prop="gia_ban">
                <el-input
                  @blur="isInputActive = false"
                  @focus="isInputActive = true"
                  style="width: 100%"
                  :min="1"
                  v-model="giaBan"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Đơn vị tính" prop="don_vi_tinh">
                <el-input v-model="form.don_vi_tinh"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Giá vốn">
                <el-input
                  @blur="isInputActiveGiaVon = false"
                  @focus="isInputActiveGiaVon = true"
                  style="width: 100%"
                  :min="1"
                  v-model="giaVon"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div style="display: flex; flex-direction: row">
                <div>
                  <el-form-item label="Thương hiệu">
                    <br />
                    <el-select
                      filterable
                      clearable
                      v-model="form.thuong_hieu_id"
                      placeholder="Chọn thương hiệu"
                    >
                      <el-option
                        v-for="item in thuongHieus"
                        :key="item.id"
                        :label="item.ten"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div style="margin-left: 10px">
                  <el-form-item>
                    <br />
                    <el-button
                      size="small"
                      class="primary-button"
                      icon="el-icon-plus"
                      circle
                      @click="showFormAddThuongHieu()"
                    ></el-button>
                  </el-form-item>
                </div>
                <div style="margin-left: 10px">
                  <el-form-item>
                    <br />
                    <el-button
                      v-if="form.thuong_hieu_id"
                      size="small"
                      class="primary-button"
                      icon="el-icon-edit"
                      circle
                      @click="showEditThuongHieu()"
                    ></el-button>
                  </el-form-item>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Vị trí">
                <el-input v-model="form.vi_tri"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                :label="'Tồn kho tối thiểu (' + form.don_vi_tinh + ')'"
              >
                <el-input
                  type="number"
                  style="width: 100%"
                  :min="0"
                  placeholder="Nhập số lượng tồn kho tối thiểu"
                  v-model="form.ton_kho_thap_nhat"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Thời gian bảo quản (Ngày)">
                <el-input
                  type="number"
                  style="width: 100%"
                  :min="1"
                  placeholder="Nhập số ngày bảo quản"
                  v-model="form.thoi_gian_bao_quan"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div style="display: flex; flex-direction: row">
                <div style="flex-grow: 4">
                  <label>Mô tả sản phẩm</label>
                  <br />
                  <br />
                  <vue-simplemde
                    v-model="form.mo_ta_san_pham"
                    ref="markdownEditor"
                  />
                </div>
                <div style="margin-left: 50px">
                  <el-form-item label="Ảnh đại diện">
                    <br />
                    <a>
                      <img
                        @click="handleUpload"
                        style="widht: 150px; height: 150px"
                        :src="src"
                      />
                    </a>
                    <input
                      ref="upload-image"
                      class="upload-image"
                      type="file"
                      @change="handleChange($event)"
                    />
                  </el-form-item>
                </div>
                <div style="margin-left: 50px">
                  <el-form-item label="Album ảnh">
                    <br />
                    <el-upload
                      ref="upload"
                      :action="urlUploadSanPham"
                      :file-list="form.fileList"
                      :headers="this.token"
                      list-type="picture-card"
                      :on-change="handleChangeAlbum"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogAlbum">
                      <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                  </el-form-item>
                </div>
              </div>
            </el-col>
            <!-- <el-col :span="24">
              <label>Mô tả sản phẩm</label>
              <br />
              <br />
              <vue-simplemde v-model="form.mo_ta_san_pham" ref="markdownEditor" />
            </el-col>-->

            <el-col :span="12">
              <router-link to="/quanlykho/loaimathang">
                <el-button type="warning" icon="el-icon-back"
                  >Quay lại</el-button
                >
              </router-link>
            </el-col>
            <el-col :span="12">
              <el-button
                style="float: right"
                class="primary-button"
                icon="el-icon-check"
                @click="addSanPham('form')"
                >Cập nhật</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog
      :title="editThuongHieu ? 'CẬP NHẬT THƯƠNG HIỆU' : 'THÊM MỚI THƯƠNG HIỆU'"
      :visible.sync="showThuongHieu"
      width="25%"
      center
    >
      <el-form
        :model="formAddThuongHieu"
        :rules="rules"
        ref="formAddThuongHieu"
      >
        <el-form-item label="Tên thương hiệu" prop="ten">
          <el-input v-model="formAddThuongHieu.ten"></el-input>
        </el-form-item>
        <el-form-item label="Mô tả">
          <el-input
            :rows="2"
            type="textarea"
            v-model="formAddThuongHieu.mo_ta"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="warning"
          icon="el-icon-close"
          @click="huyThuongHieu()"
          >Hủy bỏ</el-button
        >
        <el-button
          v-if="!editThuongHieu"
          size="small"
          class="primary-button"
          icon="el-icon-plus"
          @click="themThuongHieu('formAddThuongHieu')"
          >THÊM MỚI</el-button
        >
        <el-button
          v-if="editThuongHieu"
          size="small"
          class="primary-button"
          icon="el-icon-edit"
          @click="updateThuongHieu('formAddThuongHieu')"
          >Cập nhật</el-button
        >
        <el-button
          v-if="editThuongHieu"
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="xoaThuongHieu()"
          >Xóa</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { index } from "@/api/danhmucsanpham";
import {
  getThuongHieu,
  xoaThuongHieu,
  addThuongHieu,
  editThuongHieu,
} from "@/api/thuonghieu";
import { getToken } from "@/utils/auth";
import {
  listSanPham,
  addSanPham,
  chiTietSP,
  xoaAnh,
  editSanPham,
} from "@/api/sanpham";
import { upAnhDanhMuc } from "@/api/danhmucsanpham";
export default {
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png",
      urlUploadSanPham: "",
      endPointImage: process.env.VUE_APP_BASE,
      dialogImageUrl: "",
      dialogAlbum: false,
      thoiGianKhuyenMai: "",
      danhMucS: [],
      token: "",
      showThuongHieu: false,
      isInputActive: null,
      isInputActiveGiaVon: null,
      form: {
        id: null,
        anh_dai_dien: "",
        mo_ta_san_pham: "",
        ten_san_pham: "",
        danh_muc_id: null,
        gia_ban: "",
        gia_sale: "",
        don_vi_tinh: "",
        dang_khuyen_mai: false,
        bat_dau_khuyen_mai: null,
        ket_thuc_khuyen_mai: null,
        fileList: [],
        thuong_hieu_id: null,
        gia_von: "",
        vi_tri: null,
        ton_kho_thap_nhat: 0,
        thoi_gian_bao_quan: 1,
      },
      thuongHieus: [],
      formAddThuongHieu: {
        ten: null,
        mo_ta: null,
      },
      editThuongHieu: false,
      rules: {
        danh_muc_id: [
          {
            required: true,
            message: "Nhóm hàng hóa không thể bỏ trống",
            trigger: "blur",
          },
        ],
        ten_san_pham: [
          {
            required: true,
            message: "Tên sản phẩm không thể bỏ trống",
            trigger: "blur",
          },
        ],
        don_vi_tinh: [
          {
            required: true,
            message: "Đơn vị tính không thể bỏ trống",
            trigger: "blur",
          },
        ],
        ten: [
          {
            required: true,
            message: "Tên thương hiệu không thể bỏ trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    giaBan: {
      get() {
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          return this.form.gia_ban.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.form.gia_ban).replace(
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
        this.form.gia_ban = newValue;
      },
    },
    giaVon: {
      get() {
        if (this.isInputActiveGiaVon) {
          // Cursor is inside the input field. unformat display value for user
          return this.form.gia_von.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.form.gia_von).replace(
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
        this.form.gia_von = newValue;
      },
    },
  },
  created() {
    this.getDanhMuc();
    this.getThuongHieu();
    this.token = {
      Authorization: "Bearer " + getToken(),
    };
    this.urlUploadSanPham =
      process.env.VUE_APP_BASE_API + "uploadedit/" + this.$route.params.id;
    this.getChiTietSanPham();
  },
  methods: {
    showFormAddThuongHieu() {
      this.editThuongHieu = false;
      this.showThuongHieu = true;
      this.formAddThuongHieu = {
        ten: null,
        mo_ta: null,
      };
    },
    huyThuongHieu() {
      this.editThuongHieu = false;
      this.showThuongHieu = false;
      this.formAddThuongHieu = {
        ten: null,
        mo_ta: null,
      };
    },
    async xoaThuongHieu() {
      await xoaThuongHieu(this.form.thuong_hieu_id);
      this.$message({
        type: "success",
        message: "Xóa thương hiệu thành công",
      });
      this.showThuongHieu = false;
      this.form.thuong_hieu_id = null;
      this.getThuongHieu();
    },
    async getThuongHieu() {
      let data = await getThuongHieu();
      this.thuongHieus = data.data;
    },
    themThuongHieu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addThuongHieu(this.formAddThuongHieu).then((res) => {
            this.$message({
              type: "success",
              message: "Thêm thương hiệu thành công",
            });
          });
          this.getThuongHieu();
          this.showThuongHieu = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateThuongHieu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editThuongHieu(this.form.thuong_hieu_id, this.formAddThuongHieu).then(
            (res) => {
              this.$message({
                type: "success",
                message: "Cập nhật thương hiệu thành công",
              });
            }
          );
          this.getThuongHieu();
          this.showThuongHieu = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showEditThuongHieu() {
      let thuonghieu = this.thuongHieus.find(
        (el) => el.id == this.form.thuong_hieu_id
      );
      this.editThuongHieu = true;
      this.showThuongHieu = true;
      this.formAddThuongHieu.ten = thuonghieu.ten;
      this.formAddThuongHieu.mo_ta = thuonghieu.mo_ta;
    },
    handleRemove(file, fileList) {
      xoaAnh({ id: file.id })
        .then((res) => {
          this.$message({
            type: "success",
            message: "Xóa ảnh thành công",
          });
        })
        .catch((res) => {});
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogAlbum = true;
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
    async getDanhMuc() {
      let data = await index();
      this.danhMucS = data.data;
    },
    handleChangeAlbum(file, fileList) {
      this.form.fileList = fileList.slice(-10);
    },
    resetForm() {
      this.form = {
        id: null,
        anh_dai_dien: "",
        mo_ta_san_pham: "",
        ten_san_pham: "",
        danh_muc_id: null,
        gia_ban: "",
        gia_sale: "",
        don_vi_tinh: "",
        dang_khuyen_mai: false,
        bat_dau_khuyen_mai: null,
        ket_thuc_khuyen_mai: null,
        fileList: [],
        thuong_hieu_id: null,
        gia_von: "",
        vi_tri: null,
        ton_kho_thap_nhat: 0,
        thoi_gian_bao_quan: 1,
      };
      this.src = process.env.VUE_APP_BASE + res;
      this.$refs.upload.clearFiles();
    },
    addSanPham(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editSanPham(this.$route.params.id, this.form)
            .then((res) => {
              this.$message({
                type: "success",
                message: "Cập nhật thành công",
              });
            })
            .catch((res) => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getChiTietSanPham() {
      let data = await chiTietSP(this.$route.params.id);
      this.form = data;
      this.form.gia_von = data.gia_von ?  data.gia_von : ""
      this.form.fileList = [];
      if (this.form.anh_dai_dien) {
        this.src = process.env.VUE_APP_BASE + this.form.anh_dai_dien;
      } else {
        this.src = process.env.VUE_APP_BASE + "images/avatar/product.png";
      }
      if (data.hinh_anhs.length > 0) {
        for (let item of data.hinh_anhs) {
          let ob = { id: item.id, url: this.endPointImage + item.url_hinh_anh };
          this.form.fileList.push(ob);
        }
      }
    },
  },
};
</script>
<style scoped>
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