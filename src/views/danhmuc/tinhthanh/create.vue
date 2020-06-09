<template>
  <div>
    <el-button type="primary" @click="showCreateTinhs = true">Thêm tỉnh, thành phố</el-button>
    <el-dialog
      :visible.sync="showCreateTinhs"
      @close="close()"
      title="THÊM TỈNH THÀNH PHỐ"
      width="30%"
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        ref="formLabelAlign"
      >
        <el-row :gutter="20" justify="space-around">
          <el-col>
            <el-form-item :error="error.code" prop="code">
              <i class="el-icon-notebook-1"></i>
              <label>Mã tỉnh, thành phố</label>

              <el-input
                size="large"
                v-model="formLabelAlign.code"
                placeholder="Nhập mã tỉnh, thành phố"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :error="error.name" prop="name">
              <i class="fa fa-university"></i>
              <label>Tên tỉnh, thành phố</label>
              <el-input
                size="large"
                v-model="formLabelAlign.name"
                placeholder="Nhập tên tỉnh, thành phố"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-button
            type="primary"
            style="width:98%; margin-left: 10px;"
            :loading="loading"
            @click="submit('formLabelAlign')"
          >THÊM</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { addTinhThanh } from "@/api/TinhThanh";
export default {
  name: "CreateTinh",
  data() {
    return {
      loading: false,
      error: {
        code: "",
        name: ""
      },
      radio: 1,
      labelPosition: "top",
      showCreateTinhs: false,
      formLabelAlign: {
        code: "",
        name: ""
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
    }
  },
  methods: {
    close() {
      (this.formLabelAlign.code = ""),
        (this.formLabelAlign.name = ""),
        this.$emit("close", this.formLabelAlign);
    },
    submit(createTinhs) {
      this.$refs[createTinhs].validate(valid => {
        if (valid) {
          this.loading = true;
          (this.error.code = ""),
            (this.error.name = ""),
            addTinhThanh(this.formLabelAlign)
              .then(res => {
                this.loading = false;
                this.showCreateTinhs = false;
                (this.formLabelAlign.code = ""),
                  (this.formLabelAlign.name = ""),
                  this.$emit("onCreateTinh", true);
              })
              .catch(error => {
                this.loading = false;
                this.$emit("onCreateTinh", error);
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
