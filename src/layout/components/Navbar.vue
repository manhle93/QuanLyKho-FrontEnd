<template>
  <div class="navbar" style="display:flex;flex-direction: row;background: green;margin-bottom: 0px;">
    <div style="width: 60%; display:flex; justify-content: center; align-items: center">
      <Menu/>
    </div>
    <div style="width: 40%; display:flex; justify-content: flex-end; align-items: center">
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
import { getMenus } from "@/api/user";
import logo from "@/assets/logo/logorbt.jpg";
import Menu from "./menu";

export default {
  components: {
    Breadcrumb,
    Menu
  },
  data() {
    return {
      src: process.env.VUE_APP_BASE + "images/avatar/avatar_for_none.png",
      homeIcon: false,
      logo: logo,
      activeIndex2: '1',
      menus: []
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  created() {
    this.fetchData();
  },
  methods: {
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
      getMenus().then((res) => {
        this.menus = res.data
      });
    },
    async getThongBao(realTime) {
      this.dsOffline = data;
    },
  },
};
</script>

<style lang="scss">
.el-dropdown-menu {
  z-index: 10000 !important;
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
