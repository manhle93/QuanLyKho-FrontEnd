<template>
  <div class="app-container" style="height: calc(100vh - 50px);overflow: hidden;">
    <el-form ref="form" style="height: calc(100vh - 50px);">
      <el-row :gutter="20" style="height: calc(100vh - 50px);">
        <el-col
          :span="col1"
          class="scroll"
          style="height: calc(100vh - 50px);padding-left: 20px !important; padding-right: 0px;"
        >
          <TaoDiemChay
            @htDiemchay1="val => handleDc(val)"
            @getMarker="item => getMarker(item)"
            :address="addressbylatlong"
          ></TaoDiemChay>

          <el-row style="margin-top:10px" v-if="htdc">
            <el-select style="width:100%;text-align:center" v-model="mode">
              <el-option label="Danh sách điểm đang cháy" value="dang_chay"></el-option>
              <el-option label="Danh sách điểm cháy đang xử lý" value="da_xu_ly"></el-option>
            </el-select>
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <img
                    src="http://pcccapi.howizbiz.com/storage/images/avatar/1570780090.png"
                    style="width: 30px; height: 30px;"
                  />
                  <div style="font-weight: bold;  margin-left: 10px">Điểm cháy</div>
                </template>
                <div style="width: 100%;margin-top:20px;">
                  <el-tooltip content="Tắt còi" placement="bottom" effect="light">
                    <a @click="playSound('pause')">
                      <img
                        v-if="sound"
                        src="http://pcccapi.howizbiz.com/storage/images/avatar/1570780870.png"
                        style="width: 50px; height: 50px; margin:auto;display:block;margin-bottom:10px"
                      />
                    </a>
                  </el-tooltip>
                  <div
                    @click="activeDiemChay(diemchay.id)"
                    v-for="diemchay in diemchays"
                    :key="diemchay.id"
                    style="cursor: pointer;width: 98%;"
                  >
                    <el-card class="diem-chay" :ref="'diemchay' + diemchay.id">
                      <el-row>
                        <el-col class="icon-svg" :md="{ span: 6 }">
                          <svg-icon icon-class="fire" class="icon-fire"></svg-icon>
                        </el-col>
                        <el-col :md="{ span: 18 }">
                          <div class="ten-diem-chay">{{ diemchay.ten }}</div>
                          <div class="thong-tin-diem-chay">
                            <i class="el-icon-phone"></i>
                            <span>{{ diemchay.so_dien_thoai }}</span>
                          </div>
                          <div class="thong-tin-diem-chay">
                            <i class="el-icon-location"></i>
                            <span>{{ diemchay.dia_chi }}</span>
                          </div>
                        </el-col>
                      </el-row>
                    </el-card>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-card :class="{ 'chi-tiet-wrapper': true, show: show }">
              <el-row style="margin-bottom: 20px">
                <el-col :span="6">
                  <img
                    src="http://pcccapi.howizbiz.com/storage/images/avatar/1570780090.png"
                    style="width: 40px; height: 40px"
                  />
                </el-col>
                <el-col :span="18">
                  <div
                    style="color:#e74c3c;font-size:16px;font-weight:bold; line-height: 50px"
                  >{{ currentDiemChay.ten }}</div>
                </el-col>
              </el-row>
              <br />
              <el-form
                size="small"
                label-position="left"
                label-width="90px"
                :model="currentDiemChay"
              >
                <el-row>
                  <el-col :span="4">
                    <el-tooltip
                      content="Số điện thoại thoại người báo"
                      placement="bottom"
                      effect="light"
                    >
                      <el-button type="info" icon="el-icon-phone" size="mini" circle></el-button>
                    </el-tooltip>
                  </el-col>
                  <!-- <el-form-item> -->
                  <el-col :span="18">
                    <div
                      v-if="!editPhone"
                      style="font-size: 12px; font-weight: bold; padding-top: 5px"
                    >
                      <!-- {{ phoneFormat(currentDiemChay.so_dien_thoai) }} -->
                      {{
                      currentDiemChay.so_dien_thoai
                      ? phoneFormat(currentDiemChay.so_dien_thoai)
                      : currentDiemChay.toa_nha
                      ? phoneFormat(
                      currentDiemChay.toa_nha.so_dien_thoai[0]
                      .so_dien_thoai
                      )
                      : ""
                      }}
                    </div>
                    <el-input
                      v-if="editPhone"
                      v-model="currentDiemChay.so_dien_thoai"
                      style="width: 90%"
                      size="small"
                    ></el-input>
                  </el-col>
                  <!-- </el-form-item> -->
                  <el-col :span="2">
                    <a @click="editPhone = !editPhone">
                      <i class="el-icon-edit"></i>
                    </a>
                  </el-col>
                </el-row>
                <br />
                <el-row>
                  <el-col :span="4">
                    <el-tooltip content="Người báo cháy" placement="bottom" effect="light">
                      <el-button type="info" icon="el-icon-user" size="mini" circle></el-button>
                    </el-tooltip>
                  </el-col>
                  <!-- <el-form-item> -->
                  <el-col :span="18">
                    <div v-if="!editName" style="font-size: 12px; padding-top: 5px">
                      Người báo:
                      {{
                      currentDiemChay.ten_nguoi_bao
                      ? currentDiemChay.ten_nguoi_bao
                      : "Cháy từ thiết bị SFUL"
                      }}
                    </div>
                    <el-input
                      v-if="editName"
                      v-model="currentDiemChay.ten_nguoi_bao"
                      style="width: 90%"
                      size="small"
                    ></el-input>
                  </el-col>
                  <!-- </el-form-item> -->
                  <el-col :span="2">
                    <a @click="editName = !editName">
                      <i class="el-icon-edit"></i>
                    </a>
                  </el-col>
                </el-row>
                <br />
                <el-row v-if="currentDiemChay.toa_nha != null">
                  <el-col :span="4">
                    <el-tooltip content="Tòa nhà" placement="bottom" effect="light">
                      <el-button type="info" icon="el-icon-s-home" size="mini" circle></el-button>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="18">
                    <div
                      style="font-size: 12px; padding-top: 5px"
                      v-if="currentDiemChay.toa_nha != null"
                    >{{ currentDiemChay.toa_nha.ten }}</div>
                  </el-col>
                </el-row>
                <br v-if="currentDiemChay.toa_nha != null" />
                <el-row
                  v-if="
                    currentDiemChay.toa_nha != null &&
                      currentDiemChay.cam_bien_first != null
                  "
                >
                  <el-col :span="4">
                    <el-tooltip content="Vị trí" placement="bottom" effect="light">
                      <el-button type="info" icon="el-icon-location" size="mini" circle></el-button>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="18">
                    <div
                      style="font-size: 12px"
                      v-if="currentDiemChay.cam_bien_first.vi_tri"
                    >{{ currentDiemChay.cam_bien_first.vi_tri }}</div>
                  </el-col>
                </el-row>
                <br v-if="currentDiemChay.toa_nha != null" />
                <!-- <el-form-item label="Toà nhà">
                  <el-input
                    :placeholder="currentDiemChay.toa_nha?currentDiemChay.toa_nha.ten:''"
                    :disabled="true"
                  ></el-input>
                </el-form-item>-->
                <el-row>
                  <el-col :span="4">
                    <el-tooltip content="Địa chỉ" placement="bottom" effect="light">
                      <el-button type="info" icon="el-icon-location" size="mini" circle></el-button>
                    </el-tooltip>
                  </el-col>
                  <!-- <el-form-item> -->
                  <el-col :span="18">
                    <div
                      style="font-size: 12px;padding-top: 5px"
                      v-if="!editDiaChi"
                    >{{ currentDiemChay.dia_chi }}</div>
                    <el-input
                      style="width: 90%"
                      size="small"
                      v-if="editDiaChi"
                      type="textarea"
                      :rows="2"
                      v-model="currentDiemChay.dia_chi"
                    ></el-input>
                  </el-col>
                  <!-- </el-form-item> -->
                  <el-col :span="2">
                    <a @click="editDiaChi = !editDiaChi">
                      <i class="el-icon-edit"></i>
                    </a>
                  </el-col>
                </el-row>
                <br />
                <el-row>
                  <el-col :span="4">
                    <el-tooltip content="Thời gian báo" placement="bottom" effect="light">
                      <el-button type="info" icon="el-icon-alarm-clock" size="mini" circle></el-button>
                    </el-tooltip>
                  </el-col>
                  <!-- <el-form-item> -->
                  <el-col :span="18" style="font-size: 12px; padding-top: 5px">
                    {{ formatDate(currentDiemChay.created_at) }}
                    <!-- <el-input type="textarea" :rows="2" v-model="currentDiemChay.dia_chi"></el-input> -->
                  </el-col>
                </el-row>
              </el-form>
              <br />
              <hr />
              <br />
              <el-row style="text-align: center" v-if="loadXuLy">
                <img
                  src="http://pcccapi.howizbiz.com/storage/images/avatar/1589860286.gif"
                  style="height: 60px; width: auto"
                />
              </el-row>
              <el-row v-if="ket_thuc_xu_ly && !loadXuLy">
                <el-col :span="11">
                  <el-button
                    size="small"
                    @click="canhBaoSai"
                    type="warning"
                    style="width: 100%"
                  >Cảnh báo sai</el-button>
                </el-col>
                <el-col :span="11" :offset="2">
                  <el-button
                    size="small"
                    @click.native="ketThucXuLy"
                    type="primary"
                    style="width: 100%"
                  >Kết thúc xử lý</el-button>
                </el-col>
              </el-row>
              <el-row v-if="!ket_thuc_xu_ly && !loadXuLy">
                <el-button
                  size="small"
                  @click="canhBaoSai"
                  type="warning"
                  style="width: 100%"
                >Cảnh báo sai</el-button>
              </el-row>
              <br />
              <el-row v-if="!loadXuLy">
                <el-button
                  size="small"
                  @click="xuLyChay(currentDiemChay)"
                  type="danger"
                  style="width: 100%"
                >XỬ LÝ CHÁY</el-button>
              </el-row>
              <el-row v-if="!loadXuLy" style="margin-top:10px">
                <el-collapse v-model="activeNames1">
                  <el-collapse-item name="1">
                    <template slot="title">
                      <img
                        src="http://pcccapi.howizbiz.com/storage/images/avatar/1570527931.png"
                        style="width: 30px; height: 30px;"
                      />
                      <div
                        style="font-weight: bold; font-size: 12px; margin-left: 10px"
                      >Phương tiện PCCC</div>
                    </template>
                    <!-- <div class="scroll"> -->
                    <div v-loading="loadPtccc">
                      <div>
                        <el-row :gutter="20">
                          <el-col :span="14">
                            <el-input
                              prefix-icon="el-icon-search"
                              placeholder="Tìm kiếm"
                              v-model="timXe"
                              size="small"
                              @change="locXe"
                            ></el-input>
                          </el-col>
                          <el-col :span="10">
                            <el-select
                              v-model="tinh_thanh_id"
                              placeholder="Tỉnh thành"
                              size="small"
                              clearable
                              filterable
                              @change="locXeTheoTinh(tinh_thanh_id)"
                            >
                              <el-option
                                v-for="item in tinhThanhs"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                      </div>
                      <el-card
                        v-for="phuongtienpccc in phuongtienpcccsFilted"
                        :key="phuongtienpccc.id"
                        shadow="hover"
                        style="margin-top:10px;border: 1px solid #AED6F1"
                        v-loading="loadPtccc"
                      >
                        <el-row :gutter="20">
                          <!-- <div class="wrapper">
                              <div class="ten">{{ phuongtienpccc.ten }}</div>
                              <div class="thong-tin" style="margin-top:6px">
                                <i class="el-icon-phone"></i>
                                <span>{{ phuongtienpccc.so_dien_thoai }}</span>
                                <br />
                                <div style="text-align:center;margin-top:5px">
                                  <div style="display: inline-block">
                                    <el-button
                                      v-if="!phuongtienpccc.status"
                                      size="mini"
                                      style="float:right;margin-top:10px"
                                      type="primary"
                                      @click="updatePhuongTienPccc(phuongtienpccc.id,'add')"
                                    >Phân công</el-button>
                                    <el-button
                                      v-else
                                      size="mini"
                                      style="float:right"
                                      type="info"
                                      @click="updatePhuongTienPccc(phuongtienpccc.id,'delete')"
                                    >Hủy</el-button>
                                    <el-tooltip
                                      content="Giám sát xe"
                                      placement="bottom"
                                      effect="light"
                                    >
                                      <el-button
                                        @click="chiDuongXeDuocChon(phuongtienpccc.id)"
                                        type="primary"
                                        icon="el-icon-location-information"
                                        size="mini"
                                        v-if="phuongtienpccc.status"
                                        circle
                                        :ref="'button'+phuongtienpccc.id"
                                        style="float:right;margin-right:5px"
                                      ></el-button>
                                    </el-tooltip>
                                  </div>
                                </div>
                              </div>
                          </div>-->
                          <el-col :span="14">
                            <div style="font-weight: bold">{{ phuongtienpccc.ten }}</div>
                            <div>BKS: {{ phuongtienpccc.bien_so }}</div>
                            <div>SĐT: {{ phuongtienpccc.so_dien_thoai }}</div>
                          </el-col>
                          <el-col :span="10">
                            <el-button
                              v-if="!phuongtienpccc.status"
                              size="mini"
                              type="primary"
                              style="float:right;margin-top:10px"
                              icon="el-icon-check"
                              @click="
                                updatePhuongTienPccc(phuongtienpccc.id, 'add')
                              "
                            >Phân công</el-button>
                            <el-tooltip
                              v-else
                              content="Hủy phân công"
                              placement="bottom"
                              effect="light"
                            >
                              <el-button
                                size="small"
                                style="float:right"
                                type="danger"
                                icon="el-icon-close"
                                circle
                                @click="
                                  updatePhuongTienPccc(
                                    phuongtienpccc.id,
                                    'delete'
                                  )
                                "
                              ></el-button>
                            </el-tooltip>
                            <el-tooltip content="Giám sát xe" placement="bottom" effect="light">
                              <el-button
                                @click="chiDuongXeDuocChon(phuongtienpccc.id)"
                                type="primary"
                                icon="el-icon-location-information"
                                size="small"
                                v-if="phuongtienpccc.status"
                                circle
                                :ref="'button' + phuongtienpccc.id"
                                style="float:right;margin-right:5px"
                              ></el-button>
                            </el-tooltip>
                          </el-col>
                        </el-row>
                      </el-card>
                      <!-- <br />
                      <div style="text-align: center">
                        <el-button size="mini" type="warning" @click="xemThemPhuongtien">Xem thêm</el-button>
                      </div>-->
                    </div>
                  </el-collapse-item>
                  <el-collapse-item name="2">
                    <template slot="title">
                      <img
                        src="http://pcccapi.howizbiz.com/storage/images/avatar/1570780058.jpg"
                        style="width: 25px; height: 25px;"
                      />
                      <div
                        style="font-weight: bold; font-size: 12px;  margin-left: 10px"
                      >Đơn vị hỗ trợ</div>
                    </template>
                    <!-- <div class="scroll2"> -->
                    <div v-loading="loadPtccc">
                      <el-row :gutter="20">
                        <el-col :span="14">
                          <el-input
                            prefix-icon="el-icon-search"
                            placeholder="Tìm kiếm"
                            v-model="timDonVi"
                            size="small"
                            @change="locDonVi"
                          ></el-input>
                        </el-col>
                        <el-col :span="10">
                          <el-select
                            v-model="tinh_thanh_id_dv"
                            placeholder="Tỉnh thành"
                            size="small"
                            clearable
                            filterable
                            @change="locDonViTheoTinh(tinh_thanh_id_dv)"
                          >
                            <el-option
                              v-for="item in tinhThanhs"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            ></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </div>
                    <div>
                      <el-card
                        v-for="donvihotro in donvihotrosFilted"
                        :key="donvihotro.id"
                        shadow="hover"
                        style="margin-top:10px; border: 1px solid #AED6F1"
                      >
                        <el-row :gutter="20">
                          <el-col :span="14">
                            {{ donvihotro.ten }}
                            <div>
                              <i class="el-icon-phone"></i>
                              <span>{{ donvihotro.so_dien_thoai }}</span>
                            </div>
                          </el-col>
                          <el-col :span="10">
                            <div style="display: inline-block">
                              <el-button
                                v-if="!donvihotro.status"
                                size="mini"
                                style="float:right"
                                type="primary"
                                icon="el-icon-check"
                                @click="updateDonViHoTro(donvihotro.id, 'add')"
                              >Phân công</el-button>
                              <el-button
                                v-else
                                size="mini"
                                style="float:right"
                                type="danger"
                                icon="el-icon-close"
                                @click="
                                  updateDonViHoTro(donvihotro.id, 'delete')
                                "
                              >Hủy</el-button>
                            </div>
                          </el-col>
                          <!-- <div class="ten">{{ donvihotro.ten }}</div>
                          <div class="thong-tin" style="margin-top:5px">
                            <i class="el-icon-phone"></i>
                            <span>{{ donvihotro.so_dien_thoai }}</span>
                            <br />
                            <div style="text-align:center;margin-top:8px">
                              <div style="display: inline-block">
                                <el-button
                                  v-if="!donvihotro.status"
                                  size="mini"
                                  style="float:right"
                                  type="primary"
                                  @click="updateDonViHoTro(donvihotro.id,'add')"
                                >Phân công</el-button>
                                <el-button
                                  v-else
                                  size="mini"
                                  style="float:right"
                                  type="info"
                                  @click="updateDonViHoTro(donvihotro.id,'delete')"
                                >Hủy</el-button>
                              </div>
                            </div>
                          </div>-->
                        </el-row>
                      </el-card>
                      <!-- <br />
                      <div style="text-align: center">
                        <el-button size="mini" type="warning">Xem thêm</el-button>
                      </div>-->
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-row>
            </el-card>
          </el-row>
        </el-col>
        <el-col :span="col2" style="height: 100%">
          <MapView
            ref="map"
            @getDL="getDataBound"
            @getAdddatas="addr => handleMap(addr)"
            @getAddressByLatLong="addr2 => getDiaChi(addr2)"
            :diemchays="this.diemchays"
            :dataDiemLayNuocs="diemlaynuocs"
            :thietbiquays="thietbiquays"
            :markerItem="marker"
            :dataToaNhas="toanhas"
            :satellite="satellite"
            :phuongtienpcccs2="phuongtienpcccs2"
            :htdc="htdc"
            @toggle="showAside = !showAside"
            :currentDiemChay="currentDiemChay"
            @clickDiemChay="idDc => activeDiemChay(idDc)"
          ></MapView>
        </el-col>
      </el-row>
    </el-form>
    <div class="leaflet-top leaflet-right" style="margin-top: 30px;margin-right: 20px">
      <div class="leaflet-control-layers leaflet-control" aria-haspopup="true">
        <a class="leaflet-control-layers-toggle" href="#" title="Layers"></a>
        <form class="leaflet-control-layers-list" style="font-size: 12px;padding: 10px;">
          <div class="leaflet-control-layers-base" style="font-size: 12px">
            <label>
              <div>
                <input
                  type="checkbox"
                  class="leaflet-control-layers-selector"
                  name="leaflet-base-layers"
                  v-model="camera"
                />
                <span>Camera</span>
              </div>
            </label>
            <label>
              <div>
                <input
                  type="checkbox"
                  class="leaflet-control-layers-selector"
                  name="leaflet-base-layers"
                  v-model="nuoc"
                />
                <span>Điểm lấy nước</span>
              </div>
            </label>
            <label>
              <div>
                <input
                  type="checkbox"
                  class="leaflet-control-layers-selector"
                  name="leaflet-base-layers"
                  v-model="toanha"
                />
                <span>Tòa nhà</span>
              </div>
            </label>
            <label>
              <div>
                <input
                  type="checkbox"
                  class="leaflet-control-layers-selector"
                  name="leaflet-base-layers"
                  v-model="xe"
                />
                <span>Xe</span>
              </div>
            </label>
          </div>
          <div class="leaflet-control-layers-separator"></div>
          <div class="leaflet-control-layers-overlays">
            <label>
              <div>
                <input type="checkbox" class="leaflet-control-layers-selector" v-model="all" />
                <span>Tất cả</span>
              </div>
            </label>
            <label>
              <div>
                <input
                  type="checkbox"
                  class="leaflet-control-layers-selector"
                  name="leaflet-base-layers"
                  v-model="satellite"
                />
                <span>Google Satellite Layer</span>
              </div>
            </label>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MapView from "./MapView";
