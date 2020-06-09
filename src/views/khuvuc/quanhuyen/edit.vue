<template>
  <el-dialog :visible.sync="showCreateQuans" @close="close()" title="CHỈNH SỬA" width="30%" center>
    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="formLabelAlign"
      :rules="rules"
      ref="formLabelAlign"
    >
      <el-row :gutter="20">
        <el-col>
          <el-form-item :error="error.tinh_thanh_id" prop="tinh_thanh_id">
            <i class="fa fa-address-card-o"></i>
            <label>Tỉnh, thành phố</label>
            <br />
            <el-select v-model="formLabelAlign.tinh_thanh_id" style="width: 100%">
              <el-option
                v-for="item in tinhthanh"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :error="error.code" prop="code">
            <i class="el-icon-notebook-1"></i>
            <label>Mã quận huyện</label>
            <el-input size="large" v-model="formLabelAlign.code" placeholder="Nhập mã quận huyện"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :error="error.name" prop="name">
            <i class="fa fa-university"></i>
            <label>Tên quận, huyện</label>
            <el-input size="large" v-model="formLabelAlign.name" placeholder="Nhập tên quận huyện"></el-input>
          </el-form-item>
        </el-col>
        <el-button
          type="primary"
          style="width:98%; margin-left: 10px;"
          :loading="loading"
          @click="submit('formLabelAlign')"
        >CẬP NHẬT</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { editQuanHuyen } from "@/api/QuanHuyen";
import { getTinhThanh } from "@/api/TinhThanh";

export default {
  name: "EditQuan",
  data() {
    return {
      quanId: 0,
      loading: false,
      tinhthanh: [],
      error: {
        code: "",
        name: ""
      },
      showCreateQuans: false,
      labelPosition: "top",
      formLabelAlign: {
        code: "",
        name: "",
        tinh_thanh_id: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "Tên phòng quận, huyện được bỏ trống",
            trigger: "blur"
          },
          { min: 3, message: "Tên phòng tối thiểu 3 ký tự", trigger: "blur" }
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Tỉnh thành phố, không được bỏ trông",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "Mã quận huyện không được bỏ trống",
            trigger: "blur"
          },
          { min: 2, message: "Mã phòng tối thiểu 2 ký tự", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    QuanEdit: {
      type: Object
    }
  },
  watch: {
    active(val) {
      this.showCreateQuans = val;
    },
    QuanEdit(val) {
      this.quanId = val.id;
      this.formLabelAlign = val;
    }
  },
  created() {
    this.layTinhThanh();
  },
  methods: {
    close() {
      this.error.code = "";
      this.error.name = "";
      this.$emit("onClose");
    },
    layTinhThanh() {
      getTinhThanh().then(response => {
        this.tinhthanh = response.data;
      });
    },
    submit(editQuans) {
      this.$refs[editQuans].validate(valid => {
        if (valid) {
          this.loading = true;
          this.error.code = "";
          this.error.name = "";
          editQuanHuyen(this.quanId, this.formLabelAlign)
            .then(res => {
              this.loading = false;
              this.$emit("onEditQuan", true);
            })
            .catch(error => {
              this.loading = false;
              this.$emit("onEditQuan", error);
            });
        } else {
          return false;
        }
      });
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
</style>
