<template>
  <div class="app-container">
    <h4>Thêm mới cơ sở công trình</h4>
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item label="Mã tòa nhà" label-position="right" prop="ma">
                <el-input
                  v-model="form.ma"
                  suffix-icon="el-icon-user"
                  placeholder="Nhập vào mã tòa nhà"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Tên tòa nhà"
                label-position="right"
                prop="ten"
              >
                <el-input
                  v-model="form.ten"
                  placeholder="Nhập vào tên tòa nhà"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Hướng vào tòa nhà"
                label-position="right"
                prop="huong_vao_toa_nha"
              >
                <el-input
                  v-model="form.huong_vao_toa_nha"
                  suffix-icon="el-icon-user"
                  placeholder="Nhập hướng vào tòa nhà"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Loại hình sở hữu"
                label-position="right"
                prop="loai_hinh_so_huu_id"
              >
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.loai_hinh_so_huu_id"
                  placeholder="Hãy chọn loại hình sở hữu"
                >
                  <el-option
                    v-for="loaihinh in options.loaihinhsohuus"
                    :key="loaihinh.id"
                    :label="loaihinh.ten"
                    :value="loaihinh.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item label="Số điện thoại" label-position="right">
                <br />
                <el-tag
                  :key="tag"
                  v-for="tag in so_dien_thoais"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                  >{{ tag }}</el-tag
                >
                <el-input
                  suffix-icon="el-icon-phone"
                  type="number"
                  min="0"
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ Thêm SĐT</el-button
                >
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Địa chỉ" prop="dia_chi">
                <el-input
                  type="textarea"
                  v-model="form.dia_chi"
                  placeholder="Nhập vào địa chỉ"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Chủ tòa nhà"
                label-position="right"
                prop="chu_toa_nha"
              >
                <el-input
                  v-model="form.chu_toa_nha"
                  placeholder="Nhập vào chủ tòa nhà"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Đơn vị PCCC" prop="don_vi_pccc_id">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.don_vi_pccc_id"
                  placeholder="Hãy chọn đơn vị phòng cháy chữa cháy"
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
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Cấp quản lý hành chính"
                label-position="right"
                prop="cap_quan_ly_hanh_chinh"
              >
                <el-select
                  v-model="form.cap_quan_ly_hanh_chinh"
                  filterable
                  clearable
                  placeholder="Chọn cấp quản lý hành chính"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in capQuanLyHanhChinh"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Hình thức đầu tư"
                label-position="right"
                prop="hinh_thuc_dau_tu"
              >
                <el-select
                  v-model="form.hinh_thuc_dau_tu"
                  filterable
                  clearable
                  placeholder="Chọn hình thức đầu tư"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in hinhThucDauTu"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Loại hình hoạt động"
                label-position="right"
                prop="loai_hinh_hoat_dong"
              >
                <el-select
                  v-model="form.loai_hinh_hoat_dong"
                  filterable
                  clearable
                  placeholder="Chọn loại hình hoạt động"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in loaiHinhHoatDong"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Ngành lĩnh vực"
                label-position="right"
                prop="loai_hinh_hoat_dong"
              >
                <el-select
                  v-model="form.nganh_linh_vuc"
                  filterable
                  clearable
                  placeholder="Chọn ngành lĩnh vực"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in nganhLinhVuc"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Thuộc thành phần kinh tế"
                label-position="right"
                prop="thanh_phan_kinh_te"
              >
                <el-select
                  v-model="form.thanh_phan_kinh_te"
                  filterable
                  clearable
                  placeholder="Chọn thành phần kinh tế"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in thanhPhanKinhTe"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.ten"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item
                label="Có phải mua bảo hiểm cháy nổ bắt buộc"
                label-position="right"
              >
                <br />
                <span style="padding-right: 20px">
                  <el-radio-group v-model="phai_mua_bhcnbb" size="small">
                    <el-radio-button label="Có"></el-radio-button>
                    <el-radio-button label="Không"></el-radio-button>
                  </el-radio-group>
                </span>
                <el-radio-group
                  v-model="da_mua_bhcnbb"
                  v-if="phai_mua_bhcnbb == 'Có'"
                >
                  <el-radio :label="true" border size="small">Đã mua</el-radio>
                  <el-radio :label="false" border size="small"
                    >Chưa mua</el-radio
                  >
                </el-radio-group>
                <el-checkbox
                  v-if="phai_mua_bhcnbb == 'Không'"
                  v-model="da_mua_bhcnbb"
                  label="Có mua"
                  border
                  size="small"
                ></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 5 }">
              <el-form-item label="Năm thành lập">
                <el-input
                  type="number"
                  :min="0"
                  v-model="form.nam_thanh_lap"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 7 }">
              <el-form-item label="Website">
                <el-input type="text" v-model="form.web"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Email" prop="email">
                <el-input type="email" v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-upload
                class="upload"
                :action="urlUpload"
                :headers="this.token"
                :on-change="handleChange"
                :file-list="form.fileList"
                :before-upload="beforeUpload"
              >
                <el-button size="small" type="primary"
                  >Đính kèm tập tin</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  Đính kèm files với dung lượng nhỏ hơn 20MB
                </div>
              </el-upload>
            </el-col>
          </el-row>
          <br />
          <el-row :gutter="30">
            <el-col :md="{ span: 12 }">
              <router-link to="/congtacphongchay/toanha">
                <el-button
                  style="float: left"
                  icon="el-icon-back"
                  type="warning"
                  :url="'/congtacphongchay/toanha'"
                  >Quay lại</el-button
                >
              </router-link>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-button
                style="float: right"
                class="primary-button"
                :loading="loading"
                @click="submit('form')"
                icon="el-icon-plus"
                >Thêm tòa nhà</el-button
              >
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :md="{ span: 12 }">
              <el-form-item label="Kinh độ" label-position="right" prop="long">
                <el-input
                  v-model="form.long"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập kinh độ"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="{ span: 12 }">
              <el-form-item label="Vĩ độ" label-position="right" prop="lat">
                <el-input
                  v-model="form.lat"
                  suffix-icon="el-icon-map"
                  placeholder="Nhập vĩ độ"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="20">
            <el-col :md="{span:12}">
              <el-form-item label="Ngày đăng kí KĐ" label-position="right" prop="ngay_dang_ki_kd">
                <el-date-picker
                  v-model="form.ngay_dang_ki_kd"
                  type="date"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Chọn ngày đăng kí"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="{span:12}">
              <el-form-item label="Ngày hết hạn KĐ" label-position="right" prop="ngay_het_han_kd">
                <el-date-picker
                  v-model="form.ngay_het_han_kd"
                  type="date"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Chọn ngày hết hạn"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row :gutter="20">
            <el-col v-if="!disabledTinhThanh" :md="{ span: 12 }">
              <el-form-item label="Tỉnh thành" prop="tinh_thanh_id">
                <el-select
                  style="width:100%"
                  filterable
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
            <el-col :md="{ span: 12 }">
              <br />
              <el-checkbox
                v-model="form.hien_thi_toa_nha"
                style="margin-top:21px; width:100%"
                border
                >Hiển thị bản đồ</el-checkbox
              >
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
import { getToken } from "@/utils/auth";
import { addData, getDonvi } from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen } from "@/api/QuanHuyen";
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
      urlUpload: process.env.VUE_APP_BASE_API + "upload",
      disabledTinhThanh: true,
      token: {},
      capQuanLyHanhChinh: [],
      hinhThucDauTu: [],
      loaiHinhHoatDong: [],
      nganhLinhVuc: [],
      thanhPhanKinhTe: [],
      phai_mua_bhcnbb: "Không",
      da_mua_bhcnbb: false,
      form: {
        cap_quan_ly_hanh_chinh: "",
        hinh_thuc_dau_tu: "",
        thanh_phan_kinh_te: "",
        loai_hinh_hoat_dong: "",
        nganh_linh_vuc: "",
        phai_mua_bhcnbb: false,
        da_mua_bhcnbb: false,
        ma: "",
        ten: "",
        so_dien_thoai: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        dia_chi: "",
        lat: "",
        long: "",
        huong_vao_toa_nha: "",
        loai_hinh_so_huu_id: "",
        hien_thi_toa_nha: true,
        fileList: [],
        don_vi_pccc_id: "",
        chu_toa_nha: "",
        ngay_dang_ki_kd: "",
        ngay_het_han_kd: "",
        nam_thanh_lap: null,
        web: null,
        email: null
      },
      options: {
        tinhthanhs: [],
        quanhuyens: [],
        loaihinhsohuus: [],
        donvis: []
      },

      rules: {
        ma: [
          {
            required: true,
            message: "Mã tòa nhà không được bỏ trống",
            trigger: "blur"
          }
        ],
        ten: [
          {
            required: true,
            message: "Tên tòa nhà không được bỏ trống",
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
        so_dien_thoai: [
          {
            required: true,
            message: "Hãy nhập số điện thoại",
            trigger: "blur"
          }
        ],
        dia_chi: [
          {
            required: true,
            message: "Hãy nhập địa chỉ",
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
        ],
        email: [
          {
            type: "email",
            message: "Email không hợp lệ",
            trigger: "blur"
          }
        ]
      },
      salary_level_data: [],
      loading: false,
      so_dien_thoais: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    handleClose(tag) {
      this.so_dien_thoais.splice(this.so_dien_thoais.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.so_dien_thoais.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    changeQuanHuyen(val) {
      this.quan_huyen_id = null;
      getQuanHuyen({ tinh_thanh_id: val }).then(res => {
        this.options.quanhuyens = res.data;
      });
    },
    changeTinhThanh(val) {
      this.don_vi_pcc_id = null;
      getDonvi({ tinh_thanh_id: val }).then(res => {
        this.options.donvis = res.data;
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
      } catch (error) {}
    },
    async getLoaiHinhSoHuu() {
      let data = await getDanhMucCon({ ma: "LHSH" });
      this.options.loaihinhsohuus = data.data;
      let data2 = await getDanhMucCon({ ma: "QL_HC" });
      this.capQuanLyHanhChinh = data2.data;
      let data3 = await getDanhMucCon({ ma: "HTDT" });
      this.hinhThucDauTu = data3.data;
      let data4 = await getDanhMucCon({ ma: "LHHD" });
      this.loaiHinhHoatDong = data4.data;
      let data5 = await getDanhMucCon({ ma: "NNLV" });
      this.nganhLinhVuc = data5.data;
      let data6 = await getDanhMucCon({ ma: "TPKT" });
      this.thanhPhanKinhTe = data6.data;
    },

    async getDonVi() {
      let data = await getDonvi();
      this.options.donvis = data.data;
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          delete this.form.so_dien_thoai;
          if (this.so_dien_thoais == null || this.so_dien_thoais.length == 0) {
            this.loading = false;
            return this.$message({
              message: "Bạn chưa nhập số điện thoại tòa nhà",
              type: "warning"
            });
          }
          if (this.phai_mua_bhcnbb == "Không") {
            this.form.phai_mua_bhcnbb = false;
          }
          if (this.phai_mua_bhcnbb == "Có") {
            this.form.phai_mua_bhcnbb = true;
          }
          this.form.da_mua_bhcnbb = this.da_mua_bhcnbb;
          addData({ form: this.form, dien_thoais: this.so_dien_thoais })
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
            });
        } else {
          return false;
        }
      });
    },

    handleChange(file, fileList) {
      this.form.fileList = fileList.slice(-3);
    },
    resetForm() {
      this.form = {
        cap_quan_ly_hanh_chinh: "",
        hinh_thuc_dau_tu: "",
        thanh_phan_kinh_te: "",
        loai_hinh_hoat_dong: "",
        nganh_linh_vuc: "",
        phai_mua_bhcnbb: false,
        da_mua_bhcnbb: false,
        ma: "",
        ten: "",
        so_dien_thoai: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        dia_chi: "",
        lat: "",
        long: "",
        huong_vao_toa_nha: "",
        loai_hinh_so_huu_id: "",
        hien_thi_toa_nha: true,
        fileList: [],
        don_vi_pccc_id: "",
        chu_toa_nha: "",
        ngay_dang_ki_kd: "",
        ngay_het_han_kd: "",
        nam_thanh_lap: null,
        web: null,
        email: null
      };
      this.$refs.upload.clearFiles();
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      var filePath = file.name.split(".").pop();
      var dinhDangChoPhep = [
        "xlsx",
        "xls",
        "xlt",
        "xltx",
        "doc",
        "docx",
        "rar",
        "zip",
        "pdf",
        "jpeg",
        "jpg",
        "png",
        "txt"
      ]; //các tập tin cho phép
      if (!dinhDangChoPhep.find(el => el == filePath)) {
        this.$message({
          message: "Tập tin không hợp lệ",
          type: "warning"
        });
        this.form.fileList.pop();
        return false;
      }
      if (!isLt2M) {
        this.form.fileList.pop();
        this.$message.error("Kích thước tập tin tối đa 20Mb!");
        return false;
      }
      return true;
    }
  },
  created() {
    this.getData(getTinhThanh, "tinhthanhs");
    this.getLoaiHinhSoHuu();
    // this.getDonVi();
    this.token = {
      Authorization: "Bearer " + getToken()
    };
    getInfor().then(res => {
      this.role = res.data.role_id;
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        getDonvi({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
        this.options.donvis = res.data;
      });
      } else {
        this.disabledTinhThanh = false;
      }
    });
  }
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 180px;
  margin-left: 10px;
  vertical-align: bottom;
}
@media (max-width: 990px) {
  .back-button {
    width: fit-content;
    margin-top: 10px;
  }
}
</style>