import * as firebase2 from "firebase/app";
import {
  getData,
  getDataPolygon,
  getDiemChay,
  getDonViHoTro,
  getPhuongTienPccc,
  getXe,
  updatePhuongTienPccc,
  updateDonViHoTro,
  getViTriPhuongTienPccc
} from "@/api/giamsat";
import { index } from "@/api/phuongtienpccc";
import { updateDiemChay } from "@/api/diemchay";
import { cuocGoi } from "@/api/diemchay";
import TaoDiemChay from "./TaoDiemChay";
import { getTinhThanh } from "@/api/TinhThanh";
const cityOptions = ["Điểm cháy", "Tòa nhà", "Nước", "Camera"];
require("firebase/database");

firebase2.initializeApp({
  apiKey: "AIzaSyDYWHp7ImsUgd5XfzcgbIYEhyHM7vj0h6I",
  authDomain: "pccc-6d1dd.firebaseapp.com",
  databaseURL: "https://pccc-6d1dd.firebaseio.com",
  projectId: "pccc-6d1dd",
  storageBucket: "",
  messagingSenderId: "850349699653",
  appId: "1:850349699653:web:4e944c27822e38709b292c"
});

// Backup tai khoan firebase moi
// firebase2.initializeApp({
//   apiKey: "AIzaSyDNzTgkXTH277VpbwYyihRPJ7LoNX7b8To",
//   authDomain: "pccc-2187f.firebaseapp.com",
//   databaseURL: "https://pccc-2187f.firebaseio.com",
//   projectId: "pccc-2187f",
//   storageBucket: "pccc-2187f.appspot.com",
//   messagingSenderId: "1060604756015",
//   appId: "1:1060604756015:web:dc19dff75d3d9fab14c6da",
//    measurementId: "G-ETMWZNKZBV"
// });

