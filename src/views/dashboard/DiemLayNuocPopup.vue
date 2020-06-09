<template>
  <div class="order-popup">
    <el-row>
      <el-col :span="5" v-if="order.loai && ((order.loai.toLowerCase().includes('mương') || order.loai.toLowerCase().includes('bể')) || order.loai.toLowerCase().includes('giếng'))">
        <img
          src="http://pcccapi.howizbiz.com/storage/images/avatar/1570694417.jpg"
          style="width: 50px; height: 50px"
        />
      </el-col>
      <el-col :span="5" v-else-if="order.loai && ((order.loai.toLowerCase().includes('ao') || order.loai.toLowerCase().includes('suối') || order.loai.toLowerCase().includes('hồ') || order.loai.toLowerCase().includes('tự nhiên') || order.loai.toLowerCase().includes('sông')|| order.loai.toLowerCase().includes('kênh')))">
        <img
          src="http://pcccapi.howizbiz.com/storage/images/avatar/1570694384.jpg"
          style="width: 50px; height: 50px"
        />
      </el-col>
      <el-col :span="4" v-else>
        <img
          src="http://pcccapi.howizbiz.com/storage/images/avatar/1570526334.png"
          style="width: 50px; height: 50px"
        />
      </el-col>
      <el-col :span="19">
        <div
          style="font-size: 14px;color: red; font-weight: bold; line-height: 25px; margin-left: 10px"
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
    <el-row class="report-header" v-if="order.description && order.description != ''">
      <el-col :span="4">
        <el-button type="success" icon="el-icon-check" size="mini" circle></el-button>
      </el-col>
      <el-col :span="20" class="highlight-text">
        <span>Mô tả: {{ order.description}}</span>
      </el-col>
    </el-row>
        <el-row class="report-header">
      <el-col :span="4">
        <el-button type="success" icon="el-icon-circle-check" size="mini" circle></el-button>
      </el-col>
      <el-col :span="20" class="highlight-text">
        <span v-if="order.kha_nang_cap_nuoc_cho_xe">Khả năng cấp nước cho xe CC: Có</span>
        <span v-else>Khả năng cấp nước cho xe CC: Không</span>
      </el-col>
    </el-row>
    <el-row class="report-header">
      <el-col :span="4">
        <el-button type="warning" icon="el-icon-edit-outline" size="mini" circle></el-button>
      </el-col>
      <el-col :span="20" class="highlight-text">
        <span>Loại: {{ order.loai}}</span>
      </el-col>
    </el-row>
    <el-row class="report-header">
      <el-col :span="4">
        <el-button type="info" icon="el-icon-office-building" size="mini" circle></el-button>
      </el-col>
      <el-col :span="20" class="highlight-text">
        <span>Cơ quan QL: {{order.don_vi_quan_ly}}</span>
      </el-col>
    </el-row>
    <!-- Images -->
  </div>
</template>

<script>
export default {
  name: "DiemLayNuocPopup",

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
  font-size: 14px;
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
