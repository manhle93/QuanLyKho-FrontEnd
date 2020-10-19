<template>
  <div
    class="navbar"
    style="display:flex; flex-direction: row; justify-content: space-between; align-items: center"
  >
    <div v-if="homeIcon" style="margin-left: 20px">
      <el-tooltip class="item" effect="dark" content="Danh sách đơn hàng">
        <a @click="danhSachDon()">
          <img
            src="https://image.flaticon.com/icons/svg/3078/3078994.svg"
            style="height: 35px; width: auto;"
          />
        </a>
      </el-tooltip>
    </div>
    <hamburger
      v-else
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb class="breadcrumb-container" /> // Tên Router -->

    <!-- <div class="right-menu" style="margin-right: 10px">
      <el-dropdown class="avatar-container" trigger="click" style="margin-top: 5px">
        <div class="avatar-wrapper">
          <el-badge :value="soThongBao">
            <img
              @click="docThongBao"
              src="http://pcccapi.howizbiz.com/storage/images/avatar/1583375484.png"
              style="cursor: pointer; width: auto;height: 25px;"
            />
          </el-badge>
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
          v-infinite-scroll="loadThongBao"
          style="height:450px; overflow-y: auto; margin-top: -10px; width: 350px; overflow-x: hidden"
        >
          <el-row :gutter="20" align="center">
            <el-col :span="10" :offset="1" style="text-align:center">
              <span style="font-size: 12px; font-weight: bold">OFFLINE</span>
              <br />
              <div style="color: red; font-weight: bold">{{offline}}</div>
            </el-col>
            <el-col :span="9" :offset="2" style="text-align:center">
              <span style="font-size: 12px; font-weight: bold">ONLINE</span>
              <br />
              <div style="color: green; font-weight: bold">{{online}}</div>
            </el-col>
          </el-row>
          <el-dropdown-item v-for="item in dsOffline" :key="item.id">
            <el-tooltip placement="left-start">
              <div slot="content">
                <i class="el-icon-school" style="font-size: 16px"></i>
                <span style="margin-left: 5px" v-if="item.toa_nha != null">{{item.toa_nha.ten}}</span>
                <br />
                <br />
                <i class="el-icon-location" style="font-size: 16px"></i>
                <span
                  style="margin-left: 5px"
                  v-if="item.tinh_thanh != null"
                >{{item.tinh_thanh.name}}</span>
              </div>

              <el-row
                :gutter="20"
                :style="{backgroundColor: item.trang_thai_da_doc ? 'none': '#EBF5FB'}"
              >
                <el-col :span="3" v-if="item.noi_dung.indexOf('khởi tạo') != -1">
                  <div style="height: 80px;text-align: center; position: relative;">
                    <img
                      class="icon-status"
                      src="http://pcccapi.howizbiz.com/storage/images/avatar/1582683800.png"
                    />
                  </div>
                </el-col>
                <el-col :span="3" v-if="item.trang_thai == 'Online'">
                  <div style="height: 70px;text-align: center; position: relative;">
                    <img
                      class="icon-status"
                      src="https://image.flaticon.com/icons/svg/2345/2345659.svg"
                    />
                  </div>
                </el-col>
                <el-col
                  :span="3"
                  v-if="item.noi_dung.indexOf('khởi tạo') == -1 && item.trang_thai == 'Offline'"
                >
                  <div style="height: 70px;text-align: center; position: relative;">
                    <img
                      class="icon-status"
                      src="https://image.flaticon.com/icons/svg/1686/1686538.svg"
                    />
                  </div>
                </el-col>
                <el-col :span="19" :offset="1">
                  <div style="height: 80px; position: relative;">
                    <div
                      style="position: absolute; height: 50px;left: 0;top: 0;right: 0;bottom: 0; margin: auto;"
                    >
                      <el-row
                        style="line-height: 17px; font-size: 12px; font-weight: bold"
                      >{{item.noi_dung}}</el-row>
                      <i class="el-icon-date"></i>
                      <span style="font-size: 12px">Lúc: {{formatDateTime(item.updated_at)}}</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tooltip>
          </el-dropdown-item>
          <div style="text-align: center">
            <i v-if="loadingThongBao" class="el-icon-loading" style="color: black; "></i>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>-->

    <div style="display:flex; flex-direction: row; align-items: center">
      <div>
        <img style=" height: 50px; width: auto" :src="logo" />
      </div>
      <div
        style="color: #229954; font-size: 23px; padding-top: 5px; font-weight: bold; margin-left: 10px"
      >HỆ THỐNG QUẢN LÝ TMĐT RUỘNG BẬC THANG</div>
    </div>
    <div style="display:flex; flex-direction: row; align-items: center">
      <div style="margin-right: 50px">
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
import Hamburger from "@/components/Hamburger";
import { getInfor } from "@/api/taikhoan";
import { getSoThietBi, getThongBao, docThongBao } from "@/api/baocao";
import logo from "@/assets/logo/logorbt.jpg";

var realTimeThongBao;
export default {
  components: {
    Breadcrumb,
    Hamburger,
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

<style lang="scss" scoped>
.el-dropdown-menu {
  z-index: 100000000000 !important;
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
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

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
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
