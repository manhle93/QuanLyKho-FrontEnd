<template>
  <div class="app-container">
    <el-row>
      <el-col :span="22">
        <h3>Danh sách các đơn vị hỗ trợ</h3>
      </el-col>
    </el-row>
    <el-form class="search" :model="form">
      <el-row :gutter="24" justify="space-around">
        <el-col class="el-input-form" :sm="{span:5}">
          <el-input
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-user"
          ></el-input>
        </el-col>
        <el-col class="el-input-form" v-if="!disabledTinhThanh" :sm="{span:4}">
          <el-select
            clearable
            filterable
            allow-create
            default-first-option
            v-model="form.tinh_thanh_id"
            placeholder="Tỉnh thành"
            @change="changeQuanHuyen(form.tinh_thanh_id)"
          >
            <el-option
              v-for="item in tinhthanhs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="el-input-form" :sm="{span:4}">
          <el-select
            clearable
            v-model="form.quan_huyen_id"
            filterable
            allow-create
            default-first-option
            placeholder="Quận huyện"
          >
            <el-option
              v-for="item in quanhuyens"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="btnWidth" :span="3">
          <el-button type="primary" icon="el-icon-search" @click="searchData()">Tìm kiếm</el-button>
        </el-col>
        <el-col style="float:right" :span="3">
          <router-link style="float:right" tag="span" to="/quanlydonvipccc/donvihotro/create">
            <el-button type="primary">THÊM MỚI</el-button>
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
          style="width: 100%"
          border
        >
          <el-table-column sortable property="ma" label="Mã " min-width="113"></el-table-column>
          <el-table-column sortable property="ten" label="Tên" min-width="250"></el-table-column>
          <el-table-column sortable property="loai_don_vi.ten" label="Loại đơn vị" min-width="113"></el-table-column>
          <el-table-column sortable property="so_dien_thoai" label="Số điện thoại" min-width="116"></el-table-column>
          <el-table-column sortable property="quan_huyen.name" label="Quận huyện" min-width="113"></el-table-column>
          <el-table-column sortable property="tinh_thanh.name" label="Tỉnh thành" min-width="113"></el-table-column>
          <el-table-column label="Hành động" align="center" width="110">
            <template slot-scope="scope">
              <router-link :to="'/quanlydonvipccc/donvihotro/show/'+scope.row.id">
                <el-tooltip class="item" effect="dark" content="Chi tiết" placement="top">
                  <el-button size="medium" type="primary" icon="el-icon-view" circle></el-button>
                </el-tooltip>
              </router-link>

              <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
                <el-button
                  size="medium"
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getDonViHoTro, deleteDonViHoTro } from "@/api/donvihotro";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen, getQuanHuyenTheoTinh } from "@/api/QuanHuyen";
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
      quanhuyens: [],
      tinhthanhs: [],
      form: {
        search: "",
        quan_huyen_id: "",
        tinh_thanh_id: ""
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
    async tinhThanh() {
      getTinhThanh().then(res => {
        this.tinhthanhs = res.data;
        this.tinhthanhs.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      });
    },
    async quanHuyen() {
      getQuanHuyen().then(res => {
        this.quanhuyens = res.data;
        this.quanhuyens.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      });
    },
    async getData(page = 1, per_page = 10) {
      this.listLoading = true;
      getDonViHoTro({ page: this.page, per_page: this.per_page }).then(
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
      getDonViHoTro(this.form).then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        //console.log(response);
        this.listLoading = false;
      });
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getData(this.page, this.per_page);
    },
    changeQuanHuyen(val) {
      this.form.quan_huyen_id = null;
      getQuanHuyen({ tinh_thanh_id: val }).then(res => {
        this.quanhuyens = res.data;
        this.quanhuyens.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
      });
    },
    async handleDelete(id) {
      try {
        this.listLoading = true;
        let comfirm = await this.$confirm("Bạn có muốn xóa đơn vị hỗ trợ này");
        let status = await deleteDonViHoTro(id);
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
  },
  created() {
    this.getData();
    this.tinhThanh();
    this.quanHuyen();
    getInfor().then(res => {
      this.role = res.data.role_id;
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        getQuanHuyen({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
          this.quanhuyens = res.data;
        });
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
