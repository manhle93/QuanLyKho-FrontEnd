<template>
  <div class="order-popup">
    <el-row>
      <el-col :span="4">
        <img
          :src="src"
          style="width: 50px; height: 50px"
        />
      </el-col>
      <el-col :span="20">
        <div
          style="font-size: 14px;color: red; font-weight: bold; line-height: 25px; margin-left: 15px"
        >[{{order.ma}}] {{ order.ten}}</div>
      </el-col>
    </el-row>
    <hr />
    <el-row class="report-header">
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-location" size="mini" circle></el-button>
      </el-col>
      <el-col :span="20" class="highlight-text">
        <span>{{order.dia_chi}}</span>
      </el-col>
    </el-row>
    <el-row class="report-header">
      <el-col :span="4">
        <el-button type="success" icon="el-icon-phone" size="mini" circle></el-button>
      </el-col>
      <el-col :span="20" class="highlight-text">{{order.so_dien_thoai}}</el-col>
    </el-row>
    <el-row class="report-header">
      <el-col :span="4">
        <el-button type="warning" icon="el-icon-user" size="mini" circle></el-button>
      </el-col>
      <el-col :span="20" class="highlight-text">Cán bộ quản lý: {{order.can_bo_quan_ly}}</el-col>
    </el-row>
    <el-row class="report-header">
      <el-col :span="4">
        <el-button type="success" icon="el-icon-phone" size="mini" circle></el-button>
      </el-col>
      <el-col :span="20" class="highlight-text">Trực ban: {{order.so_dien_thoai_truc_ban}}</el-col>
    </el-row>
    <el-row class="report-header">
      <el-col :span="4">
        <el-button type="info" icon="el-icon-user" size="mini" circle></el-button>
      </el-col>
      <el-col
        :span="20"
        class="highlight-text"
      >Nhân sự quản lý: {{order.nhan_su_pccc_quan_ly}} cán bộ</el-col>
    </el-row>
    <el-row class="report-header">
      <el-col :span="4">
        <el-button type="info" icon="el-icon-user" size="mini" circle></el-button>
      </el-col>
      <el-col :span="20" class="highlight-text">Nhân sự PCCC: {{order.nhan_su_chua_chay}} cán bộ</el-col>
    </el-row>
    <el-row class="report-header">
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-edit-outline" size="mini" circle></el-button>
      </el-col>
      <el-col
        :span="20"
        class="highlight-text"
      >Quản lý {{order.quan_ly_diem_lay_nuoc}} điểm lấy nước</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "DonViPopup",

  filters: {
    formatDate(date) {
      return typeof date === "string"
        ? `${date.slice(0, 10)} ${date.slice(11, 19)}`
        : date;
    }
  },

  computed: {
    reports() {
      return this.order.reports;
    },
    src:function(){
      if(this.order&&this.order.avatar_url){
        return   process.env.VUE_APP_BASE +  "/"+this.order.avatar_url;
      }else{
        return process.env.VUE_APP_BASE +  "/storage/images/avatar/firehat.png";
      }
    }
  },

  data() {
    return {
      order: {
        construction: {},
        reports: []
      }
    };
  }
};
</script>

<style scoped>
.order-popup {
  color: #afafaf;
}

.order-item {
  display: flex;
  padding: 10px 0;
  cursor: pointer;
}

.construction-icon {
  font-size: 38px;
  line-height: 42px;
  margin-right: 5px;
  flex: none;
}

.order-info {
  flex: 1;
}

.highlight-text {
  color: #4eaff9;
  font-weight: bold;
  font-size: 12px;
  padding-top: 4px;
}

.title-text {
  font-weight: bold;
  color: rgb(26, 26, 26);
  font-size: 15px;
}

.reports-container {
  max-height: 340px;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 8px !important;
}

.report-item:not(:last-child) {
  margin-bottom: 5px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
}

.images-container {
  position: relative;
  width: 100%;
  background-color: #cccccc;
  height: 180px;
}

.images-container-img {
  width: 100%;
  height: 100%;
  margin: auto;
  object-fit: cover;
}

.image-description {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1005;
  padding: 4px;
  color: white;

  background-color: rgba(0, 0, 0, 0.5);
}
</style>
