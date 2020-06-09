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
            v-model="form.don_vi"
            multiple
            clearable
            default-first-option
            placeholder="Đơn vị PCCC"
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
            >Tìm kiếm</el-button
          >
        </el-col>
        <el-col :span="disabledTinhThanh ? 6 : 3" :offset="1">
          <router-link tag="span" to="/congtacphongchay/lichtruc/them">
            <el-button
              icon="el-icon-plus"
              size="small"
              style="float:right"
              class="primary-button"
              >Thêm mới</el-button
            >
          </router-link>
        </el-col>
      </el-row>
    </el-form>
    <h4>Danh sách lịch trực</h4>
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
          <el-table-column
            min-width="100"
            type="index"
            label="STT"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="tinh_thanh.name"
            label="Tỉnh thành"
            min-width="60"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="don_vi_pccc.ten"
            label="Đơn vị"
            min-width="60"
            align="center"
          ></el-table-column>
          <el-table-column sortable label="Ngày trực" min-width="60">
            <template slot-scope="scope" v-if="scope.row.ngay_truc">{{
              formatDate(scope.row.ngay_truc)
            }}</template>
          </el-table-column>
          <el-table-column
            prop="tong_cbcs"
            label="Tổng số CBCS"
            min-width="60"
            align="center"
          >
            <template slot-scope="scope"
              >{{ scope.row.tong_cbcs }} người</template
            >
          </el-table-column>
          <el-table-column
            prop="hanh_chinh"
            label="Cán bộ hành chính"
            min-width="60"
            align="center"
          >
            <template slot-scope="scope"
              >{{ scope.row.hanh_chinh }} người</template
            >
          </el-table-column>
          <el-table-column
            prop="co_mat"
            label="Có mặt"
            min-width="60"
            align="center"
          >
            <template slot-scope="scope"
              >{{ scope.row.co_mat }} người</template
            >
          </el-table-column>
          <el-table-column
            prop="vang_mat"
            label="Vắng mặt"
            min-width="60"
            align="center"
          >
            <template slot-scope="scope"
              >{{ scope.row.vang_mat }} người</template
            >
          </el-table-column>
          <el-table-column
            prop="tinh_hinh_trong_ngay"
            label="Tình hình trong ngày"
            align="center"
          ></el-table-column>
          <el-table-column
            label="Hành động"
            fixed="right"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              <router-link
                :to="'/congtacphongchay/lichtruc/show/' + scope.row.id"
              >
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

              <el-tooltip
                class="item"
                effect="dark"
                content="Xóa"
                placement="top"
              >
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
import { getLichTruc, xoaLichTruc } from "@/api/lichtruc";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { getDonViPccc } from "@/api/donvipccc";
import {
  getThamDinhPheDuyet,
  deleteThamDinhPheDuyet
} from "@/api/thamdinhpheduyet";

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
        don_vi: [],
        date: [],
        tinh_thanh_id: null
      },

      options: {
        donvis: [],
        tinhthanhs: []
      }
    };
  },
  created() {
    this.getData();
    getInfor().then(res => {
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        // getToaNhaSearch({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
        //   this.options.toanhas = res.data.data;
        // });
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
      getLichTruc().then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    async changeTinhThanh(val) {
      let dv = await getDonViPccc({
        tinh_thanh_id: val,
        per_page: 999999
      });
      this.options.donvis = dv.data.data;
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getLichTruc(this.form).then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    formatDate(d) {
      try {
        let date = new Date(d);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        if (day < 10) day = "0" + day;
        if (month < 10) month = "0" + month;
        return day + "/" + month + "/" + date.getUTCFullYear();
      } catch (error) {
        return null;
      }
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getData(this.page, this.per_page);
    },

    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm("Bạn có chắc chắn muốn xóa lịch trực ngày: " + "<strong>" + this.formatDate(data.ngay_truc) + "</strong>"+", " +"<strong>"+ data.don_vi_pccc.ten + "</strong>", "Xóa lịch trực", {
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          dangerouslyUseHTMLString: true,
          type: "warning"
        });
        this.listLoading = true;
        let status = await xoaLichTruc(id);
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
