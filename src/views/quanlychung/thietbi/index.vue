<template>
  <div class="app-container">
    <el-row>
      <el-select
        size="small"
        v-model="search.mode"
        placeholder="Chọn chế độ"
        clearable
        @change="
          search.toa_nha = '';
          search.don_vi_pccc = '';
          search.tinh_thanh = '';
        "
      >
        <el-option value="don_vi_pccc" label="Đơn vị PCCC" />
        <el-option
          v-if="role != 'quan_ly_tinh_thanh'"
          value="tinh_thanh"
          label="Tỉnh thành"
        />
        <el-option value="toa_nha" label="Tòa nhà" />
      </el-select>
      <el-select
        v-if="search.mode == 'toa_nha'"
        v-model="search.toa_nha"
        placeholder="Chọn giá trị"
        filterable
        clearable
      >
        <el-option
          v-for="item in options.toa_nha"
          :key="item.id"
          :label="item.ten"
          :value="item.id"
        />
      </el-select>
      <el-select
        size="small"
        v-if="search.mode == 'don_vi_pccc'"
        v-model="search.don_vi_pccc"
        placeholder="Chọn giá trị"
        filterable
        clearable
      >
        <el-option
          v-for="item in options.don_vi_pccc"
          :key="item.id"
          :label="item.ten"
          :value="item.id"
        />
      </el-select>
      <el-select
        size="small"
        v-if="search.mode == 'tinh_thanh'"
        v-model="search.tinh_thanh"
        placeholder="Chọn giá trị"
        filterable
        clearable
      >
        <el-option
          v-for="item in options.tinh_thanh"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        size="small"
        v-model="ma"
        placeholder="Nhập tên, IMEI hoặc mã thiết bị"
        clearable
        class="input-with-select"
        @keyup.enter.native="
          getData(
            pagination.per_page,
            1,
            ma,
            search.tinh_thanh,
            search.don_vi_pccc,
            search.toa_nha
          )
        "
      ></el-input>
      <el-button
        class="primary-button"
        size="small"
        icon="el-icon-search"
        @click="
          getData(
            pagination.per_page,
            1,
            ma,
            search.tinh_thanh,
            search.don_vi_pccc,
            search.toa_nha
          )
        "
        >Tìm kiếm</el-button
      >
      <el-button
        size="small"
        class="btn btnexcel"
        type="warning"
        :loading="btnLoading"
        icon="el-icon-download"
        @click="excel"
        >Xuất Excel</el-button
      >
      <input
        ref="upload-image"
        class="upload-image"
        type="file"
        @change="handleChange($event)"
      />
      <el-button
        class="primary-button btn"
        style="float:right"
        icon="el-icon-plus"
        @click="showFormCreate"
        size="small"
        >Thêm thiết bị</el-button
      >
    </el-row>
    <h5>Nhập dữ liệu từ excel</h5>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-tooltip
          class="item"
          effect="dark"
          content="Tải xuống file Excel mẫu"
          placement="top"
        >
          <el-button
            size="mini"
            class="primary-button block"
            :icon="iconDowload"
            @click="downloadMau"
            >Tải file mẫu</el-button
          >
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Chọn file để tải lên"
          placement="top"
        >
          <el-button
            :disabled="loadingUpload"
            size="mini"
            type="warning"
            class="block"
            :icon="iconUpload"
            @click="handleUpload"
            >Nhập từ Excel</el-button
          >
        </el-tooltip>
      </el-col>
    </el-row>
    <h4>Danh sách thiết bị</h4>
    <el-row style="margin-top:30px">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; font-size: 13px"
        border
      >
        <el-table-column label="STT" align="center" type="index" width="50" />
        <el-table-column label="Mã" prop="ma" width="100" />
        <el-table-column label="Tên" prop="ten" width="150" />
        <el-table-column label="IMEI" prop="imei" width="150" />
        <el-table-column prop="online" label="Online" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.online === true ? 'success' : 'warning'"
              disable-transitions
              >{{ scope.row.online ? "Online" : "Offline" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="Tỉnh thành" min-width="100" prop="tinh_thanh" />
        <el-table-column
          label="Đơn vị PCCC"
          min-width="200"
          prop="don_vi_pccc"
        />
        <el-table-column
          label="Loại thiết bị"
          min-width="180"
          prop="loai_thiet_bi"
        />
        <el-table-column label="Tòa nhà" min-width="200" prop="toa_nha" />
        <el-table-column label="Địa chỉ" min-width="180" prop="dia_chi" />
        <el-table-column label="Cảm biến" min-width="120">
          <template slot-scope="scope">
            <p v-for="item in scope.row.cam_bien" :key="item.id">
              {{ item.ma }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="Hành động"
          fixed="right"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="Cập nhật"
              placement="top"
            >
              <el-button
                size="small"
                icon="el-icon-edit"
                class="primary-button"
                circle
                @click="showFormUpdate(scope.row)"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Cảm biến">
              <el-button
                size="small"
                type="success"
                icon="el-icon-setting"
                circle
                @click="showThemCamBien(scope.row.id, scope.row.cam_bien)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Xóa"
              placement="top"
            >
              <el-button
                size="small"
                icon="el-icon-delete"
                circle
                type="danger"
                @click="destroy(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top:20px">
        <el-pagination
          background
          :current-page.sync="pagination.current_page"
          :page-size="5"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
    <el-dialog
      :title="editing ? 'Cập nhật thông tin' : 'Thêm thiết bị'"
      :visible.sync="showDialog"
      center
    >
      <el-form ref="form" :rules="rules" :model="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Mã thiết bị" prop="ma">
              <el-input v-model="form.ma" placeholder="Nhập mã thiết bị" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tên thiết bị" prop="ten">
              <el-input v-model="form.ten" placeholder="Nhập tên thiết bị" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IMEI" prop="imei">
              <el-input v-model="form.imei" placeholder="Nhập IMEI" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Loại thiết bị">
              <el-select
                v-model="form.loai_thiet_bi_id"
                style="width:100%"
                placeholder="Chọn loại thiết bị"
              >
                <el-option
                  v-for="item in loaiThietBi"
                  :key="item.id"
                  :label="item.ten"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tòa nhà">
              <el-select
                v-model="form.toa_nha_id"
                filterable
                style="width:100%"
                placeholder="Chọn tòa nhà"
              >
                <el-option
                  v-for="item in toaNha"
                  :key="item.id"
                  :label="item.ten"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ" prop="dia_chi">
              <el-input v-model="form.dia_chi" placeholder="Nhập địa chỉ" />
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="Khách hàng">
          <el-select
            v-model="form.user_id"
            style="width:100%"
            clearable
            filterable
            placeholder="Khách hàng"
          >
            <el-option
              v-for="item in khachHang"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
          <el-col :span="24">
            <el-form-item label="Mô tả">
              <el-input
                v-model="form.mo_ta"
                type="textarea"
                :rows="2"
                placeholder="Mô tả thiết bị"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          @click="showDialog = false"
          icon="el-icon-close"
          type="warning"
          >Hủy</el-button
        >
        <el-button
          v-if="editing"
          class="primary-button"
          :loading="btnLoading"
          icon="el-icon-check"
          @click="update"
          >Cập nhật</el-button
        >
        <el-button
          v-else
          :loading="btnLoading"
          class="primary-button"
          icon="el-icon-plus"
          @click="submit"
          >Thêm</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Cảm biến"
      :visible.sync="showCamBienDialog"
      width="30%"
      center
    >
      <el-table
        ref="multipleTable"
        v-loading="loading1"
        :data="tableData1"
        style="width: 100%"
        height="400"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="ma" label="Mã cảm biến" />
        <el-table-column prop="IMEI_thiet_bi" label="IMEI" />
        <el-table-column prop="vi_tri" label="Vị trí" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="toggleSelection()"
          icon="el-icon-close"
          type="warning"
          >Xóa lựa chọn</el-button
        >
        <el-button
          :loading="btnLoading"
          class="primary-button"
          @click="updateThietBiCamBien"
          icon="el-icon-check"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  index,
  updateThietBi,
  storeThietBi,
  destroyThietBi,
  getCamBien,
  addCamBien,
  getToaNha,
  exportExcel,
  uploadThietBi
} from "@/api/thietbi";
import { getTinhThanh } from "@/api/TinhThanh";
import { getAllToaNha } from "@/api/toanha";
import { getDanhMucCon } from "@/api/danhmuc";
import { getAllDonViPccc } from "@/api/donvipccc";
import { getKhachHang, getInfor } from "@/api/user";
import axios from "axios";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      ma: "",
      search: {
        mode: "",
        don_vi_pccc: "",
        tinh_thanh: "",
        toa_nha: ""
      },
      options: {
        tinh_thanh: [],
        toa_nha: [],
        don_vi_pccc: []
      },
      iconDowload: "el-icon-bottom",
      iconUpload: "el-icon-upload",
      loadingUpload: false,
      user: {},
      tableData: [],
      tableData1: [],
      loading: false,
      showDialog: false,
      showCamBienDialog: false,
      btnLoading: false,
      pagination: {},
      currentId: "",
      loading1: false,
      editing: false,
      camBien: [],
      toaNha: [],
      khachHang: [],
      form: {
        ten: "",
        ma: "",
        loai_thiet_bi_id: "",
        imei: "",
        mo_ta: "",
        toa_nha_id: "",
        dia_chi: "",
        user_id: ""
      },
      loaiThietBi: [],
      rules: {
        ten: [
          {
            required: true,
            message: "Hãy nhập tên thiết bị",
            trigger: "blur"
          }
        ],
        ma: [
          {
            required: true,
            message: "Hãy nhập mã thiết bị",
            trigger: "blur"
          }
        ],
        imei: [
          {
            required: true,
            message: "Hãy nhập imei thiết bị",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    role() {
      return this.$store.state.user.roles[0];
    }
  },
  created() {
    this.getData();
    this.getLoaiThietBi();
    // console.log(this.role);
    this.getToaNha();
    this.getOptions();
  },
  methods: {
    async getData(
      per_page = null,
      page = null,
      ma = null,
      tinh_thanh = null,
      don_vi_pccc = null,
      toa_nha = null
    ) {
      try {
        this.loading = true;
        const data = await index({
          per_page,
          page,
          ma,
          tinh_thanh,
          don_vi_pccc,
          toa_nha
        });
        this.tableData = data.data;
        this.pagination = data.meta;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async getLoaiThietBi() {
      const data = await getDanhMucCon({ ma: "LTB" });
      this.loaiThietBi = data.data;
    },
    handleCurrentChange(val) {
      this.getData(
        this.pagination.per_page,
        val,
        this.ma,
        this.search.tinh_thanh,
        this.search.don_vi_pccc,
        this.search.toa_nha
      );
    },
    async downloadMau() {
      const data = await getInfor();
      if (data.data.tinhthanh != null) {
        var tinh_thanh_id = data.data.tinhthanh.id;
        window.location.assign(
          process.env.VUE_APP_BASE_API +
            "downloadmauthietbi?tinh_thanh_id=" +
            tinh_thanh_id
        );
      } else {
        window.location.assign(
          process.env.VUE_APP_BASE_API + "downloadmauthietbi"
        );
      }
    },
    handleSizeChange(val) {
      this.getData(
        val,
        1,
        this.ma,
        this.search.tinh_thanh,
        this.search.don_vi_pccc,
        this.search.toa_nha
      );
    },
    showFormUpdate(data) {
      this.editing = true;
      this.currentId = data.id;
      this.form.ma = data.ma;
      this.form.ten = data.ten;
      this.form.toa_nha_id = data.toa_nha_id;
      this.form.loai_thiet_bi_id = data.loai_thiet_bi_id;
      this.form.mo_ta = data.mo_ta;
      this.form.imei = data.imei;
      this.showDialog = true;
      this.getKhachHang(this.form.toa_nha_id);
      this.form.user_id = data.user_id;
    },
    showFormCreate() {
      this.editing = false;
      for (const field in this.form) {
        this.form[field] = "";
      }
      this.showDialog = true;
    },
    async update() {
      try {
        this.btnLoading = true;
        await updateThietBi(this.currentId, this.form);
        this.btnLoading = false;
        this.showDialog = false;
        this.$message({
          message: "Cập nhật thành công!",
          type: "success"
        });
        this.getData(
          this.pagination.per_page,
          this.pagination.current_page,
          this.ma,
          this.search.tinh_thanh,
          this.search.don_vi_pccc,
          this.search.toa_nha
        );
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async create() {
      try {
        this.btnLoading = true;
        await storeThietBi(this.form);
        this.btnLoading = false;
        this.showDialog = false;
        this.$message({
          message: "Thêm mới thành công!",
          type: "success"
        });
        this.getData(
          this.pagination.per_page,
          this.pagination.current_page,
          this.ma,
          this.search.tinh_thanh,
          this.search.don_vi_pccc,
          this.search.toa_nha
        );
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async destroy(data) {
      try {
        await this.$confirm(
          "Bạn có chắc chắn muốn xóa: " +
          "<strong>" +
            data.ten +
            "</strong>" +
            " - Tòa nhà " +
            "<strong>" +
            data.toa_nha + "</strong>",
          "Xoá thiết bị",
          {
            confirmButtonText: "Xóa",
             dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        await destroyThietBi(data.id);
        this.$message({
          message: "Xóa thành công!",
          type: "success"
        });
        this.getData(
          this.pagination.per_page,
          this.pagination.current_page,
          this.ma,
          this.search.tinh_thanh,
          this.search.don_vi_pccc,
          this.search.toa_nha
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
    handleSelectionChange(val) {
      this.camBien = [...val.map(item => item.id)];
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    async showThemCamBien(id, camBien) {
      try {
        this.showCamBienDialog = true;
        this.loading1 = true;
        this.currentId = id;
        const data = await getCamBien(id);
        this.tableData1 = data.data;
        const toggleList = [];
        if (camBien.length > 0) {
          const id = camBien.map(item => item.id);
          this.tableData1.forEach(item => {
            if (id.indexOf(item.id) != -1) {
              toggleList.push(item);
            }
          });
        }
        setTimeout(() => {
          this.toggleSelection(toggleList);
        }, 0);
        this.loading1 = false;
      } catch (error) {
        this.loading1 = false;
      }
    },
    async updateThietBiCamBien() {
      try {
        this.btnLoading = true;
        await addCamBien(this.currentId, this.camBien);
        this.btnLoading = false;
        this.showCamBienDialog = false;
        this.$message({
          message: "Cập nhật dữ liệu thành công!",
          type: "success"
        });
        this.getData(
          this.pagination.per_page,
          this.pagination.page,
          this.ma,
          this.search.tinh_thanh,
          this.search.don_vi_pccc,
          this.search.toa_nha
        );
      } catch (error) {
        this.btnLoading = false;
      }
    },
    async getKhachHang(id) {
      this.form.user_id = "";
      const data = await getKhachHang(id);
      this.khachHang = data.data;
    },
    async getToaNha() {
      const data = await getToaNha();
      this.toaNha = data.data;
    },
    getOptions() {
      Promise.all([getAllToaNha(), getAllDonViPccc(), getTinhThanh()])
        .then(result => {
          this.options.toa_nha = result[0].data;
          this.options.don_vi_pccc = result[1].data;
          this.options.tinh_thanh = result[2].data;
        })
        .catch(err => {});
    },
    handleChange(e) {
      const files = e.target.files;
      const data = new FormData();
      data.append("file", files[0]);
      this.loadingUpload = true;
      this.iconUpload = "el-icon-loading";
      var filePath = files[0].name.split(".").pop(); //lấy định dạng file
      var dinhDangChoPhep = ["xlsx", "xls", "xlt", "xltx"]; //các tập tin cho phép

      if (!dinhDangChoPhep.find(el => el == filePath)) {
        this.loadingUpload = false;
        this.listLoading = false;
        this.iconUpload = "el-icon-bottom";
        this.$message({
          message: "Tập tin không hợp lệ, hãy upload file excel",
          type: "warning"
        });
      } else {
        uploadThietBi(data)
          .then(res => {
            this.src = process.env.VUE_APP_BASE + res;
            this.listLoading = false;
            this.iconUpload = "el-icon-bottom";
            this.loadingUpload = false;
            this.getData();
            this.$message({
              message: "Upload thành công",
              type: "success"
            });
          })
          .catch(error => {
            console.log(error);
            this.iconUpload = "el-icon-bottom";
            this.loadingUpload = false;
          });
      }
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    excel() {
      this.btnLoading = true;
      axios({
        url: process.env.VUE_APP_BASE_API + "thiet-bi/excel",
        method: "get",
        headers: { Authorization: "Bearer " + getToken() },
        responseType: "blob", // important
        params: {
          ma: this.ma,
          tinh_thanh: this.search.tinh_thanh,
          don_vi_pccc: this.search.don_vi_pccc,
          toa_nha: this.search.toa_nha
        }
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.xlsx");
        document.body.appendChild(link);
        link.click();
        this.btnLoading = false;
      });
    }
  }
};
</script>
<style lang="css">
.btnexcel {
  margin-left: 20px;
}
.el-dialog {
  width: 40%;
}
.input-with-select {
  width: 20%;
}
@media (max-width: 834px) {
  .el-dialog {
    width: 70%;
  }
  .input-with-select {
    width: 200px;
  }
}
@media (max-width: 576px) {
  .input-with-select {
    width: auto;
  }
  .btnexcel {
    margin-left: 0;
  }
  .btn {
    margin-top: 10px;
  }
}
@media (max-width: 427px) {
  .input-with-select {
    margin-top: 10px;
  }
}
.upload-image {
  display: none;
  z-index: -9999;
}
</style>
