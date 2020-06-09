<template>
  <div class="app-container">
    <el-row :gutter="20" justify="space-around">
      <el-col :span="3">
        <el-input
          placeholder="Nhập mã cảm biến"
          clearable
          style="width:150"
          v-model="form.search"
          size="small"
        ></el-input>
      </el-col>
      <el-col :span="3">
        <el-select
          size="small"
          clearable
          v-model="form.loai_cam_bien_id"
          placeholder="Chọn loại cảm biến"
        >
          <el-option v-for="item in loaiCamBien" :key="item.id" :label="item.ten" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          size="small"
          v-model="form.trang_thai_id"
          clearable
          placeholder="Chọn trạng thái cảm biến"
        >
          <el-option v-for="item in trangThai" :key="item.id" :label="item.ten" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button size="small" class="primary-button" icon="el-icon-search" @click="searchData()">Tìm kiếm</el-button>
      </el-col>
      <el-col :span="3" :offset="9">
        <el-button
        style="float:right"
          size="small"
          class="primary-button"
          @click="showFormCreate"
          icon="el-icon-plus"
        >Thêm cảm biến</el-button>
      </el-col>
    </el-row>
    <h4>Danh sách cảm biến</h4>
    <el-row style="margin-top:30px">
      <el-table :data="tableData" v-loading="loading" style="width: 100%; font-size: 13px" border>
        <el-table-column label="Loại cảm biến" min-width="103" prop="loai_cam_bien"></el-table-column>
        <el-table-column label="Mã" prop="ma" min-width="103"></el-table-column>
        <el-table-column label="IMEI" prop="IMEI_thiet_bi" min-width="103"></el-table-column>
        <el-table-column label="Vị trí lắp đặt" min-width="82" prop="vi_tri"></el-table-column>
        <el-table-column label="Số lần" prop="so_lan" min-width="65"></el-table-column>
        <el-table-column label="Mô tả" prop="mo_ta" min-width="137"></el-table-column>
        <el-table-column label="Ngày triển khai" prop="ngay_trien_khai" min-width="89"></el-table-column>
        <el-table-column label="Ngày hết hạn" prop="ngay_het_han" min-width="82"></el-table-column>
        <el-table-column label="Trạng thái" prop="trang_thai" min-width="82"></el-table-column>
        <el-table-column label="Thiết bị" prop="thiet_bi" min-width="82"></el-table-column>
        <el-table-column label="Hành động" align="center" width="110" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
              <el-button
                size="small"
                class="primary-button"
                icon="el-icon-edit"
                circle
                @click="showFormUpdate(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="destroy(scope.row)"
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
    <el-dialog :title="editing?'Cập nhật thông tin cảm biến':'Thêm cảm biến'" :visible.sync="showDialog" center>
      <el-form :rules="rules" ref="form" :model="form">
        <el-row :gutter="20">
          <el-col :sm="{span:12}">
            <el-form-item label="Loại cảm biến">
              <el-select
                v-model="form.loai_cam_bien_id"
                style="width:100%"
                placeholder="Chọn loại cảm biến"
              >
                <el-option
                  v-for="item in loaiCamBien"
                  :key="item.id"
                  :label="item.ten"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="{span:12}">
            <el-form-item label="Mã cảm biến" prop="ma">
              <el-input placeholder="Nhập mã cảm biến" v-model="form.ma"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="{span:12}">
            <el-form-item label="IMEI thiết bị" prop="IMEI_thiet_bi">
              <el-input placeholder="Nhập số IMEI thiết bị" v-model="form.IMEI_thiet_bi"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="{span:12}">
            <el-form-item label="Vị trí lắp đặt">
              <el-input placeholder="Nhập vị trí lắp đặt" v-model="form.vi_tri"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="{span:12}">
            <el-form-item label="Số lần">
              <el-input placeholder="Nhập số lần" v-model="form.so_lan"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="{span:12}">
            <el-form-item label="Trạng thái">
              <el-select
                v-model="form.trang_thai_id"
                style="width:100%"
                placeholder="Chọn trạng thái cảm biến"
              >
                <el-option
                  v-for="item in trangThai"
                  :key="item.id"
                  :label="item.ten"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="{span:12}">
            <el-form-item label="Ngày triển khai">
              <el-date-picker
                type="date"
                style="width:100%"
                placeholder="Nhập ngày triển khai"
                v-model="form.ngay_trien_khai"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="{span:12}">
            <el-form-item label="Ngày hết hạn">
              <el-date-picker
                type="date"
                style="width:100%"
                placeholder="Nhập ngày hết hạn"
                v-model="form.ngay_het_han"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Mô tả">
              <el-input type="textarea" :rows="2" placeholder="Mô tả cảm biến" v-model="form.mo_ta"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false" type="warning" icon="el-icon-close">Hủy</el-button>
        <el-button v-if="editing" class="primary-button" :loading="btnLoading" icon="el-icon-check" @click="update">Cập nhật</el-button>
        <el-button v-else :loading="btnLoading" class="primary-button" icon="el-icon-plus" @click="submit">Thêm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  index,
  updateCamBien,
  storeCamBien,
  destroyCamBien
} from "@/api/cambien";
import { getDanhMucCon } from "@/api/danhmuc";
export default {
  data() {
    return {
      search: "",
      tableData: [],
      loading: false,
      showDialog: false,
      btnLoading: false,
      pagination: {},
      currentId: "",
      editing: false,
      form: {
        ma: "",
        loai_cam_bien_id: "",
        IMEI_thiet_bi: "",
        mo_ta: "",
        vi_tri: "",
        so_lan: "",
        trang_thai_id: "",
        ngay_trien_khai: "",
        ngay_het_han: ""
      },
      loaiCamBien: [],
      trangThai: [],
      rules: {
        IMEI_thiet_bi: [
          {
            required: true,
            message: "Hãy nhập cảm biến",
            trigger: "blur"
          }
        ],
        ma: [
          {
            required: true,
            message: "Hãy nhập mã cảm biến",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async getData(per_page = null, page = null, ma = null) {
      try {
        this.loading = true;
        let data = await index({ per_page, page, ma });
        this.tableData = data.data;
        this.pagination = data.meta;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      index(this.form).then(response => {
        this.tableData = response.data;
        this.pagination = response.meta;
        //console.log(this.pagination.total);

        this.listLoading = false;
      });
    },
    async getLoaiCamBien() {
      let data = await getDanhMucCon({ ma: "LCB" });
      this.loaiCamBien = data.data;
    },
    async getTrangThai() {
      let data = await getDanhMucCon({ ma: "TTCB" });
      this.trangThai = data.data;
    },
    handleCurrentChange(val) {
      this.getData(this.pagination.per_page, val, this.ma);
    },
    handleSizeChange(val) {
      this.getData(val, 1, this.ma);
    },
    showFormUpdate(data) {
      this.editing = true;
      this.currentId = data.id;
      this.form.ma = data.ma;
      this.form.IMEI_thiet_bi = data.IMEI_thiet_bi;
      this.form.loai_cam_bien_id = data.loai_cam_bien_id;
      this.form.mo_ta = data.mo_ta;
      this.form.vi_tri = data.vi_tri;
      this.form.so_lan = data.so_lan;
      this.form.trang_thai_id = data.trang_thai_id;
      this.form.ngay_trien_khai = data.ngay_trien_khai;
      this.form.ngay_het_han = data.ngay_het_han;
      this.showDialog = true;
    },
    showFormCreate() {
      this.editing = false;
      this.form.IMEI_thiet_bi = "";
      this.form.ma = "";
      this.form.loai_cam_bien_id = "";
      this.form.mo_ta = "";
      this.form.vi_tri = "";
      this.form.so_lan = "";
      this.form.trang_thai_id = "";
      this.form.ngay_trien_khai = "";
      this.form.ngay_het_han = "";
      this.showDialog = true;
    },
    async update() {
      try {
        this.btnLoading = true;
        await updateCamBien(this.currentId, this.form);
        this.btnLoading = false;
        this.showDialog = false;
        this.$message({
          message: "Cập nhật dữ liệu thành công!",
          type: "success"
        });
        this.getData(
          this.pagination.per_page,
          this.pagination.current_page,
          this.ma
        );
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async create() {
      try {
        this.btnLoading = true;
        await storeCamBien(this.form);
        this.btnLoading = false;
        this.showDialog = false;
        this.$message({
          message: "Thêm mới dữ liệu thành công!",
          type: "success"
        });
        this.getData(
          this.pagination.per_page,
          this.pagination.current_page,
          this.ma
        );
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async destroy(data) {
      try {
        await this.$confirm(
          "Bạn có chắc chắn muốn xóa: " +  "<strong>" + data.loai_cam_bien +  "</strong>" + " -  Vị trí " + "<strong>" +  data.vi_tri + "</strong>",
          "Xóa cảm biến",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        await destroyCamBien(data.id);
        this.$message({
          message: "Xóa dữ liệu thành công!",
          type: "success"
        });
        this.getData(
          this.pagination.per_page,
          this.pagination.current_page,
          this.ma
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
    }
  },
  created() {
    this.getData();
    this.getLoaiCamBien();
    this.getTrangThai();
  }
};
</script>
<style lang="css">
.btnWidth {
  width: fit-content;
}
@media (max-width: 768px) {
  .el-input-form {
    margin-bottom: 10px;
  }
}
.el-dialog {
  width: 40%;
}

@media (max-width: 768px) {
  .el-dialog {
    width: 70%;
  }
}
</style>
