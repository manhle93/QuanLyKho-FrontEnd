<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="22" :offset="1">
          <h4>Cập nhật công tác xây dựng thực tập phương án chữa cháy</h4>
          <el-row :gutter="20">
            <el-col :sm="{ span: 5 }">
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
              <el-form-item label="Ngày lập phương án">
                <br />
                <el-date-picker
                  style="width: 100%"
                  v-model="form.ngay_lap_phuong_an"
                  type="date"
                  placeholder="Thời gian"
                  format="dd/MM/yyyy"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 4 }">
              <el-form-item label="Tòa nhà">
                <el-select
                  style="width:100%"
                  filterable
                  clearable
                  v-model="form.toa_nha_id"
                  placeholder="Hãy chọn tòa nhà"
                >
                  <el-option
                    v-for="toanha in toanhas"
                    :key="toanha.id"
                    :label="toanha.ten"
                    :value="toanha.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 10 }">
              <el-form-item label="Tình huống thực tập" label-position="right">
                <el-input
                  type="textarea"
                  v-model="form.tinh_huong"
                  placeholder="Nhập tình huống thực tập"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 5 }">
              <el-form-item label="Thời gian TTPA">
                <br />
                <el-date-picker
                  style="width: 100%"
                  v-model="form.thoi_gian"
                  type="date"
                  placeholder="Thời gian"
                  format="dd/MM/yyyy"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 5 }">
              <el-form-item label="Cấp phê duyệt">
                <el-input
                  placeholder="Nhập cấp phê duyệt"
                  v-model="form.cap_phe_duyet"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 14 }">
              <el-form-item
                label="Ý kiến nhận xét, đánh giá"
                label-position="right"
              >
                <el-input
                  type="textarea"
                  v-model="form.danh_gia"
                  placeholder="Nhập ý kiến nhận xét đánh giá"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 5 }">
              <el-form-item label="Đơn vị tham gia">
                <el-radio-group v-model="pc07" size="small">
                  <el-radio v-model="quanHuyen" :label="false" border
                    >Quận huyện</el-radio
                  >
                  <el-radio v-model="pc07" :label="true" border>PC07</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 5 }">
              <el-form-item
                v-if="!pc07"
                label="Quận huyện"
                label-position="right"
                prop="quan_huyen_tham_gia"
              >
                <br />
                <el-select
                  filterable
                  v-model="quan_huyen"
                  placeholder="Chọn một quận huyên tham gia"
                  style="width: 100%"
                  @change="changeQuanhuyen(quan_huyen)"
                >
                  <el-option
                    v-for="item in quanHuyen"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 5 }">
              <el-form-item
                v-if="pc07"
                label="Đơn vị"
                label-position="right"
                prop="danh_gia"
              >
                <br />
                <el-select
                  filterable
                  v-model="don_vi"
                  placeholder="Chọn một đơn vị tham gia"
                  style="width: 100%"
                  @change="changeDonVi(don_vi)"
                >
                  <el-option
                    v-for="item in filteredDonViPccc"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 6 }">
              <el-form-item
                label="Cán bộ chiến sĩ tham gia"
                label-position="right"
                prop="nhan_su_tham_gia"
              >
                <br />
                <el-select
                  v-model="form.nhan_su_tham_gia"
                  placeholder="Chọn các cán bộ chiến sĩ tham gia"
                  style="width: 100%"
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="item in filteredNhanSu"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="{ span: 8 }">
              <el-form-item
                label="Phương tiện tham gia"
                label-position="right"
                prop="phuong_tien_tham_gia"
              >
                <br />
                <el-select
                  v-model="form.phuong_tien_tham_gia"
                  placeholder="Chọn các phương tiện tham gia"
                  style="width: 60%"
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="item in filteredPT"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.ten }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      v-if="item.loai_phuong_tien_pccc"
                      >{{ item.loai_phuong_tien_pccc.ten }}</span
                    >
                  </el-option>
                </el-select>
                <el-button
                  size="small"
                  style="magrin-left: 50px"
                  icon="el-icon-plus"
                  class="primary-button"
                  circle
                  @click="themDonVi"
                ></el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <br />
          <el-row>
            <el-tabs v-model="activeName">
              <el-tab-pane label="Số lượng tham gia" name="first">
                <el-col :span="16">
                  <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column
                      prop="ten_don_vi"
                      label="Đơn vị tham gia"
                    ></el-table-column>
                    <el-table-column label="Sô nhân sự (người)">
                      <template slot-scope="scope">{{
                        scope.row.nhan_su_tham_gia.length
                      }}</template>
                    </el-table-column>
                    <el-table-column label="Số phương tiện (xe)">
                      <template slot-scope="scope">{{
                        scope.row.phuong_tien_tham_gia.length
                      }}</template>
                    </el-table-column>
                    <el-table-column label="Xóa" width="100">
                      <template slot-scope="scope">
                        <el-button
                          icon="el-icon-delete"
                          @click="xoaDonVi(scope.$index)"
                          circle
                          type="danger"
                          size="medium"
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="Chi tiết nhân sự" name="second">
                <el-col :span="16">
                  <el-table :data="tableDataNhanSu" stripe style="width: 100%">
                    <el-table-column
                      prop="can_bo_chien_si.ten"
                      label="Họ và tên"
                    >
                    </el-table-column>
                    <el-table-column label="Đơn vị tham gia">
                      <template slot-scope="scope">
                        <div v-if="scope.row.quan_huyen">
                          {{ scope.row.quan_huyen.name }}
                        </div>
                        <div v-if="scope.row.don_vi_pccc">
                          {{ scope.row.don_vi_pccc.ten }}
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="Chi tiết phương tiện" name="third">
                <el-col :span="16">
                  <el-table
                    :data="tableDataPhuongTien"
                    stripe
                    style="width: 100%"
                  >
                    <el-table-column label="Phương tiện" prop="phuong_tien.ten">
                    </el-table-column>
                    <el-table-column label="Biển số" prop="phuong_tien.bien_so">
                    </el-table-column>
                    <el-table-column label="Đơn vị tham gia">
                      <template slot-scope="scope">
                        <div v-if="scope.row.quan_huyen">
                          {{ scope.row.quan_huyen.name }}
                        </div>
                        <div v-if="scope.row.don_vi_pccc">
                          {{ scope.row.don_vi_pccc.ten }}
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </el-row>
          <br />
          <el-row justify="space-around">
            <el-col :sm="{ span: 12 }">
              <router-link to="/chuachayvacnch/xaydungphuonganpccc">
                <el-button type="warning" icon="el-icon-back"
                  >Quay lại</el-button
                >
              </router-link>
            </el-col>
            <el-col :sm="{ span: 12 }">
              <el-button
                icon="el-icon-check"
                style="float: right"
                class="primary-button"
                :loading="loading"
                @click="submit('form')"
                >Cập nhật</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getToaNhaTheoTinh } from "@/api/toanha";
