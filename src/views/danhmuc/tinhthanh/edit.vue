<template>
  <el-dialog :visible.sync="showCreateTinhs" @close="close()" title="CHỈNH SỬA" width="30%">
    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="formLabelAlign"
      :rules="rules"
      ref="formLabelAlign"
    >
      <el-row :gutter="20">
        <el-col>
          <el-form-item :error="error.code" prop="code">
            <i class="el-icon-notebook-1"></i>
            <label>Mã Tỉnh thành</label>
            <el-input
              size="large"
              v-model="formLabelAlign.code"
              placeholder="Nhập mã phòng ban"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :error="error.name" prop="name">
            <i class="fa fa-university"></i>
            <label>Tên tỉnh, thành phố</label>
            <el-input size="large" v-model="formLabelAlign.name" placeholder="Nhập tên phòng ban"></el-input>
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
import { editTinhThanh } from "@/api/TinhThanh";

export default {
  name: "EditTinh",
  data() {
    return {
      tinhId: 0,
      loading: false,
      error: {
        code: "",
        name: "",
      },
      showCreateTinhs: false,
      labelPosition: "top",
      formLabelAlign: {
        code: "",
        name: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Tên phòng không được bỏ trống",
            trigger: "blur"
          },
          { min: 3, message: "Tên phòng tối thiểu 3 ký tự", trigger: "blur" }
        ],
        code: [
          {
            required: true,
            message: "Mã phòng không được bỏ trống",
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
    TinhEdit: {
      type: Object
    }
  },
  watch: {
    active(val) {
      this.showCreateTinhs = val;
    },
    TinhEdit(val) {
      this.tinhId = val.id;
      this.formLabelAlign = val;
    }
  },

  methods: {
    close() {
      this.error.code = "";
      this.error.name = "";
      this.$emit("onClose");
    },
    submit(editTinhs) {
      this.$refs[editTinhs].validate(valid => {
        if (valid) {
          this.loading = true;
          this.error.code = "";
          this.error.name = "";
          editTinhThanh(this.tinhId, this.formLabelAlign)
            .then(res => {
              this.loading = false;
              this.$message({
                title: "Thành công",
                message: "Cập nhật thành công",
                type: "success"
              });
              this.showCreateTinhs = false;
            })
            .catch(error => {
              this.loading = false;
             // console.log(error)
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
