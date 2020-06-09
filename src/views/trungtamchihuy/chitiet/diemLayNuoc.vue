<template>
  <div class="app-container">
    <h4 style="color: #2E86C1">Danh sách điểm lấy nước</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="24" justify="space-around">
        <el-col class="el-input-form" :sm="{span:5}">
          <el-input
            placeholder="Tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-search"
            size="small"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-col>
        <el-col class="el-input-form" v-if="disabledTinhThanh" :sm="{span:4}">
          <el-select
            size="small"
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
            size="small"
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
          <el-button
            style="background-color: #3498DB; color: white"
            icon="el-icon-search"
            size="small"
            @click="searchData()"
          >Tìm kiếm</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          stripe
          style="width: 100%; font-size: 13px"
          border
        >
          <el-table-column label="STT " width="80" align="center">
            <template slot-scope="scope">{{ scope.$index +1 }}</template>
          </el-table-column>
          <el-table-column sortable property="ten" label="Tên điểm lấy nước" min-width="180"></el-table-column>
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
          <el-table-column sortable property="status" label="Trạng thái" min-width="125"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getDiemLayNuoc, deleteDiemLayNuoc } from "@/api/diemlaynuoc";
import { getTinhThanh } from "@/api/TinhThanh";
import { getQuanHuyen, getQuanHuyenTheoTinh } from "@/api/QuanHuyen";

export default {
  data() {
    return {
      disabledTinhThanh: true,
      page: 1,
      per_page: 5,
      total: 0,
      tableData: null,
      listLoading: false,
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
  props: {
    // tinhThanhId: { type: Number },
    showAll: { type: Boolean },
    donVi: { type: Object }
  },
  watch: {
    showAll(val) {
      if (val) {
        this.tinhThanh();
        this.$emit("getSoLuong", false);
        getDiemLayNuoc({
          page: this.page,
          per_page: this.per_page
        }).then(response => {
          this.tableData = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.$emit("getSoLuong", this.total);
          this.listLoading = false;
        });
      }
    },
    async donVi(val) {
      this.disabledTinhThanh = false;
      this.form.tinh_thanh_id = val.tinh_thanh_id;
      this.tableData = [];
      this.listLoading = true;
      this.$emit("getSoLuong", false);
      let data = [];
      if (val.children !== undefined) {
        this.form.tinh_thanh_id = val.id;
        data = await getDiemLayNuoc({
          page: this.page,
          per_page: this.per_page,
          tinh_thanh_id: val.id
        });
        getQuanHuyen({ tinh_thanh_id: val.tinh_thanh_id }).then(res => {
          this.quanhuyens = res.data;
          this.quanhuyens.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
        });
      } else {
        data = await getDiemLayNuoc({
          page: 1,
          per_page: this.per_page,
          tinh_thanh_id: val.tinh_thanh_id,
          don_vi_quan_ly_id: val.id
        });
      }

      this.tableData = data.data.data;
      this.page = data.data.current_page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.$emit("getSoLuong", this.total);
      this.listLoading = false;
    }
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
    async getData(page = 1, per_page = 5) {
      this.listLoading = true;
      getDiemLayNuoc({
        page: this.page,
        per_page: this.per_page,
        tinh_thanh_id: this.form.tinh_thanh_id
      }).then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
        this.$emit("getSoLuong", this.total);
      });
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
    searchData(page = 1, per_page = 5) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getDiemLayNuoc(this.form).then(response => {
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
        this.listLoading = false;
      }
    }
  },
  created() {
    this.tinhThanh();
    this.$emit("getSoLuong", false);
    getDiemLayNuoc({
      page: this.page,
      per_page: this.per_page
    }).then(response => {
      this.tableData = response.data.data;
      this.page = response.data.current_page;
      this.per_page = response.data.per_page;
      this.total = response.data.total;
      this.$emit("getSoLuong", this.total);
      this.listLoading = false;
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
