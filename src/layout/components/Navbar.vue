<template>
  <div class="navbar" style="display:flex;flex-direction: row;background: green;">
    <div style="width: 70%; display:flex; justify-content: center; align-items: center">
     <el-menu
        :default-active="activeIndex2"
        mode="horizontal"
        @select="handleSelect"
        background-color="green"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">Tổng quan</el-menu-item>
        <el-submenu index="2" style="margin-right:20px;">
          <template slot="title" style="font-size:14px !important" class="menu_con">Hàng hóa</template>
          <el-menu-item index="2-1">Nhóm hàng hóa</el-menu-item>
          <el-menu-item index="2-2">Thiết lập giá</el-menu-item>
          <el-menu-item index="2-2">Danh sách hàng hóa</el-menu-item>
          <el-menu-item index="2-2">Hàng tồn kho</el-menu-item>
          <el-menu-item index="2-2">Danh sách kho</el-menu-item>
        </el-submenu>
        <el-submenu index="3" style="margin-right:20px;">
          <template slot="title">Giao dịch</template>
          <el-menu-item index="3-1">Hóa đơn</el-menu-item>
          <el-menu-item index="3-2">Đặt hàng</el-menu-item>
          <el-menu-item index="3-3">Nhập kho</el-menu-item>
          <el-menu-item index="3-4">Đổi trả hàng</el-menu-item>
          <el-menu-item index="3-5">Kiểm kê kho</el-menu-item>
          <el-menu-item index="3-6">Xuất hủy</el-menu-item>
          <el-menu-item index="3-7">Thanh toán NCC</el-menu-item>
          <el-menu-item index="3-8">Hóa đơn đã hủy</el-menu-item>
          <el-menu-item index="3-9">Lịch sử nạp tiền</el-menu-item>
        </el-submenu>
        <el-submenu index="4" style="margin-right:20px;">
          <template slot="title">Người dùng</template>
          <el-menu-item index="2-1">Danh sách người dùng</el-menu-item>
          <el-menu-item index="2-2">Danh sách nhân viên</el-menu-item>
          <el-menu-item index="2-2">Lịch sử đăng nhập</el-menu-item>
          <el-menu-item index="2-2">Lịch sử đăng nhập</el-menu-item>
          <el-menu-item index="2-2">Lịch sử hoạt động</el-menu-item>
        </el-submenu>
        <el-submenu index="5" style="margin-right:20px;">
          <template slot="title">Khách hàng</template>
          <el-menu-item index="2-1">Danh sách khác hàng</el-menu-item>
          <el-menu-item index="2-2">Lịch sử đăng nhập</el-menu-item>
          <el-menu-item index="2-2">Lịch sử nạp tiền</el-menu-item>
        </el-submenu>
        <el-submenu index="6" style="margin-right:20px;">
          <template slot="title">Nhà cung cấp</template>
          <el-menu-item index="2-1">Danh sách nhà cung cấp</el-menu-item>
          <el-menu-item index="2-1">Trả hàng</el-menu-item>
          <el-menu-item index="2-1">Báo giá</el-menu-item>
          <el-menu-item index="2-2">Lịch sử đăng nhập</el-menu-item>
          <el-menu-item index="2-3">Đơn hàng nhà cung cấp</el-menu-item>
          <el-menu-item index="2-4">Trả hàng nhà cung cấp</el-menu-item>
          <el-menu-item index="2-4">Thanh toán</el-menu-item>
          <el-menu-item index="2-5">Phân quyền</el-menu-item>
        </el-submenu>
        <el-submenu index="7" style="margin-right:20px;">
          <template slot="title">Báo cáo</template>
          <el-menu-item index="2-1">Báo cáo cuối ngày</el-menu-item>
          <el-menu-item index="2-2">Báo cáo bán hàng</el-menu-item>
          <el-menu-item index="2-3">Báo cáo đặt hàng</el-menu-item>
          <el-menu-item index="2-4">Báo cáo hàng hóa</el-menu-item>
          <el-menu-item index="2-5">Báo cáo khách hàng</el-menu-item>
          <el-menu-item index="2-5">Báo cáo nhà cung cấp</el-menu-item>
          <el-menu-item index="2-5">Báo cáo nhân viên</el-menu-item>
          <el-menu-item index="2-5">Báo cáo tài chính</el-menu-item>
        </el-submenu>
        <el-submenu index="8" style="margin-right:20px;">
          <template slot="title">Nâng cao</template>
          <el-menu-item index="2-1">Tích điểm thưởng</el-menu-item>
          <el-menu-item index="2-2">Lịch sử đăng nhập</el-menu-item>
          <el-menu-item index="2-3">Phân quyền</el-menu-item>
          <el-menu-item index="2-4">Bài viết</el-menu-item>
          <el-menu-item index="2-5">Phân quyền</el-menu-item>
        </el-submenu>
        <el-submenu index="9" style="margin-right:20px;">
          <template slot="title">Thiết lập chung</template>
          <el-menu-item index="2-1">Slide</el-menu-item>
          <el-menu-item index="2-2">Món ngon mỗi ngày</el-menu-item>
          <el-menu-item index="2-3">Khuyến mãi</el-menu-item>
          <el-menu-item index="2-4">Bài viết</el-menu-item>
          <el-menu-item index="2-5">Voucher</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div style="width: 30%; display:flex; justify-content: flex-end; align-items: center">
        <div style="margin-right:50px;">
          <el-button size="small" class="primary-button" @click="banHang()">BÁN HÀNG</el-button>
          <el-button size="small" type="warning" @click="datHang()">ĐẶT HÀNG</el-button>
        </div>
        <div class="right-menu">
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <img :src="src" class="user-avatar" />
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <router-link to="/users/taikhoan">
                <el-dropdown-item>
                  <label>Thông tin tài khoản</label>
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <span style="display:block;" @click="logout()">
                  <label>Đăng xuất</label>
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import { getInfor } from "@/api/taikhoan";
import { getSoThietBi, getThongBao, docThongBao } from "@/api/baocao";
import logo from "@/assets/logo/logorbt.jpg";

