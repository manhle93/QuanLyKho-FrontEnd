<template>
  <el-row style="overflow: hidden; ">
    <el-col :span="3" style="height: calc(100vh - 100px)">
      <el-row>
        <div
          style="text-align:center;height: 150px; border: black solid 2px; margin-right: 10px; background-color: #212F3C "
        >
          <h4 style="color: white">Tỉnh thành đã kết nối</h4>
          <br />
          <div style="font-size: 36px; font-weight: bold; color: red;">{{tinhThanhDaKetNoi}}</div>
        </div>
      </el-row>
      <el-row>
        <div
          style="border: black solid 2px; margin-top: 8px; margin-right: 8px; height: calc(100vh - 280px ); overflow: auto; background-color: #212F3C; margin-bottom: 10px"
        >
          <div style="text-align:center; color: white;">
            <h5
              style="line-height: 25px; padding-left: 5px; padding-right: 5px"
            >Số thiết bị lắp đặt trên các tỉnh thành</h5>
            <hr />
          </div>
          <div v-for="(tinhThanh, index) in tinhThanhs" style="margin-bottom: 5px">
            <span
              style="padding-left: 10px; font-weight: bold; font-size: 20px; color: red"
            >{{tinhThanh.so_thiet_bi}}</span>
            <span
              class="tinh-thanh"
              @click="showTinhThanh(JSON.parse(tinhThanh.tam.st_asgeojson).coordinates[1],JSON.parse(tinhThanh.tam.st_asgeojson).coordinates[0], tinhThanh.id)"
            >{{tinhThanh.name}}</span>
          </div>
        </div>
      </el-row>
    </el-col>
    <el-col :span="15">
      <tracking-map
        ref="map"
        style="height: calc(100vh - 125px); overflow: hidden; margin-left: 5px; margin-bottom: 10px"
      ></tracking-map>
    </el-col>
    <el-col :span="6" style="height: calc(100vh - 100px)">
      <el-row>
        <el-row>
          <el-col :span="12">
            <div
              style="border: black solid 2px; margin-left: 15px; background-color: #212F3C; height: 25vh"
            >
              <div style="text-align:center; height: 30%">
                <h5 style="line-height: 0px; color: #85C1E9 ; font-weight: bold">Cơ sở công trình</h5>
                <span
                  v-if="!loadTong"
                  style="font-size: 26px; font-weight: bold; color: red"
                >{{tongToaNha}}</span>
                <span v-else style="font-size: 26px; font-weight: bold; color: red">--</span>
                <hr />
              </div>
              <div style="height: 60%; overflow: auto;" v-infinite-scroll="loadToaNha">
                <div
                  style="text-align:center;margin-top: 60px; font-size: 14px; color: white"
                  v-if="tongToaNha == 0 && !loadingToaNha"
                >Không có cơ sở công trình</div>
                <div
                  v-for="item in toaNha"
                  :key="item.id"
                  style="font-size: 14px; margin-left: 10px; margin-bottom: 10px; display: inline-block;"
                >
                  <img
                    src="http://pcccapi.howizbiz.com/storage/images/avatar/1583124084.png"
                    class="donvi"
                  />
                  <span style="line-height: 10px;display: inline-block; font-size: 12px; color: white; width: 120px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">{{item.ten}}</span>
                </div>
                <div style="text-align: center">
                  <i v-if="loadingToaNha" class="el-icon-loading" style="color: white;"></i>
                  <div v-if="per_page_toa_nha == tongToaNha">-- Hết --</div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div
              style="border: black solid 2px; margin-left: 10px; margin-right: 10px; background-color: #212F3C; height: 25vh"
            >
              <div style="text-align:center; height: 30%">
                <h5 style="color: #85C1E9; line-height: 0px">Đơn vị PCCC và CNCH</h5>
                <span
                  v-if="!loadTong"
                  style="font-size: 26px; font-weight: bold; color: red;"
                >{{tongDonVi}}</span>
                <span v-else style="font-size: 26px; font-weight: bold; color: red;">--</span>
                <hr />
              </div>
              <div style="height: 60%; overflow: auto;" v-infinite-scroll="loadDonVi">
                <div
                  style="text-align:center;margin-top: 60px; font-size: 13px; color: white"
                  v-if="donVi.length == 0 && !loadingDonVi"
                >Không có đơn vị PCCC</div>
                <div
                  v-for="item in donVi"
                  :key="item.id"
                  style="font-size: 13px; margin-left: 10px; margin-bottom: 10px; display: inline-block"
                >
                  <img
                    src="http://pcccapi.howizbiz.com//storage/images/avatar/1576278738.png"
                    class="donvi"
                  />
                  <div style="font-size: 12px; color: white; display: inline-block; width: 120px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">{{item.ten}}</div>
                </div>
                <div style="text-align: center">
                  <i v-if="loadingDonVi" class="el-icon-loading" style="color: white;"></i>
                  <div v-if="per_page_don_vi == tongDonVi">-- Hết --</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :span="12">
            <div
              style="border: black solid 2px; margin-left: 15px; background-color: #212F3C; height: 25vh"
            >
              <div style="text-align:center; height: 30%">
                <h5 style="line-height: 0px; color: red; font-weight: bold">Đang cháy</h5>
                <span style="font-size: 26px; font-weight: bold; color: red">{{dangChays.length}}</span>
                <hr />
              </div>
              <div style="height: 60%; overflow: auto;">
                <div
                  style="text-align:center;margin-top: 60px; font-size: 12px; color: white"
                  v-if="dangChays.length == 0"
                >Không có điểm cháy nào đang diễn ra</div>
                <div
                  v-for="item in dangChays"
                  :key="item.id"
                  style="font-size: 14px; margin-left: 10px; margin-bottom: 10px;"
                >
                  <img
                    src="http://pcccapi.howizbiz.com/storage/images/avatar/1583122975.gif"
                    class="dangchay"
                  />
                  <span style="line-height: 10px; font-size: 12px; color: white">{{item.ten}}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div
              style="border: black solid 2px; margin-left: 10px; margin-right: 10px; background-color: #212F3C; height: 25vh"
            >
              <div style="text-align:center; height: 30%">
                <h5 style="color: #85C1E9; line-height: 0px">Toàn bộ vụ cháy</h5>
                <span
                  v-if="!loadTong"
                  style="font-size: 26px; font-weight: bold; color: red;"
                >{{tongDiemChay}}</span>
                <span v-else style="font-size: 26px; font-weight: bold; color: red;">--</span>
                <hr />
              </div>
              <div style="height: 60%; overflow: auto;" v-infinite-scroll="loadDiemChay">
                <div
                  style="text-align:center;margin-top: 60px; font-size: 13px; color: white"
                  v-if="diemChay.length == 0 && !loadingDiemChay"
                >Không có điểm cháy nào</div>
                <div
                  v-for="item in diemChay"
                  :key="item.id"
                  style="font-size: 13px; margin-left: 10px; margin-bottom: 10px; display: inline-block"
                >
                  <img src="https://image.flaticon.com/icons/svg/523/523355.svg" class="donvi" />
                  <div
                    style="font-size: 12px; color: white; display: inline-block; width: 120px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden"
                  >{{item.ten}}</div>
                </div>
                <div style="text-align: center">
                  <i v-if="loadingDiemChay" class="el-icon-loading" style="color: white; "></i>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-row>
      <el-row>
        <div
          style="background-color: #212F3C; text-align: center; margin-left: 15px; margin-right: 10px; margin-top: 10px; border: 2px solid black; height: 100%;"
        >
          <br />
          <span
            style="font-size: 13px; font-weight: bold; color: white"
          >Tăng trưởng thiết bị năm {{new Date().getFullYear()}}</span>
          <chart height="100%" width="100%" />
        </div>
      </el-row>
    </el-col>
  </el-row>
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
import Axios from "axios";

