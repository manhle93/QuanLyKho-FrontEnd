<template>
  <div
    class="c-flex fh"
    style="padding-left: 20px; height: calc(100vh - 50px); overflow: hidden"
  >
    <div
      class="c-grow c-flex c-column"
      style="
        border-right: 2px solid #2e86c1;
        justify-content: space-between;
        flex: 1;
      "
    >
      <div class="d-flex flex-collumn" style="flex: 1; min-height: 0">
        <el-form class="d-flex fill-height flex-collumn">
          <el-row :gutter="20">
            <br />
            <el-col :span="8">
              <el-form-item>
                <el-input placeholder="Tìm kiếm sản phẩm" v-model="timKiem">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-select
                clearable
                v-model="danh_muc_id"
                placeholder="Danh mục sản phẩm"
                filterable
                @change="getSanPham()"
              >
                <el-option
                  v-for="item in danhMucs"
                  :key="item.id"
                  :label="item.ten_danh_muc"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-select
                  clearable
                  filterable
                  style="width: 100%"
                  v-model="form.bang_gia_id"
                  placeholder="Chọn bảng giá"
                  @change="chonBangGia(form.bang_gia_id)"
                >
                  <el-option
                    v-for="item in bangGias"
                    :key="item.id"
                    :label="item.ten"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-form-item>
                <a href="/quanlydonhang/taodondathang" target="_blank">
                  <el-button
                    circle
                    icon="el-icon-plus"
                    class="success-button"
                  ></el-button>
                </a>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="d-flex" style="flex: 1; min-height: 0; overflow-y: auto">
            <div style="width: 100%">
              <el-table
                show-summary
                :data="form.danhSachHang"
                style="width: 100%"
                :summary-method="tongTien"
              >
                <el-table-column
                  type="index"
                  label="STT"
                  width="100px"
                ></el-table-column>
                <el-table-column
                  prop="hang_hoa.ten_san_pham"
                  label="Hàng hóa"
                ></el-table-column>
                <el-table-column
                  prop="hang_hoa.don_vi_tinh"
                  label="Đơn vị tính"
                ></el-table-column>
                <el-table-column label="Số lượng" width="150px">
                  <template slot-scope="scope">
                    <el-input-number
                      size="small"
                      :min="0.1"
                      v-model="scope.row.so_luong"
                      :disabled="cap_nhat"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="don_gia" label="Đơn giá">
                  <template slot-scope="scope"
                    >{{ formate.formatCurrency(scope.row.don_gia) }} đ</template
                  >
                </el-table-column>
                <el-table-column label="Thành tiền">
                  <template slot-scope="scope"
                    >{{
                      formate.formatCurrency(
                        Math.ceil(scope.row.so_luong * scope.row.don_gia)
                      )
                    }}
                    đ</template
                  >
                </el-table-column>
                <el-table-column label="Xóa" v-if="!cap_nhat">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="small"
                      @click="xoaSanPham(scope.$index, scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form>
      </div>
      <div class="sanpham" v-if="!cap_nhat">
        <transition name="bounce" v-for="item in hangHoas" :key="item.id">
          <div v-show="!kiemTraDaChon(item.id)">
            <el-card
              :body-style="{ padding: '0px' }"
              style="width: 150px; margin-right: 20px"
            >
              <a @click="doiSanPham(item.id)">
                <img
                  :src="
                    item.anh_dai_dien ? endPointImage + item.anh_dai_dien : src
                  "
                  class="image"
                />
              </a>
              <div style="padding: 14px">
                <span
                  style="
                    font-size: 14px;
                    display: inline-block;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden !important;
                    text-overflow: ellipsis;
                  "
                  >{{ item.ten_san_pham }}</span
                >
                <div class="bottom clearfix">
                  <time class="time"
                    >{{ formate.formatCurrency(item.gia_ban) }} đ</time
                  >
                </div>
                <!-- <div class="bottom clearfix">
                  <el-button
                    :disabled="kiemTraDaChon(item.id)"
                    type="text"
                    class="button"
                    @click="doiSanPham(item.id)"
                  >Lựa chọn</el-button>
                </div>-->
              </div>
            </el-card>
          </div>
        </transition>
      </div>
    </div>
    <div
      class="fh c-flex c-column"
      style="
        padding-left: 15px;
        padding-right: 10px;
        background-color: #f2f3f4;
        width: 340px;
        overflow-x: hidden;
        overflow-y: auto;
      "
    >
      <div style="margin-top: 10px">
        <div style="font-size: 16px; color: #196f3d; font-weight: bold">
          Thông tin đơn hàng
        </div>
        <br />
        <el-button
          size="small"
          @click="form.trang_thai = 'hoa_don'"
          :class="form.trang_thai == 'hoa_don' ? 'success-button' : ''"
          >BÁN HÀNG</el-button
        >
        <el-button
          v-if="!cap_nhat"
          size="small"
          :class="form.trang_thai == 'moi_tao' ? 'success-button' : ''"
          @click="form.trang_thai = 'moi_tao'"
          >ĐẶT HÀNG</el-button
        >
        <br />
        <br />
        <!-- <el-checkbox
          v-if="cap_nhat"
          v-model="doiTra"
          label="Đổi trả hàng"
          border
          size="small"
          style="background: white"
        ></el-checkbox>
        <br /> -->
        <br />
        <el-form
          label-position="left"
          label-width="130px"
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
        >
          <el-form-item label="Tên đơn hàng" prop="ten">
            <el-input size="small" v-model="form.ten"></el-input>
          </el-form-item>
          <el-form-item label="Khách hàng">
            <el-select
              size="small"
              clearable
              v-model="form.khach_hang_id"
              filterable
              remote
              :remote-method="remoteMethod"
              reserve-keyword
              style="width: 80%"
              placeholder="Chọn khách hàng"
              :loading="loading"
            >
              <el-option
                class="khachhang"
                v-for="item in nhaCungCaps"
                :key="item.id"
                :label="item.ten"
                :value="item.user_id"
              >
                <div>
                  <div style="font-size: 16px; font-weight: bold">
                    {{ item.ten }}
                  </div>
                  <div style="font-size: 12px; color: gray">
                    SĐT: {{ item.so_dien_thoai }}
                  </div>
                </div>
              </el-option>
            </el-select>
            <el-button
              v-if="form.khach_hang_id"
              circle
              size="mini"
              icon="el-icon-info"
              class="success-button"
              @click="showInfo"
            ></el-button>
            <el-button
              v-else
              circle
              size="mini"
              icon="el-icon-plus"
              class="success-button"
              @click="showAddKhachHang"
            ></el-button>
          </el-form-item>
          <el-form-item label="Ghi chú">
            <el-input
              size="small"
              type="textarea"
              v-model="form.ghi_chu"
            ></el-input>
          </el-form-item>
          <el-form-item label="Giảm giá">
            <el-input
              v-model="giamGia"
              @blur="isInputGiamGia = false"
              @focus="isInputGiamGia = true"
            ></el-input>
          </el-form-item>
          <el-form-item label="Phụ thu" v-if="form.trang_thai == 'hoa_don'">
            <el-input
              v-model="phuThu"
              @blur="isInputPhuThu = false"
              @focus="isInputPhuThu = true"
              placeholder="Phụ thu"
            ></el-input>
          </el-form-item>
          <el-form-item label="Tổng tiền">
            <span style="color: green; font-size: 20px; font-weight: bold"
              >{{ formate.formatCurrency(form.tong_tien) }} đ</span
            >
          </el-form-item>
          <el-form-item
            label="Đã thanh toán"
            v-if="form.trang_thai != 'hoa_don'"
          >
            <el-input
              size="small"
              v-model="daThanhToan"
              @blur="isInputDaThanhToan = false"
              @focus="isInputDaThanhToan = true"
            ></el-input>
          </el-form-item>
          <el-form-item label="Tổng thanh toán" v-else>
            <span style="color: green; font-size: 20px; font-weight: bold"
              >{{
                formate.formatCurrency(
                  form.tong_tien - form.giam_gia + Number(form.phu_thu)
                )
              }}
              đ</span
            >
          </el-form-item>
          <el-form-item
            size="mini"
            v-if="form.trang_thai != 'hoa_don'"
            label="Phải thanh toán"
          >
            <span style="color: green; font-size: 20px; font-weight: bold"
              >{{ formate.formatCurrency(form.con_phai_thanh_toan) }} đ</span
            >
          </el-form-item>
          <el-form-item
            label="Phương thúc"
            v-if="form.trang_thai == 'hoa_don'"
            prop="thanh_toan"
          >
            <el-select
              v-model="form.thanh_toan"
              placeholder="Phương thức thanh toán"
            >
              <el-option value="tien_mat" label="Tiền mặt"></el-option>
              <el-option
                value="chuyen_khoan"
                label="Chuyển khoản/Quẹt thẻ"
              ></el-option>
              <!-- <el-option value="cod" label="Ship COD"></el-option> -->
              <el-option value="tai_khoan" label="Tài khoản" :disabled="!form.khach_hang_id"></el-option>
              <el-option value="tra_sau" label="Trả sau"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Đã thanh toán"
            v-if="form.thanh_toan == 'tra_sau'"
          >
            <el-input-number
              style="width: 100%"
              :min="0"
              :max="form.tong_tien - form.giam_gia + Number(form.phu_thu)"
              v-model="form.da_thanh_toan"
              type="number"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="Shipper" v-if="form.trang_thai == 'hoa_don'">
            <el-select
              size="small"
              v-model="form.nhan_vien_giao_hang"
              filterable
              placeholder="Chọn nhân viên giao hàng"
            >
              <el-option
                v-for="item in shipper"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ĐC nhận hàng">
            <el-input
              size="small"
              type="textarea"
              v-model="form.dia_chi"
              placeholder="Nhập địa chỉ"
            ></el-input>
          </el-form-item>
          <el-form-item label="TG nhận hàng">
            <el-date-picker
              style="width: 100%"
              format="dd/MM/yyyy HH:mm"
              v-model="form.thoi_gian_nhan_hang"
              type="datetime"
              placeholder="Select date and time"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <br />
      <el-row>
        <el-col
          :span="23"
          v-if="form.trang_thai == 'moi_tao' || form.trang_thai == 'hoa_don'"
        >
          <el-button
            v-if="form.trang_thai == 'moi_tao'"
            style="float: right; width: 100%; height: 80px; font-size: 20px"
            icon="el-icon-plus"
            class="success-button"
            @click="submit('form')"
            >ĐẶT HÀNG</el-button
          >
          <el-button
            v-if="form.trang_thai != 'moi_tao' && !cap_nhat"
            style="float: right; width: 100%; height: 80px; font-size: 20px"
            icon="el-icon-check"
            class="success-button"
            @click="submit('form')"
            >THANH TOÁN</el-button
          >
          <el-button
            v-if="cap_nhat"
            style="float: right; width: 100%; height: 80px; font-size: 20px"
            icon="el-icon-check"
            class="success-button"
            @click="submit('form')"
            >CẬP NHẬT</el-button
          >
        </el-col>
        <div
          v-if="form.trang_thai == 'huy_bo' || form.trang_thai == 'khach_huy'"
          style="
            height: 80px;
            width: 250px;
            border: 3px solid #e74c3c;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
          "
        >
          <p style="color: #e74c3c; font-weight: bold; font-size: 24px">
            {{ form.trang_thai == "huy_bo" ? "ĐÃ HỦY ĐƠN" : "KHÁCH HỦY ĐƠN" }}
          </p>
        </div>
      </el-row>
    </div>
    <el-dialog
      title="THÔNG TIN KHÁCH HÀNG"
      :visible.sync="showUserDetail"
      width="600px"
      center
    >
      <div style="display: flex; align-items: center; flex-direction: column">
        <div v-if="UserInfo.user && UserInfo.user.avatar_url">
          <img
            :src="endPointImage + UserInfo.user.avatar_url"
            style="height: 100px; width: auto; border-radius: 10px"
          />
        </div>
        <div v-else>
          <img
            :src="endPointImage + 'images/avatar/avatar_for_none.png'"
            style="height: 100px; width: auto"
          />
        </div>

        <div>
          <el-rate
            disabled
            :value="+UserInfo.tin_nhiem"
            :colors="colors"
          ></el-rate>
        </div>
      </div>
      <br>
      <el-row>
        <el-col :span="22" :offset="1"><div style="font-weight: bold">Ghi chú: <span style="color: green">{{UserInfo.ghi_chu}}</span></div></el-col>
      </el-row>
      <el-row style="margin-top: 30px">
        <el-form label-position="left" label-width="110px" size="small">
          <el-col :span="14" :offset="1">
            <el-form-item label="Khách hàng: ">{{ UserInfo.ten }}</el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="Số điện thoại: ">{{
              UserInfo.so_dien_thoai
            }}</el-form-item>
          </el-col>
          <el-col :span="14" :offset="1">
            <el-form-item label="Địa chỉ Email: ">{{
              UserInfo.email
            }}</el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="Số dư TK: "
              >{{ formate.formatCurrency(UserInfo.so_du) }} đ</el-form-item
            >
          </el-col>
          <el-col :span="23" :offset="1">
            <el-form-item label="Địa chỉ: ">{{
              UserInfo.dia_chi
            }}</el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="primary-button"
          @click="showUserDetail = false"
          icon="el-icon-close"
          >Đóng</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="THÊM MỚI KHÁCH HÀNG"
      :visible.sync="showFormAddKhachHang"
      width="700px"
      center
    >
      <el-form :model="formKhaHang" :rules="rulesKhachHang" ref="formKhaHang">
        <el-steps :space="200" :active="next ? 1 : 2" simple>
          <el-step title="Thông tin khách hàng" icon="el-icon-info"></el-step>
          <el-step title="Tài khoản đăng nhập" icon="el-icon-user"></el-step>
        </el-steps>
        <br />
        <el-row :gutter="40" v-show="next">
          <el-col :span="12">
            <el-form-item label="Mã khách hàng" prop="ma">
              <el-input
                size="small"
                v-model="formKhaHang.ma"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Loại khách hàng">
              <br />
              <el-radio
                v-model="formKhaHang.ca_nhan"
                :label="true"
                border
                size="small"
                >Cá nhân</el-radio
              >
              <el-radio
                v-model="formKhaHang.ca_nhan"
                :label="false"
                border
                size="small"
                >Tổ chức</el-radio
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tên khách hàng" prop="ten">
              <el-input size="small" v-model="formKhaHang.ten"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Mã số thuế">
              <el-input
                size="small"
                v-model="formKhaHang.ma_so_thue"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Số điện thoại" prop="so_dien_thoai">
              <el-input
                size="small"
                v-model="formKhaHang.so_dien_thoai"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Giới tính">
              <br />
              <el-radio
                v-model="formKhaHang.gioi_tinh"
                :label="true"
                border
                size="small"
                >Nam</el-radio
              >
              <el-radio
                v-model="formKhaHang.gioi_tinh"
                :label="false"
                border
                size="small"
                >Nữ</el-radio
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ngày sinh">
              <br />
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="formKhaHang.ngay_sinh"
                type="date"
                placeholder="Chọn ngày sinh"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ email">
              <el-input size="small" v-model="formKhaHang.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ">
              <el-input size="small" v-model="formKhaHang.dia_chi"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ghi chú">
              <el-input
                size="small"
                type="textarea"
                v-model="formKhaHang.mo_ta"
                :rows="2"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-show="!next">
          <el-col :span="14" :offset="5">
            <el-form-item label="Tên đăng nhập" prop="username">
              <el-input v-model="formKhaHang.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14" :offset="5">
            <el-form-item label="Mật khẩu" prop="password">
              <el-input
                type="password"
                v-model="formKhaHang.password"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14" :offset="5">
            <el-form-item
              label="Nhập lại mật khẩu"
              prop="password_confirmation"
            >
              <el-input
                type="password"
                v-model="formKhaHang.password_confirmation"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="primary-button"
          :disabled="
            !formKhaHang.ma || !formKhaHang.ten || !formKhaHang.so_dien_thoai
          "
          size="small"
          v-if="next"
          icon="el-icon-right"
          @click="next = !next"
          >Tiếp theo</el-button
        >
        <el-button
          type="warning"
          size="small"
          v-if="!next"
          icon="el-icon-back"
          @click="next = !next"
          >Quay lại</el-button
        >
        <el-button
          class="primary-button"
          size="small"
          v-if="!next"
          icon="el-icon-plus"
          @click="addKhachHang('formKhaHang')"
          >THÊM MỚI</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from "lodash";
