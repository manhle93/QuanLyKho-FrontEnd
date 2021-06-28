<template>
  <div
    class="app-container"
    style="display:flex; flex-direction: column; justify-content: space-between; height: calc(100vh - 50px)"
  >
    <div style="display: flex;">
      <div class="danhmuc" style="margin-left: 0px">
        <div
          class="item-danhmuc"
          style="background-image: linear-gradient(to right, #74ebd5 0%, #9face6 100%);"
        >
          <div>
            <div class="so-item">
              {{ (data.doanh_thu / 1000000).toFixed(2) }}
              <span style="font-size: 14px">(triệu)</span>
            </div>
            <div class="ten-item">
              Doanh thu
              <!-- <span class="type-time">{{ this.typeTime }}</span> -->
            </div>
          </div>
          <img
            src="https://res.cloudinary.com/dsobei3hp/image/upload/v1609387057/RBT/3208954_hm9zyx.svg"
            style="height: 80px;"
          />
        </div>
      </div>
      <div class="danhmuc">
        <div
          class="item-danhmuc"
          style="background-image: linear-gradient(to top, #c1dfc4 0%, #deecdd 100%);"
        >
          <div>
            <div class="so-item">{{ data.hoa_don }}</div>
            <div class="ten-item">
              Hóa đơn
              <!-- <span class="type-time">{{ this.typeTime }}</span> -->
            </div>
          </div>
          <img
            src="https://res.cloudinary.com/dsobei3hp/image/upload/v1609387099/RBT/3081305_hxhb7k.svg"
            style="height: 100px;"
          />
        </div>
      </div>

      <div class="danhmuc">
        <div
          class="item-danhmuc"
          style="background-image: linear-gradient(to right, #3ab5b0 0%, #3d99be 31%, #56317a 100%);"
        >
          <div>
            <div class="so-item" style="color: white">{{ data.don_hang }}</div>
            <div class="ten-item" style="color: white">
              Đơn hàng
              <!-- <span class="type-time">{{ this.typeTime }}</span> -->
            </div>
          </div>
          <img
            src="https://res.cloudinary.com/dsobei3hp/image/upload/v1609387100/RBT/3225094_cc3rwy.svg"
            style="height: 100px;"
          />
        </div>
      </div>

      <div class="danhmuc">
        <div
          class="item-danhmuc"
          style="background-image: linear-gradient(to top, #50cc7f 0%, #f5d100 100%);"
        >
          <div>
            <div class="so-item">{{ data.don_online }}</div>
            <div class="ten-item">
              Đặt hàng Online
              <!-- <span class="type-time">{{ this.typeTime }}</span> -->
            </div>
          </div>
          <img
            src="https://res.cloudinary.com/dsobei3hp/image/upload/v1609387100/RBT/3126589_teb0vg.svg"
            style="height: 100px;"
          />
        </div>
      </div>

      <div
        class="danhmuc"
        style="background-image: linear-gradient(-225deg, #CBBACC 0%, #2580B3 100%);"
      >
        <div class="item-danhmuc">
          <div>
            <div class="so-item">{{ data.san_pham }}</div>
            <div class="ten-item">Tổng số sản phẩm</div>
          </div>
          <img
            src="https://res.cloudinary.com/dsobei3hp/image/upload/v1609387099/RBT/743007_qqyvph.svg"
            style="height: 80px;"
          />
        </div>
      </div>
    </div>
    <div
      style="display: flex; height: calc(100vh - 250px); padding-bottom: 40px; margin-top: 30px;"
    >
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
        >
          TỔNG DOANH THU
        </div>
        <div style="display:flex; justify-content: space-between;">
          <div style="color: #515A5A; font-weight: bold;">{{ typeTime }}</div>
          <div>
            <el-select
              v-model="timeSelect"
              placeholder="Thời gian"
              size="small"
              style="z-index: 100000"
              @change="changeType"
            >
              <el-option
                v-for="item in dataFilter"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <chart2 ref="doanhthu" height="100%" width="100%" />
      </div>
      <el-card class="box-card" style="flex: 1; margin-left: 20px;">
        <!-- <div
          style="font-size: 18px; font-weight: bold; color: #1F618D; margin-bottom: 15px"
        >TỔNG DOANH THU</div>
        <div style="display:flex; justify-content: space-between;">
          <div style="color: #515A5A; font-weight: bold;">NĂM {{year}}</div>
        </div>
        <chart2 ref="doanhthu" height="100%" width="100%" />-->
        <div
          style="font-size: 18px; font-weight: bold; color: #1F618D; margin-bottom: 15px"
        >
          QUẢN LÝ NHÂN VIÊN
        </div>
        <br />
        <div style="display:flex; justify-content: space-between;">
          <div style="color: #515A5A; font-weight: bold;" center>
            <h4><i style="color: green">TRẠNG THÁI ĐĂNG NHẬP HỆ THỐNG</i></h4>
          </div>
        </div>
        <br />
        <el-table :data="dataUser" max-height="500px" style="font-size: 13px;">
          <!-- <el-table-column label="STT" min-width="55" type="index" align="center"></el-table-column> -->
          <el-table-column prop="user.name" width="230" label="Họ và tên">
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
                >
                  {{ scope.row.name }}
                </div>
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
      </el-card>
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
import { dashboard } from "@/api/bieudo";
import { getInfor } from "@/api/taikhoan";
import Chart from "../trungtamchihuy/dashboard/Chart";
import Chart2 from "../trungtamchihuy/dashboard/ChartDoanhThu";
import { getUser } from "@/api/user";

