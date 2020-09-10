<template>
  <div class="app-container">
    <el-form :model="form">
      <el-row :gutter="20" justify="space-around">
        <el-col :span="6">
          <el-date-picker
            style="width: 100%"
            v-model="form.date"
            type="daterange"
            range-separator="-"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            size="small"
            format="dd/MM/yyyy"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-select
            filterable
            clearable
            size="small"
            v-model="form.nha_cung_cap"
            placeholder="Chọn nhà cung cấp"
            style="width: 100%"
          >
            <el-option
              v-for="item in nhaCungCaps"
              :key="item.id"
              :label="item.ten"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="getDonHang()"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="11">
          <el-button
            style="float: right"
            size="small"
            class="primary-button"
            icon="el-icon-plus"
            @click="taoDon()"
          >Tạo đơn</el-button>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <h4>Lịch sử thanh toán cho nhà cung cấp</h4>

    <el-dialog :visible.sync="showCreate" title="THANH TOÁN ĐƠN HÀNG" width="900px">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-select
            size="small"
            style="width: 100%"
            placeholder="Chọn nhà cung cấp"
            v-model="nha_cung_cap_id"
            clearable
            @change="getDonHang(nha_cung_cap_id)"
          >
            <el-option
              v-for="item in nhaCungCaps"
              :key="item.id"
              :label="item.ten"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-select
            size="small"
            style="width: 100%"
            placeholder="Chọn đơn hàng"
            v-model="don_hang_id"
          >
            <el-option
              v-for="item in donhangnhacungcaps"
              :key="item.id"
              :value="item.id"
              :label="item.ten"
              :disabled="checkDaChon(item)"
            >
              <span style="float: left">{{ item.ten }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ma }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button
            class="primary-button"
            size="small"
            circle
            icon="el-icon-plus"
            @click="themSanPham()"
          ></el-button>
        </el-col>
      </el-row>
      <br />
      <el-table :data="dataDonHang" height="350px">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column label="Ngày nhập" prop="updated_at"></el-table-column>
        <el-table-column label="Tên đơn hàng" prop="ten" min-width="100">
          <template slot-scope="scope">
            {{scope.row.ten}}
            <br />
            {{scope.row.ma}}
          </template>
        </el-table-column>
        <el-table-column label="Tổng thanh toán" prop="da_thanh_toan">
          <template slot-scope="scope">{{formate.formatCurrency(scope.row.tong_tien)}} đ</template>
        </el-table-column>
        <el-table-column label="Đã thanh toán" prop="da_thanh_toan">
          <template slot-scope="scope">{{formate.formatCurrency(scope.row.da_thanh_toan)}} đ</template>
        </el-table-column>
        <el-table-column label="Phải thanh toán" prop="so_luong">
          <template
            slot-scope="scope"
          >{{formate.formatCurrency(scope.row.tong_tien - scope.row.da_thanh_toan)}} đ</template>
        </el-table-column>
        <el-table-column label="Xóa" width="80">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              type="danger"
              circle
              size="mini"
              @click="xoaSanPham(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <label>Tổng tiền phải thanh toán: {{formate.formatCurrency(tongTienPhaiThanhToan)}} đ</label>
      <br><br>
      <label style="margin-right: 20px">Số tiền thanh toán</label>
      <el-input-number style="width: 250px" size="small" v-model="thanh_toan" :min="0" :step="100" :max="tongTienPhaiThanhToan"></el-input-number>
      <br><br>
      <label>Còn phải thanh toán: {{formate.formatCurrency(tongTienPhaiThanhToan - thanh_toan)}} đ</label>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="warning" icon="el-icon-close" @click="showCreate = false">Hủy</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-if="!edit"
          icon="el-icon-plus"
          @click="submit()"
        >Thêm mới</el-button>
        <el-button
          class="primary-button"
          size="small"
          v-else
          icon="el-icon-check"
          @click="update()"
        >Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { donHangNhapKho } from "@/api/donhangnhacungcap";

export default {
  props: ["nhaCungCaps"],
  data() {
    return {
      thanh_toan: 0,
      endPointImage: process.env.VUE_APP_BASE,
      page: 1,
      per_page: 10,
      total: 0,
      tableData: null,
      listLoading: true,
      loading: false,
      search: "",
      showCreate: false,
      list: [],
      formate: formate,
      edit: false,
      don_hang_id: null,
      nha_cung_cap_id: null,
      dataDonHang: [],
      donhangnhacungcaps: [],
      tongTienPhaiThanhToan: 0,
      form: {
        date: [],
        nha_cung_cap: null,
      },
    };
  },
  methods: {
    taoDon() {
      this.showCreate = true;
    },
    async getDonHang(id) {
      this.dataDonHang = [];
      this.thanh_toan = 0
      this.tongTienPhaiThanhToan = 0
      this.don_hang_id = null;
      if (!id) {
        this.donhangnhacungcaps = [];
        return;
      }
      let data = await donHangNhapKho(id);
      this.donhangnhacungcaps = data;
    },
    themSanPham() {
      if (!this.don_hang_id) {
        this.$message({
          message: "Số lượng và đơn giá phải lớn hơn 0",
          type: "warning",
        });
        return;
      }
      
      let donHang = this.donhangnhacungcaps.find(
        (el) => el.id == this.don_hang_id
      );
      this.don_hang_id = null
      this.tongTienPhaiThanhToan =
        +this.tongTienPhaiThanhToan +
        (donHang.tong_tien - donHang.da_thanh_toan);
      this.dataDonHang.push(donHang);
    },
    xoaSanPham(index) {
      this.thanh_toan = 0
      this.tongTienPhaiThanhToan =
        this.tongTienPhaiThanhToan -
        (this.dataDonHang[index].tong_tien -
          this.dataDonHang[index].da_thanh_toan);
      this.dataDonHang.splice(index, 1);
    },
    checkDaChon(item) {
      if (item.thanh_toan || this.dataDonHang.find((el) => el.id == item.id))
        return true;
      return false;
    },
  },
};
</script>