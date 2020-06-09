<template>
  <div class="app-container">
    <h4 style="color: #2E86C1">Danh sách phương tiện phòng cháy chữa cháy</h4>
    <el-row>
      <el-input
        placeholder="Nhập thông tin tìm kiếm"
        clearable
        style="width:300px"
        v-model="search"
        class="input-with-select el-input-form"
        size="small"
        @keyup.enter.native="searchData"
      ></el-input>
      <el-button
        style="background-color: #3498DB; color: white"
        icon="el-icon-search"
        size="small"
        @click="searchData()"
      >Tìm kiếm</el-button>
    </el-row>
    <el-row style="margin-top:20px">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%; font-size: 13px"
        border
        stripe
      >
        <el-table-column label="STT" align="center" type="index" width="50"></el-table-column>
        <el-table-column sortable label="Tên" prop="ten"></el-table-column>
        <el-table-column sortable label="Số hiệu" prop="so_hieu"></el-table-column>
        <el-table-column sortable label="Biển số" prop="bien_so"></el-table-column>
        <el-table-column sortable label="SĐT" prop="so_dien_thoai"></el-table-column>
        <el-table-column sortable label="Loại phương tiện pccc" prop="loai_phuong_tien_pccc.ten"></el-table-column>
        <el-table-column label="Quản lý">
          <template slot-scope="scope">
            <div
              v-if="scope.row.don_vi_pccc_quan_ly && scope.row.don_vi_pccc !== null"
            >{{scope.row.don_vi_pccc.ten}}</div>
            <div v-else-if="scope.row.quan_huyen != null">{{scope.row.quan_huyen.name}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="Quản lý" prop="don_vi_pccc.ten"></el-table-column> -->
        <el-table-column label="IMEI thiết bị" prop="imei"></el-table-column>
      </el-table>
      <br />
      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </el-row>
    <el-dialog
      :title="editing?'CẬP NHẬT THÔNG TIN':'THÊM MỚI PHƯƠNG TIỆN'"
      :visible.sync="showDialog"
      center
    >
      <el-form label-position="top" :rules="rules" ref="form" :model="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Tên phương tiện pccc" prop="ten">
              <el-input placeholder="Nhập tên phương tiện pccc" v-model="form.ten"></el-input>
            </el-form-item>
            <el-form-item label="Số hiệu" prop="so_hieu">
              <el-input placeholder="Nhập số hiệu" v-model="form.so_hieu"></el-input>
            </el-form-item>
            <el-form-item label="Biển số" prop="bien_so">
              <el-input placeholder="Nhập biển số" v-model="form.bien_so"></el-input>
            </el-form-item>
            <el-form-item label="SĐT" prop="so_dien_thoai">
              <el-input placeholder="Nhập số điện thoại" v-model="form.so_dien_thoai"></el-input>
            </el-form-item>
            <el-form-item label="IMEI thiết bị" prop="imei">
              <el-input placeholder="Nhập IMEI thiết bị định vị" v-model="form.imei"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Loại phương tiện PCCC">
              <el-select
                v-model="form.loai_phuong_tien_pccc_id"
                style="width:100%"
                placeholder="Chọn loại phương tiện PCCC"
              >
                <el-option
                  v-for="item in loaiPhuongTienPccc"
                  :key="item.id"
                  :label="item.ten"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Trạng thái hoạt động">
              <el-select
                v-model="form.trang_thai_hoat_dong"
                style="width:100%"
                placeholder="Chọn Trạng thái hoạt động của phương tiện PCCC"
              >
                <el-option value="Tốt"></el-option>
                <el-option value="Cần sửa chữa, bảo dưỡng"></el-option>
                <el-option value="Cần thay thế"></el-option>
                <el-option value="Kém"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Tỉnh thành" prop="tinh_thanh_id">
              <el-select
                v-model="form.tinh_thanh_id"
                style="width:100%"
                placeholder="Chọn tỉnh thành"
                filterable
                @change="filterDonVi(form.tinh_thanh_id)"
                :disabled="disabledTinhThanh"
              >
                <el-option
                  v-for="tinhThanh in tinhThanhs"
                  :key="tinhThanh.id"
                  :label="tinhThanh.name"
                  :value="tinhThanh.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Trực thuộc" prop="don_vi_pccc_quan_ly">
              <el-select
                style="width:100%"
                v-model="form.don_vi_pccc_quan_ly"
                @change="changTrucThuoc"
              >
                <el-option :value="false" label="Quận huyện"></el-option>
                <el-option :value="true" label="PC07"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.don_vi_pccc_quan_ly" label="Đơn vị PCCC" prop="don_vi_pccc_id">
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
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-else label="Quận huyện" prop="quan_huyen_id">
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
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" icon="el-icon-close" @click="showDialog = false">Hủy</el-button>
        <el-button
          v-if="editing"
          style="background-color: #3498DB; color: white;"
          icon="el-icon-check"
          :loading="btnLoading"
          @click="update"
        >Cập nhật</el-button>
        <el-button
          v-else
          :loading="btnLoading"
          style="background-color: #3498DB; color: white;"
          icon="el-icon-plus"
          @click="submit"
        >Thêm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  index,
  updatePhuongTienPccc,
  storePhuongTienPccc,
  destroyPhuongTienPccc,
  getDonViPccc,
  getAllDonViPccc
} from "@/api/phuongtienpccc";
import { getDanhMucCon } from "@/api/danhmuc";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyenTheoTinh } from "@/api/QuanHuyen";
import { getInfor } from "@/api/taikhoan";
import { getPT } from "@/api/qlchung";
export default {
  data() {
    return {
      page: 1,
      per_page: 5,
      total: 0,
      disabledTinhThanh: true,
      tableData: [],
      load: false,
      timKiem: false,
      loading: false,
      showDialog: false,
      src: process.env.VUE_APP_BASE,
      search: "",
      btnLoading: false,
      currentId: "",
      editing: false,
      tinhThanh: "",
      tinhThanhs: [],
      quanHuyens: [],
      quan_huyen_id: null,
      don_vi_id: null,
      search: "",
      form: {
        bien_so: "",
        ten: "",
        loai_phuong_tien_pccc_id: "",
        so_dien_thoai: "",
        don_vi_pccc_id: "",
        so_hieu: "",
        imei: "",
        tinh_thanh_id: "",
        trang_thai_hoat_dong: "",
        don_vi_pccc_quan_ly: true,
        quan_huyen_id: null
      },
      tinh_thanh_id: null,
      donVi: [],
      loaiPhuongTienPccc: [],
      donViPccc: [],
      filteredDonViPccc: [],
      rules: {
        ten: [
          {
            required: true,
            message: "Hãy nhập tên phương tiện pccc",
            trigger: "blur"
          }
        ],
        don_vi_pccc_quan_ly: [
          {
            required: true,
            message: "Chọn đơn vị trực thuộc",
            trigger: "blur"
          }
        ],
        quan_huyen_id: [
          {
            required: true,
            message: "Chọn một quận huyện",
            trigger: "blur"
          }
        ],
        so_hieu: [
          {
            required: true,
            message: "Hãy nhập số hiệu phương tiện pccc",
            trigger: "blur"
          }
        ],
        bien_so: [
          {
            required: true,
            message: "Hãy nhập biển số phương tiện pccc",
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
        don_vi_pccc_id: [
          {
            required: true,
            message: "Hãy chọn một đơn vị PCCC",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    donVipc: { type: Object },
    showAll: { type: Boolean }
  },
  methods: {
    async getData(page = 1, per_page = 5) {
      this.loading = true;
      const data = await getPT({
        page: this.page,
        per_page: this.per_page,
        don_vi_pccc_id: this.don_vi_id,
        quan_huyen_id: this.quan_huyen_id,
        tinh_thanh_id: this.tinh_thanh_id
      });
      this.loading = false;
      this.tableData = data.data.data;
      this.page = data.data.current_page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.$emit("getSoLuong", this.total);
    },
    async getQuanHuyen(tinhThanhId) {
      let data = await getQuanHuyenTheoTinh({ tinh_thanh_id: tinhThanhId });
      this.quanHuyens = data.data;
    },
    async getLoaiPhuongTienPccc() {
      let data = await getDanhMucCon({ ma: "LPTPCCC" });
      this.loaiPhuongTienPccc = data.data;
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
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
    changTrucThuoc() {
      if(this.form.don_vi_pccc_quan_ly){
        this.form.quan_huyen_id = null
      }else {
        this.form.don_vi_pccc_id = null
      }
      // this.form.don_vi_pccc_id = '',
      // this.form.quan_huyen_id = ''
    },
    showFormUpdate(data) {
      this.editing = true;
      this.currentId = data.id;
      this.form.bien_so = data.bien_so;
      this.form.ten = data.ten;
      this.form.loai_phuong_tien_pccc_id = data.loai_phuong_tien_pccc_id;
      this.form.so_dien_thoai = data.so_dien_thoai;
      this.form.don_vi_pccc_id = data.don_vi_pccc_id;
      this.form.so_hieu = data.so_hieu;
      this.form.imei = data.imei;
      this.form.tinh_thanh_id = data.tinh_thanh_id;
      this.form.trang_thai_hoat_dong = data.trang_thai_hoat_dong;
      this.form.don_vi_pccc_quan_ly = data.don_vi_pccc_quan_ly;
      this.form.quan_huyen_id = data.quan_huyen_id;
      this.filterDonVi(this.form.tinh_thanh_id);
      this.showDialog = true;
    },
    searchData(page = 1, per_page = 5) {
      this.loading = true;
      if (this.don_vi_id !== null) {
        getPT({
          page: this.page,
          per_page: this.per_page,
          search: this.search,
          don_vi_pccc_id: this.don_vi_id,
          tinh_thanh_id: this.tinh_thanh_id
        }).then(response => {
          this.tableData = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.loading = false;
        });
      }
      if (this.don_vi_id == null && this.quan_huyen_id == null) {
        getPT({
          page: this.page,
          per_page: this.per_page,
          search: this.search,
          tinh_thanh_id: this.tinh_thanh_id
        }).then(response => {
          this.tableData = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.loading = false;
        });
      }
      if (this.quan_huyen_id !== null) {
        getPT({
          page: this.page,
          per_page: this.per_page,
          search: this.search,
          quan_huyen_id: this.quan_huyen_id,
          tinh_thanh_id: this.tinh_thanh_id
        }).then(response => {
          this.tableData = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.loading = false;
        });
      }
      this.loading = false;
    },
    showFormCreate() {
      this.editing = false;
      this.showDialog = true;
      this.form = {
        bien_so: "",
        ten: "",
        loai_phuong_tien_pccc_id: "",
        so_dien_thoai: "",
        don_vi_pccc_id: "",
        so_hieu: "",
        imei: "",
        tinh_thanh_id: "",
        trang_thai_hoat_dong: "Tốt",
        don_vi_pccc_quan_ly: true
      };
      this.getInfor();
    },
    async getAllDonVi() {
      this.load = true;
      let data = await getAllDonViPccc();
      this.donVi = data.data.data;
      this.load = false;
    },
    async update() {
      try {
        this.btnLoading = true;
        await updatePhuongTienPccc(this.currentId, this.form);
        this.btnLoading = false;
        this.showDialog = false;
        this.$message({
          message: "Cập nhật dữ liệu thành công!",
          type: "success"
        });
        this.getAllDonVi();
        this.loading = true;
        if (this.don_vi_id !== null) {
          let data = await getPT({
            page: this.page,
            per_page: this.per_page,
            don_vi_pccc_id: this.don_vi_id
          });
          this.tableData = data.data.data;
          this.page = data.data.current_page;
          this.per_page = data.data.per_page;
          this.total = data.data.total;
        }
        if (this.quan_huyen_id === null && this.don_vi_id === null) {
          let data = await getPT({
            page: this.page,
            per_page: this.per_page
          });
          this.tableData = data.data.data;
          this.page = data.data.current_page;
          this.per_page = data.data.per_page;
          this.total = data.data.total;
        }
        if (this.quan_huyen_id !== null) {
          let data = await getPT({
            page: this.page,
            per_page: this.per_page,
            quan_huyen_id: this.quan_huyen_id
          });
          this.tableData = data.data.data;
          this.page = data.data.current_page;
          this.per_page = data.data.per_page;
          this.total = data.data.total;
        }
        this.loading = false;
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async create() {
      try {
        this.btnLoading = true;
        await storePhuongTienPccc(this.form);
        this.btnLoading = false;
        this.showDialog = false;
        this.$message({
          message: "Thêm dữ liệu thành công!",
          type: "success"
        });
        this.getAllDonVi();
        this.loading = true;
        if (this.don_vi_id !== null) {
          let data = await getPT({
            page: this.page,
            per_page: this.per_page,
            don_vi_pccc_id: this.don_vi_id
          });
          this.tableData = data.data.data;
          this.page = data.data.current_page;
          this.per_page = data.data.per_page;
          this.total = data.data.total;
        }
        if (this.quan_huyen_id === null && this.don_vi_id === null) {
          let data = await getPT({
            page: this.page,
            per_page: this.per_page
          });
          this.tableData = data.data.data;
          this.page = data.data.current_page;
          this.per_page = data.data.per_page;
          this.total = data.data.total;
        }
        if (this.quan_huyen_id !== null) {
          let data = await getPT({
            page: this.page,
            per_page: this.per_page,
            quan_huyen_id: this.quan_huyen_id
          });
          this.tableData = data.data.data;
          this.page = data.data.current_page;
          this.per_page = data.data.per_page;
          this.total = data.data.total;
        }
        this.loading = false;
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async destroy(id) {
      try {
        await this.$confirm(
          "Bạn có chắc chắn muốn xóa phương tiện pccc này",
          "Xóa phương tiện PCCC",
          {
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        await destroyPhuongTienPccc(id);
        this.$message({
          message: "Xóa dữ liệu thành công!",
          type: "success"
        });
        this.getAllDonVi();
        this.loading = true;
        if (this.don_vi_id !== null) {
          let data = await getPT({
            page: this.page,
            per_page: this.per_page,
            don_vi_pccc_id: this.don_vi_id
          });
          this.tableData = data.data.data;
          this.page = data.data.current_page;
          this.per_page = data.data.per_page;
          this.total = data.data.total;
        }
        if (this.quan_huyen_id === null && this.don_vi_id === null) {
          let data = await getPT({
            page: this.page,
            per_page: this.per_page
          });
          this.tableData = data.data.data;
          this.page = data.data.current_page;
          this.per_page = data.data.per_page;
          this.total = data.data.total;
        }
        if (this.quan_huyen_id !== null) {
          let data = await getPT({
            page: this.page,
            per_page: this.per_page,
            quan_huyen_id: this.quan_huyen_id
          });
          this.tableData = data.data.data;
          this.page = data.data.current_page;
          this.per_page = data.data.per_page;
          this.total = data.data.total;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.create();
        } else {
          return false;
        }
      });
    },
    async getDonViPccc() {
      let data = await getDonViPccc();
      this.donViPccc = data.data;
    },
    async getTinhThanh() {
      let data = await getTinhThanh();
      this.tinhThanhs = data.data;
    },
    async getInfor() {
      let data = await getInfor();
      this.role = data.data.role_id;
      if (data.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        this.form.tinh_thanh_id = data.data.tinh_thanh_id;
        this.filterDonVi(this.form.tinh_thanh_id);
      } else {
        this.disabledTinhThanh = false;
      }
    },
    filterDonVi(id) {
      this.filteredDonViPccc = [
        ...this.donViPccc.filter(item => item.tinh_thanh_id == id)
      ];
      this.getQuanHuyen(id);
      if (this.form.don_vi_pccc_quan_ly) {
        this.quan_huyen_id = null;
      }
    }
  },
  created() {
    this.getLoaiPhuongTienPccc();
    this.getDonViPccc();
    this.getAllDonVi();
    this.getInfor();
    this.getTinhThanh();
    this.$emit("getSoLuong", false);
    this.getData();
  },
  watch: {
    async showAll(val) {
      if (val) {
        this.getLoaiPhuongTienPccc();
        this.getDonViPccc();
        this.getAllDonVi();
        this.getInfor();
        this.getTinhThanh();
        this.$emit("getSoLuong", false);
        let data = await getPT({
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

    async donVipc(val) {
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
        data = await getPT({
          page: this.page,
          per_page: this.per_page,
          tinh_thanh_id: val.id
        });
      }
      if (val.quan_huyen_id !== undefined) {
        this.quan_huyen_id = null;
        this.tinh_thanh_id = null
        this.don_vi_id = val.id;
        data = await getPT({
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
        data = await getPT({
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
  }
};
</script>
<style lang="css">
.el-dialog {
  width: 40%;
}
@media (max-width: 768px) {
  .el-dialog {
    width: 70%;
  }
  .el-input-form {
    margin-bottom: 10px;
  }
}
</style>
