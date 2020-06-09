<template>
  <div>
    <el-button class="primary-button" size="small" @click="showCreateForm" icon="el-icon-plus"> Thêm dân cư</el-button>
    <!-- <el-button type="warning" @click="showCreateForm" circle icon="el-icon-plus"></el-button> -->
    <el-dialog :visible.sync="showCreateUsers" @close="close()">
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        ref="formLabelAlign"
      >
        <el-row :gutter="20" justify="space-around">
          <el-col :span="12">
            <el-form-item prop="name">
              <i class="fa fa-user"></i>
              <label>Họ và tên</label>
              <el-input size="large" v-model="formLabelAlign.name" placeholder="Nhập vào họ và tên"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="phone">
              <i class="fa fa-mobile"></i>
              <label>Số điện thoại</label>
              <el-input
                size="large"
                v-model="formLabelAlign.phone"
                placeholder="Nhập vào số điện thoại"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="!disabledTinhThanh" :span="12">
            <el-form-item prop="tinh_thanh_id">
              <i class="fa fa-cog"></i>
              <label>Tỉnh thành</label>
              <el-select
                filterable
                clearable
                style="width:100%"
                v-model="formLabelAlign.tinh_thanh_id"
                placeholder="Chọn tỉnh thành"
                @change="changeTinhThanh(formLabelAlign.tinh_thanh_id)"
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
          <el-col :span="12">
            <el-form-item prop="don_vi_pccc_id">
              <i class="fa fa-cog"></i>
              <label>Đơn vị PCCC</label>
              <el-select
                filterable
                clearable
                :disabled="newdDonVi"
                style="width:100%"
                v-model="formLabelAlign.don_vi_pccc_id"
                placeholder="Chọn đơn vị"
                @change="changeDonVi(formLabelAlign.don_vi_pccc_id)"
              >
                <el-option
                  v-for="donvi in options.donvis"
                  :key="donvi.id"
                  :label="donvi.ten"
                  :value="donvi.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="toa_nha_id">
              <i class="fa fa-cog"></i>
              <label>Tòa nhà</label>
              <el-select
                filterable
                clearable
                :disabled="newdToaNha"
                style="width:100%"
                v-model="formLabelAlign.toa_nha_id"
                placeholder="Chọn tòa nhà"
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
          <el-col :span="12">
            <el-button
              class="primary-button"
              style="width:100%; margin-top: 39px; float:right"
              :loading="loading"
              @click="submit('formLabelAlign')"
              icon="el-icon-plus"
            >Thêm mới</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { addDanCu } from "@/api/dancu";
import { getToaNhaSearch } from "@/api/toanha";
import { getDonvi } from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";
export default {
  name: "CreateDancu",
  data() {
    return {
      loading: false,
      labelPosition: "top",
      showCreateUsers: false,
      newdDonVi: true,
      newdToaNha: true,
      // isClosed: true,
      formLabelAlign: {
        name: "",
        phone: "",
        toa_nha_id: "",
        tinh_thanh_id: "",
        don_vi_pccc_id: ""
      },
      role: "",
      imageUrl: "",
      rules: {
        name: [
          {
            required: true,
            message: "Tên không được bỏ trống",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "Số điện thoại không được bỏ trống",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object
    },
    disabledTinhThanh: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    changeTinhThanh(val) {
      if (val != "" && val != null) {
        this.newdDonVi = false;
        this.newdToaNha = false;
      } else {
        this.newdDonVi = true;
        this.newdToaNha = true;
      }
      this.options.donvis = [];
      this.options.toanhas = [];
      getDonvi({ tinh_thanh_id: val }).then(res => {
        this.options.donvis = res.data;
        this.formLabelAlign.don_vi_pccc_id = null;
        this.formLabelAlign.toa_nha_id = null;
      });
      getToaNhaSearch({ tinh_thanh_id: val }).then(res => {
        this.options.toanhas = res.data.data;
      });
    },
    changeDonVi(val) {
      this.formLabelAlign.toa_nha_id = null;
      this.options.toanhas = [];
      getToaNhaSearch({ don_vi_pccc_id: val }).then(res => {
        this.options.toanhas = res.data.data;
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.avatar_url = this.imageUrl;
    },
    close() {
      this.formLabelAlign.name = "";
      this.formLabelAlign.phone = "";
      this.formLabelAlign.toa_nha_id = "";
      this.$emit("close", this.formLabelAlign);
    },
    submit(createUsers) {
      this.$refs[createUsers].validate(valid => {
        if (valid) {
          this.loading = true;
          addDanCu(this.formLabelAlign)
            .then(res => {
              this.loading = false;
              this.showCreateUsers = false;
              this.formLabelAlign.name = "";
              this.formLabelAlign.phone = "";
              this.formLabelAlign.toa_nha_id = "";
              this.$emit("onCreateDanCu", true);
            })
            .catch(error => {
              this.loading = false;
              this.$emit("onCreateDanCu", error);
            });
        } else {
          return false;
        }
      });
    },
    showCreateForm() {
      this.showCreateUsers = true;
      if (!this.disabledTinhThanh) {
        this.newdDonVi = true;
        this.newdToaNha = true;
      } else {
        this.newdDonVi = false;
        this.newdToaNha = false;
      }
    }
  },
  created() {}
};
</script>
<style>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 73%;
}
.formcreate {
  height: 300px;
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
</style>
