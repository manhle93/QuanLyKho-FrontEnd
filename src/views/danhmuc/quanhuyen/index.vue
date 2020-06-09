<template>
  <div class="app-container">
    <edit-Quan
      :QuanEdit="Quan"
      :active="showEditForm"
      @onClose="handleClose()"
      @onEditQuan="result => handleEditQuan(result)"
    ></edit-Quan>
    <h4>Danh sách quận huyện</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="24" justify="space-around">
        <el-col :span="7">
          <el-input
            placeholder="Tìm tên hoặc mã quận huyện"
            v-model="form.search"
            suffix-icon="el-icon-school"
          ></el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" icon="el-icon-search" @click="searchData()">Tìm kiếm</el-button>
        </el-col>
        <el-col :span="12">
          <div style="float:right" class="adds">
            <create-Quan @onCreateQuan="Quan => handleCreateQuan(Quan)"></create-Quan>
          </div>
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
    >
      <el-table-column label="STT" min-width="65" align="center">
        <template slot-scope="scope">{{ scope.$index +1 }}</template>
      </el-table-column>
      <el-table-column sortable prop="code" label="Mã" min-width="102">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>
      <el-table-column sortable prop="name" label="Tên quận huyện" min-width="307">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="Trực thuộc tỉnh thành phố" min-width="307">
        <template slot-scope="scope">
          <span>{{ scope.row.tinh_thanh.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110" align="center" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
            <el-button
              size="medium"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
            <el-button
              size="medium"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteAppQuanID(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px">
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
import { getQuanHuyen, deleteQuanHuyen } from "@/api/QuanHuyen";

import CreateQuan from "./create";
import EditQuan from "./edit";

export default {
  name: "Quan",
  components: {
    CreateQuan,
    EditQuan
  },
  data() {
    return {
      list: null,
      page: 1,
      per_page: 10,
      listLoading: true,
      labelPosition: "top",
      Quan: null,
      showEditForm: false,
      total: 10,
      form: {},
      search: ""
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    showUpdate(Quan) {
      this.showEditForm = true;
      this.Quan = Quan;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    async fetchData(page = 1, per_page = 10) {
      this.listLoading = true;
      getQuanHuyen({ page: this.page, per_page: this.per_page }).then(
        response => {
          this.list = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.listLoading = false;
        }
      );
    },
    async searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getQuanHuyen(this.form).then(response => {
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
    handleCreateQuan(result) {
      if (result === true) {
        this.$message({
          title: "Thành công",
          message: "Tạo quận huyện thành công",
          type: "success"
        });
        this.fetchData();
      }
    },
    handleClose() {
      this.showEditForm = false;
      this.$emit("onRefresh");
    },
    handleEditQuan(result) {
      if (result === true) {
        this.showEditForm = false;
        this.$emit("onEditQuan", true);
        this.$message({
          title: "Thành công",
          message: "Cập nhật thành công",
          type: "success"
        });
        this.fetchData();
      }
    },

    deleteAppQuanID(index, item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa quận huyện này?",
        "Xóa quận huyện",
        {
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning"
        }
      )
        .then(_ => {
          deleteQuanHuyen(item.id).then(res => {
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
<style scoped>
.search {
  margin-bottom: 25px;
}
</style>
