<template>
  <div class="app-container" v-on:keyup.enter="searchData">
    <el-form :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="4">
          <el-input
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-user"
            size="small"
          ></el-input>
        </el-col>
        <el-col v-if="!disabledTinhThanh" :span="3">
          <el-select
            filterable
            v-model="form.tinh_thanh_id"
            allow-create
            clearable
            default-first-option
            placeholder="Tỉnh thành"
            @change="changeTinhThanh(form.tinh_thanh_id)"
            style="width: 100%"
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
        <el-col :span="3">
          <el-select
            size="small"
            v-model="form.don_vi_pccc_id"
            style="width: 100%"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="Nhập đơn vị PCCC"
            :remote-method="remoteMethod"
            :loading="loading"
            @focus="fun"
          >
            <el-option v-for="item in donvi" :key="item.id" :label="item.ten" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <input ref="upload-image" class="upload-image" type="file" @change="handleChange($event)" />
        <el-col :span="2">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="3" :offset="9">
          <router-link to="/congtacphongchay/toanha/create">
            <el-button
              style="float: right"
              icon="el-icon-plus"
              size="small"
              class="primary-button"
            >Thêm mới</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <h5>Nhập dữ liệu từ excel</h5>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-tooltip class="item" effect="dark" content="Tải xuống file Excel mẫu" placement="top">
          <el-button
            size="mini"
            class="primary-button block"
            :icon="iconDowload"
            @click="downloadMau"
          >Tải file mẫu</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="Chọn file để tải lên" placement="top">
          <el-button
            :disabled="loadingUpload"
            size="mini"
            type="warning"
            class="block"
            :icon="iconUpload"
            @click="handleUpload"
          >Nhập từ Excel</el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <h4>Danh sách cơ sở công trình</h4>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          style="width: 100%; font-size: 13px"
          border
        >
          <el-table-column sortable type="index" label="STT" ></el-table-column>
          <el-table-column sortable property="ma" label="Mã " min-width="125"></el-table-column>
          <el-table-column sortable property="ten" label="Tên" min-width="123"></el-table-column>
          <el-table-column sortable property="dia_chi" label="Địa chỉ" min-width="143"></el-table-column>
          <el-table-column label="Số điện thoại" min-width="115">
            <template slot-scope="scope">
              <div v-for="phone in scope.row.so_dien_thoai">{{ phone.so_dien_thoai}}</div>
            </template>
          </el-table-column>
          <el-table-column property="don_vi_pccc.ten" label="Đơn vị PCCC" min-width="125"></el-table-column>
          <el-table-column property="huong_vao_toa_nha" label="Hướng vào tòa nhà" min-width="106"></el-table-column>\
          <el-table-column property="loai_hinh_so_huu.ten" label="Loại hình sở hữu" min-width="95"></el-table-column>
          <el-table-column label="Hành động" align="center" fixed="right" width="120">
            <template slot-scope="scope">
              <router-link :to="'/congtacphongchay/toanha/show/'+scope.row.id">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  getListData,
  deleteData,
  getDonvi,
  getSearch,
  uploadToaNha
} from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
export default {
  data() {
    return {
      iconDowload: "el-icon-bottom",
      iconUpload: "el-icon-upload",
      disabledTinhThanh: true,
      page: 1,
      per_page: 10,
      total: 0,
      loadingUpload: false,
      tableData: null,
      listLoading: true,
      loading: false,
      search: "",
      donvi: [],
      value: [],
      data_don_vi: [],
      list: [],
      form: {
        tinh_thanh_id: "",
        don_vi_pccc_id: ""
      },
      options: {
        // donvis: [],
        tinhthanhs: []
      }
    };
  },
  created() {
    this.getData();
    this.getDataDanhMuc(getTinhThanh, "tinhthanhs");
    this.getDonViPCCC();
    getInfor().then(res => {
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
      } else {
        this.disabledTinhThanh = false;
      }
    });
  },

  mounted() {
    this.list = this.data_don_vi.map(item => {
      return { value: item, label: item };
    });
  },
  methods: {
    fun() {
      this.donvi = [];
    },
    async downloadMau() {
      const data = await getInfor();
      if (data.data.tinhthanh != null) {
        var tinh_thanh_id = data.data.tinhthanh.id;
        window.location.assign(
          process.env.VUE_APP_BASE_API +
            "downloadmautoanha?tinh_thanh_id=" +
            tinh_thanh_id
        );
      } else {
        window.location.assign(
          process.env.VUE_APP_BASE_API + "downloadmautoanha"
        );
      }
    },
    handleChange(e) {
      const files = e.target.files;
      const data = new FormData();
      data.append("file", files[0]);
      this.loadingUpload = true;
      this.iconUpload = "el-icon-loading";

      var filePath = files[0].name.split(".").pop(); //lấy định dạng file
      var dinhDangChoPhep = ['xlsx', 'xls', 'xlt', 'xltx']; //các tập tin cho phép

      if (!dinhDangChoPhep.find(el=> el == filePath)) {
        this.loadingUpload = false;
        this.listLoading = false;
        this.iconUpload = "el-icon-bottom";
        this.$message({
          message: "Tập tin không hợp lệ, hãy upload file excel",
          type: "warning"
        });
      } else {
        uploadToaNha(data)
          .then(res => {
            this.src = process.env.VUE_APP_BASE + res;
            this.listLoading = false;
            this.iconUpload = "el-icon-bottom";
            this.loadingUpload = false;
            this.getData();
            this.$message({
              message: "Upload thành công",
              type: "success"
            });
          })
          .catch(error => {
            console.log(error);
            this.iconUpload = "el-icon-bottom";
            this.listLoading = false;
            this.loadingUpload = false;
          });
      }
    },
    handleUpload() {
      this.$refs["upload-image"].click();
    },
    remoteMethod(query) {
      getSearch({ query1: query, query2: this.form.tinh_thanh_id }).then(
        res => {
          if (query !== "") {
            this.loading = false;
            this.donvi = res.data;
          } else {
            this.donvi = [];
          }
        }
      );
    },
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
      getListData({ page: this.page, per_page: this.per_page }).then(
        response => {
          this.tableData = response.data.data;
          this.page = response.data.current_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.listLoading = false;
        }
      );
    },
    changeTinhThanh(val) {
      getDonvi({ tinh_thanh_id: val }).then(res => {
        this.options.data_don_vi = res.data;
      });
    },

    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getListData(this.form).then(response => {
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

    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa công trình: " +  "<strong>" + data.ten +  "</strong>",
          "Xóa cơ sở công trình",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        this.listLoading = true;
        let status = await deleteData(data.id);
        let getData = await this.getData();
        this.listLoading = false;
        this.$message({
          message: "Xóa thành công",
          type: "success"
        });
      } catch (error) {
        this.listLoading = false;
      }
    },
    async getDonViPCCC() {
      let data = await getDonvi();
      this.data_don_vi = data.data;
    },
    async getDataDanhMuc(func, option) {
      try {
        let data = await func();
        this.options[option] = data.data;
      } catch (error) {}
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
