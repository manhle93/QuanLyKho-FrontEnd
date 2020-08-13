<template>
  <div
    class="app-container"
    style="display:flex; flex-direction: column; justify-content: space-between; height: calc(100vh - 50px)"
  >
    <div style="display: flex;">
      <div class="danhmuc" style="margin-left: 0px">
        <div class="item-danhmuc" style="background-color: #2471A3">
          <div>
            <div class="so-item">{{data.khach_hang}}</div>
            <div class="ten-item">Khách hàng</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3126/3126589.svg" style="height: 100px;" />
        </div>
      </div>
      <div class="danhmuc" style="background-color: #A93226">
        <div class="item-danhmuc">
          <div>
            <div class="so-item">{{data.san_pham}}</div>
            <div class="ten-item">Sản phẩm</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/743/743007.svg" style="height: 80px;" />
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
        <div class="item-danhmuc" style="background-color: #D68910">
          <div>
            <div class="so-item">{{data.hoa_don}}</div>
            <div class="ten-item">Hóa đơn: {{month}}/{{year}}</div>
          </div>
          <img src="https://image.flaticon.com/icons/svg/3081/3081305.svg" style="height: 100px;" />
        </div>
      </div>
      <div class="danhmuc">
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
    </div>
    <div style="display: flex; height: calc(100vh - 250px); padding-bottom: 40px; margin-top: 30px">
      <div style="flex: 1;">
        <div
          style="font-size: 18px; font-weight: bold; color: #1F618D; margin-bottom: 15px"
        >SẢN PHẨM BÁN CHẠY</div>
        <div style="display:flex; justify-content: space-between;">
          <!-- <div style="color: #515A5A; font-weight: bold;">DOANH THU</div> -->
          <el-select v-model="typeChart"  style="z-index: 2;" @change="changeTypeChart(typeChart)">
            <el-option label="DOANH THU" :value="'doanh_thu'"></el-option>
            <el-option label="SỐ LƯỢNG" :value="'so_luong'"></el-option>
          </el-select>
          <div style="padding-right: 30px">
            <el-date-picker
              style="z-index: 2;"
              @change="thoiGianSanPham(date)"
              v-model="date"
              size="small"
              type="month"
              format="MM/yyyy"
              placeholder="Chọn thời gian"
            ></el-date-picker>
          </div>
        </div>
        <chart ref="banchay" height="100%" width="100%" />
      </div>
      <div style="flex: 1; margin-left: 20px">
        <div
          style="font-size: 18px; font-weight: bold; color: #1F618D; margin-bottom: 15px"
        >TỔNG DOANH THU</div>
        <div style="display:flex; justify-content: space-between;">
          <div style="color: #515A5A; font-weight: bold;">NĂM {{year}}</div>
        </div>
        <chart2 ref="doanhthu" height="100%" width="100%" />
      </div>
    </div>
  </div>
</template>
<script>
import { dashboard } from "@/api/bieudo";
import { getInfor } from "@/api/taikhoan";
import Chart from "../trungtamchihuy/dashboard/Chart";
import Chart2 from "../trungtamchihuy/dashboard/ChartDoanhThu";
export default {
  components: { Chart, Chart2 },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    });
  },
  data() {
    return {
      date: new Date(),
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      typeChart: 'doanh_thu',
      data: {
        khach_hang: 0,
        don_hang: 0,
        san_pham: 0,
        hoa_don: 0,
        doanh_thu: 0,
      },
    };
  },
  created() {
    this.getInfo();
    this.getData();
  },
  methods: {
    thoiGianSanPham(e) {
      this.$refs["banchay"].getData(e, this.typeChart);
    },
    changeTypeChart(e){
      this.$refs["banchay"].getData(this.date, e);
    },
    async getData() {
      let data = await dashboard();
      this.data = data;
    },
    async getInfo() {
      let data = await getInfor();
      if (data.data.role_id == 3) {
        this.$router.push("/quanlydonhang/baogia");
      }
    },
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
