<template>
  <div id="dashboard-map-container" class="dashboard-map-container">
    <div id="dashboard-map" class="dashboard-map" />
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./L.Polyline.SnakeAnim";
import { getAddressByLatLong, getLatLongByAddressText } from "@/api/TinhThanh";
import axios from "axios";
import { getThietbiTinhThanh, getTrangThaiThietBi, getPolygol } from "@/api/baocao";
import Axios from "axios";


var map = {};
const markerGroup = {};

export default {
  name: "TrackingMap",

  components: {},
  data() {
    return {
      timeout: null,
      map: null,
      showTinh: [],
      marker: null,
      search: null,
      layerGroup: [],
      polyline: [],
      router: null,
      dataAddresses: [],
      myIconSmall: null,
      myIconMini: null,
      myIconMedium: null,
      myIconBig: null,
      dataPoints: null, 
      geo: []
    };
  },

  mounted() {
    this.getMap();
  },

  methods: {
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
    makeMarker(latlng) {
      var controler = this;
      this.marker = new L.Marker(latlng, {
        icon: this.myIcon,
        draggable: true
      }).addTo(this.map);
    },
    getAddress(lat, lng) {
      axios
        .get(
          "http://mapapi.imagetrekk.ai/geocoding/reverse?lat=" +
            lat +
            "&lng=" +
            lng
        )
        .then(res => {
          this.$emit("getAddress", {
            lat: lat,
            lng: lng,
            address: res.data.full_name
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
    resetMap(lat, lng) {
      this.map.flyTo(new L.LatLng(lat, lng), 6);
      if (this.showTinh.length > 0) {
        this.map.removeLayer(this.showTinh[0]);
      }
      this.showTinh = [];
    },
    async polygonQL(tinhthanhId) {
      if(this.geo[0]){
        this.map.removeLayer(this.geo[0])
      }
      let tinhthanh = await getPolygol({tinh_thanh_id: tinhthanhId});
        if(this.geo[0]){
        this.map.removeLayer(this.geo[0])
      }
      if (tinhthanh.data) {
        this.geo = []
        this.geo[0] = L.geoJSON(JSON.parse(tinhthanh.data.st_asgeojson), {
          style: function() {
            return { color: "#a96f9a" };
          }
        }).addTo(this.map);
        // this.map.fitBounds(this.geo[0].getBounds()); // zoom lại map khi có polygon
      }
    },
    showTinhThanh(lat, lng, id) {
      this.map.flyTo(new L.LatLng(lat, lng), 11, {
        animate: true,
        pan: {
          duration: 1
        }
      });
      var iconShow = L.icon({
        iconUrl:
          "http://pcccapi.howizbiz.com/storage/images/avatar/1584756349.png",
        iconSize: [30, 30],
        fillOpacity: 0.7
      });

      if (this.showTinh.length > 0) {
        this.map.removeLayer(this.showTinh[0]);
      }
      this.showTinh = [];
      var tinh = this.dataPoints.filter(el => el.id == id);
      this.showTinh[0] = new L.Marker([lat, lng], {
        icon: iconShow,
        draggable: false,
        opacity: 0.7
      });
      this.showTinh[0].bindPopup(
        "<strong>" +
          [tinh[0].name] +
          "</strong><br>" +
          [tinh[0].so_thiet_bi] +
          " Thiết bị"
      );
      this.showTinh[0].addTo(this.map);
    },

    async getMap(lat = 16.509832826905846, lng = 105.55450354160845) {
      var controler = this;
      this.map = L.map("dashboard-map").setView([lat, lng], 6);
      var OpenStreetMap_Mapnik = L.tileLayer(
        "http://localhost:8080/styles/basic/{z}/{x}/{y}.png",
        {
          maxZoom: 20
        }
      ).addTo(this.map);

      this.myIconBig = L.icon({
        iconUrl:
          "http://pcccapi.howizbiz.com/storage/images/avatar/1582185760.png",
        iconSize: [100, 100],
        fillOpacity: 0.7
      });
      this.myIconMini = L.icon({
        iconUrl:
          "http://pcccapi.howizbiz.com/storage/images/avatar/1582185760.png",
        iconSize: [50, 50],
        fillOpacity: 0.7
      });
      this.myIconMedium = L.icon({
        iconUrl:
          "http://pcccapi.howizbiz.com/storage/images/avatar/1582185760.png",
        iconSize: [75, 75],
        fillOpacity: 0.7
      });
      this.myIconSmall = L.icon({
        iconUrl:
          "http://pcccapi.howizbiz.com/storage/images/avatar/1582185760.png",
        iconSize: [25, 25],
        fillOpacity: 0.7
      });

      getThietbiTinhThanh().then(
        data => {
          this.dataPoints = data;
          let max = 0;
          for (var item of this.dataPoints) {
            if (max < item.so_thiet_bi) {
              max = item.so_thiet_bi;
            }
          }
          for (var item of this.dataPoints) {
            if (max < item.so_thiet_bi) {
              max = item.so_thiet_bi;
            }
            if (item.so_thiet_bi > 0) {
              const latlng = JSON.parse(item.tam.st_asgeojson);
              const mak = new L.Marker(
                [latlng.coordinates[1], latlng.coordinates[0]],
                {
                  icon:
                    item.so_thiet_bi <= max / 4
                      ? this.myIconSmall
                      : item.so_thiet_bi > max / 4 &&
                        item.so_thiet_bi <= max / 2
                      ? this.myIconMini
                      : item.so_thiet_bi > max / 2 &&
                        item.so_thiet_bi <= (3 * max) / 4
                      ? this.myIconMedium
                      : this.myIconBig,
                  draggable: false,
                  opacity: 0.7
                }
              );
              mak.bindPopup(
                "<strong>" +
                  [item.name] +
                  "</strong><br>" +
                  [item.so_thiet_bi] +
                  " Thiết bị"
              );
              mak.addTo(this.map);
            }
          }
        }
      );
      var map = this.map;
      document
        .getElementsByClassName("leaflet-control-attribution")[0]
        .firstChild.remove();
      var a = document.createElement("a");
      a.href = "http://skymapglobal.vn/";
      a.text = "Skymap";
      document
        .getElementsByClassName("leaflet-control-attribution")[0]
        .append(a);
    }
  }
};
</script>

<style scoped>
.dashboard-map-container {
  min-width: 0;
  min-height: 0;
  flex: 1;
}

.dashboard-map {
  width: 100%;
  height: 100%;
}
#boxsearch {
  border: none;
  border-bottom: 2px solid #409eff;
  padding: 10px 5px;
  position: absolute;
  top: 10px;
  right: 50px;
  width: 400px;
  z-index: 999999999999999;
}
#suggest {
  position: absolute;
  right: 50px;
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

@media (max-width: 990px) {
  #boxsearch {
    width: 300px;
  }
}
@media (max-width: 768px) {
  #boxsearch {
    width: 260px;
  }
}
@media (max-width: 576px) {
  #boxsearch {
    width: 160px;
  }
}
</style>