export default {
  components: { Chart, Chart2 },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    });
  },
  data() {
    return {
      dataFilter: [
        { name: "Hôm nay", value: "hom_nay" },
        { name: "Hôm qua", value: "hom_qua" },
        { name: "Bảy ngày trước", value: "bay_ngay_truoc" },
        { name: "Tuần này", value: "tuan_nay" },
        { name: "Tháng này", value: "thang_nay" },
        { name: "Tháng trước", value: "thang_truoc" },
        { name: "Năm nay", value: "nam_nay" },
        { name: "Năm trước", value: "nam_truoc" }
      ],
      env: process.env.VUE_APP_BASE,
      showUserDetail: false,
      UserInfo: {},
      date: [],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      typeChart: "doanh_thu",
      timeSelect: "hom_nay",
      typeTime: "TUẦN NÀY",
      data: {
        khach_hang: 0,
        don_hang: 0,
        san_pham: 0,
        hoa_don: 0,
        doanh_thu: 0
      },
      dataUser: []
    };
  },
  created() {
    this.getInfo();
    this.getDataUser();
    this.getData();
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    this.date = [firstDay, lastDay];
  },
  mounted() {
    this.$refs["doanhthu"].initChart(this.timeSelect);
  },
  methods: {
    thoiGianSanPham(e) {
      this.$refs["banchay"].getData(e, this.typeChart);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    changeTypeChart(e) {
      this.$refs["banchay"].getData(this.date, e);
    },
    async getData() {
      let data = await dashboard({ type: this.timeSelect });
      this.data = data;
    },
    async getInfo() {
      let data = await getInfor();
      if (data.data.role_id == 3) {
        this.$router.push("/quanlykho/baogia");
      }
    },
    changeType() {
      switch (this.timeSelect) {
        case "hom_nay":
          this.typeTime = "HÔM NAY";
          break;
        case "hom_qua":
          this.typeTime = "HÔM QUA";
          break;
        case "bay_ngay_truoc":
          this.typeTime = "BẢY NGÀY TRƯỚC";
          break;
        case "thang_truoc":
          this.typeTime = "THÁNG TRƯỚC";
          break;
        case "tuan_nay":
          this.typeTime = "TUẦN NÀY";
          break;
        case "thang_nay":
          this.typeTime = "THÁNG NÀY";
          break;
        case "nam_nay":
          this.typeTime = "NĂM NAY";
          break;
        case "nam_truoc":
          this.typeTime = "NĂM TRƯỚC";
          break;
      }
      this.getData();
      this.$refs["doanhthu"].initChart(this.timeSelect);
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
    async getDataUser() {
      let data = await getUser({ per_page: 9999, role: [1, 2, 5] });
      this.dataUser = data.data.data;
    }
  }
};
</script>
<style scoped>
.danhmuc {
  height: 150px;
  background-color: #16a085;
  flex: 1;
  margin-left: 20px;
}
.type-time {
  font-weight: bold;
  font-size: 14px;
}
.item-danhmuc {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-around;
}
.so-item {
  color: #004d40;
  font-size: 34px;
  font-weight: bold;
}
.ten-item {
  margin-top: 15px;
  color: #00695c;
  font-family: "segoe ui", "Open Sans", "sans-serif";
}

@media only screen and (max-width: 1200px) {
  .type-time {
    font-weight: bold;
    font-size: 9px;
  }
  .ten-item {
    font-size: 10px;
  }
}
</style>
