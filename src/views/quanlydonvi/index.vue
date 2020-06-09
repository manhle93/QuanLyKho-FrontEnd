<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="bar">
        <el-row :gutter="20">
          <el-col :span="21">
            <el-input
              v-model="searchTinhThanh"
              placeholder="Tìm kiếm"
              size="small"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button
              icon="el-icon-arrow-left"
              style="background-color: #3498DB; color: white"
              circle
              size="mini"
              @click="showBar"
            />
          </el-col>
        </el-row>

        <br />
        <div
          style="height: auto; cursor: pointer"
          :class="{ tongCuc: cucPCCC }"
          @click="tongCuc()"
        >
          <el-row :gutter="20" align="center">
            <el-col :span="3">
              <img
                src="http://pcccapi.howizbiz.com//storage/images/avatar/1576278738.png"
                style="width: 25px; height: auto; "
              />
            </el-col>
            <el-col :span="21">
              <div style="font-size: 13px; font-weight: bold; padding-top: 6px">
                Cục cảnh sát PCCC
              </div>
            </el-col>
          </el-row>
        </div>

        <div style="height: calc(100vh - 245px);  overflow-y: auto;">
          <el-tree
            ref="tree"
            :data="tinhThanh"
            :expand-on-click-node="true"
            :filter-node-method="filterNode"
            :props="defaultProps"
            @node-click="handleNodeClick"
            v-loading="loadingTree"
          >
            <span slot-scope="{ node }" style="magrin-top: 5px">
              <i class="el-icon-folder-opened" style="color: deepskyblue" />
              <span style="font-size: 13px;">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="24 - bar">
        <el-row :gutter="20">
          <el-col :span="bar == 0 ? 5 : 6">
            <!-- <el-tooltip  class="item" effect="dark" content="Danh sách đơn vị PCCC" style="float: right;">
            <router-link to="/quanlydonvipccc/donvipccc">
            <el-button icon="el-icon-s-unfold" size="mini" circle></el-button>
            </router-link>
            </el-tooltip> -->
            <el-button
              v-if="bar == 0"
              icon="el-icon-arrow-right"
              style="background-color: #3498DB; color: white"
              circle
              size="mini"
              @click="showBar"
            />
            <el-dropdown
              trigger="click"
              style="float: right;"
              v-if="editDonVi.show && editDonVi.don_vi_pccc_id != null"
            >
              <el-button
                size="mini"
                type="info"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-edit"
                  @click.native="editDonViPCCC"
                >
                  <router-link
                    v-if="editDonVi.show && editDonVi.don_vi_pccc_id != null"
                    tag="span"
                    :to="
                      '/quanlydonvipccc/donvipccc/show/' +
                        editDonVi.don_vi_pccc_id
                    "
                    >Cập nhật thông tin đơn vị PCCC</router-link
                  >
                </el-dropdown-item>
                <el-dropdown-item
                  icon="el-icon-delete"
                  @click.native="xoaDonVi(editDonVi.don_vi_pccc_id)"
                  >Xóa đơn vị PCCC</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <div style="text-align: center">
              <img
                v-if="!cucPCCC && !showQuanHuyen"
                :src="
                  donVi.avatar_url != null
                    ? 'http://pcccapi.howizbiz.com/' + donVi.avatar_url
                    : 'http://pcccapi.howizbiz.com//storage/images/avatar/1576278738.png'
                "
                style="width: 100px; height: auto"
              />
              <br />
              <br />
              <div v-if="showQuanHuyen" style="text-align: center">
                <img
                  src="https://image.flaticon.com/icons/svg/992/992211.svg"
                  style="width: 150px; height: auto"
                />
                <br />
                <br />
                <i class="el-icon-location-outline" />
                <span style="font-size: 14px; font-weight: bold;"
                  >Quận/Huyện: {{ donVi.ten }}</span
                >
              </div>
              <div
                v-if="donVi != null && !showQuanHuyen"
                style="font-weight: bold; margin-bottom: 20px"
              >
                {{ donVi.ten }}
              </div>
            </div>
            <div v-if="cucPCCC" style="text-align: center">
              <img
                src="http://pcccapi.howizbiz.com//storage/images/avatar/1576278738.png"
                style="width: 100px; height: auto"
              />
              <br />
              <div style="font-weight: bold; margin-bottom: 20px">
                Cục cảnh sát phòng cháy chữa cháy
              </div>
              <i class="el-icon-location-outline" />
              <span style="font-size: 13px; font-weight: bold;"
                >Số 2A, Đinh Lễ, Hoàn Kiếm, Hà Nội</span
              >
            </div>
            <br />
            <div v-if="donVi.tinh_thanh_id != null && !showQuanHuyen">
              <i class="el-icon-location" style="font-size: 18px;" />
              <span
                style="magrin-left: 10px; font-size: 12px; font-weight: bold"
                >Địa chỉ:</span
              >
              <span style="font-size: 13px">{{ donVi.dia_chi }}</span>
              <br />
              <br />
              <i class="el-icon-phone" style="font-size: 18px" />
              <span
                style="magrin-left: 10px; font-size: 12px; font-weight: bold"
                >SĐT trực ban:</span
              >
              <span style="font-size: 13px">{{
                donVi.so_dien_thoai_truc_ban
              }}</span>
              <br />
              <br />
              <i class="el-icon-user-solid" style="font-size: 18px" />
              <span
                style="magrin-left: 10px; font-size: 12px; font-weight: bold"
                >Cán bộ quản lý:</span
              >
              <span style="font-size: 13px">{{ donVi.can_bo_quan_ly }}</span>
              <br />
              <br />
            </div>
            <div
              v-if="chiTietTheoTinh"
              style="color: #2E86C1; font-weight: bold; font-size: 13px; padding-top: 20px; text-decoration: underline;"
            >
              Chi Tiết tại: {{ donVi.ten }}
            </div>
            <br />
            <el-collapse
              v-if="!showQuanHuyen && !chiTietTheoTinh"
              v-model="activeName"
              accordion
              @change="xemThem"
            >
              <el-collapse-item
                v-if="donVi != null"
                :title="tieudeXemThem"
                name="1"
              >
                <div v-if="!cucPCCC">
                  <div
                    style="font-size: 13px; font-weight: bold; margin-bottom: 10px"
                  >
                    {{ donVi.ten }}
                  </div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px"
                      >Nhân sự quản lý:</span
                    >
                    <span style="padding-left: 5px"
                      >{{ donVi.nhan_su_pccc_quan_ly }} cán bộ</span
                    >
                  </div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px"
                      >Nhân sự PCCC:</span
                    >
                    <span style="padding-left: 5px"
                      >{{ donVi.nhan_su_chua_chay }} cán bộ</span
                    >
                  </div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px"
                      >Số điện thoại:</span
                    >
                    <span style="padding-left: 5px">{{
                      donVi.so_dien_thoai
                    }}</span>
                  </div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px"
                      >Quản lý:</span
                    >
                    <span style="padding-left: 5px"
                      >{{ donVi.quan_ly_diem_lay_nuoc }} Điểm lấy nước</span
                    >
                  </div>
                </div>
                <div v-if="cucPCCC">
                  <div
                    style="font-size: 13px; font-weight: bold; margin-bottom: 10px"
                  >
                    {{ donVi.ten }}
                  </div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px; padding-right: 5px"
                      >Điện thoại:</span
                    >
                    069.2340.159
                  </div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px; padding-right: 5px"
                      >Cục trưởng:</span
                    >Nguyễn Tuấn Anh
                  </div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px; padding-right: 5px"
                      >Email:</span
                    >
                    cuccspccc@gmail.com
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-row>
              <div
                class="chiTietDonVi"
                :class="{ backgroundToaNha: showToaNha }"
                @click="getToaNha(donVi)"
              >
                <img
                  src="https://image.flaticon.com/icons/svg/1865/1865609.svg"
                  style="width: 20px; height: auto"
                />

                <span class="tenDonVi">Danh sách cán bộ chiến sĩ</span>
                <span v-if="tongNhanSu !== false" class="tongSoLuong">{{
                  tongNhanSu
                }}</span>
                <span v-else>
                  <i class="el-icon-loading"></i>
                </span>
              </div>

              <div
                v-if="donViKhac"
                class="chiTietDonVi"
                :class="{ backgroundPhuongTien: showPTCCC }"
                @click="getPTCCC(donVi)"
              >
                <img
                  src="http://pcccapi.howizbiz.com/storage/images/avatar/1583375300.png"
                  style="width: 20px; height: auto"
                />
                <span class="tenDonVi">Phương tiện phòng cháy chữa cháy</span>
                <span v-if="tongPhuongTien !== false" class="tongSoLuong">{{
                  tongPhuongTien
                }}</span>
                <span v-else>
                  <i class="el-icon-loading"></i>
                </span>
              </div>
              <div
                v-if="!showQuanHuyen && donViKhac"
                class="chiTietDonVi"
                :class="{ backgroundDonViHoTro: showDonViHoTro }"
                @click="getDonViHoTro(tinh_thanh_id)"
              >
                <img
                  src="https://www.flaticon.com/premium-icon/icons/svg/2523/2523837.svg"
                  style="width: 20px; height: auto;"
                />
                <span class="tenDonVi">Đơn vị hỗ trợ</span>
                <span v-if="tongDonViHoTro !== false" class="tongSoLuong">{{
                  tongDonViHoTro
                }}</span>
                <span v-else>
                  <i class="el-icon-loading"></i>
                </span>
              </div>
              <div
                v-if="!showQuanHuyen && donViKhac"
                class="chiTietDonVi"
                :class="{ backgroundDiemLayNuoc: showDiemLayNuoc }"
                @click="getDiemLayNuoc(donVi)"
              >
                <img
                  src="http://pcccapi.howizbiz.com/storage/images/avatar/1583375716.png"
                  style="width: 20px; height: auto"
                />

                <span class="tenDonVi">Điểm lấy nước</span>
                <span v-if="tongDiemLayNuoc !== false" class="tongSoLuong">{{
                  tongDiemLayNuoc
                }}</span>
                <span v-else>
                  <i class="el-icon-loading"></i>
                </span>
              </div>
              <div style="padding-top: 30px">
                <router-link tag="span" to="/quanlydonvipccc/donvipccc/create">
                  <el-button
                    size="mini"
                    icon="el-icon-plus"
                    style="width: 150px; background-color: #3498DB; color: white; font-weight: bold"
                    >Thêm đơn vị PCCC</el-button
                  >
                </router-link>
              </div>
            </el-row>
          </el-col>
          <el-col :span="bar == 0 ? 19 : 18">
            <div
              style="text-align: center; font-weight: bold; padding-top: 20px;"
            >
              QUẢN LÝ ĐƠN VỊ PHÒNG CHÁY CHỮA CHÁY
            </div>
            <DiemLayNuoc
              v-show="showDiemLayNuoc"
              :donVi="donVi"
              :showAll="cucPCCC"
              @getSoLuong="soDiemLayNuoc"
            />
            <DonViHoTro
              v-show="showDonViHoTro"
              :tinhThanhId="tinh_thanh_id"
              :showAll="cucPCCC"
              @getSoLuong="soDonViHoTro"
            />
            <NhanSu
              v-show="showToaNha"
              :donVi="donVi"
              :showAll="cucPCCC"
              @getSoLuong="soLuongNhanSu"
            />
            <PhuongTienPCCC
              v-show="showPTCCC"
              :donVipc="donVi"
              :showAll="cucPCCC"
              @getSoLuong="soPhuongTien"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getTinhThanh } from "@/api/qlchung";
