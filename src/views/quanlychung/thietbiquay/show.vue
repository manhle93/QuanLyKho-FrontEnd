<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Mã thiết bị quay" label-position="right" prop="ma">
                <el-input
                  v-model="form.ma"
                  placeholder="Nhập mã thiết bị"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Tên thiết bị quay" label-position="right" prop="ten">
                <el-input v-model="form.ten" placeholder="Nhập tên thiết bị"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Loại camera" prop="loai_may_quay_id">
                <el-select
                  style="width:100%"
                  v-model="form.loai_may_quay_id"
                  placeholder="Hãy chọn loại thiết bị"
                >
                  <el-option
                    v-for="loaithietbi in options.loaimayquays"
                    :key="loaithietbi.id"
                    :label="loaithietbi.ten"
                    :value="loaithietbi.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :md="{span:12}">
              <el-form-item label="Camera ID" label-position="right" prop="camera_id">
                <el-input v-model="form.camera_id" placeholder="Nhập camera ID"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Tên đăng nhập" label-position="right" prop="username">
                <el-input
                  v-model="form.username"
                  placeholder="Nhập tên đăng nhập"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Mật khẩu" label-position="right" prop="password">
                <el-input type="password" placeholder="Nhập mật khẩu" v-model="form.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Camera IP" label-position="right" prop="ip">
                <el-input v-model="form.ip" suffix-icon="el-icon-user" placeholder="Nhập camera IP"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Port" label-position="right" prop="port">
                <el-input v-model="form.port" placeholder="Nhập cổng"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Trạng thái" prop="trang_thai">
                <el-select
                  style="width:100%"
                  v-model="form.trang_thai"
                  placeholder="Hãy chọn trạng thái"
                >
                  <el-option
                    v-for="trangthai in options.trang_thais"
                    :key="trangthai.code"
                    :label="trangthai.name"
                    :value="trangthai.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Địa chỉ" prop="desc">
                <el-input type="textarea" v-model="form.dia_chi" placeholder="Nhập địa chỉ"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col v-if="!disabledTinhThanh" :md="{span:12}">
              <el-form-item label="Tỉnh thành" prop="tinh_thanh_id">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.tinh_thanh_id"
                  placeholder="Hãy chọn tỉnh thành"
                  @change="changeTinhThanh(form.tinh_thanh_id)"
                >
                  <el-option
                    v-for="tinhthanh in options.tinhthanhs"
                    :key="tinhthanh.id"
                    :label="tinhthanh.name"
                    :value="tinhthanh.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Tòa nhà" prop="toa_nha_id">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.toa_nha_id"
                  placeholder="Hãy chọn tòa nhà"
                >
                  <el-option
                    v-for="toanha in options.toanhas"
                    :key="toanha.id"
                    :label="toanha.ten"
                    :value="toanha.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :md="{span:12}">
              <el-form-item label="Ngày triển khai" prop="ngay_trien_khai">
                <br />
                <el-date-picker
                  style="width:100%"
                  v-model="form.ngay_trien_khai"
                  type="date"
                  placeholder="Chọn ngày"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Link" prop="link">
                <el-input placeholder="http://....." v-model="form.link"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Kinh độ" label-position="right" prop="long">
                <el-input v-model="form.long" suffix-icon="el-icon-map" placeholder="Nhập kinh độ"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Vĩ độ" label-position="right" prop="lat">
                <el-input v-model="form.lat" suffix-icon="el-icon-map" placeholder="Nhập vĩ độ"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="25">
            <el-col :md="{span:12}">
              <router-link to="/quanlythietbi/thietbiquay">
                <el-button type="warning" icon="el-icon-back">Quay lại</el-button>
              </router-link>
            </el-col>
            <el-col :md="{span:12}">
              <el-button
                style="float: right"
                class="primary-button"
                icon="el-icon-check"
                :loading="loading"
                @click="submit('form')"
              >CẬP NHẬT</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <tracking-map
            v-if="form.lat&&form.long"
            :item="form"
            @getAddress="addr => handleMap(addr)"
          ></tracking-map>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import TrackingMap from "./map";
import { editData, getDataDetail } from "@/api/thietbiquay";
import { getTinhThanh } from "@/api/TinhThanh";
import { getToaNha } from "@/api/dancu";
import { getDanhMucCon } from "@/api/danhmuc";
import { getInfor } from "@/api/taikhoan";
import BackButton from "@/layout/back";
export default {
  components: {
    TrackingMap,
    BackButton
  },
  data() {
    return {
      toanha: null,
      disabledTinhThanh: true,
      form: {
        ma: "",
        ten: "",
        trang_thai: "",
        tinh_thanh_id: "",
        loai_may_quay_id: "",
        dia_chi: "",
        ngay_trien_khai: "",
        lat: "",
        long: "",
        username: "",
        password: "",
        camera_id: "",
        ip: "",
        port: "",
        toa_nha_id: "",
        link: ""
      },
      options: {
        tinhthanhs: [],
        toanhas: [],
        loaimayquays: [],
        trang_thais: [
          {
            code: "dang_hoat_dong",
            name: "Đang hoạt động"
          }
        ]
      },
      rules: {
        ma: [
          {
            required: true,
            message: "Mã thiết bị quay không được bỏ trống",
            trigger: "blur"
          }
        ],
        ten: [
          {
            required: true,
            message: "Tên thiết bị quay không được bỏ trống",
            trigger: "blur"
          }
        ],

        tinh_thanh_id: [
          {
            required: true,
            message: "Hãy chọn một tinhr thành",
            trigger: "blur"
          }
        ],
        lat: [
          {
            required: true,
            message: "Vĩ độ không được bỏ trống",
            trigger: "blur"
          }
        ],
        long: [
          {
            required: true,
            message: "Kinh độ không được bỏ trống",
            trigger: "blur"
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    changeTinhThanh(val) {
      this.form.toa_nha_id = "";
      getToaNha({ tinh_thanh_id: val }).then(res => {
        this.options.toanhas = res.data;
      });
    },
    handleMap(val) {
      this.form.dia_chi = val.address;
      this.form.lat = val.lat;
      this.form.long = val.lng;
    },
    async getData(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {
        //console.log(error);
      }
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          editData(this.$route.params.id, this.form)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
            })
            .catch(error => {
              this.loading = false;
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },

    resetForm() {
      for (let field in this.form) {
        this.form[field] = "";
      }
    },
    async getDetail(id) {
      let toanha = await getDataDetail(id);
      this.toanha = toanha.data;
      for (let field in this.form) {
        this.form[field] = this.toanha[field];
      }
      this.loading = false;
      return true;
    },
    async getLoaiThietBi() {
      let data = await getDanhMucCon({ ma: "LMQ" });
      this.options.loaimayquays = data.data;
    }
  },
  created() {
    this.getLoaiThietBi();
    this.getData(getTinhThanh, "tinhthanhs");
    this.getData(getToaNha, "toanhas");
    this.getDetail(this.$route.params.id);
    getInfor().then(res => {
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
      } else {
        this.disabledTinhThanh = false;
      }
    });
  },

  watch: {}
};
</script>
<style lang="css" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed black;

  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader {
  border: 1px dashed black;
  /* border-radius: 50%; */
  /* width: 200px;
          height: 200px; */
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.upload-image {
  display: none;
  z-index: -9999;
}
@media (max-width: 990px) {
  .back-button {
    width: fit-content;
    margin-top: 10px;
  }
}
</style>