import { getToken } from "@/utils/auth";
import BackButton from "@/layout/back";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen, getQuanHuyenTheoTinh } from "@/api/QuanHuyen";
import { getInfor } from "@/api/taikhoan";
import { getDonViPccc } from "@/api/donvipccc";
import { danhSachCanBoChienSi } from "@/api/canbochiensi";
import { getPT } from "@/api/qlchung";
import {
  addPhuongAnThucTap,
  showPhuongAnThucTap,
  updatePhuongAnThucTap
} from "@/api/phuonganthuctap";

export default {
  components: {
    BackButton
  },
  data() {
    return {
      activeName: "first",
      disabledTinhThanh: true,
      urlUpload: process.env.VUE_APP_BASE_API + "upload",
      token: {},
      tenThamGia: "",
      tableData: [],
      tableDataNhanSu: [],
      tableDataPhuongTien: [],
      filteredDonViPccc: [],
      filteredNhanSu: [],
      filteredPT: [],
      donViPccc: [],
      nhanSu: [],
      quanHuyen: [],
      phuongTien: [],
      pc07: true,
      form: {
        quan_huyen_tham_gia: [],
        tinh_thanh_id: null,
        thoi_gian: "",
        tinh_huong: "",
        don_vi_tham_gia: [],
        nhan_su_tham_gia: [],
        phuong_tien_tham_gia: [],
        toa_nha_id: null,
        ngay_lap_phuong_an: null,
        toa_nha_id: null,
        cap_phe_duyet: '',
        danh_gia: ""
      },
      toanhas: [],
      quan_huyen: null,
      don_vi: null,
      tinhthanhs: [],
      loading: false,
      rules: {
        tinh_thanh_id: [
          {
            required: true,
            message: "Tỉnh thành không thể bỏ trống",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    pc07: function() {
      if (this.pc07) {
        this.quan_huyen = null;
      } else {
        this.don_vi = null;
      }
    }
  },
  methods: {
    async getData(id) {
      let data = await showPhuongAnThucTap(id);
      this.tableDataNhanSu = data.nhan_su;
      this.tableDataPhuongTien = data.phuong_tien;
      this.form.tinh_thanh_id = data.data.tinh_thanh_id;
      this.form.tinh_huong = data.data.tinh_huong;
      this.form.thoi_gian = new Date(data.data.thoi_gian);
      this.form.ngay_lap_phuong_an = new Date(data.data.ngay_lap_phuong_an);
      this.form.danh_gia = data.data.danh_gia;
      this.form.toa_nha_id = data.data.toa_nha_id
      this.form.cap_phe_duyet = data.data.cap_phe_duyet
      let quan = await getQuanHuyenTheoTinh({
        tinh_thanh_id: data.data.tinh_thanh_id
      });
      getToaNhaTheoTinh(data.data.tinh_thanh_id).then(res => {
        this.toanhas = res.data;
      });
      this.quanHuyen = quan.data;
      this.getNhanSu(data.data.tinh_thanh_id);
      let datapt = await getPT({
        tinh_thanh_id: this.form.tinh_thanh_id,
        per_page: 99999
      });
      this.phuongTien = datapt.data.data;
      for (let dv of data.data.don_vi) {
        let data = {
          ten_don_vi: dv.ten_don_vi,
          quan_huyen_tham_gia: null,
          don_vi_tham_gia: dv.don_vi_pccc_id,
          nhan_su_tham_gia: dv.nhan_su_tham_gia,
          phuong_tien_tham_gia: dv.phuong_tien_tham_gia
        };
        this.tableData.push(data);
      }
      for (let qh of data.data.quan_huyen) {
        let data = {
          ten_don_vi: qh.ten_quan_huyen,
          quan_huyen_tham_gia: qh.quan_huyen_id,
          don_vi_tham_gia: null,
          nhan_su_tham_gia: qh.nhan_su_tham_gia,
          phuong_tien_tham_gia: qh.phuong_tien_tham_gia
        };
        this.tableData.push(data);
      }
    },
    async changeTinhThanh(id) {
      if (id && id != "") {
        this.filteredDonViPccc = [
          ...this.donViPccc.filter(item => item.tinh_thanh_id == id)
        ];
        this.filteredNhanSu = [
          ...this.nhanSu.filter(item => item.tinh_thanh_id == id)
        ];
        getToaNhaTheoTinh(id).then(res => {
          this.toanhas = res.data;
        });
        let data = await getQuanHuyenTheoTinh({ tinh_thanh_id: id });
        this.quanHuyen = data.data;
        let datapt = await getPT({ tinh_thanh_id: id, per_page: 9999 });
        this.phuongTien = datapt.data.data;
        this.getNhanSu();
        this.quan_huyen = null;
        this.don_vi = null;
        this.tableData = [];
        this.toa_nha_id = null;
      } else {
        this.filteredDonViPccc = this.donViPccc;
      }
    },
    changeQuanhuyen(id) {
      if (id && id != "" && !this.pc07) {
        this.form.don_vi_tham_gia = null;
        this.filteredNhanSu = [
          ...this.nhanSu.filter(item => item.quan_huyen_id == id)
        ];
        this.tenThamGia = this.quanHuyen.find(el => el.id == id).name;
        this.filteredPT = [
          ...this.phuongTien.filter(item => item.quan_huyen_id == id)
        ];
      }
    },
    changeDonVi(id) {
      if (id && id != "" && this.pc07) {
        this.form.quan_huyen_tham_gia = null;
        this.filteredNhanSu = [
          ...this.nhanSu.filter(item => item.don_vi_pccc_id == id)
        ];
        this.tenThamGia = this.donViPccc.find(el => el.id == id).ten;

        this.filteredPT = [
          ...this.phuongTien.filter(item => item.don_vi_pccc_id == id)
        ];
      }
    },
    async getDonVipcc() {
      let data = await getDonViPccc({ per_page: 99999999 });
      this.donViPccc = data.data.data;
      this.filteredDonViPccc = this.donViPccc;
    },
    async getNhanSu(id) {
      let data = await danhSachCanBoChienSi({
        tinh_thanh_id: id,
        per_page: 999999
      });
      this.nhanSu = data.data.data;
    },

    resetForm() {
      (this.pc07 = true),
        (this.form = {
          quan_huyen_tham_gia: [],
          tinh_thanh_id: null,
          thoi_gian: "",
          tinh_huong: "",
          don_vi_tham_gia: [],
          nhan_su_tham_gia: [],
          phuong_tien_tham_gia: [],
          toa_nha_id: null,
          ngay_lap_phuong_an: null,
          danh_gia: ""
        });
      this.quan_huyen = null;
      this.don_vi = null;
      this.tableData = [];
    },

    themDonVi() {
      let data = {};
      if (
        (this.don_vi == "" || this.don_vi == null) &&
        (this.quan_huyen == "" || this.quan_huyen == null)
      ) {
        this.$message({
          message: "Chưa chọn đơn vị tham gia",
          type: "warning"
        });
        return;
      }
      let existItem;
      const nhanSuThamGia = this.form.nhan_su_tham_gia.reduce(
        (acc, el) => (acc = [...acc, { can_bo_chien_si_id: el }]),
        []
      );
      const phuongTienThamGia = this.form.phuong_tien_tham_gia.reduce(
        (acc, el) => (acc = [...acc, { phuong_tien_pccc_id: el }]),
        []
      );
      if (this.don_vi) {
        existItem = this.tableData.findIndex(
          el => el.don_vi_tham_gia === this.don_vi
        );

        if (existItem !== -1) {
          this.tableData[existItem].nhan_su_tham_gia = [
            ...this.tableData[existItem].nhan_su_tham_gia,
            ...nhanSuThamGia
          ];
          this.tableData[existItem].phuong_tien_tham_gia = [
            ...this.tableData[existItem].phuong_tien_tham_gia,
            ...phuongTienThamGia
          ];
          this.don_vi = null;
          (this.quan_huyen = null),
            (this.form.nhan_su_tham_gia = []),
            (this.form.phuong_tien_tham_gia = []),
            (this.tenThamGia = "");
          return;
        } else {
          data = {
            ten_don_vi: this.tenThamGia,
            quan_huyen_tham_gia: null,
            don_vi_tham_gia: this.don_vi,
            nhan_su_tham_gia: nhanSuThamGia,
            phuong_tien_tham_gia: phuongTienThamGia
          };
        }
      }
      if (this.quan_huyen) {
        existItem = this.tableData.findIndex(
          el => el.quan_huyen_tham_gia === this.quan_huyen
        );
        if (existItem !== -1) {
          this.tableData[existItem].nhan_su_tham_gia = [
            ...this.tableData[existItem].nhan_su_tham_gia,
            ...nhanSuThamGia
          ];
          this.tableData[existItem].phuong_tien_tham_gia = [
            ...this.tableData[existItem].phuong_tien_tham_gia,
            ...phuongTienThamGia
          ];
          this.don_vi = null;
          (this.quan_huyen = null),
            (this.form.nhan_su_tham_gia = []),
            (this.form.phuong_tien_tham_gia = []),
            (this.tenThamGia = "");
          return;
        } else {
          data = {
            ten_don_vi: this.tenThamGia,
            quan_huyen_tham_gia: this.quan_huyen,
            don_vi_tham_gia: null,
            nhan_su_tham_gia: this.form.nhan_su_tham_gia.reduce(
              (acc, el) => (acc = [...acc, { can_bo_chien_si_id: el }]),
              []
            ),
            phuong_tien_tham_gia: this.form.phuong_tien_tham_gia.reduce(
              (acc, el) => (acc = [...acc, { phuong_tien_pccc_id: el }]),
              []
            )
          };
        }
      }
      if (this.don_vi || this.quan_huyen) {
        this.tableData.push(data);
        this.don_vi = null;
        (this.quan_huyen = null),
          (this.form.nhan_su_tham_gia = []),
          (this.form.phuong_tien_tham_gia = []),
          (this.tenThamGia = "");
      }
    },
    xoaDonVi(index) {
      // console.log(this.tableData[index])
      this.tableData.splice(index, 1);
    },
    submit(createInfo) {
      this.$refs[createInfo].validate(valid => {
        if (valid && this.tableData.length > 0) {
          // this.loading = true;
          let donvi = this.tableData.filter(el => el.don_vi_tham_gia);
          let quanhuyen = this.tableData.filter(el => el.quan_huyen_tham_gia);
          this.form.don_vi_tham_gia = donvi;
          this.form.quan_huyen_tham_gia = quanhuyen;
          updatePhuongAnThucTap(this.$route.params.id, this.form)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "Cập nhật thành công!",
                type: "success"
              });
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
    this.getDonVipcc();
    this.token = {
      Authorization: "Bearer " + getToken()
    };
    getInfor().then(res => {
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        getToaNhaSearch({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
          this.toanhas = res.data.data;
        });
      } else {
        this.disabledTinhThanh = false;
      }
    });
    getTinhThanh().then(res => {
      this.tinhthanhs = res.data;
    });
    this.getData(this.$route.params.id);
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
