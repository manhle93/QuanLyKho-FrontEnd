<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Thông tin">
      <el-row>
        <el-col :span="8">
          <div class="tieu-de">
            <div class="sub-title">Mã nhà khách hàng:</div>
            <label>{{ data.ma }}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Tên nhà khách hàng:</div>
            <label>{{ data.ten }}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Địa chỉ:</div>
            <label>{{ data.dia_chi }}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Số điện thoại:</div>
            <label>{{ data.so_dien_thoai }}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Mã số thuế:</div>
            <label>{{ data.ma_so_thue }}</label>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="tieu-de">
            <div class="sub-title">Địa chỉ E-Mail:</div>
            <label>{{ data.email }}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Ngày sinh:</div>
            <label>{{ data.ngay_sinh }}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Tín nhiệm:</div>
            <el-rate
              :value="+data.tin_nhiem"
              @input="data.tin_nhiem = $event"
              disabled
              show-text
              :colors="colors"
              text-color="#ff9900"
              :texts="[
                'Thường',
                'Trung bình',
                'Tốt',
                'Tính nhiệm cao',
                'Rất cao',
              ]"
            ></el-rate>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Trạng thái:</div>
            <label>{{
              data.user.active ? "Hoạt động" : "Không hoạt động"
            }}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Facebook :</div>
            <label>{{ data.Facebook }}</label>
          </div>
        </el-col>
      </el-row>
      <br />
      <el-button
        size="small"
        class="primary-button"
        icon="el-icon-edit"
        @click="capNhatTT(data)"
        >Cập nhật thông tin</el-button
      >
    </el-tab-pane>
    <el-tab-pane label="Giao dịch">
      <el-table :data="data.don_dat_hangs" style="max-height: 500px">
        <el-table-column label="STT" type="index"></el-table-column>
        <el-table-column
          property="ma"
          label="Mã đơn hàng"
          min-width="125"
        ></el-table-column>
        <el-table-column
          property="ten"
          label="Tên đơn hàng"
          min-width="123"
        ></el-table-column>
        <el-table-column
          prop="created_at"
          label="Thời gian tạo"
        ></el-table-column>
        <el-table-column property="ghi_chu" label="Ghi chú"></el-table-column>
        <el-table-column label="Đã thanh toán" prop="da_thanh_toan">
          <template slot-scope="scope"
            >{{ formate.formatCurrency(scope.row.da_thanh_toan) }} đ</template
          >
        </el-table-column>
        <el-table-column
          label="Còn phải thanh toán"
          min-width="115"
          prop="con_phai_thanh_toan"
        >
          <template slot-scope="scope"
            >{{
              formate.formatCurrency(scope.row.con_phai_thanh_toan)
            }}
            đ</template
          >
        </el-table-column>
        <el-table-column
          property="trang_thai"
          label="Trạng thái"
          min-width="125"
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              effect="plain"
              v-if="scope.row.trang_thai == 'mua_hang_online'"
              >Mua hàng online</el-tag
            >
            <el-tag
              type="primary"
              effect="plain"
              v-if="scope.row.trang_thai == 'dat_hang_online'"
              >Đặt hàng online</el-tag
            >
            <el-tag
              type="success"
              effect="plain"
              v-if="scope.row.trang_thai == 'moi_tao'"
              >Mới tạo</el-tag
            >
            <el-tag
              effect="plain"
              type="danger"
              v-if="scope.row.trang_thai == 'huy_bo'"
              >Hủy bỏ</el-tag
            >
            <el-tag
              effect="plain"
              v-if="scope.row.trang_thai == 'huy_hoa_don'"
              type="warning"
              >Hủy hóa đơn</el-tag
            >
            <el-tag
              effect="plain"
              v-if="scope.row.trang_thai == 'khach_huy'"
              type="warning"
              >Khách huỷ đơn</el-tag
            >
            <el-tag
              effect="plain"
              type="success"
              v-if="scope.row.trang_thai == 'hoa_don'"
              >Đã chuyển hóa đơn</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="Công nợ">
      <el-table :data="congNos" style="max-height: 500px">
        <el-table-column label="STT" type="index"></el-table-column>
        <el-table-column
          property="ma"
          label="Mã đơn hàng"
          min-width="125"
        ></el-table-column>
        <el-table-column
          property="ten"
          label="Tên đơn hàng"
          min-width="123"
        ></el-table-column>
        <el-table-column
          prop="created_at"
          label="Thời gian tạo"
        ></el-table-column>
        <el-table-column property="ghi_chu" label="Ghi chú"></el-table-column>
        <el-table-column label="Đã thanh toán" prop="da_thanh_toan">
          <template slot-scope="scope"
            >{{ formate.formatCurrency(scope.row.da_thanh_toan) }} đ</template
          >
        </el-table-column>
        <el-table-column
          label="Còn phải thanh toán"
          min-width="115"
          prop="con_phai_thanh_toan"
        >
          <template slot-scope="scope"
            ><el-tag type="danger"
              >{{
                formate.formatCurrency(scope.row.con_phai_thanh_toan)
              }}
              đ</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column
          property="trang_thai"
          label="Trạng thái"
          min-width="125"
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              effect="plain"
              v-if="scope.row.trang_thai == 'mua_hang_online'"
              >Mua hàng online</el-tag
            >
            <el-tag
              type="primary"
              effect="plain"
              v-if="scope.row.trang_thai == 'dat_hang_online'"
              >Đặt hàng online</el-tag
            >
            <el-tag
              type="success"
              effect="plain"
              v-if="scope.row.trang_thai == 'moi_tao'"
              >Mới tạo</el-tag
            >
            <el-tag
              effect="plain"
              type="danger"
              v-if="scope.row.trang_thai == 'huy_bo'"
              >Hủy bỏ</el-tag
            >
            <el-tag
              effect="plain"
              v-if="scope.row.trang_thai == 'huy_hoa_don'"
              type="warning"
              >Hủy hóa đơn</el-tag
            >
            <el-tag
              effect="plain"
              v-if="scope.row.trang_thai == 'khach_huy'"
              type="warning"
              >Khách huỷ đơn</el-tag
            >
            <el-tag
              effect="plain"
              type="success"
              v-if="scope.row.trang_thai == 'hoa_don'"
              >Đã chuyển hóa đơn</el-tag
            >
          </template>
        </el-table-column>
      </el-table></el-tab-pane
    >
  </el-tabs>
</template>
<script>
export default {
  props: ["data"],
  data: () => ({
    formate: formate,
    colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
    congNos: [],
  }),
  created() {
    if (this.data.don_dat_hangs && this.data.don_dat_hangs.length) {
      this.congNos = this.data.don_dat_hangs.filter(
        (el) => el.thanh_toan == "tra_sau"
      );
    }
  },
  methods: {
    capNhatTT(data) {
      this.$emit("capNhatThongTin", data);
    },
  },
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