<template>
  <div class="order-popup">
    <div class="reports-container">
      <el-row>
        <el-col :span="4">
          <img
            src="http://pcccapi.howizbiz.com/storage/images/avatar/1570527931.png"
            style="width: 40px; height: 40px"
          />
        </el-col>
        <el-col :span="20">
          <div
            style="font-size: 14px;color: red; font-weight: bold; line-height: 25px; margin-left: 10px"
          >{{ order.ten}}</div>
        </el-col>
      </el-row>
      <hr />
      <el-row class="report-header">
        <el-col :span="4">
          <el-button type="success" icon="el-icon-phone" size="mini" circle></el-button>
        </el-col>
        <el-col :span="20" class="highlight-text">{{phoneFormat(order.so_dien_thoai)}}</el-col>
      </el-row>
      <el-row class="report-header">
        <el-col :span="4">
          <el-button type="warning" icon="el-icon-c-scale-to-original" size="mini" circle></el-button>
        </el-col>
        <el-col :span="20" class="highlight-text">Biển số: {{order.bien_so}}</el-col>
      </el-row>
      <el-row class="report-header">
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-s-home" size="mini" circle></el-button>
        </el-col>
        <el-col
          :span="20"
          class="highlight-text"
          v-if="order.don_vi_pccc != null"
        >Đơn vị QL: {{order.don_vi_pccc.ten}}</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "XePopup",

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
  },
  methods: {
    phoneFormat(number) {
      number = String(number);
      var formatted = "";
      var digits = 4; //The number of digits to pull off next time.
      var dash = "";
      while (digits > 0) {
        //Prepend final [digits] digits to formatted number, with a dash
        formatted =
          number.substr(number.length - digits, digits) + dash + formatted;
        //Remove digits from the old number
        number = number.substr(0, number.length - digits);
        digits = Math.min(number.length, 3);
        dash = ".";
      }
      return formatted;
    }
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
