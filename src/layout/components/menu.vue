<template>
  <div :class="{ 'has-logo': showLogo }" style="width: 100%; display:flex; justify-content:space-around; align-items: center">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="green"
      text-color="#fff"
      active-text-color="yellow"
      style="width: 100%; display:flex; justify-content:center; align-items: center"
    >
      <el-menu-item index="22"><router-link :to="'/tongquan'">
              Tổng quan
            </router-link></el-menu-item>
      <el-submenu 
        class="sub-menu"
        style="background-color:green;margin-right: 22px;"
        :index="index + ''"
        v-for="(route, index) in permission_routes"
        :key="index"
      >
        <template slot="title" v-if="!route.hidden">{{ route.name }}</template>
        <el-menu-item
          v-for="(item, index2) in route.children"
          :key="index2"
          :index="index + '-' + index2"
          v-if="!item.hidden"
        >
          <router-link :to="route.path + '/' + item.path">
            {{ item.name }}
          </router-link>
        </el-menu-item>
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
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
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
};
</script>
<style lang="scss">
.sub-menu:hover {
    background-color: red !important;
}
.sub-menu:hover li>ul>li{
background: red !important;
}
</style>

