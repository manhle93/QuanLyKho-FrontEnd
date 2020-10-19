<template>
  <el-tabs type="card">
    <el-tab-pane label="Đơn hàng">
      <div class="app-container" v-on:keyup.enter="getDonHang">
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
              multiple
              clearable
              size="small"
              v-model="form.trang_thai"
              placeholder="Trạng thái đơn hàng"
              style="width: 100%"
            >
              <el-option label="Mới tạo" value="moi_tao"></el-option>
              <el-option label="Hủy bỏ" value="huy_bo"></el-option>
              <el-option label="Đã duyệt đơn" value="da_duyet"></el-option>
              <el-option label="Đã nhập kho" value="nhap_kho"></el-option>
              <el-option
                label="Đã nhập mua ngoài"
                value="nhap_kho_ngoai"
              ></el-option>
            </el-select>
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
          <el-col :span="4">
            <el-input
              v-model="form.search"
              size="small"
              placeholder="Tìm kiếm: Mã, tên đơn hàng, SĐT khách hàng ..."
              @keyup.enter.native="getDonHang()"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-button
              size="small"
              class="primary-button"
              icon="el-icon-search"
              @click="getDonHang()"
              >Tìm kiếm</el-button
            >
          </el-col>
          <el-col :span="3">
            <router-link to="/quanlydonhang/taodonnhacungcap">
              <el-button
                style="float: right"
                size="small"
                class="primary-button"
                icon="el-icon-plus"
                >TẠO ĐƠN</el-button
              >
            </router-link>
          </el-col>
        </el-row>
        <br />
        <div
          class="d-flex"
          style="align-items: center; justify-content: space-between"
        >
          <h4><i style="color: green">DANH SÁCH ĐƠN HÀNG TỪ NHÀ CUNG CẤP</i></h4>
          <el-dropdown trigger="click">
            <el-button
              class="el-dropdown-link primary-button"
              icon="el-icon-setting"
              circle
              size="mini"
            ></el-button>
            <el-dropdown-menu slot="dropdown" style="padding-right: 5px">
              <el-checkbox v-model="showColumn.stt" style="padding-left: 10px"
                >STT</el-checkbox
              >
              <el-checkbox v-model="showColumn.ma">Mã đơn hàng</el-checkbox>
              <el-checkbox v-model="showColumn.ten">Tên đơn hàng</el-checkbox>
              <el-checkbox v-model="showColumn.tong_tien"
                >Tổng tiền</el-checkbox
              >
              <el-checkbox v-model="showColumn.ghi_chu">Ghi chú</el-checkbox>
              <el-checkbox v-model="showColumn.chiet_khau"
                >Chiết khấu</el-checkbox
              >
              <el-checkbox v-model="showColumn.da_tt"
                >Đã thanh toán</el-checkbox
              >
              <el-checkbox v-model="showColumn.thoi_gian_nhan_hang"
                >Thời gian nhận</el-checkbox
              >
              <el-checkbox v-model="showColumn.con_phai_thanh_toan"
                >Còn phải thanh toán</el-checkbox
              >
              <el-checkbox v-model="showColumn.trang_thai"
                >Trạng thái</el-checkbox
              >
              <el-checkbox
                v-model="showColumn.tao_boi"
                style="padding-right: 10px"
                >Đơn tạo bởi</el-checkbox
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <br />
        <br />
        <el-row>
          <el-col :span="24">
            <el-table
              v-loading="listLoading"
              element-loading-text="Đang tải dữ liệu"
              :data="tableData"
              style="width: 100%; font-size: 13px"
              border
            >
              <el-table-column
                sortable
                type="index"
                label="STT"
                v-if="showColumn.stt"
              ></el-table-column>
              <el-table-column
                property="ma"
                label="Mã đơn hàng"
                min-width="125"
                v-if="showColumn.ma"
              ></el-table-column>
              <el-table-column
                property="ten"
                label="Tên đơn hàng"
                min-width="123"
                v-if="showColumn.ten"
              ></el-table-column>
              <el-table-column
                label="Tổng tiền"
                min-width="115"
                prop="tong_tien"
                v-if="showColumn.tong_tien"
              >
                <template slot-scope="scope"
                  >{{ formate.formatCurrency(scope.row.tong_tien) }} đ</template
                >
              </el-table-column>
              <el-table-column
                property="ghi_chu"
                label="Ghi chú"
                min-width="123"
                v-if="showColumn.ghi_chu"
              ></el-table-column>
              <el-table-column
                label="Chiết khấu"
                min-width="115"
                prop="chiet_khau"
                v-if="showColumn.chiet_khau"
              >
                <template slot-scope="scope"
                  >{{
                    formate.formatCurrency(scope.row.chiet_khau)
                  }}
                  đ</template
                >
              </el-table-column>
              <el-table-column
                label="Đã thanh toán"
                min-width="115"
                prop="da_thanh_toan"
                v-if="showColumn.da_tt"
              >
                <template slot-scope="scope"
                  >{{
                    formate.formatCurrency(scope.row.da_thanh_toan)
                  }}
                  đ</template
                >
              </el-table-column>

              <el-table-column
                label="Còn phải thanh toán"
                min-width="115"
                v-if="showColumn.con_phai_thanh_toan"
              >
                <template slot-scope="scope"
                  >{{
                    formate.formatCurrency(
                      scope.row.tong_tien - scope.row.da_thanh_toan
                    )
                  }}
                  đ</template
                >
              </el-table-column>

              <el-table-column
                prop="thoi_gian"
                label="Thời gian nhận hàng"
                v-if="showColumn.thoi_gian_nhan_hang"
              ></el-table-column>
              <el-table-column
                property="trang_thai"
                label="Trạng thái"
                min-width="125"
                v-if="showColumn.trang_thai"
              >
                <template slot-scope="scope">
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
                    type="success"
                    v-if="scope.row.trang_thai == 'da_duyet'"
                    >Đã duyệt đơn</el-tag
                  >
                  <el-tag
                    effect="dark"
                    type="success"
                    v-if="
                      scope.row.trang_thai == 'nhap_kho' ||
                      scope.row.trang_thai == 'nhap_kho_ngoai'
                    "
                    >Đã nhập kho</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="Đơn tạo bởi"
                min-width="95"
                prop="user.name"
                v-if="showColumn.tao_boi"
              ></el-table-column>
              <el-table-column
                label="Hành động"
                align="center"
                fixed="right"
                width="120"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Chi tiết"
                    placement="top"
                  >
                    <el-button
                      size="small"
                      @click="edit(scope.row.id)"
                      class="primary-button"
                      icon="el-icon-edit"
                      circle
                    ></el-button>
                  </el-tooltip>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Xóa"
                    placement="top"
                  >
                    <el-button
                      size="small"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="handleDelete(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <br />
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            :page-sizes="[5, 10, 15, 20]"
            layout="total, sizes, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Thanh toán">
      <thanh-toan :nhaCungCaps="nhaCungCaps"></thanh-toan>
    </el-tab-pane>
    <el-tab-pane label="Trả hàng">
      <tra-hang></tra-hang>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { listDonHang, xoaDonHang } from "@/api/donhangnhacungcap";
