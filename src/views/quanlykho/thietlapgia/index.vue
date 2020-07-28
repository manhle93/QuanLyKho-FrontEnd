<template>
  <div class="app-container">
    <h3>Danh sách bảng giá</h3>
    <el-form class="search" :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="searchBangGia"
            suffix-icon="el-icon-search"
          ></el-input>
        </el-col>
        <el-col :span="7">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="getData()"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="12">
          <el-button
            style="float: right"
            @click="showFormAdd"
            size="small"
            icon="el-icon-plus"
            class="primary-button"
          >Thêm mới</el-button>
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
      <el-table-column label="STT" min-width="55" type="index" align="center"></el-table-column>
      <el-table-column sortable prop="ten" min-width="160" label="Tên bảng giá"></el-table-column>
      <el-table-column label="Thời gian bắt đầu" prop="ngay_bat_dau" min-width="157"></el-table-column>
      <el-table-column label="Thời gian bắt đầu" prop="ngay_ket_thuc" min-width="157"></el-table-column>
      <el-table-column label="Số sản phẩm" prop="so_san_pham" min-width="157"></el-table-column>
      <el-table-column align="center" min-width="140" fixed="right" label="Hoạt động">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
            <el-button
              size="small"
              style="background-color: #2E86C1; color: white"
              icon="el-icon-edit"
              circle
              @click="showUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Đặt giá sản phẩm" placement="top">
            <el-button
              size="small"
              type="warning"
              icon="el-icon-plus"
              circle
              @click="getBangGiaSanPham(scope.row.id, scope.row.ten)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteAppUserID(scope.row)"
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
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      :title="edit ? 'Cập nhật danh mục sản phẩm' :'Thêm danh mục sản phẩm'"
      :visible.sync="showForm"
      width="30%"
      center
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Tên bảng giá" prop="ten">
              <el-input v-model="form.ten"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Thời gian áp dụng">
              <el-date-picker
                style="width: 100%"
                v-model="form.thoi_gian"
                type="datetimerange"
                range-separator="-"
                start-placeholder="Bắt đầu"
                end-placeholder="Kết thúc"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Trạng thái" prop="ten">
              <br />
              <el-radio size="small" v-model="form.ap_dung" :label="true" border>Áp dụng</el-radio>
              <el-radio size="small" v-model="form.ap_dung" :label="false" border>Chưa áp dụng</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" icon="el-icon-close" @click="showForm = false">Cancel</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit"
          icon="el-icon-plus"
          @click="addBangGia('form')"
        >Thêm mới</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-else
          icon="el-icon-check"
          @click="updateBangGia('form')"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'Thiết lập giá sản phẩm ' +'('+ten_bang_gia+')'"
      :visible.sync="showFormAddGia"
      width="30%"
      center
    >
      <el-form>
        <el-row :gutter="15">
          <el-col :span="10">
            <el-form-item label="Sản phẩm">
              <el-select
                v-model="san_pham_id"
                placeholder="Chọn sản phẩm"
                size="small"
                @change="chonSanPham(san_pham_id)"
              >
                <el-option
                  v-for="item in sanPhams"
                  :key="item.id"
                  :label="item.ten_san_pham"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                  <span style="float: left">{{ item.ten_san_pham }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px"
                  >{{ item.gia_ban }} đ/{{item.don_vi_tinh}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="Giá bán">
              <el-input
                type="number"
                :min="0"
                size="small"
                placeholder="Nhập giá bán"
                v-model="gia_ban"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label>
              <br />
              <el-button
                size="small"
                type="warning"
                icon="el-icon-plus"
                circle
                @click="addSanPham()"
              ></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table height="300" :data="bangGiaSanPham" v-loading="loadSanPham">
        <el-table-column prop="san_pham.ten_san_pham" label="Tên sản phẩm"></el-table-column>
        <el-table-column prop="gia_ban" label="Giá bán mới">
          <template slot-scope="scope">{{formate.formatCurrency(scope.row.gia_ban) + ' đ'}}</template>
        </el-table-column>
        <el-table-column label="Xóa">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Chỉnh sửa" placement="top">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="xoaSanPham(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="warning"
          icon="el-icon-close"
          @click="showFormAddGia = false"
        >Cancel</el-button>
        <el-button
          class="primary-button"
          size="small"
          icon="el-icon-check"
          @click="updateBangGiaSanPham()"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
    <br />
    <h4>Danh sách sản phẩm</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="Thông tin tìm kiếm"
            v-model="searchSanPham"
            suffix-icon="el-icon-search"
          ></el-input>
        </el-col>
        <el-col :span="7">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="getDanhSachSanPham()"
          >Tìm kiếm</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="loadListSanPham"
      :data="listSanPham"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="font-size: 13px"
    >
      <el-table-column label="STT" min-width="55" type="index" align="center"></el-table-column>
      <el-table-column label="Hình ảnh" width="200" align="center">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.anh_dai_dien ? endPointImage + scope.row.anh_dai_dien: src"
            style="max-height: 90px; max-width: 90px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="ten_san_pham" min-width="160" label="Tên sản phẩm"></el-table-column>
      <el-table-column prop="danh_muc.ten_danh_muc" min-width="160" label="Danh mục"></el-table-column>
      <el-table-column prop="gia_ban" min-width="160" label="Đơn giá bán mặc định">
        <template slot-scope="scope">
          {{formate.formatCurrency(scope.row.gia_ban) + ' đ'}}
        </template>
      </el-table-column>
      <el-table-column prop="don_vi_tinh" min-width="160" label="Đơn vị tính"></el-table-column>
      <el-table-column label="Bảng giá" min-width="157">
        <template slot-scope="scope">
          <p v-for="item in scope.row.bang_gias" :key="item.id">{{item.ten}}</p>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChangeSp"
        @current-change="handleCurrentChangeSp"
        :page-sizes="[5, 10, 15, 20]"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  addBangGia,
  editBangGia,
  xoaBangGia,
  getBangGia,
  addSanPhamBangGia,
  getSanPhamBangGia,
  getSanPham
} from "@/api/banggia";
import { getTinhThanh } from "@/api/TinhThanh";
import { getInfor } from "@/api/taikhoan";
import { listSanPham } from "@/api/sanpham";

export default {
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
      src: process.env.VUE_APP_BASE + "images/avatar/product.png",
      endPointImage: process.env.VUE_APP_BASE,
      list: [],
      showForm: false,
      showFormAddGia: false,
      edit: false,
      page: 1,
      per_page: 10,
      total: 0,
      pageSp: 1,
      per_pageSp: 10,
      totalSp: 0,
      search: "",
      listLoading: true,
      labelPosition: "top",
      user: null,
      showFormAddBangGia: false,
      form: {
        id: null,
        thoi_gian: null,
        ten: null,
        ap_dung: true
      },
      bang_gia_san_pham: [],
      allBangGia: [],
      loadListSanPham: false,
      loadSanPham: true,
      sanPhams: [],
      sanpham: {},
      san_pham_id: null,
      gia_ban: null,
      bangGiaSanPham: [],
      bang_gia_id: null,
      listSanPham: [],
      searchBangGia: null,
      searchSanPham: null,
      ten_bang_gia: null,
      formate: formate,
      rules: {
        ten: [
          {
            required: true,
            message: "Tên bảng giá không thể bỏ trống",
            trigger: "blur"
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getData();
    this.getSanPham();
    this.getDanhSachSanPham();
  },
  methods: {
    showUpdate(data) {
      this.resetForm();
      this.edit = true;
      this.showForm = true;
      this.form.ten = data.ten;
      this.form.thoi_gian = [];
      if (data.ngay_bat_dau && data.ngay_ket_thuc) {
        this.form.thoi_gian[0] = new Date(data.ngay_bat_dau);
        this.form.thoi_gian[1] = new Date(data.ngay_ket_thuc);
      }
      this.form.ap_dung = data.ap_dung;
      this.form.id = data.id;
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 9999999
      });
      this.sanPhams = data.data.data;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData(this.page, this.per_page);
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.getData(this.page, this.per_page);
    },
    async getData(page, per_page) {
      this.listLoading = true;
      let data = await getBangGia({
        per_page: per_page,
        page: page,
        search: this.searchBangGia
      });
      this.list = data.data.data;
      this.listLoading = false;
      this.total = data.data.total;
      this.per_page = data.data.per_page;
      this.page = data.data.page;
    },
    searchData() {
      this.listLoading = true;
      getBangGia({ search: this.search }).then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    deleteAppUserID(item) {
      this.$confirm(
        "Bạn chắc chắn muốn xóa bảng giá: " +
          "<strong>" +
          item.ten +
          "</strong>",
        "Xóa bảng giá",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning"
        }
      )
        .then(_ => {
          xoaBangGia(item.id).then(res => {
            this.$message({
              message: "Xóa thành công",
              type: "success"
            });
            this.getData();
          });
        })
        .catch(_ => {});
    },
    showFormAdd() {
      this.resetForm();
      this.showForm = true;
    },
    addBangGia(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addBangGia(this.form).then(res => {
            this.resetForm();
            this.getData();
            this.$message({
              type: "success",
              message: "Thêm mới thành công"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateBangGia(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editBangGia(this.form.id, this.form).then(res => {
            this.resetForm();
            this.getData();
            this.$message({
              type: "success",
              message: "Cập nhật thành công"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    chonSanPham(id) {
      this.sanpham = this.sanPhams.find(el => el.id == id);
    },
    addSanPham() {
      if (this.sanpham.id && this.gia_ban) {
        this.bangGiaSanPham.push({
          san_pham: this.sanpham,
          gia_ban: this.gia_ban
        });
        for (let el of this.sanPhams) {
          if (this.sanpham.id == el.id) {
            el.disabled = true;
          }
        }
        this.sanpham = {};
        this.gia_ban = null;
        this.san_pham_id = null;
      }
    },
    resetForm() {
      this.showForm = false;
      this.bang_gia_id = null;
      this.sanpham = {};
      this.form = {
        id: null,
        thoi_gian: null,
        ten: null,
        ap_dung: true
      };
      this.gia_ban = null;
    },
    xoaSanPham(index, data) {
      this.bangGiaSanPham.splice(index, 1);
      for (let el of this.sanPhams) {
        if (data.san_pham.id == el.id) {
          el.disabled = false;
        }
      }
    },
    async getBangGiaSanPham(id, ten) {
      this.showFormAddGia = true;
      this.loadSanPham = true;
      this.bang_gia_id = id;
      this.bangGiaSanPham = [];
      this.ten_bang_gia = ten
      this.getSanPham();
      try {
        let data = await getSanPhamBangGia(id);
        for (let item of data.data) {
          this.bangGiaSanPham.push({
            san_pham: item.san_pham,
            gia_ban: item.gia_ban
          });
          for (let el of this.sanPhams) {
            if (item.san_pham_id == el.id) {
              el.disabled = true;
            }
          }
        }
        this.loadSanPham = false;
      } catch (error) {
        this.loadSanPham = false;
      }
    },
    async updateBangGiaSanPham() {
      let data = await addSanPhamBangGia(this.bang_gia_id, this.bangGiaSanPham);
      this.resetForm();
      this.showFormAddGia = false;
      this.bangGiaSanPham = [];
      this.getDanhSachSanPham()
      this.getData();
      this.$message({
        type: "success",
        message: "Thêm mới thành công"
      });
    },
    async getDanhSachSanPham() {
      this.loadListSanPham = true;
      let data = await getSanPham({
        per_page: this.per_pageSp,
        pageSp: this.pageSp,
        search: this.searchSanPham
      });
      this.listSanPham = data.data.data;
      this.loadListSanPham = false
    },
    handleCurrentChangeSp(val) {
      this.pageSp = val;
      this.getDanhSachSanPham(this.pageSp, this.per_pageSp);
    },

    handleSizeChangeSp(val) {
      this.per_pageSp = val;
      this.getDanhSachSanPham(this.pageSp, this.per_pageSp);
    },
  }
};
</script>
<style>
.search {
  margin-bottom: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: inherit;
  color: #8c939d;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.avatar {
  width: 40px;
  height: 40px;
  display: block;
}
.upload-image {
  display: none;
  z-index: -9999;
}
</style>
