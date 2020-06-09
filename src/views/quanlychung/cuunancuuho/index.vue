<template>
  <div class="app-container">
    <h3>Danh sách CNCH</h3>
    <el-form :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="4">
          <el-input
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-user"
            size="small"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            style="width: 100%"
            filterable
            v-model="form.tinh_thanh_id"
            allow-create
            clearable
            default-first-option
            placeholder="Tỉnh thành"
            size="small"
            :disabled="!disabledTinhThanh"
            @change="changeTinhThanh(form.tinh_thanh_id)"
          >
            <el-option
              v-for="item in options.tinhthanhs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="form.quan_huyen_id"
            allow-create
            clearable
            default-first-option
            placeholder="Quận huyện"
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="item in quanhuyens"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-date-picker
            v-model="form.date"
            style="width: 50%"
            type="daterange"
            range-separator="-"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            size="small"
            format="dd/MM/yyyy"
          ></el-date-picker>
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
          >Tìm kiếm</el-button>
          <!-- <el-button
            size="small"
            class="primary-button"
            icon="el-icon-upload2"
            @click="exportExcel()"
          >Xuất excel</el-button> -->
        </el-col>
        <el-col :span="4">
          <router-link :to="'/chuachayvacnch/cuunancuuho/create'">
            <el-button
              style="float:right"
              size="small"
              class="primary-button"
              icon="el-icon-plus"
            >Thêm mới</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="font-size: 13px"
    >
      <el-table-column label="STT" min-width="62" align="center">
        <template slot-scope="scope">{{ scope.$index +1 }}</template>
      </el-table-column>
      <el-table-column sortable prop="ten" label="Tên vụ việc" min-width="170"></el-table-column>
      <el-table-column label="Tên người báo" prop="nguoi_bao" min-width="140"></el-table-column>
      <el-table-column
        label="Số điện thoại người báo"
        prop="so_dien_thoai_nguoi_bao"
        min-width="140"
      ></el-table-column>
      <el-table-column label="Tỉnh thành" prop="tinh_thanh.name" min-width="150"></el-table-column>
      <el-table-column label="Quận huyện" prop="quan_huyen.name" min-width="150"></el-table-column>
      <el-table-column label="Địa chỉ" prop="dia_chi" min-width="250"></el-table-column>
      <el-table-column label="Thời gian nhận tin báo" prop="thoi_gian_nhan_tin_bao" min-width="137"></el-table-column>
      <el-table-column
        label="Thời gian bắt đầu xử lý"
        prop="thoi_gian_bat_dau_xu_ly"
        min-width="137"
      ></el-table-column>
      <el-table-column label="Thời gian kết thúc" prop="thoi_gian_ket_thuc" min-width="145"></el-table-column>
      <el-table-column align="center" width="100" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <router-link :to="'/chuachayvacnch/cuunancuuho/show/'+scope.row.id">
            <el-tooltip class="item" effect="dark" content="Chi tiết" placement="top">
              <el-button size="small" class="primary-button" icon="el-icon-view" circle></el-button>
            </el-tooltip>
          </router-link>
          <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="xoaCNCH(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getDiemChay, download } from "@/api/diemchay";
import { getDonvi } from "@/api/toanha";
import { getcnch, xoaCNCH } from "@/api/cnch";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen } from "@/api/QuanHuyen";
import { getInfor } from "@/api/taikhoan";
import axios from "axios";
import { getToken } from "@/utils/auth";
// import CreateToanha from "./create";

export default {
  components: {
    // CreateToanha
  },
  data() {
    return {
      disabledTinhThanh: true,
      list: null,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      form: {
        tinh_thanh_id: "",
        quan_huyen_id: "",
        date: []
      },
      user: "",
      item: {},
      options: {
        tinhthanhs: []
      },
      quanhuyens: []
    };
  },
  created() {
    this.fetchData();
    getTinhThanh().then(res => {
      this.options.tinhthanhs = res.data;
    });
    getDonvi().then(res => {
      this.options.donvis = res.data;
    });
    getInfor().then(res => {
      if (res.data.tinh_thanh_id) {
        this.disabledTinhThanh = false;
        this.form.tinh_thanh_id = res.data.tinh_thanh_id;
        this.changeTinhThanh( this.form.tinh_thanh_id)
      } else {
        this.disabledTinhThanh = true;
      }
    });
  },
  methods: {
    async changeTinhThanh(val) {
      let data = await getQuanHuyen({ tinh_thanh_id: val });
      this.quanhuyens = data.data;
    },
    // exportExcel() {
    //   axios({
    //     url: process.env.VUE_APP_BASE_API + "diemchay/export/excel2",
    //     method: "GET",
    //     headers: { ["Authorization"]: "Bearer " + getToken() },
    //     responseType: "blob" // important
    //   }).then(response => {
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "file.xlsx");
    //     document.body.appendChild(link);
    //     link.click();
    //   });
    // },
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.list.length ? this.list.length : last;
      this.fetchData(this.page, this.per_page);
    },
    fetchData(page = 1, per_page = 10) {
      this.listLoading = true;
      getcnch({ page: this.page, per_page: this.per_page }).then(response => {
        this.list = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    async xoaCNCH(data) {
      try {
        let comfirm = await this.$confirm("Bạn có chắc chắn muốn xóa công tác CNCH: " + "<strong>" + data.ten +  "</strong>" + " - Thời gian nhận tin báo: " + "<strong>" + data.thoi_gian_nhan_tin_bao +  "</strong>", "Xóa công tác CNCH", {
          confirmButtonText: "Xóa",
          dangerouslyUseHTMLString: true,
          cancelButtonText: "Hủy",
          type: "warning"
        });
        this.listLoading = true;
        let status = await xoaCNCH(data.id);
        this.fetchData();
        this.listLoading = false;
        this.$message({
          message: "Xóa thành công",
          type: "success"
        });
      } catch (error) {
        this.listLoading = false;
      }
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getcnch(this.form).then(response => {
        this.list = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    }
  }
};
</script>
<style >
.search {
  margin-bottom: 20px;
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