var realTimeThongBao;
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png",
      homeIcon: false,
      online: 0,
      offline: 0,
      soThongBao: 0,
      dsOnline: [],
      dsOffline: [],
      perPageThongBao: 5,
      loadingThongBao: false,
      thongBao: 0,
      ten_tinh_thanh: null,
      logo: logo,
      activeIndex2: '1'
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    danhSachDon() {
      this.homeIcon = false;
      this.$router.push("/quanlydonhang/dathang");
    },
    loadThongBao() {
      if (!this.loadingThongBao) {
        this.getThongBao(false);
        clearInterval(realTimeThongBao);
      }
    },
    formatDateTime(time) {
      var date = new Date(time);
      var h = date.getHours();
      var min = date.getMinutes();
      if (h < 10) {
        h = "0" + h;
      }
      if (min < 10) {
        min = "0" + min;
      }
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
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/customer/login?redirect=${this.$route.fullPath}`);
      clearInterval(realTimeThongBao);
    },
    async getSoThietBi() {
      try {
        let data = await getSoThietBi();
        this.soThongBao = data["thongbaomoi"];
        this.online = data.online;
        this.offline = data["offline"];
      } catch (error) {
        return;
      }
    },
    async docThongBao() {
      this.soThongBao = 0;
      clearInterval(realTimeThongBao);
      await docThongBao();
    },
    banHang() {
      this.$store.state.datmuahang.banHang = true;
      this.$router.push("/quanlydonhang/taodondathang");
    },
    datHang() {
      this.$store.state.datmuahang.banHang = false;
      this.$router.push("/quanlydonhang/taodondathang");
    },
    fetchData() {
      getInfor().then((res) => {
        if (
          res.data.role_id == 2 &&
          this.$route.path == "/quanlydonhang/taodondathang"
        ) {
          this.homeIcon = true;
        }
        if (res.data.avatar_url == null || res.data.avatar_url == "") {
          this.src =
            process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png";
        } else {
          this.src = process.env.VUE_APP_BASE + res.data.avatar_url;
        }
      });
    },
    async getThongBao(realTime) {
      this.loadingThongBao = true;
      if (!realTime) this.perPageThongBao = this.perPageThongBao + 5;
      let data = await getThongBao({ perPage: this.perPageThongBao });
      this.dsOffline = data;
      this.loadingThongBao = false;
    },
  },
};
</script>

<style lang="scss">
.el-dropdown-menu {
  z-index: 100000000000 !important;
}
.el-menu-item {
  font-size: 14px !important;
}
.el-submenu {
  font-size: 14px !important;
}
.el-submenu__title {
  font-size: 14px !important;
}
.menu_con {
  font-size: 14px !important;
}
.icon-status {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .right-menu {
    height: 100%;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

// CSS Scroll
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: green;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
