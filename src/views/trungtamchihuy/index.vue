<template>
  <div
    class="app-container"
    style="display:flex; flex-direction: column; justify-content: space-between; height: calc(100vh - 50px)"
  >
    <div style="display: flex;">
      <div class="danhmuc" style="margin-left: 0px">
        <div class="item-danhmuc" style="background-color: #27AE60">
          <div>
            <div class="so-item">
              {{(data.doanh_thu/1000000).toFixed(2)}}
              <span style="font-size: 14px">triệu đ</span>
            </div>
            <div class="ten-item">Doanh thu: {{month}}/{{year}}</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3208/3208954.svg" style="height: 80px;" />
        </div>
      </div>
      <div class="danhmuc">
        <div class="item-danhmuc" style="background-color: #D68910">
          <div>
            <div class="so-item">{{data.hoa_don}}</div>
            <div class="ten-item">Hóa đơn: {{month}}/{{year}}</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3081/3081305.svg" style="height: 100px;" />
        </div>
      </div>

      <div class="danhmuc">
        <div class="item-danhmuc">
          <div>
            <div class="so-item">{{data.don_hang}}</div>
            <div class="ten-item">Đơn hàng: {{month}}/{{year}}</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3225/3225094.svg" style="height: 100px;" />
        </div>
      </div>

      <div class="danhmuc">
        <div class="item-danhmuc" style="background-color: #2471A3">
          <div>
            <div class="so-item">{{data.don_online}}</div>
            <div class="ten-item">Đặt hàng Online {{month}}/{{year}}</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3126/3126589.svg" style="height: 100px;" />
        </div>
      </div>

      <div class="danhmuc" style="background-color: #A93226">
        <div class="item-danhmuc">
          <div>
            <div class="so-item">{{data.san_pham}}</div>
            <div class="ten-item">Nhập kho {{month}}/{{year}}</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/743/743007.svg" style="height: 80px;" />
        </div>
      </div>
    </div>
    <div style="display: flex; height: calc(100vh - 250px); padding-bottom: 40px; margin-top: 30px;">
      <div style="flex: 2;">
        <!-- <div
          style="font-size: 18px; font-weight: bold; color: #1F618D; margin-bottom: 15px"
        >SẢN PHẨM BÁN CHẠY</div>
        <div style="display:flex; justify-content: space-between;">
          <el-select v-model="typeChart" style="z-index: 2;" @change="changeTypeChart(typeChart)">
            <el-option label="DOANH THU" :value="'doanh_thu'"></el-option>
            <el-option label="SỐ LƯỢNG" :value="'so_luong'"></el-option>
          </el-select>
          <div style="padding-right: 30px">
            <el-date-picker
              style="z-index: 2; width: 100%"
              @change="thoiGianSanPham(date)"
              v-model="date"
              type="daterange"
              format="dd/MM/yyyy"
              range-separator="-"
              start-placeholder="Start date"
              end-placeholder="End date"
            ></el-date-picker>
          </div>
        </div>
        <chart ref="banchay" height="100%" width="100%" />-->

        <div
          style="font-size: 18px; font-weight: bold; color: #1F618D; margin-bottom: 15px"
        >TỔNG DOANH THU</div>
        <div style="display:flex; justify-content: space-between;">
          <div style="color: #515A5A; font-weight: bold;">NĂM {{year}}</div>
        </div>
        <chart2 ref="doanhthu" height="100%" width="100%" />
      </div>
      <div style="flex: 1; margin-left: 20px">
        <!-- <div
          style="font-size: 18px; font-weight: bold; color: #1F618D; margin-bottom: 15px"
        >TỔNG DOANH THU</div>
        <div style="display:flex; justify-content: space-between;">
          <div style="color: #515A5A; font-weight: bold;">NĂM {{year}}</div>
        </div>
        <chart2 ref="doanhthu" height="100%" width="100%" />-->
        <div
          style="font-size: 18px; font-weight: bold; color: #1F618D; margin-bottom: 15px"
        >NHÂN VIÊN, QUẢN LÝ</div>
        <br>
        <div style="display:flex; justify-content: space-between;">
          <div style="color: #515A5A; font-weight: bold;">Trạng thái hoạt động</div>
        </div>
        <br />
        <el-table :data="dataUser" height="100%">
          <!-- <el-table-column label="STT" min-width="55" type="index" align="center"></el-table-column> -->
          <el-table-column prop="user.name" width="250" label="Họ và tên">
            <template slot-scope="scope">
              <div
                style="display: flex; flex-wrap: nowrap; align-items: center;"
              >
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
          <!-- <el-table-column label="E-Mail" prop="email"></el-table-column> -->
          <el-table-column label="Vai trò" prop="role.name"></el-table-column>
          <el-table-column label="Trạng thái">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.online">ONLINE</el-tag>
              <el-tag type="info" v-else>OFFLINE</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
          <br />
          <br />
          <br />
          <label>Tỉnh thành:</label>
          <span v-if="UserInfo.tinh_thanh">{{ UserInfo.tinh_thanh.name }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="primary-button" @click="showUserDetail = false" icon="el-icon-close">Đóng</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { dashboard } from "@/api/bieudo";
import { getInfor } from "@/api/taikhoan";
import Chart from "../trungtamchihuy/dashboard/Chart";
import Chart2 from "../trungtamchihuy/dashboard/ChartDoanhThu";
import { getUser } from "@/api/user";

export default {
  components: { Chart, Chart2 },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    });
  },
  data() {
    return {
      env: process.env.VUE_APP_BASE,
      showUserDetail: false,
      UserInfo: {},
      date: [],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      typeChart: "doanh_thu",
      data: {
        khach_hang: 0,
        don_hang: 0,
        san_pham: 0,
        hoa_don: 0,
        doanh_thu: 0,
      },
      dataUser: []
    };
  },
  created() {
    this.getInfo();
    this.getDataUser()
    this.getData();
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    this.date = [firstDay, lastDay];
  },
  methods: {
    thoiGianSanPham(e) {
      this.$refs["banchay"].getData(e, this.typeChart);
    },
    changeTypeChart(e) {
      this.$refs["banchay"].getData(this.date, e);
    },
    async getData() {
      let data = await dashboard();
      this.data = data;
    },
    async getInfo() {
      let data = await getInfor();
      if (data.data.role_id == 3) {
        this.$router.push("/quanlykho/baogia");
      }
    },
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
    async getDataUser(){
      let data = await getUser({per_page: 9999, role: [1,2,5]});
      this.dataUser = data.data.data
    }
  },
};
</script>
<style scoped>
.danhmuc {
  height: 150px;
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
