<template>
  <div class="app-container">
    <el-row>
      <el-col :span="20" :offset="2">
        <h3>Thêm mới sản phẩm hàng hóa</h3>
        <el-form :model="form" :rules="rules" ref="form">
          <el-row>
            <el-col style="text-align: center">
              <div class="block">
                <img style="widht: 150px; height: 150px" :src="src" />
                <input
                  ref="upload-image"
                  class="upload-image"
                  type="file"
                  @change="handleChange($event)"
                />
                <br />
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Thay đổi ảnh đại diện"
                  placement="top"
                >
                  <el-button
                    class="primary-button block"
                    style="margin-top:20px;"
                    @click="handleUpload"
                    icon="el-icon-edit"
                    circle
                  ></el-button>
                </el-tooltip>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="Tên sản phẩm" prop="ten_san_pham">
                <el-input v-model="form.ten_san_pham"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Danh mục" prop="danh_muc_id">
                <el-select
                  v-model="form.danh_muc_id"
                  placeholder="Chọn danh mục hàng hóa"
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
                <el-input v-model="form.gia_ban"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Đơn vị tính" prop="don_vi_tinh">
                <el-input v-model="form.don_vi_tinh"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Sản phẩm khuyến mãi">
                <el-checkbox v-model="form.dang_khuyen_mai" label="Sản phẩm khuyến mãi" border></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="form.dang_khuyen_mai">
              <el-form-item label="Giá khuyến mãi" prop="gia_sale">
                <el-input v-model="form.gia_sale"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="form.dang_khuyen_mai">
              <el-form-item label="Thời gian khuyến mãi" prop="gia_sale">
                <el-date-picker
                  v-model="thoiGianKhuyenMai"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="Bắt đầu"
                  end-placeholder="Kết thúc"
                  format="dd/MM/yyyy HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <label>Mô tả sản phẩm</label>
              <br />
              <vue-simplemde v-model="form.mo_ta" ref="markdownEditor" />
            </el-col>
            <el-col :span="24">
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
            </el-col>
            <el-col :span="12">
              <router-link to="/quanlykho/loaimathang">
                <el-button type="warning" icon="el-icon-back">Quay lại</el-button>
              </router-link>
            </el-col>
            <el-col :span="12">
              <el-button
                style="float: right"
                class="primary-button"
                icon="el-icon-check"
                @click="addSanPham('form')"
              >Cập nhật</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { index } from "@/api/danhmucsanpham";
import { getToken } from "@/utils/auth";
import { listSanPham, addSanPham, chiTietSP, xoaAnh, editSanPham } from "@/api/sanpham";
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
        fileList: []
      },
      rules: {
        danh_muc_id: [
          {
            required: true,
            message: "Danh mục không thể bỏ trống",
            trigger: "blur"
          }
        ],
        ten_san_pham: [
          {
            required: true,
            message: "Tên sản phẩm không thể bỏ trống",
            trigger: "blur"
          }
        ],
        don_vi_tinh: [
          {
            required: true,
            message: "Đơn vị tính không thể bỏ trống",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getDanhMuc();
    this.token = {
      Authorization: "Bearer " + getToken()
    };
    this.urlUploadSanPham =
      process.env.VUE_APP_BASE_API + "uploadedit/" + this.$route.params.id;
    this.getChiTietSanPham();
  },
  methods: {
    handleRemove(file, fileList) {
      xoaAnh({ id: file.id })
        .then(res => {
          this.$message({
            type: "success",
            message: "Xóa ảnh thành công"
          });
        })
        .catch(res => {});
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
        .then(res => {
          this.form.anh_dai_dien = res;
          this.src = process.env.VUE_APP_BASE + res;
        })
        .catch(error => {});
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
        fileList: []
      };
      this.src = process.env.VUE_APP_BASE + res;
      this.$refs.upload.clearFiles();
    },
    addSanPham(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editSanPham(this.$route.params.id, this.form)
            .then(res => {
              this.$message({
                type: "success",
                message: "Cập nhật thành công"
              });
            })
            .catch(res => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getChiTietSanPham() {
      let data = await chiTietSP(this.$route.params.id);
      this.form = data;
      this.form.fileList = [];
      if(this.form.anh_dai_dien){
        this.src = process.env.VUE_APP_BASE + this.form.anh_dai_dien
      }else {
        this.src =  process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png"
      }
      if (data.hinh_anhs.length > 0) {
        for (let item of data.hinh_anhs) {
          let ob = { id: item.id, url: this.endPointImage + item.url_hinh_anh };
          this.form.fileList.push(ob);
        }
      }
    }
  }
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