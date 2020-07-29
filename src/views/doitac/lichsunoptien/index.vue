<template>
  <div class="app-container">
    <h4>Lịch sử nạp tiền</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="6">
          <el-date-picker
            style="width: 100%"
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            size="small"
            format="dd/MM/yyyy"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="search"
            suffix-icon="el-icon-search"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-col>
        <el-col :span="7">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="6">
          <el-button
            style="float: right"
            @click="showFormAdd"
            size="small"
            icon="el-icon-plus"
            class="primary-button"
          >Thêm mới</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="font-size: 13px"
    >
      <el-table-column label="STT" min-width="55" type="index" align="center"></el-table-column>
      <el-table-column label="Mã giao dịch" prop="ma" align="center"></el-table-column>
      <el-table-column sortable prop="khach_hang.ten" min-width="160" label="Khách hàng"></el-table-column>
      <el-table-column label="Thời gian" prop="created_at" min-width="157"></el-table-column>
      <el-table-column label="Số tiền giao dịch" min-width="157" prop="so_tien">
        <template slot-scope="scope">{{formate.formatCurrency(scope.row.so_tien)}} đ</template>
      </el-table-column>
      <el-table-column label="Số dư" min-width="157" prop="so_du">
        <template slot-scope="scope">{{formate.formatCurrency(scope.row.so_du)}} đ</template>
      </el-table-column>
      <el-table-column label="Nội dung" min-width="157" prop="noi_dung"></el-table-column>
      <el-table-column label="Trạng thái" min-width="157">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.trang_thai == 'nop_tien'">Nộp tiền vào tài khoản</el-tag>
          <el-tag type="warning" v-if="scope.row.trang_thai == 'hoan_tien'">Hoàn tiền</el-tag>
          <el-tag v-if="scope.row.trang_thai == 'mua_hang'">Giao dịch mua hàng</el-tag>
          <el-tag
            effect="dark"
            type="danger"
            v-if="scope.row.trang_thai == 'hoan_tac_nop_tien'"
          >Hoàn tác nộp tiền</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Hoàn tiền" placement="top">
            <el-button
              v-if="scope.row.trang_thai == 'nop_tien' && !scope.row.da_hoan_tien"
              size="small"
              class="primary-button"
              icon="el-icon-refresh-left"
              circle
              @click="hoanTien(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Nạp tiền vào tài khoản" :visible.sync="showForm" width="30%" center>
      <el-form :model="form" :rules="rules" ref="form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Khách hàng" prop="id_user_khach_hang">
              <br />
              <el-select
                filterable
                style="width: 100%"
                v-model="form.id_user_khach_hang"
                placeholder="Chọn khách hàng"
              >
                <el-option
                  v-for="item in khachHangs"
                  :key="item.id"
                  :label="item.ten"
                  :value="item.user_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Số tiền (Vnđ)" prop="so_tien">
              <br />
              <el-input-number style="width: 100%" :min="0" :step="500" v-model="form.so_tien"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Nội dung">
              <el-input type="textarea" v-model="form.noi_dung" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" icon="el-icon-close" @click="showForm = false">Cancel</el-button>
        <el-button
          class="primary-button"
          size="small"
          icon="el-icon-plus"
          @click="addDanhMuc('form')"
        >Nộp tiền</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { nopTien, hoanTac, lichSu, getKhachHang } from "@/api/khachhang";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/product.png",
      endPointImage: process.env.VUE_APP_BASE,
      list: [],
      showForm: false,
      edit: false,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      date: null,
      listLoading: true,
      labelPosition: "top",
      user: null,
      formate: formate,
      form: {
        id_user_khach_hang: null,
        noi_dung: "",
        so_tien: 0,
      },
      khachHangs: [],
      rules: {
        id_user_khach_hang: [
          {
            required: true,
            message: "Khách hàng không thể bỏ trống",
            trigger: "blur",
          },
        ],
        so_tien: [
          {
            required: true,
            message: "Số tiền không thể bỏ trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getData();
    this.getKhachHang();
  },
  methods: {
    async getData(page, per_page) {
      this.listLoading = true;
      let data = await lichSu({
        per_page: per_page,
        page: page,
      });
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.list = data.data.data;
      this.listLoading = false;
    },
    searchData() {
      this.listLoading = true;
      lichSu({
        search: this.search,
        date: this.date
      }).then((response) => {
        this.list = response.data.data;
        this.page = response.data.page;
        this.per_page = response.data.per_page;
        this.listLoading = false;
      });
    },
    hoanTien(item) {
      this.$confirm(
        "Hoàn tác giao dịch nộp tiền cho khách hàng: " +
          "<strong>" +
          item.khach_hang.ten +
          "</strong>" +
          ", đưa số tiền đã nạp về 0đ",
        "Hoàn tác",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then((_) => {
          hoanTac(item.id).then((res) => {
            this.$message({
              message: "Thành công",
              type: "success",
            });
            this.getData();
          });
        })
        .catch((_) => {});
    },
    showFormAdd() {
      this.resetForm();
      this.showForm = true;
    },
    addDanhMuc(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          nopTien(this.form).then((res) => {
            this.resetForm();
            this.getData();
            this.$message({
              type: "success",
              message: "Thêm mới thành công",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.showForm = false;
      this.src = process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png";
      this.form = {
        id_user_khach_hang: null,
        noi_dung: "",
        so_tien: 0,
      };
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      upAnhDanhMuc(data)
        .then((res) => {
          this.form.anh_dai_dien = res;
          this.src = process.env.VUE_APP_BASE + res;
        })
        .catch((error) => {});
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    async getKhachHang() {
      let data = await getKhachHang({
        per_page: 9999999,
      });
      this.khachHangs = data.data.data;
    },
  },
};
</script>
<style>
.search {
  margin-bottom: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: inherit;
  color: #8c939d;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.avatar {
  width: 40px;
  height: 40px;
  display: block;
}
.upload-image {
  display: none;
  z-index: -9999;
}
</style>