export default {
  components: { TrackingMap, Chart },
  data() {
    return {
      loadTong: false,
      tinhThanhs: [],
      tongThietBi: 0,
      tinhThanhId: null,
      online: [],
      offline: [],
      tinhThanhDaKetNoi: 0,
      diemChay: [],
      dangChays: [],
      donVi: [],
      toaNha: [],
      per_page_diem_chay: 5,
      loadingDiemChay: false,
      loadingDonVi: false,
      loadingDangChay: false,
      loadingToaNha: false,
      tongDiemChay: 0,
      tongToaNha: 0,
      tongDangChay: 0,
      tongDonVi: 0,
      per_page_don_vi: 5,
      per_page_toa_nha: 10,
      per_page_dang_chay: 10
    };
  },

  methods: {
    getThietBi() {
     getThietbiTinhThanh().then(
        data => {
          this.tinhThanhs = data;
          for (let item of data) {
            this.tongThietBi = this.tongThietBi + item.so_thiet_bi;
            if (item.so_thiet_bi > 0) {
              this.tinhThanhDaKetNoi++;
            }
          }
        }
      );
    },
    async getDiemChay(tinhThanhId) {
      this.loadingDiemChay = true;
      this.per_page_diem_chay += 5;
      let data = await diemChay({
        per_page: this.per_page_diem_chay,
        tinh_thanh_id: tinhThanhId
      });
      this.diemChay = data.data;
      this.tongDiemChay = data.tong;
      this.loadingDiemChay = false;
    },
    async getDonVi(tinhThanhId) {
      if (this.tongDonVi == this.per_page_don_vi) {
        this.loadingDonVi = false;
        return;
      }
      this.per_page_don_vi = this.per_page_don_vi + 5;
      this.loadingDonVi = true;
      let data = await donVi({
        per_page: this.per_page_don_vi,
        tinh_thanh_id: tinhThanhId
      });
      this.donVi = data.data;
      this.tongDonVi = data.tong;
      this.loadingDonVi = false;
    },
    async getToaNha(tinhThanhId) {
      this.per_page_toa_nha = this.per_page_toa_nha + 5;
      this.loadingToaNha = true;
      let data = await getToaNha({
        per_page: this.per_page_toa_nha,
        tinh_thanh_id: tinhThanhId
      });
      this.toaNha = data.data;
      this.tongToaNha = data.tong;
      this.loadingToaNha = false;
    },
    async getDiemDangChay(tinhThanhId) {
      let data = await dangChay({ tinh_thanh_id: tinhThanhId });
      this.dangChays = data.data;
    },
    loadToaNha() {
      if (!this.loadingToaNha) this.getToaNha();
    },

    loadDiemChay() {
      if (!this.loadingDiemChay) this.getDiemChay();
    },
    loadDonVi() {
      if (!this.loadingDonVi) this.getDonVi();
    },
    showTinhThanh(lat, lng, id) {
      this.$refs.map.showTinhThanh(lat, lng);
      this.diemChay = [];
      this.donVi = [];
      this.toaNha = [];
      this.loadTong = true
      this.loadingToaNha = true;
      this.loadingDonVi = true;
      this.loadingDiemChay = true;
      this.getDiemDangChay(id);
      this.getDiemChay(id);
      this.getDonVi(id);
      this.getToaNha(id);
    },
    async getTrangThaiThietBi() {
      let data = await getTrangThaiThietBi();
      for (let item of data) {
        if (item.online) {
          this.online.push(item);
        } else this.offline.push(item);
      }
    }
  },
  created() {
    this.getThietBi();
    this.getDiemDangChay();
  }
};
</script>
<style scoped>
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
  color: white;
  font-size: 14px;
  cursor: pointer;
}
/* width */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #5d6d7e;
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