import { getNhaCungCap } from "@/api/khachhang";
import ThanhToan from "./thanhtoan";
import TraHang from "./trahang";
export default {
  components: {
    ThanhToan,
    TraHang,
  },
  data() {
    return {
      endPointImage: process.env.VUE_APP_BASE,
      page: 1,
      per_page: 10,
      total: 0,
      tableData: null,
      listLoading: true,
      loading: false,
      search: "",
      list: [],
      formate: formate,
      form: {
        date: [],
        nha_cung_cap: null,
        search: "",
      },
      showColumn: {
        stt: true,
        ma: true,
        ten: true,
        tong_tien: true,
        ghi_chu: true,
        da_tt: true,
        thoi_gian_nhan_hang: true,
        con_phai_thanh_toan: true,
        chiet_khau: true,
        trang_thai: true,
        tao_boi: true,
      },
      formAdd: {
        id: null,
        ten: "",
        ma: "",
        tinh_thanh_id: null,
        toa_nha_id: null,
        ma_don_hang: "",
        ten_don_hang: "",
        thiet_bi: [],
        cam_bien: [],
        trang_thai: "moi_tao",
        nhan_vien_id: null,
        ghi_chu: "",
        thoi_gian: null,
        nguoi_mua_hang: "",
        tong_tien: 0,
        hinh_anhs: [],
      },
      nhaCungCaps: [],
      showCreate: false,
      rules: {
        ten: [
          {
            required: true,
            message: "Hãy nhập tên đơn hàng",
            trigger: "blur",
          },
        ],
        ma: [
          {
            required: true,
            message: "Mã đơn hàng không thể bỏ trống",
            trigger: "blur",
          },
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Hãy chọn một tỉnh thành",
            trigger: "blur",
          },
        ],
        toa_nha_id: [
          {
            required: true,
            message: "Hãy chọn một tòa nhà",
            trigger: "blur",
          },
        ],
        thoi_gian: [
          {
            required: true,
            message: "Thời gian không thể bỏ trống",
            trigger: "blur",
          },
        ],
        trang_thai: [
          {
            required: true,
            message: "Trạng thái không thể bỏ trống",
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    this.getDonHang();
    this.getNhaCungCap();
  },

  mounted() {},

  methods: {
    duyetDon() {},
    huyDon() {},
    handleCurrentChange(val) {
      this.page = val;
      this.updateDataTable();
    },

    handleSizeChange(val) {
      this.per_page = val;
      this.updateDataTable();
    },
    updateDataTable() {
      let first = (this.page - 1) * this.per_page;
      let last = first + this.per_page;
      last = last > this.tableData.length ? this.tableData.length : last;
      this.getDonHang(this.page, this.per_page);
    },

    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa đơn hàng: " +
            "<strong>" +
            data.ten +
            "</strong>",
          "Xóa đơn hàng",
          {
            confirmButtonText: "Xóa",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        this.listLoading = true;
        let status = await xoaDonHang(data.id);
        this.getDonHang();
        this.$message({
          message: "Xóa thành công",
          type: "success",
        });
      } catch (error) {
        this.listLoading = false;
      }
    },
    async getDonHang() {
      this.listLoading = true;
      let data = await listDonHang({
        per_page: this.per_page,
        page: this.page,
        nha_cung_cap: this.form.nha_cung_cap,
        date: this.form.date,
        trang_thai: this.form.trang_thai,
        search: this.form.search,
      });
      this.page = data.data.page;
      this.per_page = data.data.per_page;
      this.total = data.data.total;
      this.tableData = data.data.data;
      this.listLoading = false;
    },
    edit(id) {
      this.$router.push("/quanlydonhang/capnhatdonhang/" + id);
    },
    async getNhaCungCap() {
      let data = await getNhaCungCap({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },
  },
};
</script>


<style lang="scss" scoped>
.d-flex {
  display: flex;
  flex-direction: row;
}
</style>
