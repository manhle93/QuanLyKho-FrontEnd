<template>
  <div>
    <el-button type="primary" @click="showCreateQuans = true">Thêm quận huyện</el-button>
    <el-dialog
      :visible.sync="showCreateQuans"
      @close="close()"
      width="30%"
      title="THÊM QUẬN HUYỆN"
      center
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
            <el-form-item :error="error.tinh_thanh_id" prop="tinh_thanh_id">
              <i class="fa fa-address-card-o"></i>
              <label>Tỉnh, thành phố</label>
              <br />
              <el-select
                filterable
                v-model="formLabelAlign.tinh_thanh_id"
                placeholder="Chọn tỉnh, thành phố"
                style="width: 100%"
              >
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
              <label>Mã Quận huyện</label>
              <el-input size="large" v-model="formLabelAlign.code" placeholder="Nhập mã quận huyện"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :error="error.name" prop="name">
              <i class="fa fa-university"></i>
              <label>Tên quận huyện</label>

              <el-input
                size="large"
                v-model="formLabelAlign.name"
                placeholder="Nhập tên quận huyện"
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
import { addQuanHuyen } from "@/api/QuanHuyen";
import { getTinhThanh } from "@/api/TinhThanh";

export default {
  name: "CreateQuan",
  data() {
    return {
      loading: false,
      error: {
        code: "",
        name: ""
      },
      tinhthanh: [],
      radio: 1,
      labelPosition: "top",
      showCreateQuans: false,
      formLabelAlign: {
        code: "",
        name: "",
        tinh_thanh_id: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "Tên quận không được bỏ trống",
            trigger: "blur"
          },
          {
            min: 3,
            message: "Tên quận, huyện tối thiểu 3 ký tự",
            trigger: "blur"
          }
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
          {
            min: 2,
            message: "Quận huyện phòng tối thiểu 2 ký tự",
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
    }
  },
  created() {
    this.layTinhThanh();
  },
  methods: {
    close() {
      (this.formLabelAlign.code = ""),
        (this.formLabelAlign.name = ""),
        this.$emit("close", this.formLabelAlign);
    },
    layTinhThanh() {
      getTinhThanh().then(res => {
        this.tinhthanh = res.data;
      });
    },
    submit(createQuans) {
      this.$refs[createQuans].validate(valid => {
        if (valid) {
          this.loading = true;
          (this.error.code = ""),
            (this.error.name = ""),
            addQuanHuyen(this.formLabelAlign)
              .then(res => {
                this.loading = false;
                this.showCreateQuans = false;
                (this.formLabelAlign.code = ""),
                  (this.formLabelAlign.name = ""),
                  this.$emit("onCreateQuan", true);
              })
              .catch(error => {
                this.loading = false;
                this.$emit("onCreateQuan", error);
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
