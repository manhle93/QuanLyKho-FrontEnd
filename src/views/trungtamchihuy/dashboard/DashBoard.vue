<template>
  <div class="c-flex fh ttch">
    <div class="fh c-flex c-column" style="width: 240px;">
      <div style="padding-right: 10px; padding-bottom: 10px">
        <el-card
          v-if="!quan_ly_tinh_thanh"
          shadow="always"
          style="text-align:center;height: 150px; border: 1px solid #3498DB;"
         >
          <h4 style="color: #2E86C1">Tỉnh thành đã kết nối</h4>
          <div style="font-size: 38px; font-weight: bold; color: red;">{{tinhThanhDaKetNoi}}</div>
        </el-card>
        <el-card
          v-if="quan_ly_tinh_thanh"
          shadow="always"
          style="text-align:center;height: 150px; border: 1px solid #3498DB; "
        >
          <h4 v-if="quan_ly_tinh_thanh.toUpperCase() == 'HÀ NỘI' || quan_ly_tinh_thanh.toUpperCase() == 'ĐÀ NẴNG' || quan_ly_tinh_thanh.toUpperCase() == 'HỒ CHÍ MINH' || quan_ly_tinh_thanh.toUpperCase() == 'HẢI PHÒNG'">Thành phố</h4>
          <h4 v-else style="color: #2E86C1">Tỉnh thành</h4>
          <div style="font-size: 30px; font-weight: bold; color: red;">{{quan_ly_tinh_thanh}}</div>
        </el-card>
      </div>
      <div class="c-grow" style="padding-right: 10px;">
        <el-card class="fh" style="overflow: auto; border: 1px solid #3498DB;" shadow="always">
          <div style="text-align:center;">
            <h5
              style="line-height: 25px; padding-left: 5px; padding-right: 5px"
            >Số thiết bị lắp đặt trên các tỉnh thành</h5>
            <hr />
          </div>
          <div
            v-for="tinhThanh in tinhThanhs"
            :key="tinhThanh.id"
            style="margin-bottom: 5px; padding-right: 10px"
            :class="'dash'+tinhThanh.id"
          >
            <span
              style="padding-left: 10px; font-weight: bold; font-size: 18px; color: red"
              v-bind:style="{color: tinhThanh.so_thiet_bi ? '#1865C1': 'red'}"
            >{{tinhThanh.so_thiet_bi}}</span>
            <span
              class="tinh-thanh"
              v-bind:style="{color: tinhThanh.active ? '#1D4EC6' : '', 'font-weight': tinhThanh.active ? 'bold': ''}"
              @click="showTinhThanh(JSON.parse(tinhThanh.tam.st_asgeojson).coordinates[1],JSON.parse(tinhThanh.tam.st_asgeojson).coordinates[0], tinhThanh.id, tinhThanh)"
            >{{tinhThanh.name}}</span>
            <!-- <span v-if="tinhThanh.active"><i class="el-icon-view" style="color: white; cursor: pointer; float: right;"></i></span> -->
            <img
              v-if="tinhThanh.active"
              src="https://image.flaticon.com/icons/svg/812/812844.svg"
              width="20px"
              style="float: right; cursor: pointer"
              @click="chiTiet(tinhThanh.id)"
            />
          </div>
        </el-card>
      </div>
    </div>
    <div class="c-grow c-flex c-column">
      <el-card class="c-grow" style="position: relative;">
        <div style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;">
          <tracking-map ref="map" style="height: 100%; overflow: auto;"></tracking-map>
        </div>
        <div
          class="c-flex c-column"
          style="position: absolute; top: 5%; right: 50px; z-index: 1000; min-height: 90%"
        >
          <div
            class="c-flex c-column"
            style="border-radius: 10px;
          min-width: 260px; min-height: 200px; background-color: white; padding-bottom: 10px; box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 10px;"
          >
            <div
              class="c-flex legend"
              style="color: #409EFF"
              @click="$router.push('/congtacphongchay/toanha')"
            >
              <div class="legend-icon">
                <i class="fa fa-city"></i>
              </div>
              <div class="legend-number">{{tongToaNha}}</div>
              <div class="legend-name">Cơ sở công trình</div>
            </div>
            <div
              class="c-flex legend"
              style="color: #67C23A"
              @click="$router.push('/quanlydonvipccc/donvipccc')"
            >
              <div class="legend-icon">
                <!-- <i class="fas fa-synagogue"></i> -->
                <i class="fas fa-shield-alt"></i>
              </div>
              <div class="legend-number">{{tongDonVi}}</div>
              <div class="legend-name">Đơn vị PCCC</div>
            </div>
            <div
              class="c-flex legend"
              style="color: #F56C6C"
              @click="$router.push('/giamsat/giamsat')"
            >
              <div class="legend-icon">
                <i class="fa fa-fire"></i>
              </div>
              <div class="legend-number">{{dangChays.length}}</div>
              <div class="legend-name">Đang cháy</div>
            </div>
            <div
              class="c-flex legend end"
              style="color: #E6A23C"
              @click="$router.push('/chuachayvacnch/chuachay')"
            >
              <div class="legend-icon">
                <i class="fa fa-fire-extinguisher"></i>
              </div>
              <div class="legend-number">{{tongDiemChay}}</div>
              <div class="legend-name">Vụ cháy</div>
            </div>
          </div>

          <div
            class="c-grow"
            @click="$router.push('/quanlythietbi/thietbi')"
            style="cursor: pointer"
          >
            <div
              class="c-flex"
              style="background: white; border-radius: 10px; margin-top: 20px; overflow: hidden; box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 10px; padding-right: 5px"
            >
              <div
                class="c-flex c-grow c-column"
                style="height: 54px; padding-top:2px; padding-left: 15px; background: #607d8b; color: white; padding-right: 8px"
              >
                <div style="font-size: 12px; padding-top: 4px; padding-left: 2px">Tổng thiết bị</div>
                <div style="font-size: 30px;">{{formatedTong}}</div>
              </div>
              <div class="c-flex c-column" style="width: 70px; padding-top:2px; margin-left: 10px">
                <div style="font-size: 12px; padding-top: 4px; padding-left: 2px">Online</div>
                <div style="font-size: 30px; color: rgb(103, 194, 58)">{{formatedOnline}}</div>
              </div>
              <div class="c-flex c-column" style="width: 70px; padding-top:2px">
                <div style="font-size: 12px; padding-top: 4px; padding-left: 2px">Offline</div>
                <div style="font-size: 30px; color: rgb(245, 108, 108)">{{formatedOffline}}</div>
              </div>
            </div>
          </div>

          <div
            class="c-flex c-column"
            style="margin-top:20px; border-radius: 10px; text-align: center
          min-width: 250px; min-height: 150px; background-color: white; box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 10px;"
          >
            <el-tabs
              v-model="activeName"
              style="min-heigh: 150px; min-width: 250px"
              @tab-click="tapClick"
            >
              <el-tab-pane label="Thiết bị" name="thietBi">
                <div style="padding: 10px 8px 8px 8px">
                  <div
                    style="font-size: 13px; font-weight: bold; color: #85C1E9;"
                  >Tăng trưởng thiết bị năm {{new Date().getFullYear()}}</div>
                  <chart ref="thietBi" height="100%" width="100%" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="Vụ cháy" name="vuChay">
                <div style="padding: 10px 8px 8px 8px">
                  <div
                    style="font-size: 13px; font-weight: bold; color: #85C1E9;"
                  >Số vụ cháy năm {{new Date().getFullYear()}}</div>
                  <chart2 ref="vuChay" height="100%" width="100%" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="Thiệt hại" name="thietHai">
                <div style="padding: 10px 8px 8px 8px">
                  <div
                    style="font-size: 13px; font-weight: bold; color: #85C1E9;"
                  >Thiệt hại năm {{new Date().getFullYear()}} (triệu đồng)</div>
                  <chart3 ref="thietHai" height="100%" width="100%" />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import TrackingMap from "./map";
