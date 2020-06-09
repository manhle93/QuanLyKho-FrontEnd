<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="bar" style="border-right: 1px solid #F8F9F9; height: auto">
        <el-row :gutter="20">
          <el-col :span="21">
            <el-input placeholder="Tìm kiếm" v-model="searchTinhThanh" size="small">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button
              icon="el-icon-arrow-left"
              style="background-color: #2E86C1; color: white"
              circle
              @click="showBar"
              size="mini"
            ></el-button>
          </el-col>
        </el-row>
        <br />
        <div style="height: auto; cursor: pointer" :class="{tongCuc: cucPCCC}" @click="tongCuc()">
          <el-row :gutter="20" align="center">
            <el-col :span="3">
              <img
                src="http://pcccapi.howizbiz.com//storage/images/avatar/1576278738.png"
                style="width: 25px; height: auto; "
              />
            </el-col>
            <el-col :span="21">
              <div style="font-size: 13px; font-weight: bold; padding-top: 6px">Cục cảnh sát PCCC</div>
            </el-col>
          </el-row>
        </div>
        <div style="height: calc(100vh - 245px);  overflow-y: auto;" class="tree_container">
          <el-tree
            :data="tinhThanh"
            :expand-on-click-node="true"
            :filter-node-method="filterNode"
            :default-expanded-keys="expanded"
            node-key="code"
            ref="tree"
            :props="defaultProps"
            @node-click="handleNodeClick"
            v-loading="loadingTree"
          >
            <span slot-scope="{ node,data }" style="magrin-top: 5px" :class="'item'+data.id">
              <i class="el-icon-folder-opened" style="color: deepskyblue"></i>
              <span style="font-size: 13px;">{{node.label}}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="24 - bar">
        <el-row :gutter="20">
          <el-col :span="bar == 0 ? 5 : 6">
            <el-button
              v-if="bar == 0"
              icon="el-icon-arrow-right"
              style="background-color: #2E86C1; color: white"
              circle
              @click="showBar"
              size="mini"
            ></el-button>
            <div style="text-align: center">
              <img
                v-if="!cucPCCC && !showQuanHuyen"
                :src="donVi && donVi.avatar_url != null ? 'http://pcccapi.howizbiz.com/' + donVi.avatar_url : 'http://pcccapi.howizbiz.com//storage/images/avatar/1576278738.png'"
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
                <i class="el-icon-location-outline"></i>
                <span style="font-size: 14px; font-weight: bold;">Quận/Huyện: {{donVi.ten}}</span>
              </div>
              <div
                v-if="donVi != null && !showQuanHuyen && !cucPCCC"
                style="font-weight: bold; margin-bottom: 20px"
              >{{donVi.ten}}</div>
            </div>
            <div v-if="cucPCCC" style="text-align: center">
              <img
                src="http://pcccapi.howizbiz.com//storage/images/avatar/1576278738.png"
                style="width: 100px; height: auto"
              />
              <br />
              <div style="font-weight: bold; margin-bottom: 20px">Cục cảnh sát phòng cháy chữa cháy</div>
              <i class="el-icon-location-outline"></i>
              <span style="font-size: 13px; font-weight: bold;">Số 2A, Đinh Lễ, Hoàn Kiếm, Hà Nội</span>
            </div>
            <br />
            <div v-if="donVi && donVi.tinh_thanh_id != null && !showQuanHuyen && !cucPCCC">
              <i class="el-icon-location" style="font-size: 18px;"></i>
              <span style="magrin-left: 10px; font-size: 12px; font-weight: bold">Địa chỉ:</span>
              <span style="font-size: 13px; padding-left: 5px">{{donVi.dia_chi}}</span>
              <br />
              <br />
              <i class="el-icon-phone" style="font-size: 18px"></i>
              <span style="magrin-left: 10px; font-size: 12px; font-weight: bold">SĐT trực ban:</span>
              <span style="font-size: 13px; padding-left: 5px">{{donVi.so_dien_thoai_truc_ban}}</span>
              <br />
              <br />
              <i class="el-icon-user-solid" style="font-size: 18px"></i>
              <span style="magrin-left: 10px; font-size: 12px; font-weight: bold">Cán bộ quản lý:</span>
              <span style="font-size: 13px; padding-left: 5px">{{donVi.can_bo_quan_ly}}</span>
              <br />
              <br />
            </div>

            <div v-show="showTinhThanh">
              <i class="far fa-building" style="font-size: 16px"></i>
              <span style="magrin-left: 10px; font-size: 12px; font-weight: bold">Cơ sỏ công trình:</span>
              <span style="font-size: 13px; padding-left: 5px">{{tongToaNha}} cơ sổ công trình</span>
              <br />
              <br />
              <i class="fas fa-shield-alt" style="font-size: 16px"></i>
              <span style="magrin-left: 10px; font-size: 12px; font-weight: bold">Đơn vị PCCC:</span>
              <span style="font-size: 13px; padding-left: 5px">{{tongDonVi}} đơn vị</span>
              <br />
              <br />
              <i class="fab fa-gripfire" style="font-size: 18px"></i>
              <span
                style="magrin-left: 10px; font-size: 12px; font-weight: bold"
              >Vụ cháy đang diễn ra:</span>
              <span style="font-size: 13px; padding-left: 5px">{{tongDangChay}} điểm cháy</span>
              <br />
              <br />
              <i class="fas fa-fire-extinguisher" style="font-size: 16px"></i>
              <span style="magrin-left: 10px; font-size: 12px; font-weight: bold">Tổng số vụ cháy:</span>
              <span style="font-size: 13px; padding-left: 5px">{{tongDiemChay}} vụ cháy</span>
              <br />
              <br />
              <i class="el-icon-menu" style="font-size: 16px"></i>
              <span style="magrin-left: 10px; font-size: 12px; font-weight: bold">Tổng thiết bị:</span>
              <span style="font-size: 13px; padding-left: 5px">
                {{online + offline}},
                <span style="color: green; font-weight: bold">online:</span>
                {{online}},
                <span style="color: red; font-weight: bold">offline:</span>
                {{offline}}
              </span>
              <br />
              <hr />
              <br />
            </div>

            <el-collapse
              accordion
              v-if="!showQuanHuyen && !showTinhThanh"
              v-model="activeName"
              @change="xemThem"
            >
              <el-collapse-item :title="tieudeXemThem" name="1" v-if="donVi != null">
                <div v-if="!cucPCCC">
                  <div style="font-size: 13px; font-weight: bold; margin-bottom: 10px">{{donVi.ten}}</div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px"
                    >Nhân sự quản lý:</span>
                    <span style="padding-left: 5px">{{donVi.nhan_su_pccc_quan_ly}} cán bộ</span>
                  </div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px"
                    >Nhân sự PCCC:</span>
                    <span style="padding-left: 5px">{{donVi.nhan_su_chua_chay}} cán bộ</span>
                  </div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px"
                    >Số điện thoại:</span>
                    <span style="padding-left: 5px">{{donVi.so_dien_thoai}}</span>
                  </div>
                </div>
                <div v-if="cucPCCC">
                  <div style="font-size: 13px; font-weight: bold; margin-bottom: 10px">{{donVi.ten}}</div>
                  <div>
                    <span
                      style="font-size: 13px; font-weight: bold; margin-bottom: 8px;"
                    >Điện thoại:</span> 06923.40159
                  </div>
                  <div>
                    <span style="font-size: 13px; font-weight: bold; margin-bottom: 8px">Cục trưởng:</span> Nguyễn Tuấn Anh
                  </div>
                  <div>
                    <span style="font-size: 13px; font-weight: bold; margin-bottom: 8px">Email:</span> cuccspccc@gmail.com
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-row>
              <div
                class="chiTietDonVi"
                @click="getToaNha(donVi)"
                :class="{backgroundToaNha: showToaNha}"
              >
                <img
                  src="https://image.flaticon.com/icons/svg/1865/1865609.svg"
                  style="width: 20px; height: auto"
                />
                <span class="tenDonVi">Danh sách cán bộ chiến sĩ</span>
                <span v-if="tongNhanSu !== false" class="tongSoLuong">{{tongNhanSu}}</span>
                <span v-else>
                  <i class="el-icon-loading"></i>
                </span>
              </div>
              <div
                class="chiTietDonVi"
                @click="getPTCCC(donVi)"
                :class="{backgroundPhuongTien: showPTCCC}"
                v-if="donViKhac"
              >
                <img
                  src="http://pcccapi.howizbiz.com/storage/images/avatar/1583375300.png"
                  style="width: 20px; height: auto"
                />
                <span class="tenDonVi">Phương tiện phòng cháy chữa cháy</span>
                <span v-if="tongPhuongTien !== false" class="tongSoLuong">{{tongPhuongTien}}</span>
                <span v-else>
                  <i class="el-icon-loading"></i>
                </span>
              </div>
              <div
                v-if="!showQuanHuyen && donViKhac"
                class="chiTietDonVi"
                @click="getDonViHoTro(tinh_thanh_id)"
                :class="{backgroundDonViHoTro: showDonViHoTro}"
              >
                <img
                  src="https://www.flaticon.com/premium-icon/icons/svg/2523/2523837.svg"
                  style="width: 20px; height: auto;"
                />
                <span class="tenDonVi">Đơn vị hỗ trợ</span>
                <span v-if="tongDonViHoTro !== false" class="tongSoLuong">{{tongDonViHoTro}}</span>
                <span v-else>
                  <i class="el-icon-loading"></i>
                </span>
              </div>
              <div
                v-if="!showQuanHuyen && donViKhac"
                class="chiTietDonVi"
                @click="getDiemLayNuoc(donVi)"
                :class="{backgroundDiemLayNuoc: showDiemLayNuoc}"
              >
                <img
                  src="http://pcccapi.howizbiz.com/storage/images/avatar/1583375716.png"
                  style="width: 20px; height: auto"
                />
                <span class="tenDonVi">Điểm lấy nước</span>
                <span v-if="tongDiemLayNuoc !== false" class="tongSoLuong">{{tongDiemLayNuoc}}</span>
                <span v-else>
                  <i class="el-icon-loading"></i>
                </span>
              </div>
            </el-row>
          </el-col>
          <el-col :span="bar == 0 ? 19 : 18">
            <div
              style="text-align: center; font-weight: bold; padding-top: 20px; color: black"
            >THÔNG TIN CHI TIẾT</div>
            <DiemLayNuoc
              @getSoLuong="soDiemLayNuoc"
              v-show="showDiemLayNuoc"
              :tinhThanhId="tinh_thanh_id"
              :donVi="donVi"
            ></DiemLayNuoc>
            <DonViHoTro
              @getSoLuong="soDonViHoTro"
              v-show="showDonViHoTro"
              :tinhThanhId="tinh_thanh_id"
            ></DonViHoTro>
            <NhanSu
              @getSoLuong="soLuongNhanSu"
              v-show="showToaNha"
              :donVi="donVi"
              :tinhThanhId="tinh_thanh_id"
            ></NhanSu>
            <PhuongTienPCCC
              @getSoLuong="soPhuongTien"
              v-show="showPTCCC"
              :donVipc="donVi"
              :tinhThanhId="tinh_thanh_id"
            ></PhuongTienPCCC>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getChiTietTinhThanh } from "@/api/qlchung";
