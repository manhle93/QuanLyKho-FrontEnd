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
              <el-form-item label="Danh mục" prop="ten_san_pham">
                <el-select v-model="value" placeholder="Select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
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
            <el-col :span="6">
              <el-form-item label="Giá khuyến mãi" prop="gia_sale">
                <el-input v-model="form.gia_sale"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
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
              <el-form-item label="Mô tả">
                <el-input type="textarea" v-model="form.mo_ta" :rows="2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Album ảnh">
                <br />
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
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
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png",
      endPointImage: process.env.VUE_APP_BASE,
      dialogImageUrl: "",
      dialogAlbum: false,
      thoiGianKhuyenMai: "",
      form: {
        id: null,
        anh_dai_dien: "",
        mo_ta: "",
        ten_san_pham: "",
        gia_ban: "",
        gia_sale: "",
        don_vi_tinh: "",
        dang_khuyen_mai: false
      },
      rules: {
        ten_danh_muc: [
          {
            required: true,
            message: "Tên danh mục không thể bỏ trống",
            trigger: "blur"
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
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