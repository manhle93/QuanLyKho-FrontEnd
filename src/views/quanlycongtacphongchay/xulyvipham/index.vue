<template>
  <div class="app-container" v-on:keyup.enter="searchData">
    <el-form :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="4">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="form.search"
            suffix-icon="el-icon-search"
          ></el-input>
        </el-col>

        <el-col v-if="!disabledTinhThanh" :span="3">
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
              v-for="item in options.tinhthanhs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-date-picker
            v-model="form.thoi_gian"
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
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="6" :offset="1">
          <router-link tag="span" to="/congtacphongchay/xulyvipham/them">
            <el-button
              icon="el-icon-plus"
              size="small"
              style="float:right"
              class="primary-button"
            >Thêm mới</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-form>
    <h4>Công tác xử lý vi phạm về PCCC</h4>
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
          <el-table-column width="100" label="STT" align="center">
            <template slot-scope="scope">{{ scope.$index +1 }}</template>
          </el-table-column>
          <el-table-column width="200" label="Thời gian" min-width="96">
            <template
              slot-scope="scope"
              v-if="scope.row.thoi_gian"
            >{{formatDate(scope.row.thoi_gian)}}</template>
          </el-table-column>
          <el-table-column label="Hành vi vi phạm quy định về PCCC" align="center">
            <el-table-column prop="noi_dung_hanh_vi" label="Nội dung hành vi cụ thể"></el-table-column>
            <el-table-column label="Nhóm hành vi">
              <template slot-scope="scope">
                <div v-if="scope.row.nhom_hanh_vis.length > 0">
                  <span v-for="(item, index) in scope.row.nhom_hanh_vis" :key="item.id">
                    {{index + 1}}. {{item.ten_nhom_hanh_vi}}
                    <br />
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="toa_nha.ten" label="Cơ sở vi phạm" align="center"></el-table-column>
          <el-table-column prop="doi_tuong_vi_pham" label="Đối tượng vi phạm" align="center"></el-table-column>
          <el-table-column label="Biện pháp xử lý" align="center">
            <el-table-column label="Cảnh cáo">
              <template slot-scope="scope">
                <el-tag type="danger" effect="plain" v-if="scope.row.canh_cao">Đã cảnh cáo</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="phat_tien" label="Phạt tiền (Triệu đồng)">
              <template slot-scope="scope">
                <div v-if="scope.row.phat_tien">{{scope.row.phat_tien}} (VNĐ)</div>
              </template>
            </el-table-column>
            <el-table-column label="Tạm đình chỉ">
              <template slot-scope="scope">
                <div v-if="scope.row.tam_dinh_chi">
                  Từ ngày: {{formatDate(scope.row.ngay_tam_dinh_chi)}}
                  <br />
                  Đến ngày: {{formatDate(scope.row.ngay_phuc_hoi)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Đình chỉ">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.dinh_chi" type="danger" effect="plain">Đã đình chỉ</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="xu_ly_khac" label="Xử lý khác"></el-table-column>
          </el-table-column>
          <el-table-column label="File đính kèm">
            <template slot-scope="scope">
              <el-upload
                class="upload"
                :action="urlUpload"
                :headers="token"
                :data="{id:scope.row.id,type_reference:'xu_ly_vi_pham'}"
                :file-list="scope.row.files"
                :on-preview="download"
              ></el-upload>
            </template>
          </el-table-column>
          <el-table-column label="Hành động" fixed="right" align="center" width="110">
            <template slot-scope="scope">
              <router-link :to="'/congtacphongchay/xulyvipham/show/'+scope.row.id">
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
import { getXuLyViPham, deleteXuLyViPham } from "@/api/xulyvipham";
import { getToaNhaSearch } from "@/api/toanha";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { getToken } from "@/utils/auth";

import axios from "axios";

export default {
  data() {
    return {
      urlUpload: process.env.VUE_APP_BASE_API + "upload",
      disabledTinhThanh: true,
      page: 1,
      per_page: 10,
      token: {},
      total: 0,
      tableData: null,
      listLoading: true,
      search: "",
      form: {
        toa_nha_id: "",
        ngay_cap: "",
        tinh_thanh_id: ""
      },

      options: {
        toanhas: [],
        tinhthanhs: []
      }
    };
  },
  created() {
    this.getData();
    this.token = {
      Authorization: "Bearer " + getToken()
    };
    getInfor().then(res => {
      if (res.data.tinh_thanh_id != null) {
        this.disabledTinhThanh = true;
        getToaNhaSearch({ tinh_thanh_id: res.data.tinh_thanh_id }).then(res => {
          this.options.toanhas = res.data.data;
        });
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
    formatDate(d) {
      var date = new Date(d);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      if (day < 10) day = "0" + day;
      if (month < 10) month = "0" + month;
      return day + "/" + month + "/" + date.getUTCFullYear();
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    download(file) {
      if (!file.id) {
        file.id = file.response.result;
      }
      axios({
        url: process.env.VUE_APP_BASE_API + "building/" + file.id + "/file",
        method: "GET",
        headers: { ["Authorization"]: "Bearer " + getToken() },
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
      });
    },
    async getData(page = 1, per_page = 10) {
      this.listLoading = true;
      getXuLyViPham().then(response => {
        this.tableData = response.data.data;
        this.page = response.data.current_page;
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    changeTinhThanh(val) {
      getToaNhaSearch({ tinh_thanh_id: val, per_page: 9999999 }).then(res => {
        this.options.toanhas = res.data.data;
      });
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getXuLyViPham(this.form).then(response => {
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
        let comfirm = await this.$confirm("Bạn có chắc chắn muốn xóa vi phạm: " +  "<strong>" + data.noi_dung_hanh_vi +  "</strong>" + " Ngày " +  "<strong>" +  this.formatDate(data.thoi_gian) + "</strong>", "Xóa", {
          confirmButtonText: "Xóa",
          dangerouslyUseHTMLString: true,
          cancelButtonText: "Hủy",
          type: "warning"
        });
        this.listLoading = true;
        let status = await deleteXuLyViPham(data.id);
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
