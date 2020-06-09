<template>
  <div class="app-container">
    <h3>Danh sách điểm cháy</h3>
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
        <el-col :span="3" v-if="!disabledTinhThanh">
          <el-select
            style="width: 100%"
            filterable
            v-model="form.tinh_thanh_id"
            allow-create
            clearable
            default-first-option
            placeholder="Tỉnh thành"
            size="small"
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
            v-model="form.don_vi_pccc_id"
            allow-create
            clearable
            default-first-option
            placeholder="Đơn vị PCCC"
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="item in options.donvis"
              :key="item.id"
              :label="item.ten"
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
        </el-col>
        <el-col :span="4">
          <el-button
            style="float:right"
            size="small"
            class="primary-button"
            icon="el-icon-upload2"
            @click="exportExcel()"
          >Xuất excel</el-button>
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
      <el-table-column sortable prop="name" label="Tên" min-width="170">
        <template slot-scope="scope">{{ scope.row.ten }}</template>
      </el-table-column>
      <el-table-column label="Số điện thoại" min-width="140">
        <template slot-scope="scope">{{ scope.row.so_dien_thoai }}</template>
      </el-table-column>
      <el-table-column label="Tên người báo" min-width="140">
        <template slot-scope="scope">{{ scope.row.ten_nguoi_bao}}</template>
      </el-table-column>
      <el-table-column label="Tòa nhà" min-width="170">
        <template slot-scope="scope">{{ scope.row.toa_nha?scope.row.toa_nha.ten:null}}</template>
      </el-table-column>
      <el-table-column label="Tỉnh thành" min-width="150">
        <template slot-scope="scope">{{ scope.row.tinh_thanh?scope.row.tinh_thanh.name:null}}</template>
      </el-table-column>
      <el-table-column label="Địa chỉ" min-width="250">
        <template slot-scope="scope">{{ scope.row.dia_chi}}</template>
      </el-table-column>
      <el-table-column label="Trạng thái" min-width="137">
        <template slot-scope="scope">{{ scope.row.trang_thai_diem_chay.ten}}</template>
      </el-table-column>
      <el-table-column label="Thời gian báo cháy" min-width="137">
        <template slot-scope="scope">{{ scope.row.thoi_gian_bao_chay}}</template>
      </el-table-column>
      <el-table-column label="Thời gian bắt đầu xử lý" min-width="137">
        <template slot-scope="scope">{{ scope.row.thoi_gian_bat_dau_xu_ly}}</template>
      </el-table-column>
      <el-table-column label="Thời gian kết thúc" min-width="145">
        <template slot-scope="scope">{{ scope.row.thoi_gian_ket_thuc}}</template>
      </el-table-column>
      <el-table-column align="center" width="100" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <router-link :to="'/chuachayvacnch/diemchay/show/'+scope.row.id">
            <el-tooltip class="item" effect="dark" content="Chi tiết" placement="top">
              <el-button size="small" class="primary-button" icon="el-icon-view" circle></el-button>
            </el-tooltip>
          </router-link>
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
import { getTinhThanh } from "@/api/TinhThanh";
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
        don_vi_pccc_id: "",
        date: []
      },
      user: "",
      item: {},
      // showCreateForm: false,
      options: {
        tinhthanhs: [],
        donvis: []
      },
      idDiemChay: 0
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
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
      } else {
        this.disabledTinhThanh = false;
      }
    });
  },
  methods: {
    // createToaNha(id) {
    //   this.showCreateForm = true;
    //   this.idDiemChay = id;
    //   console.log(this.idDiemChay);
    // },
    // handleClose() {
    //   this.showCreateForm = false;
    //   this.$emit("onRefresh");
    // },
    exportExcel() {
      axios({
        url: process.env.VUE_APP_BASE_API + "diemchay/export/excel2",
        method: "GET",
        headers: { ["Authorization"]: "Bearer " + getToken() },
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.xlsx");
        document.body.appendChild(link);
        link.click();
      });
    },
    // handleCreateToaNha(result) {
    //   if (result === true) {
    //     this.$message({
    //       type: "success",
    //       message: "Thêm mới thành công"
    //     });
    //   }
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
      getDiemChay({ page: this.page, per_page: this.per_page }).then(
        response => {
          this.list = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.listLoading = false;
        }
      );
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getDiemChay(this.form).then(response => {
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
