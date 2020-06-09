<template>
  <div class="app-container" v-on:keyup.enter="searchData">
    <el-form :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="4">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-user"
          ></el-input>
        </el-col>

        <el-col v-if="!disabledTinhThanh" :span="3">
          <el-select
            size="small"
            filterable
            v-model="form.tinh_thanh_id"
            allow-create
            clearable
            default-first-option
            placeholder="Tỉnh thành"
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
            size="small"
            filterable
            v-model="form.toa_nha_id"
            allow-create
            clearable
            default-first-option
            placeholder="Tòa nhà"
          >
            <el-option
              v-for="item in options.toanhas"
              :key="item.id"
              :label="item.ten"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="10">
          <el-date-picker
            v-model="form.ngay_cap"
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
        <el-col :span="3" :offset="1">
          <router-link tag="span" to="/congtacphongchay/thamdinhpheduyet/them">
            <el-button
              icon="el-icon-plus"
              size="small"
              style="float:right"
              class="primary-button"
            >Thêm mới</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-form>
    <h4>Công tác thẩm định và cấp giấy phép chứng nhận đủ điều kiện về PCCC</h4>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          border
          fit
          highlight-current-row
          style="font-size: 13px"
        >
          <el-table-column min-width="52" sortable label="STT" align="center">
            <template slot-scope="scope">{{ scope.$index +1 }}</template>
          </el-table-column>
          <el-table-column prop="ten_van_ban" label="Tên văn bản" align="center"></el-table-column>
          <el-table-column prop="so_van_ban" label="Số văn bản" align="center"></el-table-column>
          <el-table-column sortable label="Ngày cấp" min-width="96">
            <template
              slot-scope="scope"
              v-if="scope.row.ngay_cap"
            >{{formatDate(scope.row.ngay_cap)}}</template>
          </el-table-column>
          <el-table-column prop="co_quan_cap" label="Cơ quan cấp" align="center"></el-table-column>
          <el-table-column prop="ghi_chu" label="Ghi chú" align="center"></el-table-column>
          <el-table-column label="Hành động" fixed="right" align="center" width="110">
            <template slot-scope="scope">
              <router-link :to="'/congtacphongchay/thamdinhpheduyet/show/'+scope.row.id">
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
                  @click="handleDelete(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
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
import { index, deleteKiemTraToaNha } from "@/api/kiemtratoanha";
import { getToaNhaSearch } from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { getThamDinhPheDuyet, deleteThamDinhPheDuyet } from "@/api/thamdinhpheduyet";

export default {
  data() {
    return {
      disabledTinhThanh: true,
      page: 1,
      per_page: 10,
      total: 0,
      tableData: null,
      listLoading: true,
      search: "",
      form: {
        toa_nha_id: "",
        ngay_cap: "",
        tinh_thanh_id: ""
      },

      options: {
        toanhas: [],
        tinhthanhs: []
      }
    };
  },
  created() {
    this.getData();
    getInfor().then(res => {
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        getToaNhaSearch({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
          this.options.toanhas = res.data.data;
        });
      } else {
        this.disabledTinhThanh = false;
      }
    });

    getTinhThanh().then(res => {
      this.options.tinhthanhs = res.data;
    });
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    async getData(page = 1, per_page = 10) {
      this.listLoading = true;
      getThamDinhPheDuyet().then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    changeTinhThanh(val) {
      getToaNhaSearch({ tinh_thanh_id: val, per_page: 9999999 }).then(res => {
        this.options.toanhas = res.data.data;
      });
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getThamDinhPheDuyet(this.form).then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    formatDate(d) {
      let date = new Date(d);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      if (day < 10) day = "0" + day;
      if (month < 10) month = "0" + month;
      return day + "/" + month + "/" + date.getUTCFullYear();
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getData(this.page, this.per_page);
    },

    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa: " + "<strong>" + data.ten_van_ban +  "</strong>" + " Số " + "<strong>"  + data.so_van_ban + "</strong>",
          "Xóa thẩm duyệt",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        this.listLoading = true;
        let status = await deleteThamDinhPheDuyet(data.id);
        let getData = await this.getData();
        this.listLoading = false;
        this.$message({
          message: "Xóa thành công",
          type: "success"
        });
      } catch (error) {
        //console.log(error);
        this.listLoading = false;
      }
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
