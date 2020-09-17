<template>
  <div class="app-container">
    <h4>Danh sách nhân viên</h4>
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
        <el-col :span="7">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
          >Tìm kiếm</el-button>
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
      <el-table-column prop="name" min-width="160" label="Họ Tên">
        <template slot-scope="scope">
          <div style="display: flex; flex-wrap: nowrap; align-items: center;">
            <img
              :src="
                scope.row.avatar_url
                  ? env + scope.row.avatar_url
                  : env + 'images/avatar/avatar_for_none.png'
              "
              style="width: 50px; height: 50px; border-radius: 50%; cursor: pointer"
              @click="showUser(scope.row)"
            />
            <div
              style="padding-left: 20px; font-weight:bold; cursor: pointer"
              @click="showUser(scope.row)"
            >{{ scope.row.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="Tên đăng nhập" min-width="150"></el-table-column>
      <el-table-column label="Số điện thoại" min-width="157" prop="phone"></el-table-column>
      <el-table-column prop="nhan_vien.so_cmt" label="Số chứng minh thư" min-width="150"></el-table-column>
      <el-table-column min-width="157" label="Địa chỉ" prop="nhan_vien.dia_chi"></el-table-column>
      <el-table-column
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
      <el-table-column align="center" min-width="110" fixed="right" label="Hoạt động">
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

    <el-dialog title="Thông tin tài khoản" :visible.sync="showUserDetail" width="30%" center>
      <div style="display: flex; justify-content: center">
        <div v-if="UserInfo.avatar_url">
          <img
            :src="env + UserInfo.avatar_url"
            style="height: 100px; width: auto; border-radius: 10px"
          />
        </div>
        <div v-if="!UserInfo.avatar_url">
          <img :src="env + 'images/avatar/avatar_for_none.png'" style="height: 100px; width: auto" />
        </div>
      </div>
      <br />
      <br />
      <br />
      <div style="display:flex">
        <div style="flex-grow: 1">
          <label>Họ tên:</label>
          {{ UserInfo.name }}
          <br />
          <br />
          <br />
          <label>Email:</label>
          {{ UserInfo.email }}
          <br />
          <br />
          <br />
          <label>Quyền:</label>
          <span v-if="UserInfo.role">{{ UserInfo.role.name }}</span>
        </div>
        <div style="flex-grow: 1;">
          <label>Tên đăng nhập:</label>
          {{ UserInfo.username }}
          <br />
          <br />
          <br />
          <label>SĐT:</label>
          {{ UserInfo.phone }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="primary-button" @click="showUserDetail = false" icon="el-icon-close">Đóng</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Cập nhật thông tin nhân viên" :visible.sync="showEditForm" center width="40%">
      <el-form
        :label-position="labelPosition"
        :rules="rules"
        ref="formLabelAlign"
        label-width="100px"
        :model="formLabelAlign"
      >
        <el-row>
          <el-col style="text-align: center">
            <div class="block">
              <img style="widht: 130px; height: 130px" :src="env + src" />
              <input
                ref="upload-image"
                class="upload-image"
                type="file"
                @change="handleChange($event)"
              />
              <!-- <br />
              <el-tooltip
                class="item"
                effect="dark"
                content="Thay đổi ảnh đại diện"
                placement="top"
              >
                <el-button
                  class="primary-button block"
                  style="margin-top:20px;"
                  @click="handleUpload"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip> -->
              <!-- <img :src="src" > -->
            </div>
          </el-col>
        </el-row>
        <br>
        <el-row :gutter="20" justify="space-around">
          <el-col :span="11">
            <el-form-item prop="name">
              <i class="fa fa-user"></i>
              <label>Họ và tên</label>
              <el-input size="small" v-model="formLabelAlign.name" placeholder="Nhập vào họ và tên"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="username">
              <label>
                <i class="fa fa-user"></i> Tên đăng nhập
              </label>
              <el-input
                size="small"
                v-model="formLabelAlign.username"
                placeholder="Nhập vào tên đăng nhập"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item>
              <i class="fa fa-mobile"></i>
              <label>Số điện thoại</label>
              <el-input
                size="small"
                v-model="formLabelAlign.phone"
                placeholder="Nhập vào số điện thoại"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="email">
              <label>
                <i class="fa fa-envelope-o"></i> Email
              </label>
              <el-input size="small" v-model="formLabelAlign.email" placeholder="Nhập vào email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="password">
              <i class="fa fa-lock"></i>
              <label>Địa chỉ</label>
              <el-input
                size="small"
                v-model="formLabelAlign.dia_chi"
                placeholder="Địa chỉ thường chú"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="password_confirmation">
              <label>
                <i class="fa fa-lock"></i> Số CMT
              </label>
              <el-input
                size="small"
                v-model="formLabelAlign.so_cmt"
                placeholder="Số chứng minh thư"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="role_id">
              <i class="fa fa-cog"></i>
              <label>Ngày bắt đầu làm việc</label>
              <el-date-picker
                format="dd/MM/yyyy"
                size="small"
                style="width: 100%"
                v-model="formLabelAlign.ngay_bat_dau_lam_viec"
                type="date"
                placeholder="Ngày bắt đầu làm việc"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item>
              <i class="fa fa-cog"></i>
              <label>Số điện thoại người thân</label>
              <el-input
                size="small"
                v-model="formLabelAlign.so_dien_thoai_nguoi_than"
                placeholder="Số điện thoại người thân"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-button
            class="primary-button"
            icon="el-icon-check"
            style="width:100%;"
            :loading="loading"
            @click="submit('formLabelAlign')"
          >CẬP NHẬT</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, deleteUser, updateNhanVien } from "@/api/user";
import { getInfor } from "@/api/taikhoan";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      env: process.env.VUE_APP_BASE,
      list: null,
      src: "images/avatar/avatar_for_none.png",
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
        search: null,
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
          description: "",
        },
      },
      loading: false,
      showUserDetail: false,
      UserInfo: {},
      formLabelAlign: {
        user_id: null,
        name: null,
        username: null,
        phone: null,
        email: null,
        dia_chi: null,
        so_cmt: null,
        ngay_bat_dau_lam_viec: null,
        so_dien_thoai_nguoi_than: null,
      },
      actives: [
        { value: true, label: "Hoạt động" },
        { value: false, label: "Không hoạt động" },
      ],
      rules: {
        name: [
          {
            required: true,
            message: "Tên không được bỏ trống",
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: "Tên đăng nhập không được bỏ trống",
            trigger: "blur",
          },
          { unique: true, message: "Tên đăng nhập bị trùng", trigger: "blur" },
        ],
        email: [
          {
            required: true,
            message: "Email không được bỏ trống",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Hãy nhập một địa chỉ email hợp lệ",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    submit(editUsers) {
      this.$refs[editUsers].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.formLabelAlign.email = this.formLabelAlign.email.toLowerCase();
          updateNhanVien(this.formLabelAlign)
            .then((res) => {
              this.loading = false;
              this.showEditForm = false;
              this.fetchData();
            })
            .catch((error) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    showUpdate(user) {
      this.showEditForm = true;
      this.formLabelAlign.user_id = user.id;
      this.formLabelAlign.username = user.username;
      this.formLabelAlign.name = user.name;
      this.formLabelAlign.phone = user.phone;
      this.formLabelAlign.email = user.email;
      this.formLabelAlign.ngay_bat_dau_lam_viec = user.created_at;
      if(user.avatar_url){
        this.src = user.avatar_url
      }else {
        this.src = "images/avatar/avatar_for_none.png"
      }
      if (user.nhan_vien) {
        this.formLabelAlign.dia_chi = user.nhan_vien.dia_chi;
        this.formLabelAlign.so_cmt = user.nhan_vien.so_cmt;
        this.formLabelAlign.so_dien_thoai_nguoi_than =
          user.nhan_vien.so_dien_thoai_nguoi_than;
      } else {
        this.formLabelAlign.dia_chi = null;
        this.formLabelAlign.so_cmt = null;
        this.formLabelAlign.so_dien_thoai_nguoi_than = null;
      }
    },
    handleChange(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);
      userAvatar(this.userId, data)
        .then((res) => {
          this.formLabelAlign.avatar_url = res;
          this.src = process.env.VUE_APP_BASE + res;
        })
        .catch((error) => {});
    },

    handleUpload() {
      this.$refs["upload-image"].click();
    },
    showUser(data) {
      this.showUserDetail = true;
      this.UserInfo = data;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },
    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    async fetchData(page = 1, per_page = 10) {
      this.listLoading = true;
      await getInfor().then((res) => {
        this.user_login = res.data;
      });
      getUser({ page: this.page, per_page: this.per_page, role: [2] }).then(
        (response) => {
          this.list = response.data.data;
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
      getUser(this.form).then((response) => {
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
          message: "Thêm mới thành công",
        });
        this.fetchData();
      }
    },
    handleEditUser(result) {
      if (result === true) {
        this.showEditForm = false;
        this.$message({
          type: "success",
          message: "Cập nhập thành công",
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
          type: "warning",
        }
      )
        .then((_) => {
          deleteUser(item.id).then((res) => {
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.fetchData();
          });
        })
        .catch((_) => {});
    },
  },
};
</script>
<style>
.search {
  margin-bottom: 20px;
}
</style>
