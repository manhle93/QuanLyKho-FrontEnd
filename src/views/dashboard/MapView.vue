<template>
  <div class="dashboard-map-container" id="dashboard-map-container">
    <div class="dashboard-map" id="dashboard-map">
      <p
        v-if="!them"
        style="color: deepskyblue; position:absolute;z-index:999999999999;left: 35%;background-color: white;font-weight: 500; font-size: 21px"
      >Chọn một địa điểm trên bản đồ</p>
      <el-button
        type="primary"
        icon="el-icon-menu"
        style=" position:absolute;z-index:9999999999999999999;margin-top:100px;margin-left:7px"
        circle
        @click="toggle"
      ></el-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getAddressByLatLong, getLatLongByAddressText } from "@/api/TinhThanh";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.gridlayer.googlemutant";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./L.Polyline.SnakeAnim";
import { getDonViPccc, allDonViPcccOnMap } from "@/api/donvipccc";
import { getPolygol } from "@/api/TinhThanh";
import "leaflet-routing-machine/dist/leaflet-routing-machine.js";
import "leaflet-rotatedmarker";
import "leaflet-control-geocoder";
import "lrm-graphhopper";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import DiemLayNuocPopup from "./DiemLayNuocPopup";
import XePopup from "./XePopup";
import DonViPopup from "./DonViPopup";
import ToaNhaPopup from "./ToaNhaPopup";
import CameraPopup from "./CameraPopup";
var map = {};
let markerDiemChayGroup = {};
let markerDonViGroup = {};
let markerNuocGroup = {};
let markerCameraGroup = {};
let markerToaNhaGroup = {};
let markerXeGroup = {};
let diem_chays = [];
let phuong_tiens = [];
let toa_nhas = [];
let diem_lay_nuocs = [];
let don_vis = [];
let thiet_bi_quays = [];
export const CameraPopupComp = new Vue(CameraPopup).$mount();

export const ToaNhaPopupComp = new Vue(ToaNhaPopup).$mount();
export const XePopupComp = new Vue(XePopup).$mount();
export const DiemLayNuocPopupComp = new Vue(DiemLayNuocPopup).$mount();
export const DonViPopupComp = new Vue(DonViPopup).$mount();
const cameraPopup = L.popup().setContent(CameraPopupComp.$el);
const toaNhaNuocPopup = L.popup().setContent(ToaNhaPopupComp.$el);
const xePopup = L.popup().setContent(XePopupComp.$el);
const diemLayNuocPopup = L.popup().setContent(DiemLayNuocPopupComp.$el);
const donViPopup = L.popup().setContent(DonViPopupComp.$el);

