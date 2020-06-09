<template>
  <div class="app-container">
    <div class="user-table-actions">
      <edit-user
        :userEdit="user"
        :active="showEditForm"
        @onClose="handleClose()"
        @onEditUser="result => handleEditUser(result)"
      ></edit-user>
    </div>
    <h4>Danh sách người dùng</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-search"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            size="small"
            v-model="form.active"
            allow-create
            clearable
            default-first-option
            placeholder="Trạng thái"
            style="width: 100%"
          >
            <el-option
              v-for="item in actives"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            size="small"
            :disabled="timKiemTinhThanh"
            filterable
            multiple
            v-model="form.tinh_thanh_id"
            allow-create
            clearable
            default-first-option
            placeholder="Tỉnh thành"
            style="width: 100%"
          >
            <el-option
              v-for="item in tinhthanhs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            size="small"
            filterable
            multiple
            v-model="form.toa_nha_id"
            allow-create
            clearable
            default-first-option
            placeholder="Tòa nhà"
            style="width: 100%"
          >
            <el-option
              v-for="item in toanhas"
              :key="item.id"
              :label="item.ten"
              :value="item.id"
            ></el-option>
          </el-select>
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
        <el-col :span="4">
          <create-user
            style="float:right"
            @onCreateUser="user => handleCreateUser(user)"
          ></create-user>
          <br />
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
      <el-table-column label="STT" min-width="55" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column sortable prop="name" min-width="160" label="Tên">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column
        sortable
        prop="username"
        label="Tên đăng nhập"
        min-width="150"
      >
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="Email" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Số điện thoại" min-width="157">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="Tỉnh thành" min-width="157">
        <template slot-scope="scope" v-if="scope.row.tinh_thanh !== null">{{
          scope.row.tinh_thanh.name
        }}</template>
      </el-table-column>
      <el-table-column label="Tòa nhà" min-width="157">
        <template slot-scope="scope" v-if="scope.row.toa_nha !== null">{{
          scope.row.toa_nha.ten
        }}</template>
      </el-table-column>
      <el-table-column
        sortable
        prop="active"
        class-name="status-col"
        label="Trạng thái"
        align="center"
        min-width="157"
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.active">Hoạt động</el-tag>
          <el-tag type="danger" v-else>Không hoạt động</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="110"
        fixed="right"
        label="Hoạt động"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="Chỉnh sửa"
            placement="top"
          >
            <el-button
              size="small"
              style="background-color: #2E86C1; color: white"
              icon="el-icon-edit"
              circle
              @click="showUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteAppUserID(scope.$index, scope.row)"
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
import { getUser, deleteUser } from "@/api/user";
import CreateUser from "./create";
import EditUser from "./edit";
import { getTinhThanh } from "@/api/TinhThanh";
import { getAllToaNha } from "@/api/toanha";
import { getInfor } from "@/api/taikhoan";

export default {
  components: {
    CreateUser,
    EditUser
  },
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
      timKiemTinhThanh: false,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      showEditForm: false,
      toanhas: "",
      tinhthanhs: "",
      form: {
        active: "",
        tinh_thanh_id: "",
        toa_nha_id: ""
      },
      user_login: {
        name: "",
        email: "",
        username: "",
        phone: "",
        avatar_url: "",
        tinh_thanh_id: "",
        quan_huyen_id: "",
        role: {
          code: "",
          name: "",
          description: ""
        }
      },
      actives: [
        { value: true, label: "Hoạt động" },
        { value: false, label: "Không hoạt động" }
      ]
    };
  },
  created() {
    this.fetchData();
    this.getToaNha();
    this.tinhThanh();
  },
  methods: {
    showUpdate(user) {
      this.showEditForm = true;
      this.user = user;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },
    phoneFormat(number) {
      number = String(number);
      var formatted = "";
      var digits = 4; //The number of digits to pull off next time.
      var dash = "";
      while (digits > 0) {
        //Prepend final [digits] digits to formatted number, with a dash
        formatted =
          number.substr(number.length - digits, digits) + dash + formatted;
        //Remove digits from the old number
        number = number.substr(0, number.length - digits);
        digits = Math.min(number.length, 3);
        dash = ".";
      }
      return formatted;
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    async fetchData(page = 1, per_page = 10) {
      this.listLoading = true;
      await getInfor().then(res => {
        this.user_login = res.data;
      });
      if (this.user_login.role.code == "quan_ly_tinh_thanh") {
        this.form.tinh_thanh_id[0] = this.user_login.tinh_thanh_id;
        this.timKiemTinhThanh = true;
      }
      getUser({ page: this.page, per_page: this.per_page }).then(response => {
        this.list = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    async getToaNha() {
      getAllToaNha().then(res => {
        this.toanhas = res.data;
      });
    },
    async tinhThanh() {
      getTinhThanh().then(res => {
        this.tinhthanhs = res.data;
        this.tinhthanhs.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      });
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getUser(this.form).then(response => {
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
    handleCreateUser(result) {
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
    handleEditUser(result) {
      if (result === true) {
        this.showEditForm = false;
        this.$message({
          type: "success",
          message: "Cập nhập thành công"
        });
        this.fetchData();
      }
    },

    deleteAppUserID(index, item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa người dùng: " +
          "<strong>" +
          item.name +
          "</strong>",
        "Xóa người dùng",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning"
        }
      )
        .then(_ => {
          deleteUser(item.id).then(res => {
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
</style>