import { listSanPham } from "@/api/sanpham";
import { getKhachHang } from "@/api/khachhang";
import { getBangGia } from "@/api/banggia";
import { index } from "@/api/danhmucsanpham";
import {
  editDonDathang,
  getChiTietDonDathang,
  huyDon,
  chuyenHoaDon,
  getShipper,
} from "@/api/dondathang";
import { addKhachHang } from "@/api/khachhang";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập mật khẩu mới"));
      } else {
        if (this.formKhaHang.password_confirmation !== "") {
          this.$refs.formKhaHang.validateField("password_confirmation");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Hãy nhập lại mật khẩu mới"));
      } else if (value !== this.formKhaHang.password) {
        callback(new Error("Mật khẩu hai lần nhập không trùng khớp"));
      } else {
        callback();
      }
    };
    return {
      showUserDetail: false,
      active: 0,
      src: process.env.VUE_APP_BASE + "images/avatar/product.png",
      endPointImage: process.env.VUE_APP_BASE,
      next: true,
      showFormAddKhachHang: false,
      cap_nhat: false,
      doiTra: false,
      hangCus: [],
      formKhaHang: {
        id: null,
        ten: null,
        ma: "KH" + new Date().getTime(),
        so_dien_thoai: null,
        dia_chi: null,
        ngay_sinh: null,
        ghi_chu: null,
        ca_nhan: false,
        ma_so_thue: null,
        gioi_tinh: true,
        email: null,
        username: null,
        password: null,
        password_confirmation: null,
        anh_dai_dien: null,
        facebook: null,
        trang_thai: null,
        so_tai_khoan: null,
        so_du: null,
        chuyen_khoan_cuoi: null,
        giao_dich_cuoi: null,
        nhom_id: null,
        loai_thanh_vien_id: null,
        tin_nhiem: null,
        diem_quy_doi: null,
        tien_vay: null,
      },
      form: {
        ma: "ĐĐH_" + new Date().getTime(),
        ten: null,
        ghi_chu: null,
        tong_tien: null,
        da_thanh_toan: null,
        danhSachHang: [],
        khach_hang_id: null,
        da_thanh_toan: 0,
        giam_gia: 0,
        con_phai_thanh_toan: 0,
        nhan_vien_giao_hang: null,
        trang_thai: "moi_tao",
        bang_gia_id: null,
        thanh_toan: null,
        dia_chi: "Tại quầy",
        thoi_gian_nhan_hang: new Date(),
        phu_thu: 0,
      },
      isInputDaThanhToan: null,
      isInputPhuThu: null,
      isInputGiamGia: null,
      tongTienCu: null,
      danh_muc_id: null,
      formate: formate,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      trang_thai: "moi_tao",
      admin: false,
      timKiem: null,
      nhaCungCaps: [],
      hangHoa: {},
      hang_hoa_id: null,
      hangHoas: [],
      bangGias: [],
      so_luong: 1,
      don_vi_tinh: null,
      don_gia: null,
      shipper: [],
      UserInfo: {},
      danhMucs: [],
      loading: false,
      rules: {
        ten: [
          { required: true, message: "Hãy nhập tên đơn hàng", trigger: "blur" },
          {
            min: 5,
            message: "Tên đơn hàng tối thiểu 5 ký tự",
            trigger: "blur",
          },
        ],
        thanh_toan: [
          {
            required: true,
            message: "Phương thức thanh toán không thể bỏ trống",
            trigger: "change",
          },
        ],
      },
      rulesKhachHang: {
        ten: [
          {
            required: true,
            message: "Tên khách hàng không thể bỏ trống",
            trigger: "blur",
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" },
        ],
        ma: [
          {
            required: true,
            message: "Mã khách hàng không thể bỏ trống",
            trigger: "blur",
          },
          { min: 3, message: "Độ dài tối thiểu 3 ký tự", trigger: "blur" },
        ],
        so_dien_thoai: [
          {
            required: true,
            message: "Số điện thoại không thể bỏ trống",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Email không được bỏ trống",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Hãy nhập một địa chỉ email hợp lệ",
            trigger: ["blur", "change"],
          },
        ],
        username: [
          {
            required: true,
            message: "Tên đăng nhập không thể bỏ trống",
            trigger: "blur",
          },
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          {
            min: 6,
            message: "Độ dài tối thiểu 6 kí tự",
            trigger: "blur",
          },
        ],
        password_confirmation: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  computed: {
    daThanhToan: {
      get() {
        if (this.isInputDaThanhToan) {
          // Cursor is inside the input field. unformat display value for user
          return this.form.da_thanh_toan.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.form.da_thanh_toan).replace(
            /(\d)(?=(\d{3})+(?:\.\d+)?$)/g,
            "$1."
          );
        }
      },
      set(modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        let newValue = parseFloat(
          String(modifiedValue).replace(/[^\d\.]/g, "")
        );
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.form.da_thanh_toan = newValue;
      },
    },
    phuThu: {
      get() {
        if (this.isInputPhuThu) {
          // Cursor is inside the input field. unformat display value for user
          return this.form.phu_thu.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.form.phu_thu).replace(
            /(\d)(?=(\d{3})+(?:\.\d+)?$)/g,
            "$1."
          );
        }
      },
      set(modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        let newValue = parseFloat(
          String(modifiedValue).replace(/[^\d\.]/g, "")
        );
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.form.phu_thu = newValue;
      },
    },
    giamGia: {
      get() {
        if (this.isInputGiamGia) {
          // Cursor is inside the input field. unformat display value for user
          return this.form.giam_gia.toString();
        } else {
          // User is not modifying now. Format display value for user interface
          return String(this.form.giam_gia).replace(
            /(\d)(?=(\d{3})+(?:\.\d+)?$)/g,
            "$1."
          );
        }
      },
      set(modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        let newValue = parseFloat(
          String(modifiedValue).replace(/[^\d\.]/g, "")
        );
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.form.giam_gia = newValue;
      },
    },
  },
  created() {
    this.getSanPham();
    this.getKhachHang();
    this.getData();
    this.getBangGia();
    this.nhanVienGiaoHang();
    this.getDanhMuc();
  },
  watch: {
    timKiem: debounce(function () {
      this.getSanPham();
    }, 300),
    doiTra(val) {
      this.cap_nhat = !val;
    },
    "form.giam_gia": function (val) {
      this.form.con_phai_thanh_toan =
        this.form.tong_tien - this.form.da_thanh_toan - val;
    },

    "form.da_thanh_toan": function (val) {
      this.form.con_phai_thanh_toan =
        this.form.tong_tien - this.form.giam_gia - val;
    },
    "form.tong_tien": function (val) {
      this.form.con_phai_thanh_toan =
        this.form.tong_tien - this.form.giam_gia - this.form.da_thanh_toan;
    },
  },
  methods: {
    addKhachHang(formKhaHang) {
      this.$refs[formKhaHang].validate((valid) => {
        if (valid) {
          addKhachHang(this.formKhaHang).then((res) => {
            this.resetFormKhaHang();
            this.getKhachHang();
            this.$message({
              type: "success",
              message: "Thêm mới thành công",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    async getDanhMuc() {
      let data = await index();
      this.danhMucs = data.data;
    },
    async showAddKhachHang() {
      this.resetFormKhaHang();
      this.showFormAddKhachHang = true;
    },
    async getData() {
      let data = await getChiTietDonDathang(this.$route.params.id);
      this.form.ma = data.data.ma;
      this.form.ten = data.data.ten;
      this.form.ghi_chu = data.data.ghi_chu;
      this.form.tong_tien = data.data.tong_tien;
      this.form.da_thanh_toan = data.data.da_thanh_toan;
      this.form.trang_thai = data.data.trang_thai;
      this.trang_thai = data.data.trang_thai;
      this.form.khach_hang_id = data.data.user_id;
      this.form.giam_gia = data.data.giam_gia ? data.data.giam_gia : 0;
      this.form.con_phai_thanh_toan = data.data.con_phai_thanh_toan;
      this.form.nhan_vien_giao_hang = data.data.nhan_vien_giao_hang;
      this.form.bang_gia_id = data.data.bang_gia_id;
      this.form.thanh_toan = data.data.thanh_toan ? data.data.thanh_toan : 0;
      this.form.dia_chi = data.data.dia_chi;
      this.form.thoi_gian_nhan_hang = data.data.thoi_gian_nhan_hang;
      this.form.phu_thu = data.data.phu_thu ? data.data.phu_thu : 0;
      this.form.danhSachHang = [];
      this.hangCus = [];
      for (let sp of data.data.san_phams) {
        let item = {};
        item.don_gia = sp.gia_ban;
        item.so_luong = sp.so_luong;
        item.hang_hoa = sp.san_pham;
        this.form.danhSachHang.push({ ...item });
        this.hangCus.push({ ...item });
      }
      if (data.data.trang_thai == "hoa_don") {
        this.cap_nhat = true;
      }
      this.tongTienCu =
        Number(this.form.tong_tien) +
        Number(this.form.phu_thu) -
        Number(this.form.giam_gia);
    },
    showInfo() {
      this.UserInfo = this.nhaCungCaps.find(
        (el) => el.user_id == this.form.khach_hang_id
      );
      if (this.UserInfo) {
        this.showUserDetail = true;
      } else this.UserInfo = {};
    },
    async getSanPham() {
      let data = await listSanPham({
        per_page: 6,
        search: this.timKiem,
        danh_muc_id: this.danh_muc_id,
      });
      this.hangHoas = data.data.data;
    },
    doiSanPham(id) {
      const cBangGia = this.bangGias.find(
        (el) => el.id === this.form.bang_gia_id
      );
      this.hang_hoa_id = id;
      this.hangHoa = this.hangHoas.find((el) => el.id == id);
      this.don_vi_tinh = this.hangHoa.don_vi_tinh;
      if (cBangGia) {
        const findSp = cBangGia.san_pham.find((i) => i.san_pham_id === id);
        if (findSp) this.don_gia = findSp.gia_ban;
        else this.don_gia = this.hangHoa.gia_ban;
      } else {
        this.don_gia = this.hangHoa.gia_ban;
      }

      this.addSanPham();
    },
    async getBangGia() {
      let data = await getBangGia({
        per_page: 9999999,
      });
      this.bangGias = data.data.data;
    },
    addSanPham() {
      if (this.hang_hoa_id && this.so_luong && this.don_gia) {
        let data = {};
        data.hang_hoa = this.hangHoa;
        data.so_luong = this.so_luong;
        data.don_gia = this.don_gia;
        this.form.danhSachHang.push(data);
        for (let el of this.hangHoas) {
          if (this.hang_hoa_id == el.id) {
            el.disabled = true;
          }
        }
        this.hang_hoa_id = null;
        this.so_luong = 1;
        this.don_gia = null;
        this.don_vi_tinh = null;
        this.hangHoa = {};
      }
    },
    kiemTraDaChon(SanPhamID) {
      let a = this.form.danhSachHang.find((el) => el.hang_hoa.id == SanPhamID);
      if (a) return true;
      return false;
    },
    xoaSanPham(index, data) {
      this.form.danhSachHang.splice(index, 1);
      for (let el of this.hangHoas) {
        if (data.hang_hoa.id == el.id) {
          el.disabled = false;
        }
      }
    },
    tongTien(param) {
      const { columns, data } = param;
      const sums = Array(7).fill("");
      const tongTien = data.reduce(
        (acc, el) => (acc += Number(el.don_gia) * Number(el.so_luong)),
        0
      );
      this.form.tong_tien = tongTien;
      return sums;
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.danhSachHang.length == 0) {
            this.$message({
              message: "Danh sách hàng hóa không thể bỏ trống",
              type: "warning",
            });
            return;
          }
          this.form.hangCus = [];
          this.form.doiTra = [];
          this.form.chenhLech = 0;
          if (this.doiTra) {
            let dataDoiTra = [];
            this.hangCus.map((el) => {
              let exist = this.form.danhSachHang.find(
                (it) => it.hang_hoa.id === el.hang_hoa.id
              );
              if (exist) {
                if (el.so_luong > exist.so_luong)
                  dataDoiTra.push({
                    ...el,
                    so_luong: el.so_luong - exist.so_luong,
                  });
              } else {
                dataDoiTra.push({
                  ...el,
                  so_luong: el.so_luong,
                });
              }
            });
            this.form.doiTra = dataDoiTra;
            this.form.hangCus = this.hangCus;
            this.form.chenhLech =
              Number(this.form.tong_tien) +
              Number(this.form.phu_thu) -
              Number(this.form.giam_gia) -
              Number(this.tongTienCu);
          }
          editDonDathang(this.$route.params.id, this.form).then((res) => {
            this.$message({
              message: "Cập nhật đơn hàng thành công",
              type: "success",
            });
          });
          this.doiTra = false;
          this.getData().catch((error) => {
            console.log(error);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    back() {
      this.$router.push("/quanlydonhang/nhacungcap");
    },
    resetForm() {
      this.form = {
        ma: "ĐĐH_" + new Date().getTime(),
        ten: null,
        ghi_chu: null,
        tong_tien: null,
        da_thanh_toan: null,
        danhSachHang: [],
        khach_hang_id: null,
        da_thanh_toan: 0,
        giam_gia: 0,
        con_phai_thanh_toan: 0,
        thanh_toan: null,
        dia_chi: "Tại quầy",
        thoi_gian_nhan_hang: new Date(),
        phu_thu: 0,
      };
      this.hangHoa = {};
      this.hang_hoa_id = null;
      this.so_luong = null;
      this.don_vi_tinh = null;
      this.don_gia = null;
    },
    async getKhachHang() {
      let data = await getKhachHang({
        per_page: 999999,
      });
      this.nhaCungCaps = data.data.data;
    },

    async remoteMethod(query) {
      this.loading = true;
      let data = await getKhachHang({
        per_page: 999999,
        search: query,
      });
      this.nhaCungCaps = data.data.data;
      this.loading = false;
    },
    async getBangGia() {
      let data = await getBangGia({
        per_page: 9999999,
      });
      this.bangGias = data.data.data;
    },
    chonBangGia(id) {
      if (id) {
        let bangGia = this.bangGias.find((el) => el.id == id);
        this.form.danhSachHang.map((el) => {
          const findIndex = bangGia.san_pham.findIndex(
            (i) => i.san_pham_id === el.hang_hoa.id
          );
          if (findIndex !== -1) {
            el.don_gia = bangGia.san_pham[findIndex].gia_ban;
          }
        });
      } else {
        this.form.danhSachHang.map((el) => {
          el.don_gia = el.hang_hoa.gia_ban;
        });
      }
    },
    inHoaDon() {
      window.open(
        process.env.VUE_APP_BASE_API + "inhoadon/" + this.$route.params.id,
        "_blank"
      );
    },
    async huyDon() {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn hủy đơn đặt hàng hàng này",
          "Hủy đơn đặt hàng",
          {
            confirmButtonText: "Đồng y",
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        let status = await huyDon(this.$route.params.id);
        this.getData();
        this.$message({
          message: "Hủy đơn thành công",
          type: "success",
        });
      } catch (error) {}
    },
    nhanVienGiaoHang() {
      getShipper().then((res) => {
        this.shipper = res;
      });
    },
    async hoaDon() {
      try {
        let comfirm = await this.$confirm(
          "Bạn có chắc chắn muốn chuyển hóa đơn cho đơn đặt hàng hàng này",
          "Chuyển hóa đơn",
          {
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
            type: "warning",
          }
        );
        let status = await chuyenHoaDon(this.$route.params.id, {
          thanh_toan: this.form.thanh_toan,
          khach_hang_id: this.form.khach_hang_id,
          nhan_vien_giao_hang: this.form.nhan_vien_giao_hang,
        });
        this.getData();
        this.$message({
          message: "Thanh toán thành công",
          type: "success",
        });
      } catch (error) {}
    },

    resetFormKhaHang() {
      this.showFormAddKhachHang = false;
      (this.next = true),
        (this.formKhaHang = {
          id: null,
          ten: null,
          ma: "KH" + new Date().getTime(),
          so_dien_thoai: null,
          dia_chi: null,
          ngay_sinh: null,
          ghi_chu: null,
          ca_nhan: false,
          ma_so_thue: null,
          gioi_tinh: true,
          email: null,
          username: null,
          password: null,
          password_confirmation: null,
          anh_dai_dien: null,
          facebook: null,
          so_tai_khoan: null,
          so_du: null,
          chuyen_khoan_cuoi: null,
          giao_dich_cuoi: null,
          nhom_id: null,
          loai_thanh_vien_id: null,
          tin_nhiem: null,
          diem_quy_doi: null,
          tien_vay: null,
          trang_thai: null,
        });
    },
  },
};
</script>
<style scoped>
.flex-collumn {
  flex-direction: column;
}
.d-flex {
  display: flex;
}
.fill-height {
  height: 100%;
}
.el-select-dropdown__item {
  height: auto;
}
.condau {
  height: 80px;
  width: 250px;
  border: 3px solid #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
  height: 130px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.sanpham {
  overflow: auto;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  border-top: 1px solid #2e86c1;
  background-color: #58d68d;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  scroll-behavior: smooth;
}

.bounce-enter-active {
  animation: bounce-in 0.8s;
}
.bounce-leave-active {
  animation: bounce-in 0.8s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>