export default {
  name: "tracking-map",
  data() {
    return {
      googleLayer: null,
      them: true,
      timeout: null,
      map: null,
      marker: null,
      search: null,
      layerGroup: [],
      polyline: [],
      router: null,
      routing: [],
      dataAddresses: [],
      myIcon: null,
      myDiemChayIcon: null,
      myXeIcon: null,
      myToaNhaIcon: null,
      myDonViIcon: null,
      myNuocIcon: null,
      myCameraIcon: null,
      roadLayer: null,
      imgLayer: null,
      diemlaynuocs: [],
      toanhas: [],
      xeRealTime: null,
      PhuongTienGroup: [],
      markerPt: []
    };
  },
  props: {
    dataDiemLayNuocs: {
      type: Array
    },
    points: {
      type: Array
    },
    // diemlaynuocs: {
    //   type: Array
    // },
    phuongtienpcccs2: {
      type: Array
    },
    diemchays: {
      type: Array
    },
    thietbiquays: {
      type: Array
    },
    dataToaNhas: {
      type: Array
    },
    currentDiemChay: {
      type: Object
    },
    markerItem: {
      type: Object
    },
    htdc: {
      type: Boolean
    },
    satellite: {
      type: Boolean
    }
  },

  watch: {
    satellite() {
      if (this.satellite == false) {
        if (this.imgLayer) {
          this.map.removeLayer(this.imgLayer);
        }

        this.roadLayer = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            subdomains: ["a", "b", "c"],
            zoomControl: false,
            attributionControl: false
          }
        );
        this.roadLayer.addTo(this.map);
      } else {
        if (this.roadLayer) {
          this.map.removeLayer(this.roadLayer);
        }

        this.imgLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            maxZoom: 19,
            zoomControl: false,
            attributionControl: false
          }
        );
        this.imgLayer.addTo(this.map);
      }
    },
    currentDiemChay(val) {
      this.map.setView([val.lat, val.long], 18);
    },
    markerItem(val) {
      if (val) this.setMarker(val);
    },
    htdc(val) {
      if (!val) {
        this.taoDiemChay();
        this.them = false;
      } else {
        this.xoaDiemChay();
      }
    },
    toanhas(val) {
      if (val.length == 0 && toa_nhas.length > 0) {
        toa_nhas.forEach(el => {
          this.map.removeLayer(el);
        });
        toa_nhas = [];
      } else {
        var controller = this;
        let i = 0;
        toa_nhas.forEach(el => {
          this.map.removeLayer(el);
        });
        toa_nhas = [];
        val.forEach(function(element) {
          toa_nhas[i] = L.marker([element.lat, element.long], {
            icon: controller.myToaNhaIcon,
            draggable: false
          })
            .bindPopup(toaNhaNuocPopup, {
              maxWidth: 200,
              minWidth: 200
            })
            .on("click", function(event) {
              ToaNhaPopupComp.order = element;
            })
            .addTo(controller.map);
          i = i + 1;
        });
      }
      // markerToaNhaGroup.clearLayers();
    },
    thietbiquays(val) {
      if (val.length == 0 && thiet_bi_quays.length > 0) {
        thiet_bi_quays.forEach(el => {
          this.map.removeLayer(el);
        });
        thiet_bi_quays = [];
      } else if (val.length > 0 && thiet_bi_quays.length == 0) {
        let i = 0;
        var controller = this;
        val.forEach(function(element) {
          thiet_bi_quays[i] = L.marker([element.lat, element.long], {
            icon: controller.myCameraIcon,
            draggable: false,
            autoClose: false
          })
            .bindPopup(cameraPopup, {
              maxWidth: 1000,
              minWidth: 400
            })
            .on("click", function(event) {
              CameraPopupComp.order = element;
              CameraPopupComp.view();
            })
            .on("popupclose", function() {
              CameraPopupComp.dispose();
            })
            .addTo(controller.map);
          i = i + 1;
        });
      }
    },
    // phuongtienpcccs2(val) {
    //   if (val.length == 0 && phuong_tiens.length > 0) {
    //     phuong_tiens.forEach(el => {
    //       this.map.removeLayer(el);
    //     });
    //     phuong_tiens = [];
    //   } else if (val.length > 0 && phuong_tiens.length == 0) {
    //     var controller = this;
    //     let i = 0;
    //     var markers = new L.MarkerClusterGroup({
    //       iconCreateFunction: function(cluster) {
    //         var markers = cluster.getAllChildMarkers();
    //         var html =
    //           '<div class="circle">' +
    //           '<span class="soXe">' +
    //           markers.length +
    //           "</span>" +
    //           "</div>";
    //         return L.divIcon({
    //           html: html,
    //           className: "mycluster"
    //           // iconSize: L.point(32, 32)
    //         });
    //       }
    //     });
    //     val.forEach(function(element) {
    //       phuong_tiens[i] = L.marker([element.lat, element.long], {
    //         icon: controller.myXeIcon,
    //         imei: element.imei,
    //         draggable: false,
    //         rotationAngle: element.huong
    //       })
    //         .bindPopup(xePopup, { maxWidth: 200, minWidth: 200 })
    //         .on("click", function(event) {
    //           XePopupComp.order = element;
    //         });
    //       markers.addLayer(phuong_tiens[i]);
    //       i = i + 1;
    //     });
    //     this.map.addLayer(markers);
    //   }
    // },

    phuongtienpcccs2(val) {
      if (val.length == 0 && phuong_tiens.length > 0) {
        this.markerPt.removeLayers(this.PhuongTienGroup);
        phuong_tiens = [];
        this.PhuongTienGroup = [];
      } else if (val.length > 0 && phuong_tiens.length == 0) {
        var controller = this;
        let i = 0;
        this.markerPt = new L.MarkerClusterGroup({
          iconCreateFunction: function(cluster) {
            var markers = cluster.getAllChildMarkers();
            var html =
              '<div class="circle">' +
              '<span class="soXe">' +
              markers.length +
              "</span>" +
              "</div>";
            return L.divIcon({
              html: html,
              className: "mycluster"
              // iconSize: L.point(32, 32)
            });
          }
        });
        val.forEach(function(element) {
          phuong_tiens[i] = L.marker([element.lat, element.long], {
            icon: controller.myXeIcon,
            imei: element.imei,
            draggable: false,
            rotationAngle: element.huong
          })
            .bindPopup(xePopup, { maxWidth: 200, minWidth: 200 })
            .on("click", function(event) {
              XePopupComp.order = element;
            });
          controller.PhuongTienGroup.push(phuong_tiens[i]);
          i = i + 1;
        });
        this.markerPt.addLayers(this.PhuongTienGroup);
        this.map.addLayer(this.markerPt);
      }
    },

    diemchays(val) {
      var controller = this;
      let i = 0;
      val.forEach(function(element) {
        diem_chays[i] = L.marker([element.lat, element.long], {
          icon: controller.myDiemChayIcon,
          draggable: false
        })
          .on("click", function() {
            controller.$emit("clickDiemChay", element.id);
          })
          .addTo(controller.map);
        i = i + 1;
      });
    },
    dataDiemLayNuocs() {
      this.getMapDiemLayNuoc();
    },
    dataToaNhas() {
      this.getMapToaNha();
    },
    diemlaynuocs(val) {
      if (val.length == 0 && diem_lay_nuocs.length > 0) {
        diem_lay_nuocs.forEach(el => {
          this.map.removeLayer(el);
        });
        diem_lay_nuocs = [];
      } else {
        var controller = this;
        let i = 0;
        diem_lay_nuocs.forEach(el => {
          this.map.removeLayer(el);
        });
        diem_lay_nuocs = [];
        val.forEach(function(element) {
          diem_lay_nuocs[i] = L.marker([element.lat, element.long], {
            icon: controller.myNuocIcon,
            draggable: false
          })
            .bindPopup(diemLayNuocPopup, {
              maxWidth: 200,
              minWidth: 200
            })
            .on("click", function(event) {
              DiemLayNuocPopupComp.order = element;
            })
            .addTo(controller.map);
          i = i + 1;
        });
      }
    },
    search(val) {
      if (val != "" && val != null) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          document.getElementById("suggest").style.display = "table";
          document.getElementById("suggest").style.backgroundColor = "white";
          this.getLatLng(val);
        }, 500);
      } else {
        this.dataAddresses = [];
        document.getElementById("suggest").style.display = "none";
      }
    }
  },
  methods: {
    toggle() {
      this.map._onResize();
      this.$emit("toggle");
    },
    async getDonVi() {
      var controller = this;
      let donvi = await allDonViPcccOnMap();
      donvi.forEach(function(element) {
        let icon_url = "";
        if (element.avatar_url) {
          icon_url = process.env.VUE_APP_BASE + "/" + element.avatar_url;
        } else {
          icon_url =
            process.env.VUE_APP_BASE + "/storage/images/avatar/firehat.png";
        }
        controller.map.addLayer(
          L.marker([element.lat, element.long], {
            icon: L.icon({
              iconUrl: icon_url,
              iconSize: [50, 50]
            }),
            draggable: false
          })
            .bindPopup(donViPopup, { minWidth: 220, maxWidth: 200 })
            .on("click", function(event) {
              DonViPopupComp.order = element;
            })
        );
      });
      this.resetMap(this.map);
    },
    async polygonQL() {
      let tinhthanh = await getPolygol();
      if (tinhthanh.data) {
        var geo = L.geoJSON(JSON.parse(tinhthanh.data.st_asgeojson), {
          style: function() {
            return { color: "#a96f9a" };
          }
        }).addTo(this.map);
        this.map.fitBounds(geo.getBounds());
      }
    },
    deleteMarker() {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
    },
    setMarker(item) {
      document.getElementById("suggest").style.display = "none";
      this.deleteMarker();
      var lat = item.lat;
      var lng = item.long;
      this.$emit("getAddress", {
        lat: lat,
        lng: lng,
        address: item.full_name
      });
      this.map.setView([lat, lng], 15);
      this.makeMarker([lat, lng]);

      this.search = null;
      this.dataAddresses = [];
    },
    taoDiemChay() {
      this.them = false;
      // if (this.routing) {
      //   this.map.removeControl(this.routing);
      // }
      this.map.on("click", e => {
        this.deleteMarker();
        this.makeMarker(e.latlng);
      });
    },
    makeMarker(latlng) {
      var controler = this;
      this.marker = new L.Marker(latlng, {
        icon: this.myIcon,
        draggable: true
      });

      var latlon = this.marker.getLatLng();
      controler.getAddress(latlon.lat, latlon.lng);
      this.marker.addTo(this.map);
      this.marker.on("dragend", function(event) {
        latlon = this.getLatLng();
        controler.getAddress(latlon.lat, latlon.lng);
      });
    },
    removeDiemChay(lat, long) {
      let dc = diem_chays.find(
        el => el._latlng.lat == lat && el._latlng.lng == long
      );
      if (dc) {
        this.map.removeLayer(dc);
      }
    },
    xoaDiemChay() {
      this.them = true;
      var controler = this;
      this.deleteMarker();
      this.map.off("click");
    },
    getAddress(lat, lng) {
      // var controller = this;
      // getAddressByLatLong({ lat: lat, long: lng }).then(res => {
      //   if (res[0]) {
      //     controller.$emit("getAddressByLatLong", {
      //       lat: lat,
      //       long: lng,
      //       dia_chi: res[0].street
      //     });
      //   } else {
      //     controller.$emit("getAddressByLatLong", {
      //       lat: lat,
      //       long: lng,
      //       dia_chi: ""
      //     });
      //   }
      // });

      axios
        .get(
          "http://mapapi.imagetrekk.ai/geocoding/reverse?lat=" +
            lat +
            "&lng=" +
            lng +
            "&api_key=FyMKEwsMQFBvVNOCVCxMpKACwkSyCl"
        )
        .then(res => {
          //console.log(res.data);
          this.$emit("getAddressByLatLong", {
            lat: lat,
            long: lng,
            dia_chi: res.data.full_name
          });
        });
    },
    getLatLng(search) {
      getLatLongByAddressText({ search: search }).then(res => {
        this.dataAddresses = res;
        if (res == null || res == []) {
          document.getElementById("suggest").style.display = "none";
        }
      });
    },
    getMap(lat = 21.005796351058695, lng = 105.8465337753296) {
      var controler = this;
      this.map = L.map("dashboard-map").setView([lat, lng], 15);
      let roadLayer = L.tileLayer(
        // "http://127.0.0.1:8080/styles/basic/{z}/{x}/{y}.png",
        "http://localhost:8080/styles/basic/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          subdomains: ["a", "b", "c"],
          zoomControl: false,
          attributionControl: false
        }
      );
      roadLayer.addTo(this.map);

      this.myIcon = L.icon({
        iconUrl:
          "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
        iconSize: [35, 35]
      });
      this.myDiemChayIcon = L.icon({
        iconUrl:
          // "http://pcccapi.howizbiz.com/storage/images/avatar/1583122975.gif",
          "http://pcccapi.howizbiz.com/storage/images/avatar/1589941433.gif",
        iconSize: [50, 60]
      });
      this.myNuocIcon = L.icon({
        iconUrl:
          "http://img.clipartlook.com/fire-hydrant-free-clipart-fire-hydrant-clip-art-400_400.png",
        iconSize: [35, 35]
      });

      this.myDonViIcon = L.icon({
        iconUrl:
          "http://pcccapi.howizbiz.com/storage/images/avatar/firehat.png",
        iconSize: [50, 50]
      });
      this.myToaNhaIcon = L.icon({
        iconUrl:
          // "http://www.iconarchive.com/download/i103361/paomedia/small-n-flat/building.ico",
          "http://pcccapi.howizbiz.com/storage/images/avatar/1587702789.png",
        iconSize: [25, 25]
      });
      this.myCameraIcon = L.icon({
        iconUrl:
          "http://pcccapi.howizbiz.com/storage/images/avatar/1587702850.png",
        iconSize: [40, 40]
      });
      this.myXeIcon = L.icon({
        iconUrl:
          "http://pcccapi.howizbiz.com/storage/images/avatar/1590130827.png",
        iconSize: [40, 30]
      });
      this.marker = new L.Marker([lat, lng], {
        icon: this.myIcon,
        draggable: true
      });
      document
        .getElementsByClassName("leaflet-control-attribution")[0]
        .firstChild.remove();
      var a = document.createElement("a");
      a.href = "http://skymapglobal.vn/";
      a.text = "Skymap";
      document
        .getElementsByClassName("leaflet-control-attribution")[0]
        .append(a);
    },
    getRoute(latStart, lonStart, latEnd, lonEnd, fit = true, index) {
      // if (this.routing[index]) {
      //   this.map.removeControl(this.routing[index]);
      // }
      var color = [
        "#3367D6",
        "#6C3483",
        "#BA4A00",
        "#A93226",
        "#212F3C",
        "#145A32 ",
        "#BA4A00"
      ];
      this.routing[index] = L.Routing.control({
        waypoints: [L.latLng(latStart, lonStart), L.latLng(latEnd, lonEnd)],
        router: L.Routing.graphHopper(undefined /* no api key */, {
          serviceUrl: "http://skymapglobal.vn:1234/route",
          urlParameters: { locale: "vi_VN" }
        }),
        lineOptions: {
          styles: [
            {
              color: index <= color.length ? color[index] : "#145A32",
              opacity: 1,
              weight: 5
            }
          ]
        },
        show: true,
        fitSelectedRoutes: fit
      });
      this.routing[index].addTo(this.map);
      for (var i = 0; i <= this.routing.length; i++) {
        // ẩn thông báo chỉ đường
        if (i != index && this.routing[i] != undefined) {
          this.routing[i].hide();
        }
      }
    },
    realTimeXe(data) {
      if (this.PhuongTienGroup.length > 0 && data.length > 0 && this.markerPt) {
        this.markerPt.removeLayers(this.PhuongTienGroup);
        phuong_tiens = [];
        this.PhuongTienGroup = [];
      }
      if (data.length > 0) {
        var controller = this;
        let i = 0;
        this.markerPt = new L.MarkerClusterGroup({
          iconCreateFunction: function(cluster) {
            var markers = cluster.getAllChildMarkers();
            var html =
              '<div class="circle">' +
              '<span class="soXe">' +
              markers.length +
              "</span>" +
              "</div>";
            return L.divIcon({
              html: html,
              className: "mycluster"
            });
          }
        });
        data.forEach(function(element) {
          phuong_tiens[i] = L.marker([element.lat, element.long], {
            icon: controller.myXeIcon,
            imei: element.imei,
            draggable: false,
            rotationAngle: (element.huong + 90)
          })
            .bindPopup(xePopup, { maxWidth: 200, minWidth: 200 })
            .on("click", function(event) {
              XePopupComp.order = element;
            });
          controller.PhuongTienGroup.push(phuong_tiens[i]);
          i = i + 1;
        });
        this.markerPt.addLayers(this.PhuongTienGroup);
        this.map.addLayer(this.markerPt);
      }

      // let indexPT = phuong_tiens.findIndex(el => el.options.imei === imei);
      // var xe = phuong_tiens.find(el => el.options.imei == imei);
      // if (xe) {
      //   setTimeout(() => {
      //     this.map.removeLayer(xe);
      //   }, 1000);
      //   phuong_tiens[indexPT] = L.marker([data.data.lat, data.data.long], {
      //     icon: this.myXeIcon,
      //     imei: imei,
      //     draggable: false,
      //     rotationAngle: (data.data.huong + 90)
      //   })
      //     .bindPopup(xePopup, { maxWidth: 200, minWidth: 200 })
      //     .on("click", function(event) {
      //       XePopupComp.order = element;
      //     })
      //     .addTo(this.map);
      // }
    },
    hideItinerary(index) {
      if (this.routing[index]) {
        this.map.removeControl(this.routing[index]);
      }
    },
    setView(latStart, lonStart) {
      this.map.setView(new L.LatLng(latStart, lonStart), 19);
    },
    resetMap(map) {
      map.invalidateSize();
    },
    getBoundsPolygon(bounds, zoomLevel) {
      let pointArray = [];
      var center = bounds.getCenter();
      pointArray.push(bounds.getSouthWest()); //bottom left
      pointArray.push({ lat: bounds.getSouth(), lng: center.lng }); //bottom center
      pointArray.push(bounds.getSouthEast()); //bottom right
      pointArray.push({ lat: center.lat, lng: bounds.getEast() }); // center right
      pointArray.push(bounds.getNorthEast()); //top right
      pointArray.push({
        lat: bounds.getNorth(),
        lng: this.map.getCenter().lng
      }); //top center
      pointArray.push(bounds.getNorthWest()); //top left
      pointArray.push({
        lat: this.map.getCenter().lat,
        lng: bounds.getWest()
      }); //center left
      let geoPoly = {
        type: "Polygon",
        coordinates: [
          [
            [bounds.getNorthWest().lng, bounds.getNorthWest().lat],
            [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
            [bounds.getSouthEast().lng, bounds.getSouthEast().lat],
            [bounds.getSouthWest().lng, bounds.getSouthWest().lat]
          ]
        ]
      };
      // this.$emit("getDL", geoPoly, zoomLevel);
    },
    getDSDiemNuoc(soLuong) {
      let bounds = this.map.getBounds();
      let zoomLevel = this.map.getZoom();
      this.getBoundsPolygon(bounds, zoomLevel);
      if (soLuong) {
        const temp = this.dataDiemLayNuocs.filter(el =>
          bounds.contains([Number(el.lat), Number(el.long)])
        );
        if (soLuong > temp.length) {
          this.diemlaynuocs = temp;
        } else {
          const range = Math.round(temp.length / soLuong);

          this.diemlaynuocs = temp.filter((_, index) => index % range === 0);
        }
      } else {
        this.diemlaynuocs = this.dataDiemLayNuocs.filter(el =>
          bounds.contains([Number(el.lat), Number(el.long)])
        );
      }
    },
    getDSToaNha(soLuong) {
      let bounds = this.map.getBounds();
      if (soLuong) {
        const temp = this.dataToaNhas.filter(el =>
          bounds.contains([Number(el.lat), Number(el.long)])
        );
        if (soLuong > temp.length) {
          this.toanhas = temp;
        } else {
          const range = Math.round(temp.length / soLuong);
          this.toanhas = temp.filter((_, index) => index % range === 0);
        }
      } else {
        this.toanhas = this.dataToaNhas.filter(el =>
          bounds.contains([Number(el.lat), Number(el.long)])
        );
      }
    },
    getMapDiemLayNuoc() {
      let zoomLevel = this.map.getZoom();

      if (this.dataDiemLayNuocs.length == 0) {
        this.diemlaynuocs = [];
        return;
      }
      if (zoomLevel >= 17) {
        this.getDSDiemNuoc();
      }

      if (zoomLevel < 17 && zoomLevel >= 15) {
        this.getDSDiemNuoc(150);
      }
      if (zoomLevel < 15 && zoomLevel >= 13) {
        this.getDSDiemNuoc(150);
      }

      if (zoomLevel < 13 && zoomLevel >= 11) {
        this.getDSDiemNuoc(150);
      }
      if (zoomLevel < 11 && zoomLevel >= 9) {
        this.getDSDiemNuoc(150);
      }
      if (zoomLevel < 9 && zoomLevel >= 7) {
        this.getDSDiemNuoc(100);
      }
      if (zoomLevel < 7) {
        this.getDSDiemNuoc(100);
      }
    },
    refershMap() {
      this.map.invalidateSize();
    },
    getMapToaNha() {
      let zoomLevel = this.map.getZoom();
      if (this.dataToaNhas.length == 0) {
        this.toanhas = [];
        return;
      }
      if (zoomLevel >= 17) {
        this.getDSToaNha();
      }

      if (zoomLevel < 17 && zoomLevel >= 15) {
        this.getDSToaNha(150);
      }
      if (zoomLevel < 15 && zoomLevel >= 13) {
        this.getDSToaNha(150);
      }

      if (zoomLevel < 13 && zoomLevel >= 11) {
        this.getDSToaNha(150);
      }
      if (zoomLevel < 11 && zoomLevel >= 9) {
        this.getDSToaNha(150);
      }
      if (zoomLevel < 9 && zoomLevel >= 7) {
        this.getDSToaNha(100);
      }
      if (zoomLevel < 7) {
        this.getDSToaNha(100);
      }
    }
  },

  mounted() {
    this.getMap();
    this.map.off("click");
    this.map.on("zoomend", () => {
      this.getMapDiemLayNuoc();
      this.getMapToaNha();
    });
    this.map.on("moveend", () => {
      this.getMapDiemLayNuoc();
      this.getMapToaNha();
    });
    markerDiemChayGroup = L.markerClusterGroup().addTo(this.map);
    markerNuocGroup = L.markerClusterGroup().addTo(this.map);
    markerDonViGroup = L.markerClusterGroup().addTo(this.map);
    markerToaNhaGroup = L.markerClusterGroup().addTo(this.map);
    markerCameraGroup = L.markerClusterGroup().addTo(this.map);
    markerXeGroup = L.markerClusterGroup().addTo(this.map);
  },
  created() {
    this.polygonQL();
    this.getDonVi();
    this.nuoc = false;
  },
  components: {
    DiemLayNuocPopup,
    DonViPopup,
    ToaNhaPopup
  }
};
</script>

