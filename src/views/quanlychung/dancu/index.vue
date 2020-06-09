<template>
  <div class="app-container" v-on:keyup.enter="searchData">
    <div class="user-table-actions">
      <edit-dancu
        :disabledTinhThanh="disabledTinhThanh"
        :disableDonVi="disableDonVi"
        :disableToaNha="disableToaNha"
        :userEdit="user"
        :options="options"
        :active="showEditForm"
        @onClose="handleClose()"
        @onEditDanCu="result => handleEditDanCu(result)"
      ></edit-dancu>
    </div>
    <h4>Danh sách dân cư</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="24" justify="space-around">
        <el-col class="el-input-form" :sm="{span:5}">
          <el-input
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-user"
            size="small"
          ></el-input>
        </el-col>
        <el-col class="el-input-form" v-if="!disabledTinhThanh" :sm="{span:3}">
          <el-select
            filterable
            v-model="form.tinh_thanh_id"
            allow-create
            clearable
            default-first-option
            placeholder="Tỉnh thành"
            @change="changeTinhThanh(form.tinh_thanh_id)"
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
        <el-col class="el-input-form" :sm="{span:3}">
          <el-select
            v-model="form.don_vi_pccc_id"
            filterable
            remote
            reserve-keyword
            placeholder="Nhập đơn vị PCCC"
            :remote-method="remoteMethod"
            :loading="loading"
            @focus="fun"
            size="small"
          >
            <el-option v-for="item in dancu" :key="item.id" :label="item.ten" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col class="el-input-form" :sm="{span:3}">
          <el-select
            v-model="form.toa_nha_id"
            filterable
            remote
            reserve-keyword
            placeholder="Nhập tòa nhà"
            :remote-method="remoteMethod1"
            :loading="loading1"
            @focus="fun1"
            size="small"
          >
            <el-option v-for="item in toanha" :key="item.id" :label="item.ten" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col class="btnWidth" :span="3">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="6" style="float:right">
          <div class="adds" style="float:right">
            <create-dancu
              :disabledTinhThanh="disabledTinhThanh"
              :disableDonVi="disableDonVi"
              :disableToaNha="disableToaNha"
              :options="options"
              @onCreateDanCu="user => handleCreateDanCu(user)"
            ></create-dancu>
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
      style="font-size: 13px"
    >
      <el-table-column label="STT" min-width="37" align="center">
        <template slot-scope="scope">{{ scope.$index +1 }}</template>
      </el-table-column>
      <el-table-column sortable prop="name" label="Họ tên" min-width="181">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="Số điện thoại" min-width="137">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="Tỉnh thành" min-width="137">
        <template slot-scope="scope">{{ scope.row.tinh_thanh==null?null:scope.row.tinh_thanh.name }}</template>
      </el-table-column>
      <el-table-column label="Đơn vị PCCC" min-width="137">
        <template
          slot-scope="scope"
        >{{ scope.row.don_vi_pccc==null?null:scope.row.don_vi_pccc.ten }}</template>
      </el-table-column>
      <el-table-column label="Tòa nhà" min-width="154">
        <template slot-scope="scope">{{ scope.row.toa_nha==null?null:scope.row.toa_nha.ten }}</template>
      </el-table-column>
      <el-table-column align="center" min-width="80" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
            <el-button
              size="small"
              class="primary-button"
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
              @click="deleteRow(scope.$index, scope.row)"
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
import { getDanCu, deleteData, getToaNha, getSearch1 } from "@/api/dancu";
import { getDonvi, getToaNhaSearch, getSearch } from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import CreateDancu from "./create";
import EditDancu from "./edit";

export default {
  components: {
    CreateDancu,
    EditDancu
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
      disabledTinhThanh: true,
      disableDonVi: true,
      disableToaNha: true,
      list: null,
      page: 1,
      per_page: 10,
      total: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      loading: false,
      dancu: [],
      list1: [],
      value: [],
      data_dan_cu: [],
      toanha: [],
      list2: [],
      value1: [],
      loading1: false,
      data_toa_nha: [],
      showEditForm: false,
      role: "",
      form: {
        active: "",
        tinh_thanh_id: "",
        don_vi_pccc_id: "",
        toa_nha_id: ""
      },
      options: {
        toanhas: [],
        tinhthanhs: [],
        donvis: []
      },
      actives: [
        { value: true, label: "True" },
        { value: false, label: "False" }
      ]
    };
  },
  mounted() {
    this.list2 = this.data_toa_nha.map(item => {
      return { value: item, label: item };
    });
    this.list1 = this.data_dan_cu.map(item => {
      return { value: item, label: item };
    });
  },
  created() {
    this.fetchData();
    getToaNha().then(res => {
      this.options.toanhas = res.data;
    });
    getDonvi().then(res => {
      this.options.donvis = res.data;
    });
    getTinhThanh().then(res => {
      this.options.tinhthanhs = res.data;
    });
    getInfor().then(res => {
      this.role = res.data.role_id;
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        this.disableDonVi = false;
        this.disableToaNha = false;
      } else {
        this.disabledTinhThanh = false;
      }
    });
  },
  methods: {
    fun() {
      this.dancu = [];
    },
    fun1() {
      this.toanha = [];
    },
    remoteMethod1(query) {
      getSearch1({
        query1: query,
        query2: this.form.tinh_thanh_id,
        query3: this.form.don_vi_pccc_id
      }).then(res => {
        if (query !== "") {
          this.loading1 = false;
          this.toanha = res.data;
        } else {
          this.toanha = [];
        }
      });
    },
    remoteMethod(query) {
      getSearch({ query1: query, query2: this.form.tinh_thanh_id }).then(
        res => {
          if (query !== "") {
            this.loading = false;
            this.dancu = res.data;
          } else {
            this.dancu = [];
          }
        }
      );
    },
    showUpdate(user) {
      this.showEditForm = true;
      if (user.tinh_thanh_id != "" && user.tinh_thanh_id != null) {
        this.disableDonVi = false;
        this.disableToaNha = false;
      } else {
        this.disableDonVi = true;
        this.disableToaNha = true;
      }
      this.user = user;
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
      getDanCu({ page: this.page, per_page: this.per_page }).then(response => {
        this.list = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getDanCu(this.form).then(response => {
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
    handleCreateDanCu(result) {
      if (result === true) {
        this.$message({
          type: "success",
          message: "Thêm mới thành công"
        });
        this.fetchData();
      }
    },
    changeTinhThanh(val) {
      getDonvi({ tinh_thanh_id: val }).then(res => {
        this.options.donvis = res.data;
        this.form.don_vi_pccc_id = null;
        this.form.toa_nha_id = null;
      });
      getToaNhaSearch({ tinh_thanh_id: val }).then(res => {
        this.options.toanhas = res.data.data;
        this.form.toa_nha_id = null;
        this.form.don_vi_pccc_id = null;
      });
    },
    changeDonVi(val) {
      this.form.toa_nha_id = null;
      getToaNhaSearch({ don_vi_pccc_id: val }).then(res => {
        this.options.toanhas = res.data.data;
      });
    },
    handleClose() {
      this.showEditForm = false;
      this.$emit("onRefresh");
    },
    handleEditDanCu(result) {
      if (result === true) {
        this.showEditForm = false;
        this.$emit("onEditUser", true);
        this.$message({
          type: "success",
          message: "Cập nhập thành công"
        });
        this.fetchData();
      }
    },

    deleteRow(index, item) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa dân cư: " + "<strong>" + item.name +  "</strong>",
        "Xóa dân cư",
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
