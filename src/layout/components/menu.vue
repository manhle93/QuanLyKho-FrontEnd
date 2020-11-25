<template>
  <div
    :class="{ 'has-logo': showLogo }"
    style="width: 100%; display:flex; justify-content:space-around; align-items: center"
  >
    <el-menu
      class="el-menu-demo"
      :default-active="activeIndex"
      mode="horizontal"
      background-color="green"
      text-color="#fff"
      active-text-color="yellow"
      style="width: 100%; display:flex; justify-content:center; align-items: center"
    >
      <el-menu-item index="22" style="margin-right: 50px">
        <router-link :to="'/tongquan'">
          <b style="font-size: 18px">Tổng quan</b>
        </router-link>
      </el-menu-item>
      <el-submenu
        class="sub-menu"
        style="background-color:green;"
        v-for="(route, index) in permission_routes"
        :key="index"
        :index="String(index)"
      >
        <template slot="title" v-if="!route.hidden && route.name">
          <span
            :style="{color: index == activeIndex ? 'yellow': 'white'}"
            style="font-size: 15px; padding-right: 10px; padding-left: 10px;"
          >{{ route.name }}</span>
        </template>
        <router-link
          v-for="(item, index2) in route.children"
          :key="index2"
          :to="route.path + '/' + item.path"
        >
          <el-menu-item
            :index="String(index + '-' + index2)"
            v-if="!item.hidden"
          >{{ item.name }}</el-menu-item>
        </router-link>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Sidebar/Logo";
import SidebarItem from "./Sidebar/SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  data() {
    return {
      activeIndex: "22",
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
.sub-menu:hover {
  background-color: red !important;
}
.sub-menu:hover li > ul > li {
  background: red !important;
}
</style>

<style>
/* .is-opened .el-submenu__title {
  background-color: red !important;
}
.el-menu-item:hover {
    background-color: red !important;

} */
</style>

