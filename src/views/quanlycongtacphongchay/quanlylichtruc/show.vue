<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="22" :offset="1">
          <h4>CẬP NHẬT LỊCH TRỰC</h4>
          <el-row :gutter="20">
            <el-col :sm="{ span: 4 }">
              <el-form-item label="Tỉnh thành" prop="tinh_thanh_id">
                <el-select
                  :disabled="disabledTinhThanh"
                  style="width:100%"
                  filterable
                  clearable
                  v-model="form.tinh_thanh_id"
                  placeholder="Hãy chọn tỉnh thành"
                  @change="changeTinhThanh(form.tinh_thanh_id)"
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

            <el-col :sm="{ span: 5 }">
              <el-form-item label="Đơn vị" prop="don_vi_id">
                <el-select
                  style="width:100%"
                  filterable
                  clearable
                  v-model="form.don_vi_id"
                  placeholder="Hãy chọn đơn vị pccc"
                >
                  <el-option
                    v-for="donvi in donVis"
                    :key="donvi.id"
                    :label="donvi.ten"
                    :value="donvi.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="{ span: 5 }">
              <el-form-item label="Ngày trực" prop="ngay_truc">
                <br />
                <el-date-picker
                  style="width: 100%"
                  v-model="form.ngay_truc"
                  type="date"
                  placeholder="Thời gian"
                  format="dd/MM/yyyy"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 5 }">
              <el-form-item label="Chỉ huy đội" prop="chi_huy_doi">
                <el-select
                  style="width:100%"
                  filterable
                  clearable
                  v-model="form.chi_huy_doi"
                  placeholder="Chọn chỉ huy đội"
                >
                  <el-option
                    v-for="chiHuy in canbochiensis"
                    :key="chiHuy.id"
                    :label="chiHuy.ten"
                    :value="chiHuy.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 5 }">
              <el-form-item label="Cán bộ tổng hợp" prop="can_bo_tong_hop">
                <el-select
                  style="width:100%"
                  filterable
                  clearable
                  v-model="form.can_bo_tong_hop"
                  placeholder="Chọn cán bộ tổng hợp"
                >
                  <el-option
                    v-for="thop in canbochiensis"
                    :key="thop.id"
                    :label="thop.ten"
                    :value="thop.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <h4>I. QUÂN SỐ</h4>
            </el-col>

            <el-col :sm="{ span: 6 }">
              <el-form-item label="Tổng số CBCS" prop="tong_cbcs">
                <el-input
                  type="number"
                  :min="0"
                  v-model="form.tong_cbcs"
                  placeholder="Nhập tổng số CBCS"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 6 }">
              <el-form-item label="Số CBCS có mặt" prop="co_mat">
                <el-input type="number" v-model="form.co_mat" placeholder="Nhập số CBCS có mặt"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 6 }">
              <el-form-item label="Hành chính" prop="hanh_chinh">
                <el-input
                  type="number"
                  v-model="form.hanh_chinh"
                  :min="0"
                  placeholder="Nhập số CBCS hành chính"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 6 }">
              <el-form-item label="Số CBCS vắng mặt" prop="vang_mat">
                <el-input type="number" v-model="form.vang_mat" placeholder="Nhập số CBCS vắng mặt"></el-input>
              </el-form-item>
            </el-col>

            <el-col>
              <H4>II. TRỰC TRONG NGÀY</H4>
            </el-col>
            <el-col :sm="{ span: 6 }">
              <el-form-item label="Trực chỉ huy" prop="truc_chi_huy">
                <el-select
                  style="width:100%"
                  filterable
                  multiple
                  clearable
                  v-model="chiHuys"
                  placeholder="Chọn CBCS tham gia"
                >
                  <el-option
                    v-for="trucch in canbochiensis"
                    :key="trucch.id"
                    :label="trucch.ten"
                    :value="trucch.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 6 }">
              <el-form-item label="Trực ban" prop="truc_ban">
                <el-select
                  style="width:100%"
                  filterable
                  multiple
                  clearable
                  v-model="trucBans"
                  placeholder="Chọn CBCS tham gia"
                >
                  <el-option
                    v-for="trucban in canbochiensis"
                    :key="trucban.id"
                    :label="trucban.ten"
                    :value="trucban.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 6 }">
              <el-form-item label="Trực kiểm tra" prop="truc_kiem_tra">
                <el-select
                  style="width:100%"
                  filterable
                  multiple
                  clearable
                  v-model="trucKTs"
                  placeholder="Chọn CBCS tham gia"
                >
                  <el-option
                    v-for="trucKiemTra in canbochiensis"
                    :key="trucKiemTra.id"
                    :label="trucKiemTra.ten"
                    :value="trucKiemTra.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 6 }">
              <el-form-item label="Trực thông tin" prop="truc_thong_tin">
                <el-select
                  style="width:100%"
                  filterable
                  multiple
                  clearable
                  v-model="trucThongTins"
                  placeholder="Chọn CBCS tham gia"
                >
                  <el-option
                    v-for="tructt in canbochiensis"
                    :key="tructt.id"
                    :label="tructt.ten"
                    :value="tructt.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <H4>III. PHÂN CÔNG LỰC LƯỢNG PHƯƠNG TIỆN</H4>
            </el-col>
            <el-col :sm="{ span: 10 }">
              <el-form-item label="Phương tiện PCCC" prop="phuong_tien_pccc_id">
                <el-select
                  style="width:100%"
                  filterable
                  multiple
                  clearable
                  v-model="phuongTienTruc"
                  placeholder="Chọn phương tiện PCCC"
                >
                  <el-option
                    v-for="toanha in phuong_tien_pcccs"
                    :key="toanha.id"
                    :label="toanha.ten"
                    :value="toanha.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <H4>VI. TÌNH HÌNH TRONG NGÀY</H4>
            </el-col>
            <el-col :sm="{ span: 24 }">
              <el-form-item prop="tinh_hinh_trong_ngay">
                <el-input
                  type="textarea"
                  v-model="form.tinh_hinh_trong_ngay"
                  placeholder="Công tác học tập, huấn luyện, thực tập phương án, chữa cháy, CNCH"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <br />
          <el-row justify="space-around">
            <el-col :sm="{ span: 12 }">
              <router-link to="/congtacphongchay/lichtruc">
                <el-button type="warning" icon="el-icon-back">Quay lại</el-button>
              </router-link>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-button
                icon="el-icon-check"
                style="float: right"
                class="primary-button"
                :loading="loading"
                @click="submit('form')"
              >CẬP NHẬT</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { danhSachCanBoChienSi } from "@/api/canbochiensi";
