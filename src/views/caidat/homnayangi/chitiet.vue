<template>
  <div class="app-container">
    <h3>Nguyên liệu sản xuất</h3>
    <el-table
      :data="data"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="font-size: 13px"
    >
      <el-table-column label="STT" min-width="55" type="index" align="center"></el-table-column>
      <!-- <el-table-column label="Hình ảnh" width="200" align="center">
        <template slot-scope="scope">
          <img
            :src="
              scope.row.nguyen_lieus.anh_dai_dien
                ? endPointImage + scope.row.nguyen_lieus.anh_dai_dien
                : src
            "
            style="max-height: 90px; max-width: 90px"
          />
        </template>
      </el-table-column>-->
      <el-table-column prop="ten" min-width="160" label="Tên nguyên liệu"></el-table-column>
      <el-table-column prop="so_luong" min-width="160" label="Số lượng">
        <template slot-scope="scope">
          {{
          formate.formatCurrency(scope.row.so_luong) + ' ' +scope.row.don_vi
          }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ["data"],
  data: () => ({
    formate: formate,
    src: process.env.VUE_APP_BASE + "images/avatar/product.png",
    endPointImage: process.env.VUE_APP_BASE,
    colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
  }),
  created() {
    console.log(this.data);
  },
  methods: {},
};
</script>
<style scoped>
.tieu-de {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
}
.sub-title {
  width: 130px;
}
</style>