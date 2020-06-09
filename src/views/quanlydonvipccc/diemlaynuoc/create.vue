 <template>
  <div class="app-container">
    <h4>THÊM ĐIỂM LẤY NƯỚC</h4>
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Mã điểm" label-position="right" prop="ma">
                <el-input v-model="form.ma" suffix-icon="el-icon-user" placeholder="Nhập mã điểm"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Tên điểm" label-position="right" prop="ten">
                <el-input v-model="form.ten" placeholder="Nhập tên điểm"></el-input>
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
                  @change="changeQuanHuyen(form.tinh_thanh_id)"
                >
                  <el-option
                    v-for="tinhthanh in tinhthanhs"
                    :key="tinhthanh.id"
                    :label="tinhthanh.name"
                    :value="tinhthanh.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Quận huyện" prop="quan_huyen_id">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.quan_huyen_id"
                  placeholder="Hãy chọn quận huyện"
                >
                  <el-option
                    v-for="quanhuyen in quanhuyens"
                    :key="quanhuyen.id"
                    :label="quanhuyen.name"
                    :value="quanhuyen.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Đơn vị quản lý" label-position="right" prop="don_vi_quan_ly">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.don_vi_quan_ly_id"
                  placeholder="Hãy chọn quận huyện"
                >
                  <el-option
                    v-for="quanhuyen in donViPccc"
                    :key="quanhuyen.id"
                    :label="quanhuyen.ten"
                    :value="quanhuyen.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Loại" label-position="right" prop="loai">
                <el-input placeholder="Nhập loại điểm lấy nước" v-model="form.loai"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Mô tả" label-position="right" prop="description">
                <el-input
                  v-model="form.description"
                  suffix-icon="el-icon-user"
                  placeholder="Nhập mô tả"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label-position="right" prop="status">
                <br />
                <el-checkbox
                  v-model="form.kha_nang_cap_nuoc_cho_xe"
                  border
                >Có khả năng cấp nước cho xe chữa cháy</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Địa chỉ" label-position="right" prop="dia_chi">
                <el-input
                  v-model="form.dia_chi"
                  suffix-icon="el-icon-user"
                  placeholder="Nhập mã điểm"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Độ quan trọng" label-position="right" prop="important">
                <el-input v-model="form.important" placeholder="Nhập độ quan trọng"></el-input>
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
            <el-col :md="{span:12}">
              <el-form-item label-position="right" prop="status">
                <el-checkbox v-model="form.hien_thi_tren_map" border>Hiển thị trên bản đồ</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="{span:12}">
              <router-link to="/donvipccc/quanlychung">
                <el-button type="warning" icon="el-icon-back">Quay lại</el-button>
              </router-link>
            </el-col>
            <el-col :md="{span:12}">
              <el-button
                style="float: right"
                class="primary-button"
                :loading="loading"
                @click="submit('form')"
                icon="el-icon-plus"
              >THÊM</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <tracking-map @getAddress="addr => handleMap(addr)"></tracking-map>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import TrackingMap from "./map";
import { addDiemLayNuoc } from "@/api/diemlaynuoc";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen } from "@/api/QuanHuyen";
import { getDanhMucCon } from "@/api/danhmuc";
import { getInfor } from "@/api/taikhoan";
import BackButton from "@/layout/back";
import { getDonViPccc } from "@/api/donvipccc";
export default {
  components: {
    TrackingMap,
    BackButton
  },
  data() {
    return {
      disabledTinhThanh: true,
      status_diem_lay_nuoc: [],
      type_diem_lay_nuoc: [],
      form: {
        ma: "",
        ten: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        dia_chi: "",
        lat: "",
        long: "",
        don_vi_quan_ly_id: "",
        loai: "",
        status: "",
        important: "",
        description: "",
        kha_nang_cap_nuoc_cho_xe: true,
        hien_thi_tren_map: true
      },
      donViPccc: [],
      tinhthanhs: [],
      quanhuyens: [],
      rules: {
        ma: [
          {
            required: true,
            message: "Mã đơn vị không được bỏ trống",
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
        ten: [
          {
            required: true,
            message: "Tên đơn vị không được bỏ trống",
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
        quan_huyen_id: [
          {
            required: true,
            message: "Hãy chọn một quận huyện",
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
      salary_level_data: [],
      loading: false
    };
  },
  methods: {
    changeQuanHuyen(val) {
      this.form.quan_huyen_id = null;
      getQuanHuyen({ tinh_thanh_id: val }).then(res => {
        this.quanhuyens = res.data;
      });
      getDonViPccc({ tinh_thanh_id: val, per_page: 9999999 }).then(res => {
        this.donViPccc = res.data.data;
      });
    },
    handleMap(val) {
      this.form.dia_chi = val.address;
      this.form.lat = val.lat;
      this.form.long = val.lng;
    },
    async tinhThanh() {
      getTinhThanh().then(res => {
        this.tinhthanhs = res.data;
      });
    },
    async getLoaiDLN() {
      let data = await getDanhMucCon({ ma: "LDLN" });
      this.type_diem_lay_nuoc = data.data;
    },
    async getTrangThaiDLN() {
      let data = await getDanhMucCon({ ma: "TTDLN" });
      this.status_diem_lay_nuoc = data.data;
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          addDiemLayNuoc(this.form)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Thêm mới thành công!",
                type: "success"
              });
              this.resetForm();
            })
            .catch(error => {
              this.loading = false;
              //console.log(error);
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
    }
  },
  created() {
    this.tinhThanh();
    this.getTrangThaiDLN();
    this.getLoaiDLN();
    getInfor().then(res => {
      this.role = res.data.role_id;
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        this.form.tinh_thanh_id = res.data.tinh_thanh_id;
        getQuanHuyen({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
          this.quanhuyens = res.data;
          this.quanhuyens.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
        });
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
