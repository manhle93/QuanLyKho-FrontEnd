<template>
  <div class="app-container">
    <el-row>
      <el-select
        class="el-input-form"
        v-model="search.tinh_thanh"
        v-if="!disabledTinhThanh"
        filterable
        clearable
        placeholder="Chọn tỉnh thành"
      >
        <el-option
          v-for="tinhThanh in tinhThanhs"
          :key="tinhThanh.id"
          :label="tinhThanh.name"
          :value="tinhThanh.id"
        ></el-option>
      </el-select>
      <el-input
        placeholder="Nhập số hiệu phương tiện pccc"
        clearable
        style="width:250px"
        v-model="search.so_hieu"
        class="input-with-select el-input-form"
      ></el-input>
      <el-input
        placeholder="Nhập biển số phương tiện pccc"
        clearable
        style="width:300px"
        v-model="search.bien_so"
        class="input-with-select el-input-form"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getData(pagination.per_page, 1,search.tinh_thanh,search.so_hieu,search.bien_so)"
        ></el-button>
      </el-input>
      <el-button type="primary" @click="showFormCreate" style="float:right">Thêm phương tiện pccc</el-button>
    </el-row>
    <h4 v-if="timKiem">Kết quả tìm kiếm</h4>
    <el-row style="margin-top:30px" v-if="timKiem">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" border>
        <el-table-column label="STT" align="center" type="index" width="50"></el-table-column>
        <el-table-column label="Tên" prop="ten"></el-table-column>
        <el-table-column label="Số hiệu" prop="so_hieu"></el-table-column>
        <el-table-column label="Biển số" prop="bien_so"></el-table-column>
        <el-table-column label="SĐT" prop="so_dien_thoai"></el-table-column>
        <el-table-column label="Loại phương tiện pccc" prop="loai_phuong_tien_pccc"></el-table-column>
        <el-table-column label="Đơn vị" prop="don_vi_pccc"></el-table-column>
        <el-table-column label="IMEI thiết bị" prop="imei"></el-table-column>
        <el-table-column label="Hành động" align="center" width="110">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
              <el-button
                size="medium"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showFormUpdate(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
              <el-button
                size="medium"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="destroy(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top:20px">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.current_page"
          :page-size="5"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-row>
    <h4>Danh sách phương tiện PCCC</h4>
    <el-row>
      <el-collapse accordion v-loading="load">
        <el-collapse-item v-for="(dv, index) in donVi" :name="index +1" :key="index">
          <template slot="title">
            +
            <img
              src="http://pcccapi.howizbiz.com/storage/images/avatar/1570527931.png"
              style="width: 30px; height: 30px"
            />
            <label style="margin-left: 10px; margin-right: 10px">{{dv.ten}}</label>
            <el-tag size="small" effect="dark">{{dv.phuong_tien.length}} Xe</el-tag>
          </template>
          <div>
            <el-row style="margin-bottom: 10px">
              <el-button
                type="primary"
                icon="el-icon-location"
                size="mini"
                circle
                style="margin-left: 10px"
              ></el-button>
              <span style="font-size: 12px; font-weight: bold;margin-left: 5px">{{dv.dia_chi}}</span>
            </el-row>
            <el-row>
              <el-button
                type="success"
                icon="el-icon-phone"
                size="mini"
                style="margin-left: 10px"
                circle
              ></el-button>
              <span style="font-size: 12px; font-weight: bold;margin-left: 5px">{{dv.so_dien_thoai}}</span>
            </el-row>
            <br />
            <el-table :data="dv.phuong_tien" v-loading="loading" style="width: 100%" border>
              <el-table-column label="STT" align="center" type="index" width="50"></el-table-column>
              <el-table-column label="Tên" prop="ten"></el-table-column>
              <el-table-column label="Số hiệu" prop="so_hieu"></el-table-column>
              <el-table-column label="Biển số" prop="bien_so"></el-table-column>
              <el-table-column label="SĐT" prop="so_dien_thoai"></el-table-column>
              <el-table-column label="Loại phương tiện pccc" prop="loai_phuong_tien_pccc.ten"></el-table-column>
              <el-table-column label="Đơn vị" prop="don_vi_pccc.ten"></el-table-column>
              <el-table-column label="IMEI thiết bị" prop="imei"></el-table-column>
              <el-table-column label="Hành động" align="center" width="110">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
                    <el-button
                      size="medium"
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      @click="showFormUpdate(scope.row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
                    <el-button
                      size="medium"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="destroy(scope.row.id)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <el-dialog
      :title="editing?'Cập nhật phương tiện pccc':'Thêm phương tiện pccc'"
      :visible.sync="showDialog"
      center
    >
      <el-form label-position="top" :rules="rules" ref="form" :model="form">
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
        <el-row>
          <el-col :span="11">
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
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="Đơn vị PCCC" prop="don_vi_pccc_id">
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
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">Hủy</el-button>
        <el-button v-if="editing" type="primary" :loading="btnLoading" @click="update">Cập nhật</el-button>
        <el-button v-else :loading="btnLoading" type="primary" @click="submit">Thêm</el-button>
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
import { getInfor } from "@/api/taikhoan";
export default {
  data() {
    return {
      disabledTinhThanh: true,
      tableData: [],
      load: false,
      timKiem: false,
      loading: false,
      showDialog: false,
      src: process.env.VUE_APP_BASE,
      search: {
        tinh_thanh: "",
        so_hieu: "",
        bien_so: ""
      },
      btnLoading: false,
      pagination: {},
      currentId: "",
      editing: false,
      tinhThanh: "",
      tinhThanhs: [],
      form: {
        bien_so: "",
        ten: "",
        loai_phuong_tien_pccc_id: "",
        so_dien_thoai: "",
        don_vi_pccc_id: "",
        so_hieu: "",
        imei: "",
        tinh_thanh_id: "",
        trang_thai_hoat_dong: ""
      },
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
            message: "Hãy nhập số hiệu phương tiện pccc",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async getData(
      per_page = null,
      page = 1,
      tinh_thanh = null,
      so_hieu = null,
      bien_so = null
    ) {
      try {
        this.loading = true;
        this.timKiem = true;
        if (
          this.search.bien_so == "" &&
          this.search.tinh_thanh == "" &&
          this.search.so_hieu == ""
        ) {
          this.timKiem = false;
        }
        let data = await index({
          per_page,
          page,
          tinh_thanh,
          so_hieu,
          bien_so
        });
        this.tableData = data.data;
        this.pagination = data.meta;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async getLoaiPhuongTienPccc() {
      let data = await getDanhMucCon({ ma: "LPTPCCC" });
      this.loaiPhuongTienPccc = data.data;
    },
    handleCurrentChange(val) {
      this.getData(
        this.pagination.per_page,
        val,
        this.search.tinh_thanh,
        this.search.so_hieu,
        this.search.bien_so
      );
    },
    handleSizeChange(val) {
      this.getData(
        val,
        1,
        this.search.tinh_thanh,
        this.search.so_hieu,
        this.search.bien_so
      );
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
      this.filterDonVi(this.form.tinh_thanh_id);
      this.showDialog = true;
      console.log(data);
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
        trang_thai_hoat_dong: "Tốt"
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
        this.getData(
          this.pagination.per_page,
          this.pagination.current_page,
          this.search.tinh_thanh,
          this.search.so_hieu,
          this.search.bien_so
        );
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
        this.getData(
          this.pagination.per_page,
          this.pagination.current_page,
          this.search.tinh_thanh,
          this.search.so_hieu,
          this.search.bien_so
        );
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async destroy(id) {
      try {
        await this.$confirm(
          "Bạn có chắc chắn muốn xóa phương tiện pccc này",
          "Warning",
          {
            confirmButtonText: "Xóa",
             dangerouslyUseHTMLString: true,
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
        this.getData(
          this.pagination.per_page,
          this.pagination.current_page,
          this.search.tinh_thanh,
          this.search.so_hieu,
          this.search.bien_so
        );
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
    }
  },
  created() {
    this.getLoaiPhuongTienPccc();
    this.getDonViPccc();
    this.getAllDonVi();
    this.getInfor();
    this.getTinhThanh();
  },
  watch: {
    tinhThanh: function(val) {
      this.filteredDonViPccc = [
        ...this.donViPccc.filter(item => item.tinh_thanh_id == val)
      ];
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
