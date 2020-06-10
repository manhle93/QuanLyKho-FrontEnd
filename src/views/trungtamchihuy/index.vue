<template>
  <h1>Dashboard</h1>
</template>
<script>
import { getTinhThanh, getDonViPccc } from "@/api/TinhThanh";
import { getToaNha } from "@/api/thietbi";
import { getToaNhaTheoTinh } from "@/api/toanha";
import { getListData } from "@/api/toanha";
import axios from "axios";
import { getToken } from "@/utils/auth";
import Dashboard from "./dashboard/DashBoard";
import Chitiet from "./chitiet/index";

export default {
  components: { Dashboard, Chitiet },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    });
  },
  data() {
    return {

    };
  },
  created() {
  },
  methods: {

  }
};
</script>
<style scoped>

</style>
