<template>
  <div class="app-container">
    <h4 style="color: #2E86C1">Danh sách cán bộ chiến sĩ</h4>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="formSearch.search"
          size="small"
          placeholder="Thông tin tìm kiếm"
          @keyup.enter.native="timKiem"
        />
      </el-col>
      <el-col :span="2">
        <el-button
          icon="el-icon-search"
          style="background-color: #3498DB; color: white"
          size="small"
          @click="timKiem"
        >Tìm Kiếm</el-button>
      </el-col>
    </el-row>
    <el-dialog
      :title="edit ? 'Cập nhật thông tin' : 'Thêm mới cán bộ chiến sĩ'"
      :visible.sync="showForm"
      width="50%"
      center
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-row :gutter="20">
              <el-col>
                <el-form-item label="Họ tên" prop="ten">
                  <el-input v-model="form.ten" placeholder="Họ tên cán bộ chiến sĩ" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col>
                <el-form-item label="Số điện thoại" prop="so_dien_thoai">
                  <el-input v-model="form.so_dien_thoai" placeholder="Nhập số điện thoại" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Ngày sinh" prop="ngay_sinh">
                  <br />
                  <el-date-picker
                    v-model="form.ngay_sinh"
                    type="date"
                    placeholder="Chọn ngày sinh"
                    format="dd/MM/yyyy"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Số CMND">
                  <el-input v-model="form.cmnd" placeholder="Nhập số chứng minh nhân dân"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="13">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Cấp bậc">
                  <el-select
                    v-model="form.cap_bac_id"
                    style="width:100%"
                    placeholder="Chọn cấp bậc"
                    filterable
                  >
                    <el-option
                      v-for="capBac in capBacs"
                      :key="capBac.id"
                      :label="capBac.ten"
                      :value="capBac.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Chức vụ">
                  <el-select
                    v-model="form.chuc_vu_id"
                    style="width:100%"
                    placeholder="Chọn chức vụ"
                    filterable
                  >
                    <el-option
                      v-for="chucVu in chucVus"
                      :key="chucVu.id"
                      :label="chucVu.ten"
                      :value="chucVu.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Tỉnh thành" prop="tinh_thanh_id">
                  <el-select
                    v-model="form.tinh_thanh_id"
                    style="width:100%"
                    placeholder="Chọn tỉnh thành"
                    filterable
                    :disabled="disabledTinhThanh"
                    @change="filterDonVi(form.tinh_thanh_id)"
                  >
                    <el-option
                      v-for="tinhThanh in tinhThanhs"
                      :key="tinhThanh.id"
                      :label="tinhThanh.name"
                      :value="tinhThanh.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Trực thuộc" prop="truc_thuoc_quan_huyen">
                  <el-select
                    v-model="form.truc_thuoc_quan_huyen"
                    style="width:100%"
                    @change="trucThuoc"
                  >
                    <el-option :value="true" label="Quận huyện" />
                    <el-option :value="false" label="PC07" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              v-if="!form.truc_thuoc_quan_huyen"
              label="Đơn vị PCCC"
              prop="don_vi_pccc_id"
            >
              <el-select
                v-model="form.don_vi_pccc_id"
                style="width:100%"
                placeholder="Chọn đơn vị PCCC"
              >
                <el-option
                  v-for="item in filteredDonViPccc"
                  :key="item.id"
                  :label="item.ten"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  v-if="form.truc_thuoc_quan_huyen"
                  label="Quận huyện"
                  prop="quan_huyen_id"
                >
                  <el-select
                    v-model="form.quan_huyen_id"
                    style="width:100%"
                    placeholder="Chọn quận huyện quản lý"
                  >
                    <el-option
                      v-for="item in quanHuyens"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  v-if="form.truc_thuoc_quan_huyen"
                  label="Trực thuộc phòng"
                  prop="loai_nhan_su"
                >
                  <br />
                  <el-select v-model="form.loai_nhan_su" style="width: 100%">
                    <el-option value="phong_ngua" label="Phòng cháy">Phòng cháy</el-option>
                    <el-option value="cnch" label="Công tác CC&CNCH">Công tác CC&CNCH</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" icon="el-icon-close" @click="cancel">Hủy</el-button>
        <el-button
          v-if="!edit"
          style="background-color: #3498DB; color: white"
          icon="el-icon-plus"
          :loading="btnLoading"
          @click="add"
        >Thêm mới</el-button>
        <el-button
          v-else
          style="background-color: #3498DB; color: white"
          icon="el-icon-check"
          :loading="btnLoading"
          @click="update"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
    <el-table v-loading="loading" :data="tableData" style="width: 100%; font-size: 13px" border stripe >
      <el-table-column label="STT" align="center" type="index" width="50" />
      <el-table-column sortable label="Họ và tên" prop="ten" />
      <el-table-column sortable label="Ngày sinh">
        <template slot-scope="scope">
          <div>{{ formatDate(scope.row.ngay_sinh)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="SĐT" prop="so_dien_thoai" />
      <el-table-column sortable label="Chức vụ" prop="chuc_vu.ten" />
      <el-table-column sortable label="Cấp bậc" prop="cap_bac.ten_cap_bac" />
      <el-table-column sortable label="Trực thuộc">
        <template slot-scope="scope">
          <div v-if="scope.row.don_vi_pccc !== null">{{ scope.row.don_vi_pccc.ten }}</div>
          <div v-else-if="scope.row.quan_huyen != null">{{ scope.row.quan_huyen.name }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable label="Phòng ban">
        <template slot-scope="scope">
          <div v-if="scope.row.don_vi_pccc !== null" />
          <div
            v-else-if="scope.row.quan_huyen != null"
          >{{ scope.row.loai_nhan_su == 'phong_ngua' ? 'Phòng cháy': 'Công tác CC&CNCH' }}</div>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <div class="block">
      <el-pagination
        background
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { getDonViPccc, getAllDonViPccc } from "@/api/phuongtienpccc";
import {
  addCanBoChienSi,
  danhSachCanBoChienSi,
  updateCanBoChienSi,
  xoaNhanSu
} from "@/api/canbochiensi";
import { getCapBac, getChucVu } from "@/api/capbacchucvu";

import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { getQuanHuyenTheoTinh } from "@/api/QuanHuyen";
export default {
  props: {
    donVi: { type: Object },
    showAll: { type: Boolean }
  },
  data() {
    return {
      formSearch: {
        search: "",
        tinh_thanh_id: null,
        don_vi_pccc_id: null
      },
      btnLoading: false,
      loading: false,
      page: 1,
      per_page: 5,
      total: 0,
      currentId: null,
      showForm: false,
      edit: false,
      tinhThanhs: [],
      quanHuyens: [],
      filteredDonViPccc: [],
      donViPccc: [],
      disabledTinhThanh: true,
      role: "",
      tableData: [],
      quan_huyen_id: null,
      don_vi_id: null,
      form: {
        loai_nhan_su: "phong_ngua",
        ten: "",
        truc_thuoc_quan_huyen: false,
        quan_huyen_id: null,
        don_vi_pccc_id: null,
        tinh_thanh_id: null,
        so_dien_thoai: "",
        chuc_vu_id: null,
        cap_bac_id: null,
        cmnd: ""
      },
      tinh_thanh_id: null,
      chucVus: [],
      capBacs: [],
      rules: {
        ten: [
          {
            required: true,
            message: "Tên không thể bỏ trống",
            trigger: "blur"
          },
          {
            min: 3,
            message: "Tên quá ngắn",
            trigger: "blur"
          }
        ],
        so_dien_thoai: [
          {
            required: true,
            message: "Hãy nhập số điện thoại",
            trigger: "change"
          }
        ],
        loai_nhan_su: [
          {
            required: true,
            message: "Chọn loại nhân sự",
            trigger: "change"
          }
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Tỉnh thành không thể bỏ trống",
            trigger: "change"
          }
        ],
        truc_thuoc_quan_huyen: [
          {
            required: true,
            message: "Chọn một đơn vị trực thuộc",
            trigger: "change"
          }
        ],
        don_vi_pccc_id: [
          {
            required: true,
            message: "Đơn vị PCCC không thể bỏ trống",
            trigger: "change"
          }
        ],
        quan_huyen_id: [
          {
            required: true,
            message: "Hãy chọn một quận huyện",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    async showAll(val) {
      if (val) {
        this.getTinhThanh();
        this.getDonViPccc();
        this.getInfor();
        this.formSearch = {
          search: "",
          tinh_thanh_id: null,
          don_vi_pccc_id: null
        };
        const data = await danhSachCanBoChienSi({
          page: this.page,
          per_page: this.per_page
        });
        this.tableData = data.data.data;
        this.page = data.data.current_page;
        this.per_page = data.data.per_page;
        this.total = data.data.total;
        this.$emit("getSoLuong", this.total);
        this.loading = false;
      }
    },
    tinhThanh: function(val) {
      this.filteredDonViPccc = [
        ...this.donViPccc.filter(item => item.tinh_thanh_id == val)
      ];
    },

    async donVi(val) {
      this.loading = true;
      this.tableData = [];
      if (val === null || val === undefined) {
        this.tableData = [];
        this.loading = false;
        return;
      }
      var data = [];
      this.$emit("getSoLuong", false);
      if (val.children !== undefined) {
        this.tinh_thanh_id = val.id;
        this.formSearch.tinh_thanh_id = val.id
        data = await danhSachCanBoChienSi({
          page: this.page,
          per_page: this.per_page,
          tinh_thanh_id: val.id
        });
      }
      if (val.quan_huyen_id !== undefined) {
        this.quan_huyen_id = null;
        this.tinh_thanh_id = null
        this.don_vi_id = val.id;
        this.formSearch.quan_huyen_id = null;
        this.formSearch.don_vi_pccc_id = val.id;
        data = await danhSachCanBoChienSi({
          page: this.page,
          per_page: this.per_page,
          don_vi_pccc_id: val.id
        });
      } else if (
        val.quan_huyen_id === undefined &&
        val.children === undefined
      ) {
        this.tinh_thanh_id = null
        this.quan_huyen_id = val.id;
        this.don_vi_id = null;
        this.formSearch.quan_huyen_id = val.id;
        this.formSearch.don_vi_pccc_id = null;
        data = await danhSachCanBoChienSi({
          page: this.page,
          per_page: this.per_page,
          quan_huyen_id: val.id
        });
      }
      this.tableData = data.data.data;
      this.page = data.data.current_page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.$emit("getSoLuong", this.total);
      this.loading = false;
    }
  },
  created() {
    this.getTinhThanh();
    this.getDonViPccc();
    this.getInfor();
    this.$emit("getSoLuong", false);
    this.getData();
    this.getCapBac();
    this.getChucVu();
  },

  methods: {
    timKiem(page = 1, per_page = 5) {
      this.loading = true;
      danhSachCanBoChienSi(this.formSearch).then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    formatDate(date) {
      try {
        var d = new Date(date);
        var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        var month =
          d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
        return day + "/" + month + "/" + d.getUTCFullYear();
      } catch (error) {
        return null;
      }
    },
    async getCapBac() {
      let data = await getCapBac();
      this.capBacs = data;
    },
    async getChucVu() {
      let data = await getChucVu();
      this.chucVus = data;
    },
    async getData(page = 1, per_page = 5) {
      this.loading = true;
      const data = await danhSachCanBoChienSi({
        page: this.page,
        per_page: this.per_page,
        quan_huyen_id: this.quan_huyen_id,
        don_vi_pccc_id: this.don_vi_id,
        tinh_thanh_id: this.tinh_thanh_id
      });
      this.loading = false;
      this.tableData = data.data.data;
      this.page = data.data.current_page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.$emit("getSoLuong", this.total);
    },
    async getTinhThanh() {
      const data = await getTinhThanh();
      this.tinhThanhs = data.data;
    },
    async getQuanHuyen(tinhThanhId) {
      const data = await getQuanHuyenTheoTinh({ tinh_thanh_id: tinhThanhId });
      this.quanHuyens = data.data;
    },
    async getDonViPccc() {
      const data = await getDonViPccc();
      this.donViPccc = data.data;
    },
    filterDonVi(id) {
      this.filteredDonViPccc = [
        ...this.donViPccc.filter(item => item.tinh_thanh_id == id)
      ];
      this.getQuanHuyen(id);
      if (this.form.truc_thuoc_quan_huyen) {
        this.don_vi_pccc_id = null;
      }
    },
    trucThuoc() {
      if (this.form.truc_thuoc_quan_huyen) {
        this.form.don_vi_pccc_id = null;
      } else {
        this.form.quan_huyen_id = null;
        this.form.don_vi_pccc_id = this.don_vi;
        this.form.loai_nhan_su = null;
      }
    },
    updateDataTable() {
      const first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getData(this.page, this.per_page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    cancel() {
      this.edit = false;
      this.showForm = false;
      this.form = {
        ten: "",
        truc_thuoc_quan_huyen: false,
        quan_huyen_id: null,
        don_vi_pccc_id: null,
        tinh_thanh_id: null,
        so_dien_thoai: "",
        chuc_vu_id: null,
        cap_bac_id: null,
        cmnd: ""
      };
    },
    showFormUpdate(data) {
      this.edit = true;
      this.currentId = data.id;
      this.form.ten = data.ten;
      this.form.so_dien_thoai = data.so_dien_thoai;
      this.form.ngay_sinh = data.ngay_sinh;
      this.form.tinh_thanh_id = data.tinh_thanh_id;
      this.form.quan_huyen_id = data.quan_huyen_id;
      this.form.loai_nhan_su = data.loai_nhan_su;
      this.form.cap_bac_id = data.cap_bac_id;
      this.form.chuc_vu_id = data.chuc_vu_id;
      this.filterDonVi(this.form.tinh_thanh_id);
      this.form.don_vi_pccc_id = data.don_vi_pccc_id;
      this.form.cmnd = data.cmnd;
      this.showForm = true;
      if (data.quan_huyen_id === null) {
        this.form.truc_thuoc_quan_huyen = false;
      } else {
        this.form.truc_thuoc_quan_huyen = true;
      }
    },
    async destroy(id) {
      try {
        await this.$confirm(
          "Bạn có chắc chắn muốn xóa nhân sự này",
          "Xóa nhân sự",
          {
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        await xoaNhanSu(id);
        this.$message({
          message: "Xóa dữ liệu thành công!",
          type: "success"
        });
        this.loading = true;
        if (this.don_vi_id !== null) {
          danhSachCanBoChienSi({
            page: this.page,
            per_page: this.per_page,
            don_vi_pccc_id: this.don_vi_id
          }).then(res => {
            this.tableData = res.data.data;
            this.page = res.data.current_page;
            this.per_page = res.data.per_page;
            this.total = res.data.total;
            this.loading = false;
          });
        }
        if (this.don_vi_id == null && this.quan_huyen_id == null) {
          danhSachCanBoChienSi({
            page: this.page,
            per_page: this.per_page
          }).then(res => {
            this.tableData = res.data.data;
            this.page = res.data.current_page;
            this.per_page = res.data.per_page;
            this.total = res.data.total;
            this.loading = false;
          });
        }
        if (this.quan_huyen_id !== null) {
          danhSachCanBoChienSi({
            page: this.page,
            per_page: this.per_page,
            quan_huyen_id: this.quan_huyen_id
          }).then(res => {
            this.tableData = res.data.data;
            this.page = res.data.current_page;
            this.per_page = res.data.per_page;
            this.total = res.data.total;
            this.loading = false;
          });
        }
      } catch (error) {
        this.loading = false;
      }
    },
    add() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          addCanBoChienSi(this.form).then(res => {
            this.$message({
              message: "Thêm mới thành công",
              type: "success"
            });
            this.btnLoading = false;
            this.showForm = false;
            this.loading = true;
            if (this.don_vi_id !== null) {
              danhSachCanBoChienSi({
                page: this.page,
                per_page: this.per_page,
                don_vi_pccc_id: this.don_vi_id
              }).then(res => {
                this.tableData = res.data.data;
                this.page = res.data.current_page;
                this.per_page = res.data.per_page;
                this.total = res.data.total;
                this.loading = false;
                this.btnLoading = true;
              });
            }
            if (this.don_vi_id == null && this.quan_huyen_id == null) {
              danhSachCanBoChienSi({
                page: this.page,
                per_page: this.per_page
              }).then(res => {
                this.tableData = res.data.data;
                this.page = res.data.current_page;
                this.per_page = res.data.per_page;
                this.total = res.data.total;
                this.loading = false;
              });
            }
            if (this.quan_huyen_id !== null) {
              danhSachCanBoChienSi({
                page: this.page,
                per_page: this.per_page,
                quan_huyen_id: this.quan_huyen_id
              }).then(res => {
                this.tableData = res.data.data;
                this.page = res.data.current_page;
                this.per_page = res.data.per_page;
                this.total = res.data.total;
                this.loading = false;
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    update() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          try {
            this.btnLoading = true;
            updateCanBoChienSi(this.currentId, this.form).then(res => {
              this.showForm = false;
              this.btnLoading = false;
              this.$message({
                message: "Cập nhật dữ liệu thành công!",
                type: "success"
              });
              this.loading = true;
              if (this.don_vi_id !== null) {
                danhSachCanBoChienSi({
                  page: this.page,
                  per_page: this.per_page,
                  don_vi_pccc_id: this.don_vi_id
                }).then(res => {
                  this.tableData = res.data.data;
                  this.page = res.data.current_page;
                  this.per_page = res.data.per_page;
                  this.total = res.data.total;
                  this.loading = false;
                });
              }
              if (this.don_vi_id == null && this.quan_huyen_id == null) {
                danhSachCanBoChienSi({
                  page: this.page,
                  per_page: this.per_page
                }).then(res => {
                  this.tableData = res.data.data;
                  this.page = res.data.current_page;
                  this.per_page = res.data.per_page;
                  this.total = res.data.total;
                  this.loading = false;
                });
              }
              if (this.quan_huyen_id !== null) {
                danhSachCanBoChienSi({
                  page: this.page,
                  per_page: this.per_page,
                  quan_huyen_id: this.quan_huyen_id
                }).then(res => {
                  this.tableData = res.data.data;
                  this.page = res.data.current_page;
                  this.per_page = res.data.per_page;
                  this.total = res.data.total;
                  this.loading = false;
                });
              }
            });
          } catch (error) {
            this.btnLoading = false;
            this.loading = false;
            console.log(error);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getInfor() {
      const data = await getInfor();
      this.role = data.data.role_id;
      if (data.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        this.form.tinh_thanh_id = data.data.tinh_thanh_id;
        this.filterDonVi(this.form.tinh_thanh_id);
      } else {
        this.disabledTinhThanh = false;
      }
    },
    showFormCreate() {
      this.edit = false;
      this.showForm = true;
      this.form = {
        ten: "",
        truc_thuoc_quan_huyen: false,
        quan_huyen_id: null,
        don_vi_pccc_id: null,
        tinh_thanh_id: null,
        so_dien_thoai: "",
        loai_nhan_su: null,
        chuc_vu_id: null,
        cap_bac_id: null,
        cmnd: ""
      };
      this.getInfor();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.search {
  margin-bottom: 20px;
}
.upload-image {
  display: none;
  z-index: -9999;
}
.btnWidth {
  width: fit-content;
}
@media (max-width: 768px) {
  .el-input-form {
    margin-bottom: 10px;
  }
}
</style>
