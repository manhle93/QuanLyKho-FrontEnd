<template>
  <div
    :class="{ 'has-logo': showLogo }"
    style="
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    "
  >
    <el-menu
      class="el-menu-demo"
      :default-active="activeIndex"
      mode="horizontal"
      background-color="#388E3C"
      text-color="#fff"
      active-text-color="yellow"
      style="
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <el-menu-item index="22" style="margin-right: 50px">
        <router-link :to="'/tongquan'">
          <img
            :src="LogoSanPham"
            height="35px"
            style="
              border: 2px solid white;
              border-radius: 4px;
              margin-right: 5px;
            "
          />
          <b style="font-size: 18px">Tổng quan</b>
        </router-link>
      </el-menu-item>
      <el-submenu
        v-for="(route, index) in permission_routes"
        :key="index"
        :index="String(index)"
      >
        <template slot="title" v-if="!route.hidden && route.name">
          <span
            :style="{ color: index == activeIndex ? 'yellow' : 'white' }"
            style="
              font-size: 15px;
              font-weight: 600;
              padding-right: 20px;
              padding-left: 20px;
              border-left: 1px solid #DCDCDC;
            "
            >{{ route.name }}</span
          >
        </template>
        <div v-if="route.name == 'Quản lý'">
          <el-submenu index="3-1-0">
            <template slot="title">Quản lý người dùng</template>
            <router-link
              v-for="(item, index2) in route.children.filter((el) =>
                nguoiDung.includes(el.path)
              )"
              :key="'3-1-0-' + index2"
              :to="route.path + '/' + item.path"
            >
              <el-menu-item
                :index="String('3-1-0-' + index + '-' + index2)"
                v-if="!item.hidden"
                >{{ item.name }}</el-menu-item
              >
            </router-link>
          </el-submenu>
          <el-submenu index="3-1-1">
            <template slot="title">Quản lý hàng hóa</template>
            <router-link
              v-for="(item, index2) in route.children.filter(
                (el) => !nguoiDung.includes(el.path)
              )"
              :key="'3-1-1-' + index2"
              :to="route.path + '/' + item.path"
            >
              <el-menu-item
                :index="String('3-1-1-' + index + '-' + index2)"
                v-if="!item.hidden"
                >{{ item.name }}</el-menu-item
              >
            </router-link>
          </el-submenu>
        </div>

        <div v-else-if="route.name == 'Giao dịch'">
          <el-submenu index="4-1-0">
            <template slot="title">Giao dịch NCC</template>
            <router-link
              v-for="(item, index2) in route.children.filter((el) =>
                giaoDichNCC.includes(el.path)
              )"
              :key="'4-1-0-' + index2"
              :to="route.path + '/' + item.path"
            >
              <el-menu-item
                :index="String('4-1-0-' + index + '-' + index2)"
                v-if="!item.hidden"
                >{{ item.name }}</el-menu-item
              >
            </router-link>
          </el-submenu>
          <el-submenu index="4-1-1">
            <template slot="title">Giao dịch Khách hàng</template>
            <router-link
              v-for="(item, index2) in route.children.filter((el) =>
                giaoDichKH.includes(el.path)
              )"
              :key="'4-1-1-' + index2"
              :to="route.path + '/' + item.path"
            >
              <el-menu-item
                :index="String('4-1-1-' + index + '-' + index2)"
                v-if="!item.hidden"
                >{{ item.name }}</el-menu-item
              >
            </router-link>
          </el-submenu>
          <el-submenu index="4-1-2">
            <template slot="title">Giao dịch Kho</template>
            <router-link
              v-for="(item, index2) in route.children.filter((el) =>
                giaoDichKho.includes(el.path)
              )"
              :key="'4-1-2-' + index2"
              :to="route.path + '/' + item.path"
            >
              <el-menu-item
                :index="String('4-1-2-' + index + '-' + index2)"
                v-if="!item.hidden"
                >{{ item.name }}</el-menu-item
              >
            </router-link>
          </el-submenu>
        </div>
        <router-link
          v-else
          v-for="(item, index2) in route.children"
          :key="index2"
          :to="route.path + '/' + item.path"
        >
          <el-menu-item
            :index="String(index + '-' + index2)"
            v-if="!item.hidden"
            >{{ item.name }}</el-menu-item
          >
        </router-link>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Sidebar/Logo";
import LogoSanPham from '@/assets/logo/logorbt.jpg'
import SidebarItem from "./Sidebar/SidebarItem";
import variables from "@/styles/variables.scss";
export default {
  data() {
    return {
      activeIndex: "22",
      nguoiDung: [
        "nhanvien",
        "nhacungcap",
        "khachhang",
        "taikhoan",
        "management",
      ],
      LogoSanPham,
      giaoDichNCC: ["nhacungcap", "trahangnhacungcap", "thanhtoannhacungcap"],
      giaoDichKho: ["nhapkho", "kiemke", "xuathuy", "trahang", "nhapkhotam"],
      giaoDichKH: ["dathang", "lichsunoptien", "doitrahang", "hoadon"],
    };
  },
  components: { SidebarItem, Logo },
  created() {
    this.activeMenu();
  },
  watch: {
    $route(to, from) {
      this.activeMenu();
    },
  },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    activeMenu() {
      let name = this.$route.name;
      let index = this.permission_routes.findIndex((el) => {
        if (el.children) {
          const exist = el.children.find((it) => it.name === name);
          if (exist) {
            return true;
          }
        } else if (el.name === name) return true;
        return false;
      });
      this.activeIndex = String(index);
    },
  },
};
</script>
<style lang="scss">
</style>

<style>
/* .is-opened .el-submenu__title {
  background-color: red !important;
}
.el-menu-item:hover {
    background-color: red !important;

} */
</style>

