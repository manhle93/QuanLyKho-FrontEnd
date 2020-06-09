<template>
  <div class="app-container">
    <el-form class="search" :model="form">
      <el-row :gutter="24" justify="space-around">
        <el-col class="el-input-form" :sm="{span:5}">
          <el-input placeholder="Tìm kiếm" v-model="form.search" suffix-icon="el-icon-user"></el-input>
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
        <el-col :span="3" style="float:right">
          <router-link style="float:right" tag="span" to="/quanlydonvipccc/diemlaynuoc/create">
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
          <el-table-column sortable label="STT " type="index" align="center">
          </el-table-column>
          <el-table-column sortable property="ten" label="Tên điểm lấy nước" min-width="150"></el-table-column>
          <el-table-column
            sortable
            property="don_vi_quan_ly"
            label="Đơn vị quản lý"
            min-width="150"
          ></el-table-column>
          <el-table-column sortable property="loai" label="Loại" min-width="80"></el-table-column>
          <el-table-column sortable label="Địa chỉ" min-width="150">
            <template slot-scope="scope">{{ scope.row.dia_chi}}</template>
          </el-table-column>
          <el-table-column sortable property="description" label="Mô tả" min-width="150"></el-table-column>
          <el-table-column sortable property="status" label="Trạng thái sử dụng" min-width="125"></el-table-column>
          <el-table-column sortable property="important" label="Độ quan trọng" min-width="80"></el-table-column>
          <el-table-column label="Hành động" align="center" width="110" fixed="right">
            <template slot-scope="scope">
              <router-link :to="'/quanlydonvipccc/diemlaynuoc/show/'+scope.row.id">
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
import { getDiemLayNuoc, deleteDiemLayNuoc } from "@/api/diemlaynuoc";
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
      quanhuyens: [],
      tinhthanhs: [],
      search: "",
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
    async getData(page = 1, per_page = 10) {
      this.listLoading = true;
      getDiemLayNuoc({ page: this.page, per_page: this.per_page }).then(
        response => {
          this.tableData = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.listLoading = false;
        }
      );
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
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getDiemLayNuoc(this.form).then(response => {
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

    async handleDelete(id) {
      try {
        this.listLoading = true;
        let comfirm = await this.$confirm("Bạn có muốn xóa điểm lấy nước này");
        let status = await deleteDiemLayNuoc(id);
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
          this.quanhuyens.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
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