import {
  getThietbiTinhThanh,
  getTrangThaiThietBi,
  diemChay,
  donVi,
  getToaNha,
  dangChay
} from "@/api/baocao";
import Chart from "./Chart";
import Chart2 from "./ChartVuChay";
import Chart3 from "./ChartThietHai";
import Axios from "axios";
import { getInfor } from "@/api/taikhoan";
import { getSoThietBi } from "@/api/baocao";
import numeral from "numeral";

export default {
  components: { TrackingMap, Chart, Chart2, Chart3 },
  data() {
    return {
      activeName: "vuChay",
      loadTong: false,
      tinhThanhs: [],
      tongThietBi: 0,
      tinhThanhId: null,
      online: 0,
      offline: 0,
      tinhThanhDaKetNoi: 0,
      diemChay: [],
      dangChays: [],
      donVi: [],
      toaNha: [],
      quan_ly_tinh_thanh: null,
      per_page_diem_chay: 5,
      loadingDiemChay: false,
      loadingDonVi: false,
      loadingDangChay: false,
      loadingToaNha: false,
      loadingThietBi: false,
      tongDiemChay: 0,
      tongToaNha: 0,
      tongDangChay: 0,
      tongDonVi: 0,
      per_page_don_vi: 5,
      per_page_toa_nha: 10,
      per_page_dang_chay: 10,
      formatNumberOnline: "0.[0]a",
      formatNumberOffline: "0.[0]a",
      formatNumberTong: "0.[0]a"
    };
  },

  computed: {
    formatedOnline() {
      return String(
        numeral(this.online).format(this.formatNumberOnline)
      ).toUpperCase();
    },
    formatedOffline() {
      return String(
        numeral(this.offline).format(this.formatNumberOffline)
      ).toUpperCase();
    },
    formatedTong() {
      return String(
        numeral(this.offline + this.online).format(this.formatNumberTong)
      ).toUpperCase();
    }
  },

  methods: {
    chiTiet(id) {
      this.$emit("chiTietTinhThanh", id, true);
    },
    getThietBi() {
      getThietbiTinhThanh().then(res => {
        this.tinhThanhs = res;
        this.tinhThanhs.map(tinhthanh => {
          tinhthanh.active = false;
        });
        for (let item of res) {
          this.tongThietBi = this.tongThietBi + item.so_thiet_bi;
          if (item.so_thiet_bi > 0) {
            this.tinhThanhDaKetNoi++;
          }
        }
      });
    },
    tapClick() {
      this.$nextTick(() => {
        this.$refs[this.activeName].render();
      });
    },
    async getSoThietBi(tinhThanhId) {
      this.loadingThietBi = true;
      let data = await getSoThietBi({ tinh_thanh_id: tinhThanhId });
      this.loadingThietBi = false;
      this.online = data.online;
      this.offline = data["offline"];
    },
    async getDiemChay(tinhThanhId) {
      this.loadingDiemChay = true;
      let data = await diemChay({
        per_page: 1,
        tinh_thanh_id: tinhThanhId
      });
      this.diemChay = data.data;
      this.tongDiemChay = data.tong;
      this.loadingDiemChay = false;
      this.loadTong = false;
    },
    async getDonVi(tinhThanhId) {
      this.loadingDonVi = true;
      let data = await donVi({
        per_page: 1,
        tinh_thanh_id: tinhThanhId
      });
      this.donVi = data.data;
      this.tongDonVi = data.tong;
      this.loadingDonVi = false;
      this.loadTong = false;
    },
    async getToaNha(tinhThanhId) {
      this.loadingToaNha = true;
      let data = await getToaNha({
        per_page: 1,
        tinh_thanh_id: tinhThanhId
      });
      this.toaNha = data.data;
      this.tongToaNha = data.tong;
      this.loadingToaNha = false;
      this.loadTong = false;
    },
    async getDiemDangChay(tinhThanhId) {
      let data = await dangChay({ tinh_thanh_id: tinhThanhId });
      this.dangChays = data.data;
    },
    loadToaNha() {
      if (!this.loadingToaNha) this.getToaNha(this.tinhThanhId);
    },

    loadDiemChay() {
      if (!this.loadingDiemChay) this.getDiemChay(this.tinhThanhId);
    },
    loadDonVi() {
      if (!this.loadingDonVi) this.getDonVi(this.tinhThanhId);
    },
    scroll(tinh_thanh_id) {
      let element = document.getElementsByClassName("dash" + tinh_thanh_id);
      setTimeout(() => {
        if (element[0])
          element[0].scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest"
          });
      }, 800);
    },
    receiveData(tinh_thanh_id) {
      if (tinh_thanh_id) {
        let tinh = this.tinhThanhs.find(el => el.id == tinh_thanh_id);
        this.showTinhThanh(
          JSON.parse(tinh.tam.st_asgeojson).coordinates[1],
          JSON.parse(tinh.tam.st_asgeojson).coordinates[0],
          tinh_thanh_id,
          tinh
        );
      } else {
        this.$refs.map.resetMap(17.685895196738677, 106.78710937500001);
        this.tinhThanhs.map(tinhThanh => {
          tinhThanh.active = false;
        });
        this.getDiemDangChay();
        this.getDiemChay();
        this.getDonVi();
        this.getToaNha();
        this.getSoThietBi();
        this.$emit("chiTietTinhThanh", null);
      }
    },

    showTinhThanh(lat, lng, id, tinhThanh) {
      this.tinhThanhs.map(tinhThanh => {
        if (tinhThanh.id !== id) {
          tinhThanh.active = false;
        }
      });
      tinhThanh.active = !tinhThanh.active;
      if (!tinhThanh.active) {
        this.$refs.map.resetMap(17.685895196738677, 106.78710937500001);
        this.$refs.map.polygonQL(null);
        this.getDiemDangChay();
        this.getDiemChay();
        this.getDonVi();
        this.getToaNha();
        this.getSoThietBi();
        this.$emit("chiTietTinhThanh", null);
      } else {    
        this.tinhThanhId = id;
        this.$emit("chiTietTinhThanh", id, false);
        this.$refs.map.showTinhThanh(lat, lng, id);
        this.$refs.map.polygonQL(id);
        this.diemChay = [];
        this.donVi = [];
        this.toaNha = [];
        this.loadTong = true;
        this.loadingToaNha = true;
        this.loadingDonVi = true;
        this.loadingDiemChay = true;
        this.getDiemDangChay(id);
        this.getDiemChay(id);
        this.getDonVi(id);
        this.getToaNha(id);
        this.getSoThietBi(id);
      }
    },
    async getTrangThaiThietBi() {
      let data = await getTrangThaiThietBi();
      for (let item of data) {
        if (item.online) {
          this.online.push(item);
        } else this.offline.push(item);
      }
    },
    async getUserInfo() {
      let data = await getInfor();
      if (data.data.role_id == 2) {
        this.quan_ly_tinh_thanh = data.data.tinhthanh.name;
      } else {
        this.quan_ly_tinh_thanh = null;
      }
    }
  },
  created() {
    this.getThietBi();
    this.getDiemDangChay();
    this.getDonVi();
    this.getToaNha();
    this.getDiemChay();
    this.getSoThietBi();
    this.getUserInfo();
  }
};
</script>
<style scoped>
.element {
  margin-left: 15px;
  height: 13vh;
  min-height: 100px;
  text-align: center;
}

