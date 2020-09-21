<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Thông tin">
      <el-row>
        <el-col :span="8">
          <div class="tieu-de">
            <div class="sub-title">Mã nhà cung cấp:</div>
            <label>{{data.ma}}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Tên nhà cung cấp:</div>
            <label>{{data.ten}}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Địa chỉ:</div>
            <label>{{data.dia_chi}}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Số điện thoại:</div>
            <label>{{data.so_dien_thoai}}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Mã số thuế:</div>
            <label>{{data.ma_so_thue}}</label>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="tieu-de">
            <div class="sub-title">Địa chỉ E-Mail:</div>
            <label>{{data.email}}</label>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Công ty:</div>
            <label>{{data.cong_ty}}</label>
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
              :texts="['Thường', 'Trung bình', 'Tốt', 'Tính nhiệm cao', 'Rất cao']"
            ></el-rate>
          </div>
          <div class="tieu-de">
            <div class="sub-title">Trạng thái:</div>
            <label>{{data.user.active ? "Hoạt động" : "Không hoạt động"}}</label>
          </div>
        </el-col>
      </el-row>
      <br />
      <el-button
        size="small"
        class="primary-button"
        icon="el-icon-edit"
        @click="capNhatTT(data)"
      >Cập nhật thông tin</el-button>
    </el-tab-pane>

    <el-tab-pane label="Lịch sử nhập/Trả hàng">
      <div>
        <el-table :data="nhapXuat">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="Mã đơn hàng">
            <template slot-scope="scope">{{scope.row.ma ? scope.row.ma : scope.row.ma_don}}</template>
          </el-table-column>
          <el-table-column prop="created_at" label="Thời gian"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-tag effect="plain" v-if="scope.row.hanh_dong == 'nhap_hang'">Nhập hàng</el-tag>
              <el-tag effect="plain" type="warning" v-else>Trả hàng</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Số tiền" prop="so_tien">
            <template slot-scope="scope">{{formate.formatCurrency(scope.row.so_tien)}}</template>
          </el-table-column>
          <el-table-column label="Chi tiết">
            <template slot-scope="scope">
              <router-link
                :to="'/quanlydonhang/capnhatdonhang/' + scope.row.id"
                v-if="scope.row.hanh_dong == 'nhap_hang'"
              >
                <el-button
                  size="small"
                  style="background-color: #2E86C1; color: white"
                  icon="el-icon-view"
                  circle
                ></el-button>
              </router-link>
              <router-link :to="'/quanlydonhang/trahangnhacungcap'" v-else>
                <el-button
                  size="small"
                  style="background-color: #2E86C1; color: white"
                  icon="el-icon-view"
                  circle
                ></el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>

    <el-tab-pane label="Theo dõi công nợ">
      <el-table :data="tableCongNo" max-height="300px">
        <el-table-column type="index" label="STT"></el-table-column>
        <el-table-column label="Thời gian" prop="thoi_gian"></el-table-column>
        <el-table-column label="Tên đơn" prop="ten" min-width="100">
          <template slot-scope="scope">
            {{scope.row.ten}}
            <br />
            {{scope.row.ma}}
          </template>
        </el-table-column>
        <el-table-column label="Hành động">
          <template slot-scope="scope">
            <el-tag effect="plain" v-if="scope.row.hanh_dong == 'nhap_hang'">Nhập hàng</el-tag>
            <el-tag
              effect="plain"
              type="success"
              v-if="scope.row.hanh_dong == 'thanh_toan'"
            >Thanh toán</el-tag>
            <el-tag effect="plain" type="warning" v-if="scope.row.hanh_dong == 'tra_hang'">Trả hàng</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Nợ phát sinh" prop="so_tien">
          <template
            slot-scope="scope"
          >{{scope.row.hanh_dong == 'nhap_hang' ? '+ ' : '- ' }} {{formate.formatCurrency(scope.row.so_tien)}} đ</template>
        </el-table-column>
        <el-table-column label="Nợ cuối" prop="no_cuoi">
          <template slot-scope="scope">{{formate.formatCurrency(scope.row.no_cuoi)}} đ</template>
        </el-table-column>
      </el-table>
      <br />
      <br />
      <span>
        Công nợ cuối kỳ:
        <label>{{formate.formatCurrency(no_cuoi_ky)}} đ</label>
      </span>
    </el-tab-pane>
    <el-tab-pane label="Báo giá">
      <el-table :data="baoGias" style="width: 100%; font-size: 13px" border>
        <el-table-column sortable type="index" label="STT"></el-table-column>
        <el-table-column property="ma" label="Mã đơn hàng" min-width="125"></el-table-column>
        <el-table-column property="ten" label="Tên báo giá" min-width="123"></el-table-column>
        <el-table-column prop="created_at" label="Thời gian gửi"></el-table-column>
        <el-table-column property="ghi_chu" label="Ghi chú" min-width="123"></el-table-column>
        <el-table-column label="Đơn tạo bởi" min-width="95" prop="user.name"></el-table-column>
        <el-table-column label="Hành động" align="center" fixed="right" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Chi tiết" placement="top">
              <el-button
                size="small"
                @click="edit(scope.row.id)"
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
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { theoDoiCongNo } from "@/api/donhangnhacungcap";
import { getBaoGia } from "@/api/baogia";

