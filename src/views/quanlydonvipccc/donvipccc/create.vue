 <template>
  <div class="app-container">
    <h4>Thêm mới đơn vị PCCC</h4>
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Mã đơn vị" label-position="right" prop="ma">
                <el-input v-model="form.ma" placeholder="Nhập mã đơn vị"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Tên đơn vị" label-position="right" prop="ten">
                <el-input v-model="form.ten" placeholder="Nhập tên đơn vị"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Cán bộ quản lý" label-position="right" prop="can_bo_quan_ly">
                <el-input
                  v-model="form.can_bo_quan_ly"
                  placeholder="Nhập cán bộ quản lý"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Số điện thoại" label-position="right" prop="so_dien_thoai">
                <el-input
                  v-model="form.so_dien_thoai"
                  placeholder="Nhập số điện thoại"
                  suffix-icon="el-icon-phone"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item
                label="Số điện thoại trực ban"
                label-position="right"
                prop="so_dien_thoai_truc_ban"
              >
                <el-input
                  v-model="form.so_dien_thoai_truc_ban"
                  placeholder="Nhập số điện thoại trực ban"
                  suffix-icon="el-icon-phone"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Số điểm lấy nước quản lý" prop="desc">
                <el-input
                  type="number"
                  :min="0"
                  v-model="form.quan_ly_diem_lay_nuoc"
                  placeholder="Nhập số điểm lấy nước quản lý"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item
                label="Số nhân sự PCCC quản lý"
                label-position="right"
                prop="nhan_su_pccc_quan_ly"
              >
                <el-input
                  type="number"
                  :min="0"
                  v-model="form.nhan_su_pccc_quan_ly"
                  prefix-icon="el-icon-user"
                  placeholder="Nhập số nhân sự PCCC quản lý"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item
                label="Số lượng nhân sự chữa cháy"
                label-position="right"
                prop="nhan_su_chua_chay"
              >
                <el-input
                  prefix-icon="el-icon-user"
                  type="number"
                  :min="0"
                  v-model="form.nhan_su_chua_chay"
                  placeholder="Nhập số lượng nhân sự chữa cháy"
                ></el-input>
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
                    v-for="tinhthanh in options.tinhthanhs"
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
                    v-for="quanhuyen in options.quanhuyens"
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
              <el-form-item label="Kinh độ" label-position="right" prop="long">
                <el-input
                  type="number"
                  v-model="form.long"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập kinh độ"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Vĩ độ" label-position="right" prop="lat">
                <el-input
                  type="number"
                  v-model="form.lat"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập vĩ độ"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <!-- <el-col :md="{span:12}">
              <el-form-item label="Địa chỉ" prop="dia_chi">
                <el-input type="textarea" v-model="form.dia_chi" placeholder="Nhập địa chỉ"></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :md="{span:12}">
              <el-form-item label="Loại hình đơn vị" prop="loai_hinh_don_vi">
                <br />
                <el-select v-model="form.loai_hinh_don_vi" style="width: 100%">
                  <el-option value="hanh_chinh" label="Hành chính">Đơn vị hành chính</el-option>
                  <el-option value="nghiep_vu" label="Nghiệp vụ">Đơn vị nghiệp vụ</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <br />
              <el-checkbox
                v-model="form.hien_thi_tren_map"
                style="margin-top:21px; width:100%"
                border
              >Hiển thị bản đồ</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="Địa chỉ" prop="dia_chi">
              <el-input type="textarea" v-model="form.dia_chi" placeholder="Nhập địa chỉ"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :md="{span:12}">
              <!-- <el-button type="primary" :loading="loading" @click="submit('form')">Thêm</el-button> -->
              <router-link to="/donvipccc/quanlychung">
                <el-button type="warning" icon="el-icon-back">Quay lại</el-button>
              </router-link>
            </el-col>
            <el-col class="back-button" :md="{span:12}">
              <!-- <back-button :url="'/quanlydonvipccc/donvipccc'"></back-button> -->
              <el-button
                style="float:right"
                type="primary"
                icon="el-icon-plus"
                :loading="loading"
                @click="submit('form')"
                class="primary-button"
              >Thêm mới</el-button>
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
import { addDonViPccc, getDonViPccc } from "@/api/donvipccc";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen } from "@/api/QuanHuyen";
import { getDonvi } from "@/api/toanha";
import { getInfor } from "@/api/taikhoan";
import BackButton from "@/layout/back";

export default {
  components: {
    TrackingMap,
    BackButton
  },
  data() {
    return {
      disabledTinhThanh: true,
      form: {
        ma: "",
        ten: "",
        so_dien_thoai: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        dia_chi: "",
        lat: "",
        long: "",
        loai_hinh_don_vi: "nghiep_vu",
        quan_ly_diem_lay_nuoc: "",
        can_bo_quan_ly: "",
        so_dien_thoai_truc_ban: "",
        nhan_su_chua_chay: 0,
        nhan_su_pccc_quan_ly: 0,
        hien_thi_tren_map: true
      },
      options: {
        tinhthanhs: [],
        quanhuyens: []
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
        dia_chi: [
          {
            required: true,
            message: "Địa chỉ không được bỏ trống",
            trigger: "blur"
          }
        ],
        loai_hinh_don_vi: [
          {
            required: true,
            message: "Chọn một loại hình đơn vị",
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
            message: "Hãy chọn một quận huyện thành",
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
    getDonViRole() {
      if (this.role == 2) {
        this.form.tinh_thanh_id = res.data.tinh_thanh_id;
        getDonvi({ tinh_thanh_id: this.form.tinh_thanh_id }).then(res => {
          this.options.donvis = res.data;
          //console.log(res);
        });
      }
    },
    changeQuanHuyen(val) {
      getQuanHuyen({ tinh_thanh_id: val }).then(res => {
        this.options.quanhuyens = res.data;
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
    async getDataDanhMuc(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {
        //console.log(error);
      }
    },
    async getDonViPCCC() {
      let data = await getDonvi();
      this.options.donvis = data.data;
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          addDonViPccc(this.form)
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
      this.form = {
        ma: "",
        ten: "",
        so_dien_thoai: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        dia_chi: "",
        lat: "",
        long: "",
        loai_hinh_don_vi: "nghiep_vu",
        quan_ly_diem_lay_nuoc: "",
        can_bo_quan_ly: "",
        so_dien_thoai_truc_ban: "",
        nhan_su_chua_chay: 0,
        nhan_su_pccc_quan_ly: 0,
        hien_thi_tren_map: true
      };
    }
  },
  created() {
    this.getDataDanhMuc(getQuanHuyen, "quanhuyens");
    this.getDataDanhMuc(getTinhThanh, "tinhthanhs");
    this.getDonViPCCC();
    this.getDonViRole();
    getInfor().then(res => {
      this.role = res.data.role_id;
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        getQuanHuyen({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
          this.options.quanhuyens = res.data;
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
