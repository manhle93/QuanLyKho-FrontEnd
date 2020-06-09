<template>
  <div class="app-container" style="padding: 5px !important;">
    <el-form
      ref="form"
      :model="address"
      :rules="rules"
      style="box-shadow: 0 3px 12px 0 rgba(0,0,0,.6); margin-top: 10px; padding: 10px !important;"
    >
      <el-form-item label="Tên điểm cháy" prop="ten">
        <el-input v-model="address.ten" suffix-icon="el-icon-user" size="small"></el-input>
      </el-form-item>

      <el-form-item label="Số điện thoại" prop="so_dien_thoai">
        <el-input
          v-model="address.so_dien_thoai" size="small"
          suffix-icon="el-icon-phone"
        ></el-input>
      </el-form-item>

      <el-form-item label="Tên người báo" prop="ten_nguoi_bao">
        <el-input v-model="address.ten_nguoi_bao" size="small"></el-input>
      </el-form-item>

      <el-form-item label="Địa chỉ" prop="dia_chi">
        <el-input type="textarea" v-model="address.dia_chi"></el-input>
      </el-form-item>
      <el-form-item
        v-if="!disabledTinhThanh"
        label="Tỉnh thành"
        prop="tinh_thanh_id"
      >
        <el-select
        size="small"
          filterable
          style="width:100%"
          v-model="address.tinh_thanh_id"
          placeholder="Hãy chọn tỉnh thành"
        >
          <el-option
            v-for="tinhthanh in options.tinhthanhs"
            :key="tinhthanh.id"
            :label="tinhthanh.name"
            :value="tinhthanh.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Kinh độ" prop="long">
        <el-input v-model="address.long" suffix-icon="el-icon-map" size="small"></el-input>
      </el-form-item>
      <el-form-item label="Vĩ độ" prop="lat">
        <el-input v-model="address.lat" suffix-icon="el-icon-map" size="small"></el-input>
      </el-form-item>
      <br>
          <el-button
            style="width: 100%; margin-bottom: 10px"
            class="primary-button"
            icon="el-icon-plus"
            :loading="loading"
            size="small"
            @click="submit('form')"
            >Thêm điểm cháy</el-button
          >
      <!-- <el-button type="primary" @click="resetForm">Reset</el-button> -->
    </el-form>

  </div>
</template>

<script>
import { addDiemChay } from "@/api/diemchay";
import router from "@/router";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
export default {
  components: {},
  props: {
    addressdc: {
      type: Object
    }
  },

  data() {
    return {
      disabledTinhThanh: true,
      address: {
        ma: "",
        ten: "",
        so_dien_thoai: "",
        ten_nguoi_bao: "",
        dia_chi: "",
        lat: "",
        long: "",
        tinh_thanh_id: ""
      },
      options: {
        tinhthanhs: []
      },
      rules: {
        ma: [
          {
            required: true,
            message: "Mã đơn vị không được bỏ trống",
            trigger: "blur"
          }
        ],
        ten: [
          {
            required: true,
            message: "Tên đơn vị không được bỏ trống",
            trigger: "blur"
          }
        ],
        so_dien_thoai: [
          {
            required: true,
            message: "Hãy nhập số điện thoại",
            trigger: "blur"
          }
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Hãy chọn một tỉnh thành",
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
        dia_chi: [
          {
            required: true,
            message: "Địa chỉ không được bỏ trống",
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
  created() {
    this.getDataDanhMuc(getTinhThanh, "tinhthanhs");
    getInfor().then(res => {
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
      } else {
        this.disabledTinhThanh = false;
      }
    });
  },
  watch: {
    addressdc(val) {
      this.address.lat = val.lat;
      this.address.long = val.long;
      this.address.dia_chi = val.dia_chi;
    }
  },
  methods: {
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          addDiemChay(this.address)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Thêm mới thành công!",
                type: "success"
              });
              this.resetForm();
              this.$emit("htDiemChay2", true);
            })
            .catch(error => {
              this.loading = false;
              // console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    async getDataDanhMuc(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {
        //console.log(error);
      }
    },
    resetForm() {
      for (let field in this.address) {
        this.address[field] = "";
      }
    }
  },
  mounted() {}
};
</script>
<style lang="css" scoped>
.el-form-item { 
  margin-bottom: 7px;
}
</style>
