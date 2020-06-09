<template>
  <div class="app-container">
    <h4>Danh sách đơn vị phòng cháy chữa cháy</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="4">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-user"
          ></el-input>
        </el-col>
        <el-col v-if="!disabledTinhThanh" :span="12">
          <el-select
            size="small"
            filterable
            v-model="form.tinh_thanh_id"
            allow-create
            clearable
            default-first-option
            placeholder="Tỉnh thành"
          >
            <el-option
              v-for="item in tinhthanhs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
          >Tìm kiếm</el-button>
        </el-col>

        <el-col style="float:right" :span="3">
          <router-link style="float:right" tag="span" to="/quanlydonvipccc/donvipccc/create">
            <el-button size="small" class="primary-button" icon="el-icon-plus">Thêm mới</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          style="width: 100%; font-size: 13px"
          border
        >
          <el-table-column width="80" type="index" label="Mã "></el-table-column>
          <el-table-column min-width="130" sortable property="ma" label="Mã "></el-table-column>
          <el-table-column min-width="214" sortable property="ten" label="Tên"></el-table-column>
          <el-table-column min-width="214" sortable property="dia_chi" label="Địa chỉ"></el-table-column>
          <el-table-column min-width="130" property="so_dien_thoai" label="Số điện thoại"></el-table-column>
          <el-table-column min-width="130" sortable property="tinh_thanh.name" label="Tỉnh thành"></el-table-column>
          <!-- <el-table-column sortable property="quan_huyen.name" label="Quận huyện"></el-table-column> -->

          <el-table-column label="Hành động" align="center" width="110">
            <template slot-scope="scope">
              <router-link :to="'/quanlydonvipccc/donvipccc/show/'+scope.row.id">
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
                  @click="handleDelete(scope.row.id)"
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
import { getDonViPccc, deleteDonViPccc } from "@/api/donvipccc";
import { getDonvi } from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";

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
      role: "",
      form: {
        tinh_thanh_id: "",
        don_vi_pccc_id: ""
      },
      options: {
        donvis: [],
        tinhthanhs: []
      }
    };
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
      getDonViPccc({ page: this.page, per_page: this.per_page }).then(
        response => {
          this.tableData = response.data.data;
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
      // console.log(this.form);
      getDonViPccc(this.form).then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getData(this.page, this.per_page);
    },
    getDonViRole() {
      if (this.role == 2) {
        this.form.tinh_thanh_id = res.data.tinh_thanh_id;
        getDonvi({ tinh_thanh_id: this.form.tinh_thanh_id }).then(res => {
          this.options.donvis = res.data;
          //console.log(res);
        });
      }
    },
    changeTinhThanh(val) {
      getDonvi({ tinh_thanh_id: val }).then(res => {
        this.options.donvis = res.data;
      });
    },

    async handleDelete(id) {
      try {
        this.listLoading = true;
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa đơn vị này",
          "Xóa đơn vị PCCC",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        let status = await deleteDonViPccc(id);
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
    },

    async tinhThanh() {
      try {
        let data = await getTinhThanh();
        this.tinhthanhs = data.data;
      } catch (error) {
        //console.log(error);
      }
    },
    async getDataDanhMuc(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {
        //console.log(error);
      }
    },
    async getDonViPCCC() {
      let data = await getDonvi();
      this.options.donvis = data.data;
    }
  },

  created() {
    this.tinhThanh();
    this.getData();
    this.getDataDanhMuc(getTinhThanh, "tinhthanhs");
    this.getDonViPCCC();
    this.getDonViRole();
    getInfor().then(res => {
      this.role = res.data.role_id;
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
      } else {
        this.disabledTinhThanh = false;
      }
    });
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