.element:hover {
  background-color: #154360;
}
.thietbi {
  margin-left: 15px;
  background-color: #212f3c;
}
.thietbi:hover {
  background-color: #154360;
}
.donvi {
  height: 15px;
  width: auto;
  display: inline-block;
  margin-right: 5px;
}
.dangchay {
  height: 30px;
  width: 20px;
  display: inline-block;
  margin-right: 3px;
}
.vuchay {
  height: 25px;
  width: auto;
  display: inline-block;
  margin-right: 3px;
}
.greendot {
  height: 10px;
  width: 10px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
.tinh-thanh {
  padding-left: 10px;
  font-size: 13px;
  cursor: pointer;
}
.tinh-thanh:hover {
  color: #d8250c;
  font-weight: bold;
}

.legend {
  align-items: center;
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  margin-left: 20px;
  margin-right: 20px;
  padding-top: 20px;
  padding-bottom: 10px;
  min-width: 210px;
  cursor: pointer;
}

.legend:hover {
  color: gray !important;
}

.legend.end {
  border-bottom: none;
}

.legend-icon {
  font-size: 30px;
}

.legend-number {
  font-size: 36px;
  padding-right: 10px;
  flex-grow: 1;
  text-align: end;
}

.legend-name {
  width: 76px;
  font-size: 12px;
  height: 28px;
  color: rgba(0, 0, 0, 0.6);
}
/* width */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: white;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: lightgray;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: gray;
}

.element-title {
  font-size: 14px;
  height: 40px;
  color: #85c1e9;
  font-weight: bold;
}
</style>

<style>
.ttch .el-tabs__nav.is-top {
  margin-left: 20px;
}
.ttch .el-tabs__header {
  margin: 0;
}
.ttch .el-tabs__item {
  font-size: 13px;
}
</style>