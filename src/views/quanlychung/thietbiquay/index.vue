<template>
  <div class="app-container">
    <h4>Danh sách cammera</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="24" justify="space-around">
        <el-col :span="6">
          <el-input
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-search"
            size="small"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
            >Tìm kiếm</el-button
          >
        </el-col>
        <el-col :sm="{ span: 13 }" :offset="2">
          <router-link
            class="them-moi"
            tag="span"
            to="/quanlythietbi/thietbiquay/create"
          >
            <el-button size="small" class="primary-button" icon="el-icon-plus"
              >Thêm mới</el-button
            >
          </router-link>
        </el-col>
      </el-row>
      <br />
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
      <el-table-column label="STT" min-width="62" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column sortable prop="code" label="Mã" min-width="150">
        <template slot-scope="scope">{{ scope.row.ma }}</template>
      </el-table-column>
      <el-table-column sortable prop="name" label="Tên" min-width="200">
        <template slot-scope="scope">{{ scope.row.ten }}</template>
      </el-table-column>
      <el-table-column label="Loại máy quay" min-width="170">
        <template slot-scope="scope">{{
          scope.row.loai_thiet_bi ? scope.row.loai_thiet_bi.ten : null
        }}</template>
      </el-table-column>
      <el-table-column label="Tỉnh thành" min-width="130">
        <template slot-scope="scope">{{
          scope.row.tinh_thanh ? scope.row.tinh_thanh.name : null
        }}</template>
      </el-table-column>
      <el-table-column label="Ngày triển khai" min-width="130">
        <template slot-scope="scope">{{ scope.row.ngay_trien_khai }}</template>
      </el-table-column>
      <el-table-column label="Trạng thái" min-width="130">
        <template slot-scope="scope">{{ scope.row.status_name }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        width="110"
        fixed="right"
        label="Hành động"
      >
        <template slot-scope="scope">
          <router-link :to="'/quanlythietbi/thietbiquay/show/' + scope.row.id">
            <el-tooltip
              class="item"
              effect="dark"
              content="Chi tiết"
              placement="top"
            >
              <el-button
                size="small"
                class="primary-button"
                icon="el-icon-view"
                circle
              ></el-button>
            </el-tooltip>
          </router-link>
          <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteRow(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getThietBiQuay, deleteData } from "@/api/thietbiquay";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      cam: null,
      showEditForm: false,
      form: {
        active: ""
      },
      actives: [
        { value: true, label: "True" },
        { value: false, label: "False" }
      ]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    showUpdate(cam) {
      this.showEditForm = true;
      this.cam = cam;
      //console.log(this.cam);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },

    fetchData(page = 1, per_page = 10) {
      this.listLoading = true;
      getThietBiQuay({ page: this.page, per_page: this.per_page }).then(
        response => {
          this.list = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.listLoading = false;
          // console.log(response);
        }
      );
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getThietBiQuay(this.form).then(response => {
        this.list = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.list.length ? this.list.length : last;
      this.fetchData(this.page, this.per_page);
    },
    handleCreateThietBiQuay(result) {
      if (result === true) {
        this.$message({
          type: "success",
          message: "Thêm mới thành công"
        });
        this.fetchData();
      }
    },
    handleClose() {
      this.showEditForm = false;
      this.$emit("onRefresh");
    },
    handleEditThietBiQuay(result) {
      if (result === true) {
        this.showEditForm = false;
        this.$emit("onEditThietBiQuay", true);
        this.$message({
          type: "success",
          message: "Cập nhập thành công"
        });
        this.fetchData();
      }
    },

    deleteRow(index, item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa thiết bị quay: " +  "<strong>" + item.ten + "</strong>",
        "Xóa thiết bị quay",
        {
          confirmButtonText: "Xóa",
          dangerouslyUseHTMLString: true,
          cancelButtonText: "Hủy",
          type: "warning"
        }
      )
        .then(_ => {
          deleteData(item.id).then(res => {
            this.$message({
              message: "Xóa thành công",
              type: "success"
            });
            this.fetchData();
          });
        })
        .catch(_ => {});
    }
  }
};
</script>
<style>
.search {
  margin-bottom: 20px;
}
.them-moi {
  float: right;
}
@media (max-width: 576px) {
  .them-moi {
    margin-top: 10px;
    float: left;
  }
}
</style>
