<template>
  <div>
    <el-dialog :visible.sync="showCreateUsers" @close="close()">
      <el-form
        :label-position="labelPosition"
        :rules="rules"
        ref="formLabelAlign"
        label-width="100px"
        :model="formLabelAlign"
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
              <i class="fa fa-user"></i>
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
                :disabled="disabledDonVi"
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
                clearable
                :disabled="disabledToaNha"
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
            <br />
            <el-button
              class="primary-button"
              style="width:100%; margin-top: 25px; float:right"
              :loading="loading"
              icon="el-icon-check"
              @click="submit('formLabelAlign')"
            >Cập nhật</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { editDanCu } from "@/api/dancu";
import { getToaNhaSearch } from "@/api/toanha";
import { getDonvi } from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";

export default {
  name: "EditDancu",
  data() {
    return {
      userId: 0,
      loading: false,
      labelPosition: "top",
      showCreateUsers: false,
      newdDonVi: false,
      newdToaNha: false,
      isClosed: true,
      formLabelAlign: {
        name: "",
        phone: "",
        toa_nha_id: "",
        tinh_thanh_id: "",
        don_vi_pccc_id: ""
      },
      role: "",

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
    userEdit: {
      type: Object
    },
    options: {
      type: Object
    },
    disabledTinhThanh: {
      type: Boolean,
      default: true
    },
    disableDonVi: {
      type: Boolean,
      default: true
    },
    disableToaNha: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    disabledDonVi: function() {
      if (this.isClosed) {
        return this.disableDonVi;
      } else return this.newdDonVi;
    },
    disabledToaNha: function() {
      if (this.isClosed) {
        return this.disableToaNha;
      } else return this.newdToaNha;
    }
  },
  methods: {
    close() {
      this.isClosed = true;
      this.$emit("onClose");
    },
    changeTinhThanh(val) {
      this.isClosed = false;
      if (val != "" && val != null) {
        this.newdDonVi = false;
        this.newdToaNha = false;
      } else {
        this.newdDonVi = true;
        this.newdToaNha = true;
      }
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
      getToaNhaSearch({ don_vi_pccc_id: val }).then(res => {
        this.options.toanhas = res.data.data;
      });
    },
    submit(editUsers) {
      this.$refs[editUsers].validate(valid => {
        if (valid) {
          this.loading = true;
          editDanCu(this.userId, this.formLabelAlign)
            .then(res => {
              this.loading = false;
              this.$emit("onEditDanCu", true);
            })
            .catch(error => {
              this.loading = false;
              this.$emit("onEditDanCu", error);
            });
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    active(val) {
      this.showCreateUsers = val;
    },
    userEdit(val) {
      this.userId = val.id;
      Object.assign(this.formLabelAlign, val);
    }
  }
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