export default {
  name: "Dashboard",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    });
  },

  data() {
    return {
      tinhThanhs: [],
      timXe: "",
      timDonVi: "",
      tinh_thanh_id: null,
      tinh_thanh_id_dv: null,
      tinh_thanh_id_f: null,
      tinh_thanh_id_f_dv: null,
      ket_thuc_xu_ly: false,
      editDiaChi: false,
      editPhone: false,
      loadingXlc: false,
      editName: false,
      all: false,
      marker: null,
      htdc: true,
      checkboxGroup1: ["Điểm cháy"],
      col1: 0,
      col2: 24,
      showAside: true,
      cities: cityOptions,
      diemchays: [],
      mode: "dang_chay",
      audio: new Audio(require("@/assets/mp3/canh_bao.mp3")),
      sound: false,
      camera: false,
      nuoc: false,
      toanha: false,
      xe: false,
      satellite: false,
      donvipcccs: [],
      diemlaynuocs: [],
      thietbiquays: [],
      toanhas: [],
      addressbylatlong: {},
      phuongtienpcccs: [],
      phuongtienpcccsFilted: [],
      phuongtienpcccs2: [],
      donvihotros: [],
      donvihotrosFilted: [],
      show: false,
      currentDiemChay: {
        ten_nguoi_bao: "",
        so_dien_thoai: "",
        dia_chi: ""
      },
      loadPtccc: false,
      loadXuLy: false,
      goiDien: {
        apiKey: "2982#djd838jdh!23",
        toNumber: "84866699806",
        content: "",
        checksum: "",
        toa_nha_id: "",
        diemchay_id: ""
      },
      activeNames: "1",
      activeNames1: "",
      realtime: ""
    };
  },
  components: { TaoDiemChay, MapView },
  watch: {
    timXe: function(query) {
      this.locXe();
    },
    timDonVi: function(val) {
      this.locDonVi();
    },
    mode(val) {
      this.realtimeViTriXe(null, true);
      this.getDiemChay();
      if (val == "da_xu_ly") {
        this.sound = false;
      }
    },
    showAside(val) {
      this.realtimeViTriXe(null, true);
      if (this.col1 == 5) {
        this.col1 = 0;
        this.col2 = 24;
      } else {
        this.col1 = 5;
        this.col2 = 19;
      }
    },
    currentDiemChay(val) {},
    show(val) {
      if (!val) {
        this.activeNames = "1";
      }
    },
    all(val) {
      if (val) {
        this.camera = true;
        this.nuoc = true;
        this.toanha = true;
      } else {
        this.camera = false;
        this.nuoc = false;
        this.toanha = false;
      }
    },
    async camera(val) {
      if (val) {
        this.checkboxGroup1.push("Camera");
        this.getData();
        let data = await getData({ filter: ["Camera"] });
        this.thietbiquays = data.data.thietbiquays;
      } else {
        this.checkboxGroup1 = this.checkboxGroup1.filter(function(ele) {
          return ele != "Camera";
        });
        this.thietbiquays = [];
      }
    },
    async nuoc(val) {
      if (val) {
        this.checkboxGroup1.push("Nước");
        // this.getData();
        let data = await getData({ filter: ["Nước"] });
        this.diemlaynuocs = data.data.nuoc;
      } else {
        this.checkboxGroup1 = this.checkboxGroup1.filter(function(ele) {
          return ele != "Nước";
        });
        this.diemlaynuocs = [];
      }
    },
    async toanha(val) {
      if (val) {
        this.checkboxGroup1.push("Tòa Nhà");
        // this.getData();
        let data = await getData({ filter: ["Tòa Nhà"] });
        this.toanhas = data.data.toanhas;
      } else {
        this.checkboxGroup1 = this.checkboxGroup1.filter(function(ele) {
          return ele != "Tòa Nhà";
        });
        this.toanhas = [];
      }
    },
    async xe(val) {
      if (val) {
        this.checkboxGroup1.push("Xe");
        // this.getData();
        let data = await getData({ filter: ["Xe"] });
        this.phuongtienpcccs2 = data.data.xe;
      } else {
        this.checkboxGroup1 = this.checkboxGroup1.filter(function(ele) {
          return ele != "Xe";
        });
        this.phuongtienpcccs2 = [];
      }
    }
  },
  methods: {
    async getDataBound(poly, zoomLevel) {
      let data = await getDataPolygon({
        filter: this.checkboxGroup1,
        polygon: poly,
        zoomLevel: zoomLevel
      });
      // this.thietbiquays = data.data.thietbiquays;
      // this.toanhas = data.data.toanhas;
      // this.diemlaynuocs = data.data.nuoc;
      // this.phuongtienpcccs2 = data.data.xe;
    },
    locXe() {
      this.phuongtienpcccsFilted = this.phuongtienpcccs.filter(
        el =>
          (!this.tinh_thanh_id_f || el.tinh_thanh_id == this.tinh_thanh_id_f) &&
          (el.ten
            .toLocaleLowerCase()
            .includes(this.timXe.toLocaleLowerCase()) ||
            el.bien_so
              .toLocaleLowerCase()
              .includes(this.timXe.toLocaleLowerCase()) ||
            el.so_dien_thoai
              .toLocaleLowerCase()
              .includes(this.timXe.toLocaleLowerCase()))
      );
    },
    locXeTheoTinh(id) {
      (this.tinh_thanh_id_f = id), this.locXe();
    },

    locDonVi() {
      this.donvihotrosFilted = this.donvihotros.filter(
        el =>
          (!this.tinh_thanh_id_f_dv ||
            el.tinh_thanh_id == this.tinh_thanh_id_f_dv) &&
          (el.ten
            .toLocaleLowerCase()
            .includes(this.timDonVi.toLocaleLowerCase()) ||
            el.ma
              .toLocaleLowerCase()
              .includes(this.timDonVi.toLocaleLowerCase()) ||
            el.so_dien_thoai
              .toLocaleLowerCase()
              .includes(this.timDonVi.toLocaleLowerCase()))
      );
    },
    locDonViTheoTinh(id) {
      (this.tinh_thanh_id_f_dv = id), this.locDonVi();
    },

    xemThemPhuongtien() {},
    async getTinhThanh() {
      let data = await getTinhThanh();
      this.tinhThanhs = data.data;
    },
    handleDc(val) {
      this.htdc = val;
    },
    getMarker(val) {
      this.marker = val;
    },
    getDiaChi(val) {
      this.addressbylatlong = val;
    },
    canhBaoSai() {
      this.$confirm("Đây là điểm cháy do cảnh báo sai ?", "Cảnh báo sai", {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning"
      })
        .then(_ => {
          this.loadXuLy = true;
          this.currentDiemChay.trang_thai = "canh_bao_sai";
          this.currentDiemChay.thoi_gian_bat_dau_xu_ly = "bat_dau_xu_ly_chay";
          this.currentDiemChay.thoi_gian_ket_thuc = "ket_thuc_xu_ly_chay";
          var index;
          updateDiemChay(this.currentDiemChay.id, this.currentDiemChay).then(
            res => {
              this.show = false;
              var index = this.diemchays.findIndex(
                diemchay => diemchay.id == this.currentDiemChay.id
              );
              for (
                let e = 0;
                e < this.currentDiemChay.phuong_tien_pccc.length;
                e++
              ) {
                let i = this.phuongtienpcccs2.findIndex(
                  item => item.id == this.currentDiemChay.phuong_tien_pccc[e].id
                );
                this.$refs.map.hideItinerary(i);
              }
              this.diemchays.splice(index, 1);
              clearInterval(this.realtime);
              this.$refs.map.removeDiemChay(
                this.currentDiemChay.lat,
                this.currentDiemChay.long
              );
              this.loadXuLy = false;
              this.$message({
                title: "Thành công",
                message: "Cập nhật thành công",
                type: "success"
              });
            }
          );
        })
        .catch(_ => {
          this.loadXuLy = false;
        });
    },
    phoneFormat(number) {
      try {
        number = String(number);
        var formatted = "";
        var digits = 4; //The number of digits to pull off next time.
        var dash = "";
        while (digits > 0) {
          //Prepend final [digits] digits to formatted number, with a dash
          formatted =
            number.substr(number.length - digits, digits) + dash + formatted;
          //Remove digits from the old number
          number = number.substr(0, number.length - digits);
          digits = Math.min(number.length, 3);
          dash = ".";
        }
        return formatted;
      } catch (error) {
        return "";
      }
    },
    ketThucXuLy() {
      this.$confirm("Điểm cháy được xử lý xong?", "Kết thúc xử lý cháy", {
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
        type: "warning"
      })
        .then(_ => {
          this.loadXuLy = true;
          this.currentDiemChay.trang_thai = "ket_thuc_xu_ly";
          this.currentDiemChay.thoi_gian_ket_thuc = "ket_thuc_xu_ly_chay";
          updateDiemChay(this.currentDiemChay.id, this.currentDiemChay).then(
            res => {
              this.show = false;
              let index = this.diemchays.findIndex(
                diemchay => diemchay.id == this.currentDiemChay.id
              );
              for (
                let e = 0;
                e < this.currentDiemChay.phuong_tien_pccc.length;
                e++
              ) {
                let i = this.phuongtienpcccs2.findIndex(
                  item => item.id == this.currentDiemChay.phuong_tien_pccc[e].id
                );
                this.$refs.map.hideItinerary(i);
                clearInterval(this.realtime);
              }

              this.diemchays.splice(index, 1);
              clearInterval(this.realtime);
              this.$refs.map.removeDiemChay(
                this.currentDiemChay.lat,
                this.currentDiemChay.long
              );
              this.realtimeViTriXe(null, true);
              clearInterval(this.realtime);
              this.$refs.map.hideItinerary();
              this.loadXuLy = false;
              this.$message({
                title: "Thành công",
                message: "Cập nhật thành công",
                type: "success"
              });
            }
          );
        })
        .catch(_ => {
          this.loadXuLy = false;
        });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async getData() {
      let data = await getData({ filter: this.checkboxGroup1 });
      this.thietbiquays = data.data.thietbiquays;
      this.toanhas = data.data.toanhas;
      this.diemlaynuocs = data.data.nuoc;
      this.phuongtienpcccs2 = data.data.xe;
    },
    async getDiemChay() {
      this.show = false;
      let data = await getDiemChay({ trang_thai: this.mode });
      this.diemchays = data.data;
      if (this.diemchays.length > 0 && this.mode == "dang_chay") {
        this.playSound("play");

        this.checkboxGroup1.push("Xe");
        let dataXe = await getData({ filter: this.checkboxGroup1 });
        this.phuongtienpcccs2 = dataXe.data.xe;

        for (let item of this.diemchays) {
          this.currentDiemChay = this.diemchays.find(
            itemm => itemm.id == item.id
          );
          for (let it of item.phuong_tien_pccc) {
            let index = this.phuongtienpcccs2.findIndex(el => el.id == it.id);
            if (index != -1) {
              await this.chiDuongXe(index, true);
            }
          }
        }
      }
      // for (var chay of this.diemchays) {
      //   var vi_tris = "";
      //   if (chay.cam_bien.length > 0) {
      //     for (var i = 0; i < chay.cam_bien.length; i++) {
      //       vi_tris = vi_tris + chay.cam_bien[i].vi_tri + ", ";
      //     }
      //   }
      //   if (chay.toa_nha_id != null && this.mode == "dang_chay") {
      //     for (var phone of chay.toa_nha.so_dien_thoai) {
      //       if (phone.so_dien_thoai.slice(0, 1) == 0) {
      //         phone.so_dien_thoai =
      //           "84" + phone.so_dien_thoai.slice(1, phone.so_dien_thoai.length);
      //         this.goiDien.content =
      //           "Cảnh báo, Cảnh báo ! " +
      //           vi_tris +
      //           " Tòa nhà " +
      //           chay.toa_nha.ten +
      //           " , " +
      //           "đang xảy ra nguy cơ cháy. Các đơn vị kiểm tra xác minh. " +
      //           "Cảnh báo, Cảnh báo ! " +
      //           vi_tris +
      //           " Tòa nhà " +
      //           chay.toa_nha.ten +
      //           " , " +
      //           "đang xảy ra nguy cơ cháy. Các đơn vị kiểm tra xác minh.";
      //         this.goiDien.checksum =
      //           this.goiDien.apiKey +
      //           phone.so_dien_thoai +
      //           this.goiDien.content;
      //         this.goiDien.toNumber = phone.so_dien_thoai;
      //         this.goiDien.toa_nha_id = chay.toa_nha_id;
      //         this.goiDien.diemchay_id = chay.id;
      //         try {
      //           await cuocGoi(this.goiDien);
      //         } catch (error) {
      //           console.log("Không thể thực hiện cuộc gọi", error);
      //         }
      //       }
      //     }
      //   }
      // }
    },
    addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    formatDate(d) {
      var a = new Date(d);
      return (
        this.addZero(a.getHours()) +
        ":" +
        this.addZero(a.getMinutes()) +
        ", Ngày " +
        this.addZero(a.getDate()) +
        "/" +
        this.addZero(a.getMonth() + 1) +
        "/" +
        a.getUTCFullYear()
      );
    },
    check() {
      this.getData();
    },
    async activeDiemChay(id) {
      this.col1 = 5;
      this.col2 = 19;
      this.loadPtccc = true;
      this.realtimeViTriXe(null, true);
      this.$refs.map.hideItinerary();
      clearInterval(this.realtime);
      this.activeNames = "";
      if (this.$refs["diemchay" + id][0].$el.classList.contains("active")) {
        this.$refs["diemchay" + id][0].$el.classList.remove("active");
        this.show = false;
        return;
      }
      for (let ref in this.$refs) {
        if (ref != "form" && ref != "map") {
          if (this.$refs[ref].length > 0) {
            this.$refs[ref][0].$el.classList.remove("active");
          }
        }
      }
      this.$refs["diemchay" + id][0].$el.classList.toggle("active");
      this.currentDiemChay = this.diemchays.find(item => item.id == id);
      this.tinh_thanh_id = this.currentDiemChay.tinh_thanh_id;
      this.tinh_thanh_id_dv = this.currentDiemChay.tinh_thanh_id;
      this.tinh_thanh_id_f = this.tinh_thanh_id;
      this.tinh_thanh_id_f_dv = this.tinh_thanh_id;
      this.getPhuongTienPcccDonViHoTro(id);
      this.xe = true;
      // await this.getData();

      this.show = true;
    },

    async xuLyChay(diemchay) {
      this.realtimeViTriXe(null, true);
      (this.ket_thuc_xu_ly = true), (this.loading = true);
      this.loadingXlc = true;
      diemchay.trang_thai = "da_xu_ly";
      var lat = diemchay.lat;
      var long = diemchay.long;
      diemchay.thoi_gian_bat_dau_xu_ly = "bat_dau_xu_ly_chay";
      let res = await updateDiemChay(diemchay.id, diemchay);
      this.nuoc = true;
      this.xe = true;
      this.loading = false;
      delete diemchay.thoi_gian_bat_dau_xu_ly;
      if (diemchay.phuong_tien_pccc.length == 0) {
        var donvi = res.data.donvi;
        this.$refs.map.hideItinerary();
        this.$refs.map.getRoute(donvi.lat, donvi.long, lat, long);
        // this.loadingXlc = false;
      } else {
        let index = this.phuongtienpcccs2.findIndex(
          phuongtien => phuongtien.id == diemchay.phuong_tien_pccc[0].id
        );
        await this.chiDuongXe(index, true);
        this.realtimeViTriXe(index);
        // this.loadingXlc = false;
      }
    },
    realtimeViTriXe(index = null, stop = null) {
      if (stop) {
        clearInterval(this.realtime);
        return;
      }
      this.realtime = setInterval(() => this.chiDuongXe(index, false), 100000);
    },
    getPhuongTienPcccDonViHoTro(id) {
      Promise.all([getDonViHoTro(id), getPhuongTienPccc(id)]).then(result => {
        this.phuongtienpcccs = result[1].data;
        this.donvihotros = result[0].data;
        this.phuongtienpcccsFilted = this.phuongtienpcccs;
        this.donvihotrosFilted = this.donvihotros;
        this.locXe();
        this.locDonVi();
        this.loadPtccc = false;
      });
    },
    async updatePhuongTienPccc(id, mode) {
      await updatePhuongTienPccc(this.currentDiemChay.id, { mode, id });
      let index = this.phuongtienpcccs.findIndex(
        phuongtien => phuongtien.id == id
      );
      let index2 = this.phuongtienpcccs2.findIndex(
        phuongtien => phuongtien.id == id
      );
      if (mode == "add") {
        this.phuongtienpcccs[index].status = true;
        this.currentDiemChay.phuong_tien_pccc.push(this.phuongtienpcccs[index]);
        await this.chiDuongXe(index2, true);
        this.realtimeViTriXe(index2);
      } else {
        this.phuongtienpcccs[index].status = false;
        this.currentDiemChay.phuong_tien_pccc.splice(
          this.currentDiemChay.phuong_tien_pccc.findIndex(
            item => item.id == this.phuongtienpcccs[index].id
          ),
          1
        );
        this.realtimeViTriXe(null, true);
        let i = this.currentDiemChay.phuong_tien_pccc.findIndex(
          item => item.id == this.phuongtienpcccs[index].id
        );
        this.$refs.map.hideItinerary(i);
      }
    },
    async updateDonViHoTro(id, mode) {
      await updateDonViHoTro(this.currentDiemChay.id, { mode, id });
      let index = this.donvihotros.findIndex(donvi => donvi.id == id);
      if (mode == "add") {
        this.donvihotros[index].status = true;
      } else {
        this.donvihotros[index].status = false;
      }
    },
    setView(id) {
      let xe = this.phuongtienpcccs2.find(item => item.id == id);
      this.$refs.map.setView(xe.lat, xe.long);
    },
    async chiDuongXe(index, fit = true) {
      this.xe = true;
      if (this.checkboxGroup1.findIndex(el => el == "Xe") !== -1) {
        this.checkboxGroup1.splice(this.checkboxGroup1.findIndex(el => el == "Xe"), 1);
      }
      if (this.checkboxGroup1.findIndex(el => el == "Xe") == -1) {
        this.checkboxGroup1.push("Xe");
      }
      let dataXe = await getData({ filter: ["Xe"] });
      this.phuongtienpcccs2 = dataXe.data.xe;

      let phuongTienPccc = this.phuongtienpcccs2[index];
      let data = await getViTriPhuongTienPccc(phuongTienPccc.imei);
      let tmp = [...this.phuongtienpcccs2];
      tmp[index]["lat"] = data.data.lat;
      tmp[index]["long"] = data.data.long;
      this.phuongtienpcccs2 = [...tmp];
      if (
        this.currentDiemChay.lat != undefined &&
        this.currentDiemChay.long != undefined
      ) {
        this.$refs.map.hideItinerary(index);
        // this.$refs.map.realTimeXe(phuongTienPccc.imei, data)
        this.$refs.map.getRoute(
          data.data.lat,
          data.data.long,
          this.currentDiemChay.lat,
          this.currentDiemChay.long,
          fit,
          index
        );
        this.$refs.map.realTimeXe(this.phuongtienpcccs2);
      }
    },
    realtimeViTriXe(index = null, stop = null) {
      if (stop) {
        clearInterval(this.realtime);
        return;
      }
      this.realtime = setInterval(() => this.chiDuongXe(index, false), 10000);
    },
    async updatePhuongTienPccc(id, mode) {
      let index = this.phuongtienpcccs.findIndex(
        phuongtien => phuongtien.id == id
      );
      let index2 = this.phuongtienpcccs2.findIndex(
        phuongtien => phuongtien.id == id
      );
      if (index2 == -1 && mode == "add") {
        await this.$confirm(
          "Hiện không xác định được vị trí của xe này. Bạn vẫn muốn phân công chứ?",
          "Cảnh báo",
          {
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
            type: "warning"
          }
        );
        await updatePhuongTienPccc(this.currentDiemChay.id, {
          mode,
          id
        });
      }
      await updatePhuongTienPccc(this.currentDiemChay.id, { mode, id });
      if (mode == "add") {
        this.phuongtienpcccs[index].status = true;
        this.currentDiemChay.phuong_tien_pccc.push(this.phuongtienpcccs[index]);
        if (index2 != -1) {
          this.$refs.map.hideItinerary();
          clearInterval(this.realtime);
          await this.chiDuongXe(index2, true);
          this.realtimeViTriXe(index2);
        }
      } else {
        this.phuongtienpcccs[index].status = false;
        this.currentDiemChay.phuong_tien_pccc.splice(
          this.currentDiemChay.phuong_tien_pccc.findIndex(
            item => item.id == this.phuongtienpcccs[index].id
          ),
          1
        );
        if (index2 != -1) {
          let index = this.phuongtienpcccs2.findIndex(item => item.id == id);
          this.$refs.map.hideItinerary(index);
          clearInterval(this.realtime);
        }
      }
    },
    async updateDonViHoTro(id, mode) {
      await updateDonViHoTro(this.currentDiemChay.id, { mode, id });
      let index = this.donvihotros.findIndex(donvi => donvi.id == id);
      if (mode == "add") {
        this.donvihotros[index].status = true;
      } else {
        this.donvihotros[index].status = false;
      }
    },
    playSound(mode) {
      if (mode == "play") {
        this.audio.play();
        this.sound = true;
      } else {
        this.audio.pause();
        this.sound = false;
      }
    },
    async getAllPhuongTienPccc() {
      let data = await index();
      this.phuongtienpcccs2 = data.data;
    },
    async chiDuongXeDuocChon(id) {
      let index = this.phuongtienpcccs2.findIndex(item => item.id == id);
      if (index == -1) {
        this.$message.error(
          "Không thể chỉ đường do không xác định được vị trí của xe"
        );
        return;
      }
      clearInterval(this.realtime);
      await this.chiDuongXe(index, true);
      this.realtimeViTriXe(index);
    }
  },
  created() {
    this.getTinhThanh();
    var db = firebase2.database();
    var eadsRef = firebase2.database().ref("diem_chay");
    var controller = this;
    this.nuoc = true;
    eadsRef
      .endAt()
      .limitToLast(1)
      .on("child_added", function(snapshot) {
        controller.getDiemChay();
      });
    if (this.diemlaynuocs.length == 0 || !this.diemlaynuocs) {
      getData({ filter: ["Nước"] }).then(res => {
        this.diemlaynuocs = res.data.nuoc;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  padding: 2px;
}

.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.leaflet-control-layers {
  &:hover {
    .leaflet-control-layers-list {
      display: table;
    }

    .leaflet-control-layers-toggle {
      display: none;
    }
  }
}

.wrapper {
  .ten {
    font-weight: bold;
    font-size: 12px;
  }
}

.scroll {
  max-height: 850px;
  overflow-y: auto;
}

.scroll2 {
  max-height: 300px;
  overflow-y: auto;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #f5f5f5;
}

.el-collapse-item__header {
  font-size: 20px !important;
}

::-webkit-scrollbar {
  width: 7px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #bfc9ca;
}

.chi-tiet-wrapper {
  background: white;
  z-index: 9999;
  margin-top: 10px;
  display: none;
}

.show {
  display: block;
}

.leaflet-control-layers-toggle {
  height: 42px !important;
  width: 42px !important;
}

.active {
  background: #ff6c5c !important;
}

.el-card__body {
  padding: 10px !important;
}

ul li {
  font-size: 14px;
}

.ten-diem-chay {
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}

.thong-tin-diem-chay {
  font-size: 13px;
  margin-top: 10px;
  color: #ecf0f1;
}

.icon-fire {
  font-size: 45px;
}

.diem-chay {
  border-radius: 10px;
  margin-bottom: 10px;
  background: #1f618d;
  // border-left: 9px solid #935116;
}
//res
@media (max-width: 992px) {
  .diem-chay {
    text-align: center;
  }
}
</style>
