<template>
  <div class="app-container">
    <h4><i style="color: green"> HÌNH ẢNH BANNER</i></h4>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="font-size: 13px"
    >
      <el-table-column
        label="STT"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column label="Tín nhiệm khách hàng" prop="dong_chu">
        <template slot-scope="scope">
          <div>{{ scope.row.tin_nhiem }} sao</div>
          <el-rate
            :value="+scope.row.tin_nhiem"
            :disabled="true"
            :max="10"
          ></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="Mức chiết khâu">
        <template slot-scope="scope"
          >{{ scope.row.phan_tram }} %</template
        >
      </el-table-column>
      <el-table-column label="Trạng thái" prop="dong_chu"
        ><template slot-scope="scope">
          <div v-if="scope.row.active">
            <el-tag effect="plain" type="success">Đang áp dụng</el-tag>
          </div>

          <div v-else>
            <el-tag effect="plain" type="warning">Chưa áp dụng</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="110"
        fixed="right"
        label="Hoạt động"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="Chỉnh sửa"
            placement="top"
          >
            <el-button
              size="small"
              class="primary-button"
              icon="el-icon-edit"
              circle
              @click="showUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="CẬP NHẬT CHIẾT KHẤU"
      :visible.sync="showForm"
      width="600px"
      center
    >
      <el-form>
        <el-form-item label="Tín nhiệm khách hàng">
          <div>{{ form.tin_nhiem }} sao</div>
          <el-rate
            :value="+form.tin_nhiem"
            :disabled="true"
            :max="10"
          ></el-rate>
        </el-form-item>
        <el-form-item label="Phần trăm chiết khâu">
          <el-input
            placeholder="Nhập phần trăm chiết khâu"
            v-model="form.phan_tram"
            :min="0"
            type="number"
          >
            <template slot="append"
              >%</template
            >
          </el-input>
        </el-form-item>
        <el-form-item label="Áp dụng">
          <br />
          <el-checkbox
            v-model="form.active"
            label="Áp dụng"
            border
          ></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="warning"
          icon="el-icon-close"
          @click="showForm = false"
          >Hủy</el-button
        >
        <el-button
          class="primary-button"
          size="small"
          icon="el-icon-check"
          @click="update()"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getChietKhau, updateChietKhau } from "@/api/caidat";
export default {
  data: () => ({
    tableData: [],
    showForm: false,
    listLoading: false,
    form: {
      id: null,
      tin_nhiem: 0,
      phan_tram: 0,
      active: true
    }
  }),
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.listLoading = true
      let data = await getChietKhau();
      this.tableData = data;
      this.listLoading = false
    },
    showUpdate(data) {
      this.showForm = true;
      this.form.id = data.id;
      this.form.tin_nhiem = data.tin_nhiem;
      this.form.phan_tram = data.phan_tram;
      this.form.active = data.active;
    },
    async update() {
      if (
        this.form.phan_tram == null ||
        this.form.phan_tram == undefined ||
        this.form.phan_tram == ""
      ) {
        this.$message({
          message: "Chưa nhập phần trăm chiết khâu",
          type: "warning"
        });
        return;
      }
      if (this.form.phan_tram < 0) {
        this.$message({
          message: "Phần trăm chiết khâu không hợp lệ",
          type: "warning"
        });
        return;
      }
      try {
        await updateChietKhau(this.form);
        this.getData();
         this.showForm = false
        this.$message({
          message: "Cập nhật thành công",
          type: "success"
        });
      } catch (error) {
        this.showForm = false
        this.listLoading = false;
      }
    }
  }
};
</script>