export default {
  props: ["data"],
  data() {
    return {
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      no_dau_ky: 0,
      no_cuoi_ky: 0,
      tong_phat_sinh: 0,
      tableCongNo: [],
      formate: formate,
      nhapXuat: [],
      baoGias: [],
    };
  },
  created() {
    this.getCongNo();
    this.getBaoGia();
  },
  methods: {
    capNhatTT(data) {
      this.$emit("capNhatThongTin", data);
    },

    async getCongNo() {
      let data = await theoDoiCongNo({
        nha_cung_cap: this.data.id,
      });
      this.no_dau_ky = data.no_dau_ky;
      let newData = [];
      data.nhap_hang.map((nh) => {
        newData.push({
          ...nh,
          thoi_gian: nh.updated_at,
          hanh_dong: "nhap_hang",
          ma: nh.ma,
          so_tien:
            nh.tong_tien && nh.da_thanh_toan
              ? parseInt(nh.tong_tien) - parseInt(nh.da_thanh_toan)
              : 0,
        });
      });
      data.thanh_toan.map((tt) => {
        newData.push({
          ...tt,
          thoi_gian: tt.updated_at,
          hanh_dong: "thanh_toan",
          ma: tt.ma_don,
          ten: tt.ten,
          so_tien: parseInt(tt.thanh_toan),
        });
      });
      data.tra_hang.map((th) => {
        newData.push({
          ...th,
          thoi_gian: th.updated_at,
          hanh_dong: "tra_hang",
          ma: th.ma,
          ten: th.ten,
          so_tien: parseInt(th.tong_tien),
        });
      });
      newData = newData.sort((a, b) => a.thoi_gian < b.thoi_gian);
      let tempNoDauKy = this.no_dau_ky;
      let tempPhatSinh = 0;
      newData = newData.map((el) => {
        if (el.hanh_dong === "nhap_hang") {
          tempNoDauKy += el.so_tien;
          tempPhatSinh += el.so_tien;
        } else {
          tempNoDauKy -= el.so_tien;
          tempPhatSinh -= el.so_tien;
        }
        return {
          ...el,
          no_cuoi: tempNoDauKy,
        };
      });
      this.no_cuoi_ky = tempNoDauKy;
      this.tong_phat_sinh = tempPhatSinh;
      this.tableCongNo = newData;
      this.nhapXuat = this.tableCongNo.filter(
        (el) => el.hanh_dong != "thanh_toan"
      );
    },
    async getBaoGia() {
      let data = await getBaoGia({
        per_page: 999999,
        page: 1,
        nha_cung_cap: this.data.user_id,
      });
      this.baoGias = data.data.data;
    },
    edit(id) {
      this.$router.push("/quanlykho/capnhatbaogia/" + id);
    },
    async handleDelete(data) {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa báo giá: " +
            "<strong>" +
            data.ten +
            "</strong>",
          "Xóa báo giá",
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