<template>
  <div class="app-container">
    <h4>Lịch sử hoạt động</h4>
    <el-form class="search" :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="4">
          <el-select
            size="small"
            v-model="form.user_id"
            clearable
            filterable
            placeholder="Tài khoản"
            style="width: 100%"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left"
                ><i class="el-icon-user-solid" style="padding-right: 10px"></i
                >{{ item.name }}</span
              >
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.username
              }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            size="small"
            v-model="form.hanh_vi"
            clearable
            filterable
            placeholder="Hành vi"
            style="width: 100%"
          >
            <el-option value="created" label="THÊM MỚI">
              <i class="el-icon-plus" style="padding-right: 10px"></i> Thêm mới
            </el-option>
            <el-option value="updated" label="CẬP NHẬT THÔNG TIN">
              <i class="el-icon-check" style="padding-right: 10px"></i> Cập nhật
              thông tin
            </el-option>
            <el-option value="deleted" label="XÓA">
              <i class="el-icon-delete" style="padding-right: 10px"></i> Xóa dữ
              liệu
            </el-option>
            <el-option value="login_fail" label="XÓA">
              <i class="el-icon-lock" style="padding-right: 10px"></i> Khóa tài
              khoản
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            size="small"
            v-model="form.doi_tuong"
            clearable
            filterable
            placeholder="Đối tượng"
            style="width: 100%"
          >
            <el-option value="diem_chay" label="ĐIỂM CHÁY">
              <i class="fas fa-fire" style="padding-right: 10px"></i>Điểm cháy
            </el-option>
            <el-option value="user" label="NGƯỜI DÙNG">
              <i class="el-icon-user" style="padding-right: 10px"></i>Người dùng
            </el-option>
            <el-option value="can_bo_chien_si" label="CÁN BỘ CHIẾN SĨ">
              <i class="el-icon-user-solid" style="padding-right: 10px"></i>Cán
              bộ chiến sĩ
            </el-option>
            <el-option value="lich_truc" label="LỊCH TRỰC">
              <i
                class="el-icon-date"
                style="padding-right: 15px; font-size: 18px;"
              ></i
              >Lịch trực
            </el-option>
            <el-option value="phuong_tien_pccc" label="PHƯƠNG TIỆN PCCC">
              <i class="fas fa-truck" style="padding-right: 10px"></i>Phương
              tiện PCCC
            </el-option>
            <el-option value="toa_nha" label="CƠ SỞ CÔNG TRÌNH">
              <i class="el-icon-school" style="padding-right: 10px"></i>Cơ sở
              công trình
            </el-option>
            <el-option value="don_vi_ho_tro" label="ĐƠN VỊ HỖ TRỢ">
              <i
                class="el-icon-first-aid-kit"
                style="padding-right: 10px; font-size: 18px; font-weight: bold"
              ></i
              >Đơn vị hỗ trợ
            </el-option>
            <el-option value="don_vi_pccc" label="ĐƠN VỊ PCCC">
              <i class="fas fa-shield-alt" style="padding-right: 10px"></i>Đơn
              vị PCCC
            </el-option>

            <el-option value="cam_bien" label="CẢM BIẾN">
              <i
                class="el-icon-stopwatch"
                style="padding-right: 10px; font-size: 16px; font-weight: bold"
              ></i
              >Cảm biến
            </el-option>
            <el-option value="thiet_bi" label="THIẾT BỊ TRUNG TÂM">
              <i class="far fa-dot-circle" style="padding-right: 10px"></i>Thiết
              bị trung tâm
            </el-option>
            <el-option value="thiet_bi_quay" label="THIẾT BỊ QUAY">
              <i class="fas fa-video" style="padding-right: 10px"></i>Thiết bị
              quay
            </el-option>
            <el-option value="diem_lay_nuoc" label="ĐIỂM LẤY NƯỚC">
              <i class="fas fa-swimming-pool" style="padding-right: 10px"></i
              >Điểm lấy nước
            </el-option>
            <el-option value="kiem_tra_toa_nha" label="KIÊM TRA TÒA NHÀ">
              <i
                class="el-icon-document-checked"
                style="padding-right: 10px; font-size: 18px; font-weight: bold"
              ></i
              >Kiểm tra tòa nhà
            </el-option>
            <el-option value="dan_cu" label="DÂN CƯ">
              <i class="fas fa-user-friends" style="padding-right: 10px"></i>Dân
              cư
            </el-option>
            <el-option
              value="huan_luyen_boi_duong"
              label="HUẤN LUYỆN BỒI DƯỠNG NGHIỆP VỤ PCCC"
            >
              <i
                class="el-icon-notebook-1"
                style="padding-right: 10px; font-size: 18px;"
              ></i
              >Huấn luyện bồi dưỡng nghiệp vụ PCCC
            </el-option>
            <el-option
              value="tham_duyet"
              label="THẨM DUYỆT CẤP GIẤY CHỨNG NHẬN PCCC"
            >
              <i
                class="el-icon-edit-outline"
                style="padding-right: 10px; font-size: 18px;"
              ></i
              >Thẩm duyệt cấp giấy chứng nhận PCCC
            </el-option>
            <el-option value="xu_ly_vi_pham" label="XỬ LÝ VI PHẠM VỀ PCCC">
              <i
                class="far fa-file-excel"
                style="padding-right: 15px; font-size: 18px;"
              ></i
              >Xử lý vi phạm về PCCC
            </el-option>
            <el-option value="cuu_ho_cuu_nan" label="CỨU NẠN CỨU HỘ">
              <i
                class="el-icon-help"
                style="padding-right: 15px; font-size: 18px;"
              ></i
              >Cứu nạn cứu hộ
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="form.date"
            style="width: 100%"
            type="daterange"
            range-separator="-"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            size="small"
            format="dd/MM/yyyy"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
            >Tìm kiếm</el-button
          >
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
      <el-table-column
        label="STT"
        min-width="55"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column prop="user.name" width="250" label="Họ và tên">
        <template slot-scope="scope">
          <div
            style="display: flex; flex-wrap: nowrap; align-items: center;"
            v-if="scope.row.user"
          >
            <img
              :src="
                scope.row.user.avatar_url
                  ? env + scope.row.user.avatar_url
                  : env + 'images/avatar/avatar_for_none.png'
              "
              style="width: 50px; height: 50px; border-radius: 50%; cursor: pointer"
              @click="showUser(scope.row.user)"
            />
            <div
              style="padding-left: 20px; font-weight:bold; cursor: pointer"
              @click="showUser(scope.row.user)"
            >
              {{ scope.row.user.name }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="user.username"
        label="Tên đăng nhập"
        width="200"
      ></el-table-column>
      <el-table-column sortable label="Thời gian" width="250">
        <template slot-scope="scope">{{
          formatDateTime(scope.row.created_at)
        }}</template>
      </el-table-column>
      <el-table-column label="Hành động" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.hanh_dong == 'updated'">
            <el-tag effect="plain" type="primary">Cập nhật</el-tag>
          </div>
          <div v-if="scope.row.hanh_dong == 'created'">
            <el-tag effect="plain" type="success">Thêm mới</el-tag>
          </div>
          <div v-if="scope.row.hanh_dong == 'deleted'">
            <el-tag effect="plain" type="danger">Xóa</el-tag>
          </div>
          <div v-if="scope.row.hanh_dong == 'login_fail'">
            <el-tag effect="plain" type="danger">Khóa tài khoản</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="noi_dung"
        label="Nội dung"
        min-width="150"
      ></el-table-column>
      <el-table-column label="Đối tượng" min-width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 'diem_lay_nuoc'">
            Điểm lấy nước ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'user'">
            User ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'can_bo_chien_si'">
            Cán bộ chiến sĩ ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'phuong_tien_pccc'">
            Phương tiện PCCC ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'don_vi_ho_tro'">
            Đơn vị hỗ trợ ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'don_vi_pccc'">
            Đơn vị PCCC (PC07) ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'cam_bien'">
            Cảm biến ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'thiet_bi'">
            Thiết bị trung tâm ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'thiet_bi_quay'">
            Thiết bị quay ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'kiem_tra_toa_nha'">
            Kiểm tra tòa nhà ID: {{ scope.row.reference_id }}
          </div>

          <div v-if="scope.row.type == 'dan_cu'">
            Thiết bị trung tâm ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'huan_luyen_boi_duong'">
            Huấn luyện bồi dưỡng PCCC ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'tham_duyet'">
            Thẩm duyệt cấp giấy phép PCCC ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'xu_ly_vi_pham'">
            Xử lý vi phạm PCCC ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'diem_chay'">
            Điểm cháy ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'toa_nha'">
            Cơ sở công trình ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'lich_truc'">
            Lịch trực ID: {{ scope.row.reference_id }}
          </div>
          <div v-if="scope.row.type == 'cuu_ho_cuu_nan'">
            Cứu nạn cứu hộ ID: {{ scope.row.reference_id }}
          </div>
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
    <el-dialog
      title="Thông tin tài khoản"
      :visible.sync="showUserDetail"
      width="30%"
      center
    >
      <div style="display: flex; justify-content: center">
        <div v-if="UserInfo.avatar_url">
          <img
            :src="env + UserInfo.avatar_url"
            style="height: 100px; width: auto; border-radius: 10px"
          />
        </div>
        <div v-if="!UserInfo.avatar_url">
          <img
            :src="env + 'images/avatar/avatar_for_none.png'"
            style="height: 100px; width: auto"
          />
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
          <br />
          <br />
          <br />
          <label>Tỉnh thành:</label>
          <span v-if="UserInfo.tinh_thanh">{{ UserInfo.tinh_thanh.name }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="primary-button"
          @click="showUserDetail = false"
          icon="el-icon-close"
          >Đóng</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getLichSuHoatDong, getUser } from "@/api/user";
import { getTinhThanh } from "@/api/TinhThanh";
import { getAllToaNha } from "@/api/toanha";
import { getInfor } from "@/api/taikhoan";

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
      env: process.env.VUE_APP_BASE,
      showUserDetail: false,
      UserInfo: {},
      list: null,
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
        user_id: null,
        date: null,
        hanh_vi: null,
        doi_tuong: null
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
          description: ""
        }
      },
      users: [],
      actives: [
        { value: true, label: "Hoạt động" },
        { value: false, label: "Không hoạt động" }
      ]
    };
  },
  created() {
    this.fetchData();
    this.getUser();
  },
  methods: {
    async getUser() {
      let data = await getUser({ per_page: 999999 });
      this.users = data.data.data;
    },
    viewDetail(data) {},
    formatDateTime(time) {
      try {
        var date = new Date(time);
        var h = date.getHours();
        var min = date.getMinutes();
        if (h < 10) h = "0" + h;
        if (min < 10) min = "0" + min;
        return (
          h +
          ":" +
          min +
          " Ngày " +
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getUTCFullYear()
        );
      } catch {
        return null;
      }
    },
    showUser(data) {
      this.showUserDetail = true;
      this.UserInfo = data;
    },
    showUpdate(user) {
      this.showEditForm = true;
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
    async fetchData(page = 1, per_page = 10) {
      this.listLoading = true;
      let response = await getLichSuHoatDong({
        page: this.page,
        per_page: this.per_page
      });
      this.list = response.data;
      this.page = response.current_page;
      this.per_page = response.per_page;
      this.total = response.total;
      this.listLoading = false;
    },
    searchData(page = 1, per_page = 10) {
      this.listLoading = true;
      this.form.page = this.page;
      this.form.per_page = this.per_page;
      getLichSuHoatDong(this.form).then(response => {
        this.list = response.data;
        this.page = response.current_page;
        this.per_page = response.per_page;
        this.total = response.total;
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
          message: "Thêm mới thành công"
        });
        this.fetchData();
      }
    },
    handleClose() {
      this.showEditForm = false;
      this.$emit("onRefresh");
    },
    handleEditUser(result) {
      if (result === true) {
        this.showEditForm = false;
        this.$message({
          type: "success",
          message: "Cập nhập thành công"
        });
        this.fetchData();
      }
    },

    deleteAppUserID(index, item) {
      this.$confirm("Bạn chắc chắn muốn xóa người dùng này?")
        .then(_ => {
          deleteUser(item.id).then(res => {
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
<style>
.search {
  margin-bottom: 20px;
}
</style>
