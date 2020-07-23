<template>
  <div class="app-container">
    <div style="display: flex;">
      <div class="danhmuc" style="margin-left: 0px">
        <div class="item-danhmuc" style="background-color: #2471A3">
          <div>
            <div class="so-item">150</div>
            <div class="ten-item">Khách hàng</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3126/3126589.svg" style="height: 100px;" />
        </div>
      </div>
      <div class="danhmuc" style="background-color: red">
        <div class="item-danhmuc">
          <div>
            <div class="so-item">10000</div>
            <div class="ten-item">Sản phẩm</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/743/743007.svg" style="height: 100px;" />
        </div>
      </div>
      <div class="danhmuc">
        <div class="item-danhmuc">
          <div>
            <div class="so-item">130</div>
            <div class="ten-item">Đơn đặt hàng</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3225/3225094.svg" style="height: 100px;" />
        </div>
      </div>
      <div class="danhmuc">
        <div class="item-danhmuc" style="background-color: #D68910">
          <div>
            <div class="so-item">130</div>
            <div class="ten-item">Hóa đơn</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3081/3081305.svg" style="height: 100px;" />
        </div>
      </div>
      <div class="danhmuc">
        <div class="item-danhmuc" style="background-color: #27AE60">
          <div>
            <div class="so-item">100 tr</div>
            <div class="ten-item">Doanh thu</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3208/3208954.svg" style="height: 100px;" />
        </div>
      </div>
    </div>
    <div style="display: flex; margin-top: 40px">
      <div style="flex: 1; height: 500px;">
        <img src="https://f7.photo.talk.zdn.vn/6682167246699137293/1eacc0f1fce700b959f6.jpg" style="height: 100%">
      </div>
      <div style="flex: 1; height: 500px; margin-left: 20px">
        <img src="https://f9.photo.talk.zdn.vn/4452099574540903946/6aafbbb084a678f821b7.jpg" style="height: 100%">
      </div>
    </div>
  </div>
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
    next((vm) => {
      vm.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    });
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style scoped>
.danhmuc {
  height: 140px;
  background-color: #16a085;
  flex: 1;
  margin-left: 20px;
}
.item-danhmuc {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-around;
}
.so-item {
  color: white;
  font-size: 34px;
  font-weight: bold;
}
.ten-item {
  margin-top: 15px;
  color: white;
  font-family: time new roman;
}
</style>