import DiemLayNuoc from "./diemLayNuoc";
import DonViHoTro from "./donViHoTro";
import PhuongTienPCCC from "./phuongTienPCCC";
import NhanSu from "./nhanSu";
import {
  diemChay,
  donVi,
  getToaNha,
  dangChay,
  getSoThietBi
} from "@/api/baocao";

export default {
  components: { DiemLayNuoc, DonViHoTro, PhuongTienPCCC, NhanSu },
  data() {
    return {
      loadingTree: false,
      showTinhThanh: false,
      tieudeXemThem: "Thu gọn",
      activeName: "1",
      expanded: [],
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
      donVi: {},
      bar: 4,
      editDonVi: {
        show: false,
        don_vi_pccc_id: null
      },
      defaultProps: {
        children: "children",
        label: "ten",
        id: "id",
        code: "code"
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
      tongDangChay: 0,
      tongDonVi: 0,
      tongDiemChay: 0,
      tongToaNha: 0,
      online: 0,
      offline: 0
    };
  },
  props: {
    chiTiet: { type: Number }
  },
  watch: {
    searchTinhThanh(val) {
      this.$refs.tree.filter(val);
    },
    chiTiet(val) {
      
      var data = { id: val, children: [] };
      this.chiTietTheoTinh = true;
      this.showQuanHuyen = false;
      this.getDiemLayNuoc(data);
      this.getDonViHoTro(val);
      this.getPTCCC(data);
      this.getToaNha(data);
      this.cucPCCC = false;
      this.tinh_thanh_id = val;
      if (this.tinhThanh) {
        this.donVi = this.tinhThanh.find(el => el.id == val);
      }
      this.showTinhThanh = true;
      this.getSoCongTrinh(val);
      this.getDonVi(val);
      this.getDiemDangChay(val);
      this.getDiemChay(val);
      this.getSoThietBi(val);
      if(!val){this.tongCuc()}

      // this.getChiTietTinhThanh();
    }
  },
  created() {
    this.getChiTietTinhThanh();
  },
  methods: {
    scroll(id) {
      setTimeout(() => {
        if (this.tinhThanh != null) {
          var tinh = this.tinhThanh.find(tl => tl.id == id);
          this.expanded = [];
          if (tinh) this.expanded.push(tinh.code);
        }

        const scroll = document.getElementsByClassName("tree_container");
        for (let i = 1; i < 64; i++) {
          let els = document.getElementsByClassName("item" + i);
          if (els[0]) {
            els[0].style.color = "";
            els[0].style.fontWeight = "normal";
          }
        }

        var element = document.getElementsByClassName("item" + id);
        if (element[0]) {
          element[0].style.color = "red";
          element[0].style.fontWeight = "bold";
          element[0].scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
          });
        }
      }, 100);
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.ten.indexOf(value) !== -1;
    },
    xemThem(val) {
      if (val === "") this.tieudeXemThem = "Xem thêm";
      if (val === "1") this.tieudeXemThem = "Thu gọn";
    },
    showBar() {
      if (this.bar == 4) {
        this.bar = 0;
      } else {
        this.bar = 4;
      }
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
    tongCuc() {
      this.showTinhThanh = false;
      this.cucPCCC = true;
      this.showQuanHuyen = false;
      this.chiTietTheoTinh = false;
      this.donViKhac = true;
      this.$emit("chiTiet", null);
      this.editDonVi = {
        show: false,
        don_vi_pccc_id: null
      };
      this.donVi = {
        tinh_thanh_id: null
      };
      this.tinh_thanh_id = null;
      for (let i = 1; i < 64; i++) {
        let els = document.getElementsByClassName("item" + i);
        if (els[0]) {
          els[0].style.color = "";
          els[0].style.fontWeight = "normal";
        }
      }
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
      this.showTinhThanh = false;
      for (let i = 1; i < 64; i++) {
        let els = document.getElementsByClassName("item" + i);
        if (els[0]) {
          els[0].style.color = "";
          els[0].style.fontWeight = "normal";
        }
      }

      if (data.children !== undefined && data.id !== undefined) {
        this.chiTietTheoTinh = true;
        this.showTinhThanh = true;
        this.showQuanHuyen = false;
        if(this.tinh_thanh_id !== data.id){
           this.$emit("chiTiet", data.id);
        }
        this.tinh_thanh_id = data.id
        this.getDiemLayNuoc(data);
        this.getDonViHoTro(data.id);
        this.getPTCCC(data);
        this.getToaNha(data);
        this.getSoCongTrinh(data.id);
        this.getDiemDangChay(data.id);
        this.getDonVi(data.id);
        this.getDiemChay(data.id);
        this.getSoThietBi(data.id);
        this.cucPCCC = false;
        var element = document.getElementsByClassName("item" + data.id);
        if (element[0]) {
          element[0].style.color = "red";
          element[0].style.fontWeight = "bold";
        }
       
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

    async getChiTietTinhThanh() {
      this.loadingTree = true
      let data = await getChiTietTinhThanh({
        tinh_thanh_id: this.tinh_thanh_id
      });
      this.loadingTree = false
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
          code: el.code,
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
    },

    async getSoThietBi(tinhThanhId) {
      let data = await getSoThietBi({ tinh_thanh_id: tinhThanhId });
      this.online = data.online;
      this.offline = data["offline"];
    },

    async getDiemChay(tinhThanhId) {
      let data = await diemChay({
        per_page: 1,
        tinh_thanh_id: tinhThanhId
      });
      this.tongDiemChay = data.tong;
    },

    async getDonVi(tinhThanhId) {
      let data = await donVi({
        per_page: 1,
        tinh_thanh_id: tinhThanhId
      });
      this.tongDonVi = data.tong;
    },

    async getSoCongTrinh(tinhThanhId) {
      let data = await getToaNha({
        per_page: 1,
        tinh_thanh_id: tinhThanhId
      });
      this.tongToaNha = data.tong;
    },
    async getDiemDangChay(tinhThanhId) {
      let data = await dangChay({ tinh_thanh_id: tinhThanhId });
      this.tongDangChay = data.data.length;
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