import { getDonViPccc } from "@/api/donvipccc";
import { getPT } from "@/api/qlchung";
import { getToken } from "@/utils/auth";
import BackButton from "@/layout/back";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { themlichtruc, showLichtruc, updateLichTruc } from "@/api/lichtruc";
import { getTrangThai } from "@/api/kiemtratoanha";
import { addThamDinhPheDuyet } from "@/api/thamdinhpheduyet";

export default {
  components: {
    BackButton
  },
  data() {
    return {
      disabledTinhThanh: true,
      urlUpload: process.env.VUE_APP_BASE_API + "upload",
      token: {},
      form: {
        tinh_thanh_id: null,
        don_vi_id: null,
        ngay_truc: null,
        chi_huy_doi: null,
        can_bo_tong_hop: null,
        tong_cbcs: 0,
        co_mat: 0,
        hanh_chinh: 0,
        vang_mat: 0,
        truc_chi_huy: [],
        truc_ban: [],
        truc_kiem_tra: [],
        truc_thong_tin: [],
        phuong_tien_pccc_id: [],
        tinh_hinh_trong_ngay: ""
      },
      chiHuys: [],
      trucBans: [],
      trucKTs: [],
      trucThongTins: [],
      canbochiensis: [],
      tinhthanhs: [],
      donVis: [],
      phuongTienTruc: [],
      phuong_tien_pcccs: [],
      loading: false,
      rules: {
        tinh_thanh_id: [
          {
            required: true,
            message: "Tỉnh thành không được bỏ trống",
            trigger: "blur"
          }
        ],
        don_vi_id: [
          {
            required: true,
            message: "Đơn vị không được bỏ trống",
            trigger: "blur"
          }
        ],
        ngay_cap: [
          {
            required: true,
            message: "Ngày cấp không được bỏ trống",
            trigger: "blur"
          }
        ],
        ngay_truc: [
          {
            required: true,
            message: "Ngày trực không được bỏ trống",
            trigger: "blur"
          }
        ],
      }
    };
  },
  methods: {
    async getData(id) {
      let data = await showLichtruc(id);
      this.form.tinh_thanh_id = data.tinh_thanh_id;
      this.getDataSelect(this.form.tinh_thanh_id);
      this.form = data;
      this.form.truc_ban = [];
      this.form.truc_kiem_tra = [];
      this.form.truc_thong_tin = [];
      this.form.truc_chi_huy = [];
      this.form.phuong_tien_pccc_id = [];
      data.nhan_sus.map(nhan_su => {
        switch (nhan_su.chi_tiet_nhan_su) {
          case "truc_ban":
            this.trucBans.push(nhan_su.reference_id);
            break;
          case "truc_thong_tin":
            this.trucThongTins.push(nhan_su.reference_id);
            break;
          case "truc_chi_huy":
            this.chiHuys.push(nhan_su.reference_id);
            break;
          case "truc_kiem_tra":
            this.trucKTs.push(nhan_su.reference_id);
            break;

          default:
            break;
        }
      });
      data.phuong_tiens.map(pt => this.phuongTienTruc.push(pt.reference_id));
    },

    async getDataSelect(val) {
      let data = await danhSachCanBoChienSi({
        tinh_thanh_id: val,
        per_page: 999999
      });
      this.canbochiensis = data.data.data;
      let dv = await getDonViPccc({
        tinh_thanh_id: val,
        per_page: 999999
      });
      this.donVis = dv.data.data;
      let pt = await getPT({ tinh_thanh_id: val, per_page: 999999 });
      this.phuong_tien_pcccs = pt.data.data;
    },
    async changeTinhThanh(val) {
      this.form.don_vi_id = null;
      this.form.chi_huy_doi = null;
      this.form.can_bo_tong_hop = null;
      this.form.tong_cbcs = 0;
      this.form.co_mat = 0;
      this.form.hanh_chinh = 0;
      this.form.vang_mat = 0;
      this.form.truc_chi_huy = [];
      this.form.truc_ban = [];
      this.form.truc_kiem_tra = [];
      this.form.truc_thong_tin = [];
      this.form.phuong_tien_pccc_id = [];
      this.tinh_hinh_trong_ngay = "";
      let data = await danhSachCanBoChienSi({
        tinh_thanh_id: val,
        per_page: 999999
      });
      this.canbochiensis = data.data.data;
      let dv = await getDonViPccc({
        tinh_thanh_id: val,
        per_page: 999999
      });
      this.donVis = dv.data.data;
      let pt = await getPT({ tinh_thanh_id: val, per_page: 999999 });
      this.phuong_tien_pcccs = pt.data.data;
    },
    resetForm() {
      this.form = {
        tinh_thanh_id: null,
        don_vi_id: null,
        ngay_truc: null,
        chi_huy_doi: "",
        can_bo_tong_hop: "",
        tong_cbcs: 0,
        co_mat: 0,
        hanh_chinh: 0,
        vang_mat: 0,
        truc_chi_huy: [],
        truc_ban: [],
        truc_kiem_tra: [],
        truc_thong_tin: [],
        phuong_tien_pccc_id: [],
        tinh_hinh_trong_ngay: ""
      };
    },
    handleChange(file, fileList) {
      this.form.fileList = fileList.slice(-3);
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid) {
          this.loading = true;
          this.form.truc_chi_huy = this.chiHuys;
          this.form.truc_ban = this.trucBans;
          this.form.truc_kiem_tra = this.trucKTs;
          this.form.truc_thong_tin = this.trucThongTins;
          this.form.phuong_tien_pccc_id = this.phuongTienTruc;
          updateLichTruc(this.$route.params.id, this.form)
            .then(res => {
              this.loading = false;

              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
              // this.resetForm();
            })
            .catch(error => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.token = {
      Authorization: "Bearer " + getToken()
    };
    this.getData(this.$route.params.id);
    getInfor().then(res => {
      if (res.data.tinh_thanh_id && res.data.role_id == 2) {
        this.disabledTinhThanh = true;
        this.form.tinh_thanh_id = res.data.tinh_thanh_id;
        this.getDataSelect(res.data.tinh_thanh_id);
      } else {
        this.disabledTinhThanh = false;
      }
    });

    getTinhThanh().then(res => {
      this.tinhthanhs = res.data;
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
@media (max-width: 576px) {
  .back-button {
    width: fit-content;
    margin-top: 10px;
  }
}
</style>