<style scoped>
.dashboard-map-container {
  min-width: 0;
  min-height: 0;
  flex: 1;
  height: 100%;
}
.dashboard-map {
  width: 100%;
  height: 100%;
  position: relative;
}

#boxsearch {
  border: none;
  border-bottom: 2px solid #409eff;
  padding: 10px 5px;
  position: absolute;
  top: 10px;
  right: 170px;
  width: 400px;
  z-index: 999999999999999;
}

#suggest {
  position: absolute;
  right: 170px;
  top: 51px;
  z-index: 99999999999;
  width: 400px;
}

#suggest ul {
  list-style: none;
  padding-left: 0px;
  margin-top: 0px;
}

#suggest ul li:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}

.fa-search {
  position: absolute;
  right: 20px;
  z-index: 999999999999;
  bottom: 475px;
  color: #409eff;
  font-size: 18px;
}

#them-toa-nha {
  position: absolute;
  top: 10px;
  z-index: 99999;
  right: 25px;
}

#xoa-toa-nha {
  position: absolute;
  top: 10px;
  z-index: 99999;
  right: 25px;
}

.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  background: #fff;
  color: #333;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
}

.leaflet-popup-content {
  width: 100px;
  height: 200px;
}
</style>
<style lang="scss">
.circle {
  height: 30px;
  width: 40px;
  background-image: url("http://pcccapi.howizbiz.com/storage/images/avatar/1587545941.png");
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.soXe {
  font-size: 18px;
  z-index: 999;
  color: white;
  font-weight: bold;
}
.leaflet-routing-container-hide {
  display: none;
}
</style>
