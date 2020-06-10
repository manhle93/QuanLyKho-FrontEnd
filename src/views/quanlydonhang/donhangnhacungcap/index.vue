<template>
  <div class="app-container" v-on:keyup.enter="searchData">
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
            size="small"
            v-model="form.nha_cung_cap"
            placeholder="Chọn nhà cung cấp"
            style="width: 100%"
          >
            <el-option
              v-for="item in nhaCungCaps"
              :key="item.id"
              :label="item.ten"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button
            size="small"
            class="primary-button"
            icon="el-icon-search"
            @click="searchData()"
          >Tìm kiếm</el-button>
        </el-col>
        <el-col :span="11">
          <el-button
            style="float: right"
            size="small"
            class="primary-button"
            icon="el-icon-plus"
            @click="showCreateDonHang"
          >Tạo đơn</el-button>
        </el-col>
      </el-row>
    </el-form>
    <br />
    <h4>Danh sách đơn hàng nhà cung cấp</h4>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading == false"
          element-loading-text="Đang tải dữ liệu"
          :data="tableData"
          style="width: 100%; font-size: 13px"
          border
        >
          <el-table-column sortable type="index" label="STT"></el-table-column>
          <el-table-column prop="thoi_gian" label="Thời gian">
            <template slot-scope="scope">{{formatDate(scope.row.thoi_gian)}}</template>
          </el-table-column>
          <el-table-column property="ma" label="Mã " min-width="125"></el-table-column>
          <el-table-column property="ten" label="Tên đơn hàng" min-width="123"></el-table-column>
          <el-table-column property="tinh_thanh.name" label="Tỉnh thành" min-width="123"></el-table-column>
          <el-table-column property="toa_nha.ten" label="Tòa nhà" min-width="143"></el-table-column>
          <el-table-column label="Nhân viên triển khai" min-width="115" prop="user_nhan_vien.name"></el-table-column>
          <el-table-column property="trang_thai" label="Trạng thái" min-width="125">
            <template slot-scope="scope">
              <el-tag effect="plain" v-if="scope.row.trang_thai == 'moi_tao'">Mới tạo</el-tag>
              <el-tag
                effect="dark"
                v-if="scope.row.trang_thai == 'bao_hong'"
                type="warning"
              >Sự cố, báo hỏng</el-tag>
              <el-tag
                effect="plain"
                type="warning"
                v-if="scope.row.trang_thai == 'dang_trien_khai'"
              >Đang triển khai</el-tag>
              <el-tag
                effect="dark"
                type="danger"
                v-if="scope.row.trang_thai == 'nhan_vien_huy_don'"
              >Nhân viên hủy</el-tag>
              <el-tag effect="plain" type="danger" v-if="scope.row.trang_thai == 'huy_bo'">Hủy bỏ</el-tag>
              <el-tag
                effect="plain"
                type="success"
                v-if="scope.row.trang_thai == 'hoan_thanh'"
              >Hoàn thành</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Đơn tạo bởi" min-width="95" prop="user_nguoi_tao.name"></el-table-column>
          <el-table-column label="Hành động" align="center" fixed="right" width="120">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="Chi tiết" placement="top">
                <el-button
                  size="small"
                  @click="showEdit(scope.row)"
                  class="primary-button"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="Xóa" placement="top">
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
</template>
<script>
export default {
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
      edit: false,
      form: {
        date: [],
        nha_cung_cap: []
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
        hinh_anhs: []
      },
      nhaCungCaps: [],
      showCreate: false,
      rules: {
        ten: [
          {
            required: true,
            message: "Hãy nhập tên đơn hàng",
            trigger: "blur"
          }
        ],
        ma: [
          {
            required: true,
            message: "Mã đơn hàng không thể bỏ trống",
            trigger: "blur"
          }
        ],
        tinh_thanh_id: [
          {
            required: true,
            message: "Hãy chọn một tỉnh thành",
            trigger: "blur"
          }
        ],
        toa_nha_id: [
          {
            required: true,
            message: "Hãy chọn một tòa nhà",
            trigger: "blur"
          }
        ],
        thoi_gian: [
          {
            required: true,
            message: "Thời gian không thể bỏ trống",
            trigger: "blur"
          }
        ],
        trang_thai: [
          {
            required: true,
            message: "Trạng thái không thể bỏ trống",
            trigger: "blur"
          }
        ]
      }
    };
  },

  created() {},

  mounted() {},

  methods: {
    showCreateDonHang() {
      this.resetForm();
      this.showCreate = true;
      this.edit = false;
      this.getDataThietBi(null);
      this.getDataCamBien();
    },
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
      this.searchData(this.page, this.per_page);
    },
    resetForm() {
      this.showCreate = false;
      this.chiTietToaNha = {};
      this.so_dien_thoai_toa_nha = "";
      this.formAdd = {
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
        hinh_anhs: []
      };
      this.toanhas = [];
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
            type: "warning"
          }
        );
        this.listLoading = true;
        let status = await xoadonhang(data.id);
        let getData = await this.getData();
        this.listLoading = false;
        this.$message({
          message: "Xóa thành công",
          type: "success"
        });
      } catch (error) {
        this.listLoading = false;
      }
    },
    showEdit(data) {
      this.edit = true;
      this.resetForm();
      this.showCreate = true;
      this.formAdd.ma = data.ma;
      this.formAdd.ten = data.ten;
      this.formAdd.tinh_thanh_id = data.tinh_thanh_id;
      this.formAdd.toa_nha_id = data.toa_nha_id;
      this.formAdd.trang_thai = data.trang_thai;
      this.formAdd.nhan_vien_id = data.nhan_vien_id;
      this.formAdd.thoi_gian = data.thoi_gian;
      this.formAdd.ghi_chu = data.ghi_chu;
      this.formAdd.id = data.id;
      this.formAdd.nguoi_mua_hang = data.nguoi_mua_hang;
      this.formAdd.tong_tien = data.tong_tien;
      this.formAdd.hinh_anhs = data.hinh_anhs;
      getToaNhaSearch({
        tinh_thanh_id: this.formAdd.tinh_thanh_id,
        per_page: 20,
        id: [this.formAdd.toa_nha_id]
      }).then(res => {
        this.toanhas = res.data.data;
      });
      this.chonToaNha(data.toa_nha_id);
      for (let cb of data.cam_biens) {
        this.formAdd.cam_bien.push(cb.cam_bien_id);
      }
      for (let tb of data.thiet_bis) {
        this.formAdd.thiet_bi.push(tb.thiet_bi_id);
      }
      queryThietBi({ id: this.formAdd.thiet_bi }).then(res => {
        this.thietBis = res.data;
        this.loadingQuery = false;
      });
      getCamBien({ id: this.formAdd.cam_bien }).then(res => {
        this.camBiens = res.data;
        this.loadingQuery = false;
      });
    }
  }
};
</script>


<style lang="scss" scoped>
</style>