import DiemLayNuoc from "./diemLayNuoc";
import DonViHoTro from "./donViHoTro";
import PhuongTienPCCC from "./phuongTienPCCC";
import NhanSu from "./nhanSu";
import { deleteDonViPccc } from "@/api/donvipccc";
export default {
  components: { DiemLayNuoc, DonViHoTro, PhuongTienPCCC, NhanSu },
  data() {
    return {
      loadingTree: false,
      tieudeXemThem: "Thu gọn",
      activeName: "1",
      showDiemLayNuoc: false,
      showQuanHuyen: false,
      showDonViHoTro: false,
      showToaNha: true,
      showPTCCC: false,
      donViKhac: true,
      tinhThanh: [],
      searchTinhThanh: "",
      tinh_thanh_id: null,
      doiThamMuu: false,
      bar: 4,
      editDonVi: {
        show: false,
        don_vi_pccc_id: null
      },
      defaultProps: {
        children: "children",
        label: "ten"
      },
      donVi: {
        tinh_thanh_id: null,
        quan_huyen_id: null
      },
      cucPCCC: true,
      tongNhanSu: 0,
      tongPhuongTien: 0,
      tongDonViHoTro: 0,
      tongDiemLayNuoc: 0,
      donViId: null,
      chiTietTheoTinh: false
    };
  },
  watch: {
    searchTinhThanh(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getTinhThanh();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.ten.indexOf(value) !== -1;
    },
    xemThem(val) {
      if (val === "") this.tieudeXemThem = "Xem thêm";
      if (val === "1") this.tieudeXemThem = "Thu gọn";
    },
    editDonViPCCC() {
      window.location.assign;
    },
    soLuongNhanSu(total) {
      this.tongNhanSu = total;
    },
    soPhuongTien(total) {
      this.tongPhuongTien = total;
    },
    soDonViHoTro(total) {
      this.tongDonViHoTro = total;
    },
    soDiemLayNuoc(total) {
      this.tongDiemLayNuoc = total;
    },
    showBar() {
      if (this.bar === 4) {
        this.bar = 0;
      } else {
        this.bar = 4;
      }
    },
    async xoaDonVi(id) {
      try {
        this.listLoading = true;
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn xóa đơn vị này",
          "Xóa đơn vị PCCC",
          {
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        let status = await deleteDonViPccc(id);
        this.getTinhThanh();
        this.tongCuc();
        this.$message({
          message: "Xóa thành công",
          type: "success"
        });
      } catch (error) {
        console.log(error);
      }
    },
    tongCuc() {
      this.cucPCCC = true;
      this.showQuanHuyen = false;
      this.chiTietTheoTinh = false;
      this.donViKhac = true;
      this.editDonVi = {
        show: false,
        don_vi_pccc_id: null
      };
      this.donVi = {
        tinh_thanh_id: null
      };
      this.tinh_thanh_id = null;
    },
    getToaNha(data) {
      this.showDiemLayNuoc = false;
      this.showPTCCC = false;
      this.showDonViHoTro = false;
      this.showToaNha = true;
      this.donVi = data;
    },
    getPTCCC(data) {
      this.showDiemLayNuoc = false;
      this.showToaNha = false;
      this.showDonViHoTro = false;
      this.showPTCCC = true;
      this.donVi = data;
    },
    getDonViHoTro(id) {
      this.showDiemLayNuoc = false;
      this.showToaNha = false;
      this.showPTCCC = false;
      this.showDonViHoTro = true;
      this.tinh_thanh_id = id;
    },
    getDiemLayNuoc(data) {
      this.showToaNha = false;
      this.showPTCCC = false;
      this.showDonViHoTro = false;
      this.showDiemLayNuoc = true;
      this.donVi = data;
    },
    handleNodeClick(data) {
      if (data.children !== undefined && data.id !== undefined) {
        this.chiTietTheoTinh = true;
        this.showQuanHuyen = false;
        this.getDiemLayNuoc(data);
        this.getDonViHoTro(data.id);
        this.getPTCCC(data);
        this.getToaNha(data);
        this.cucPCCC = false;
      }
      if (data.children === undefined) {
        this.donVi = data;
        this.cucPCCC = false;
        this.donViKhac = true;
        if (data.loai_hinh_don_vi !== "nghiep_vu") {
          this.donViKhac = false;
        }
        this.getDiemLayNuoc(this.donVi);
        this.getDonViHoTro(this.donVi.tinh_thanh_id);
        this.getPTCCC(this.donVi);
        this.getToaNha(this.donVi);
        this.showQuanHuyen = false;
        this.chiTietTheoTinh = false;
        this.editDonVi = {
          show: true,
          don_vi_pccc_id: data.id
        };
        if (data.tinh_thanh_id !== undefined && data.avatar_url === undefined) {
          this.showQuanHuyen = true;
          this.cucPCCC = false;
          this.donViKhac = true;
          this.editDonVi = {
            show: false,
            don_vi_pccc_id: null
          };
        }
      }
    },
    async getTinhThanh() {
      this.loadingTree = true;
      const data = await getTinhThanh();
      this.loadingTree = false;
      const newData = data.map(el => {
        const dsNV = el.don_vi_pccc
          .filter(it => it.loai_hinh_don_vi === "nghiep_vu")
          .sort((a, b) =>
            a.ten.toLowerCase().localeCompare(b.ten.toLowerCase())
          );
        const dsHC = el.don_vi_pccc
          .filter(it => it.loai_hinh_don_vi === "hanh_chinh")
          .sort((a, b) =>
            a.ten.toLowerCase().localeCompare(b.ten.toLowerCase())
          );
        return {
          id: el.id,
          ten: el.ten,
          children: [
            {
              ten: "PC07",
              children: [...dsHC, ...dsNV]
            },
            {
              ten: "Quận huyện",
              children: el.quan_huyen
                .map(item => ({
                  ...item,
                  ten: item.name
                }))
                .sort((a, b) =>
                  a.ten
                    .substring(0, 1)
                    .toLowerCase()
                    .localeCompare(b.ten.substring(0, 1).toLowerCase())
                )
            }
          ]
        };
      });

      this.tinhThanh = newData;
    }
  }
};
</script>
<style scoped>
.tongSoLuong {
  color: white;
  background-color: #3498db;
  font-weight: bold;
  width: auto;
  height: 15px;
  text-align: center;
  font-size: 13px;
  border-radius: 5px;
  padding-right: 6px;
  padding-left: 6px;
}
.chiTietDonVi {
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
}
.tenDonVi {
  padding-left: 15px;
  font-weight: bold;
  font-size: 13px;
  flex: 1;
}
.tongCuc {
  background-color: #f2f4f4;
  color: #2980b9;
}
.backgroundDonViHoTro {
  background-color: #f2f3f4;
  color: #2980b9;
}
.backgroundToaNha {
  background-color: #f2f3f4;
  color: #2980b9;
}
.backgroundPhuongTien {
  background-color: #f2f3f4;
  color: #2980b9;
}
.backgroundDiemLayNuoc {
  background-color: #f2f3f4;
  color: #2980b9;
}
.highlight-text {
  font-size: 12px;
  padding-top: 6px;
  font-weight: bold;
}
.report-header {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
}

/* width */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: white;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: lightgray;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: gray;
}
</style>
