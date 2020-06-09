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
//   import 'leaflet.gridlayer.googlemutant'

// Marker Cluster
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./L.Polyline.SnakeAnim";
import axios from "axios";
import { getLatLongByAddressText } from "@/api/TinhThanh";

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
     item:{
      type:Object
    }
  },
  watch: {
    search(val) {
      //console.log(val);
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
      this.map.setView([lat, lng], 18);
      this.marker = new L.Marker([lat, lng], {
        icon: this.myIcon,
        draggable: true
      });
      this.marker
        .bindPopup("<strong>" + [lat, lng] + "</strong>")
        .addTo(this.map);

      this.search = null;
      this.dataAddresses = [];
    },
    getAddress(lat, lng) {
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
        //    this.$emit('getAddress',{"lat":lat, "lng":lng,"address":res.data.result.full_name})
      });
    },
    getMap(lat = 21.005796351058695, lng = 105.8465337753296) {
      var controler = this;

      this.map = L.map("dashboard-map").setView([lat, lng], 18);

      var OpenStreetMap_Mapnik = L.tileLayer(
        "https:{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 20
        }
      ).addTo(this.map);

      // L.tileLayer(
      //   "https://tile{s}.skysmartmap.com/api/tiles/basic/{z}/{x}/{y}.png",
      //   {
      //     maxZoom: 18,
      //     subdomains: [0, 1, 2, 3, 4]
      //   }
      // ).addTo(this.map);

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
      document.getElementsByClassName( 'leaflet-control-attribution' )[0].firstChild.remove();
      var a = document.createElement("a");
      a.href="http://skymapglobal.vn/";
      a.text="Skymap";
      document.getElementsByClassName( 'leaflet-control-attribution' )[0].append(a);
    }
  },

  mounted() {
    if(this.item&&this.item.lat&&this.item.long){
      this.getMap(this.item.lat,this.item.long);
    }else{
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
  height: 450px;
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
  #boxsearch{
    width: 300px;
  }
}
@media (max-width: 768px) {
  #boxsearch{
    width: 260px;
  }
}
@media (max-width: 576px) {
  #boxsearch{
    width: 160px;
  }
}
</style>
