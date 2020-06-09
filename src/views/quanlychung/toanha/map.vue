<template>
  <div class="dashboard-map-container" id="dashboard-map-container">
    <input type="text" id="boxsearch" v-model="search" placeholder="Nhập địa chỉ cần tìm kiếm...." />
    <i class="fa fa-search"></i>
    <div id="suggest" style="display:none">
      <ul>
        <li
          style="padding:12px 0px 12px 10px"
          v-for="(item,index) in dataAddresses"
          @click="setMarker(item)"
        >
          <i class="fa fa-map-marker"></i>
          <a style="margin-left:5px">{{item.full_name}}</a>
        </li>
      </ul>
    </div>
    <div class="dashboard-map" id="dashboard-map"></div>
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

var map = {};
let markerGroup = {};

export default {
  name: "tracking-map",
  data() {
    return {
      timeout: null,
      map: null,
      marker: null,
      search: null,
      layerGroup: [],
      polyline: [],
      router: null,
      dataAddresses: [],
      myIcon: null
    };
  },
  props: {
    points: {
      type: Array
    },
    item: {
      type: Object
    }
  },
  watch: {
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
    getMap(lat = 21.005796351058695, lng = 105.8465337753296) {
      var controler = this;

      this.map = L.map("dashboard-map").setView([lat, lng], 18);

      var OpenStreetMap_Mapnik = L.tileLayer(
        // "https:{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        // "http:{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
        // "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", OKOK
        // "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
        // "http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png",
        // "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        "http://localhost:8080/styles/basic/{z}/{x}/{y}.png",

        {
          maxZoom: 20
        }
      ).addTo(this.map);
      this.myIcon = L.icon({
        iconUrl:
          "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
        iconSize: [35, 35]
      });
      this.marker = new L.Marker([lat, lng], {
        icon: this.myIcon,
        draggable: true
      });
      this.marker
        .bindPopup("<strong>" + [lat, lng] + "</strong>")
        .addTo(this.map);

      var map = this.map;
      this.map.on("click", e => {
        this.deleteMarker();
        this.marker = new L.Marker(e.latlng, {
          icon: this.myIcon,
          draggable: true
        });
        var latlon = this.marker.getLatLng();
        controler.getAddress(latlon.lat, latlon.lng);
        this.marker
          .bindPopup("<strong>" + e.latlng + "</strong>")
          .addTo(this.map);
        this.marker.on("dragend", function(event) {
          latlon = this.getLatLng();
          controler.getAddress(latlon.lat, latlon.lng);
        });
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
    }
  },

  mounted() {
    if (this.item && this.item.lat && this.item.long) {
      this.getMap(this.item.lat, this.item.long);
    } else {
      this.getMap();
    }
  },

  components: {}
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
  height: 500px;
}
#boxsearch {
  border: none;
  border-bottom: 2px solid #409eff;
  padding: 10px 5px;
  position: absolute;
  top: 220px;
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
  right: 70px;
  z-index: 999999999999;
  top: 230px;
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
