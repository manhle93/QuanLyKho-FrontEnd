<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Hoạt động">
      <el-table :data="hoatDong" v-loading="loading">
        <el-table-column label="STT" type="index"></el-table-column>
        <el-table-column label="Thời gian" prop="created_at"></el-table-column>
        <el-table-column label="Hành động" prop="noi_dung"></el-table-column>
      </el-table>
      <br />
      <div class="block">
        <el-pagination
          background
          @current-change="handleCurrentChangeHoatDong"
          :page-sizes="[5, 10, 15, 20]"
          layout="prev, pager, next"
          :total="totalHoatDong"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Giao dịch">
      <el-table :data="giaoDich">
        <el-table-column label="STT" type="index"></el-table-column>
        <el-table-column label="Thời gian" prop="created_at"></el-table-column>
        <el-table-column label="Hành động" prop="noi_dung"></el-table-column>
      </el-table>
      <br />
      <div class="block">
        <el-pagination
          background
          @current-change="handleCurrentChangeGiaoDich"
          :page-sizes="[5, 10, 15, 20]"
          layout="prev, pager, next"
          :total="totalGiaoDich"
        ></el-pagination>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { getLichSuHoatDong } from "@/api/user";

export default {
  props: ["data"],
  data() {
    return {
      hoatDong: [],
      giaoDich: [],
      pageHoatDong: 1,
      loading: false,
      pageGiaoDich: 1,
      totalHoatDong: 0,
      totalGiaoDich: 0,
    };
  },
  created() {
    this.getHoatDong();
    this.getGiaoDich();
  },
  methods: {
    async getHoatDong() {
      this.loading = true;
      let data = await getLichSuHoatDong({
        page: this.pageHoatDong,
        user_id: this.data.id
      });
      this.loading = false;
      this.pageHoatDong = data.current_page;
      this.totalHoatDong = data.total;
      this.hoatDong = data.data.filter((el) => el.type != "don_hang");
    },
    async getGiaoDich() {
      this.loading = true;
      let data = await getLichSuHoatDong({
        page: this.pageGiaoDich,
        doi_tuong: "don_hang",
        user_id: this.data.id
      });
      this.loading = false;
      this.totalGiaoDich = data.total;
      this.pageGiaoDich = data.current_page;
      this.giaoDich = data.data;
    },
    handleCurrentChangeHoatDong(val) {
      this.pageHoatDong = val;
      this.getHoatDong();
    },
    handleCurrentChangeGiaoDich(val) {
      this.pageGiaoDich = val;
      this.getGiaoDich();
    },
  },
};
</script>