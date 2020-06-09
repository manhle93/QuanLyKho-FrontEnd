<template>
    <div class="">
        <el-row>
            <el-button
            style="margin-top: 20px"
                    size="small"
                    v-if="them"
                   class="primary-button right"
                    @click="taoDiemChay"
                    id="them-toa-nha"
            >+ Tạo điểm cháy</el-button>
        </el-row>
        <el-row>
            <el-col :span="19">
                <!-- <input style="margin-top: 20px" type="text" id="boxsearch" v-model="search" placeholder="Nhập địa chỉ cần tìm kiếm...." v-if="!them"/> -->
                <el-input placeholder="Nhập địa chỉ tìm kiếm" size="small" style="margin-top: 20px; padding-left: 3px;" v-model="search"  v-if="!them"> <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
            </el-col>
            <el-col :span="5">
                <el-button size="mini" type="danger" v-if="!them"  @click="xoaDiemChay" style="font-size: 12px; margin-left: 5px; margin-top: 22px;">Hủy</el-button>
            </el-col>
            <el-col :span="24">
                <div id="suggest" style="display:none">
                    <ul>
                        <li
                                style="padding:12px 0px 12px 10px"
                                v-for="(item,index) in dataAddresses"
                                :key="item.full_name"
                                @click="setMarker(item)"
                        >
                            <i class="fa fa-map-marker"></i>
                            <a style="margin-left:5px">{{item.full_name}}</a>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <order-popup v-if="!them" :addressdc="addressdc" @htDiemChay2="item=>xoaDiemChay()"></order-popup>
        </el-row>
    </div>
</template>

<script>
  import { getLatLongByAddressText } from '@/api/TinhThanh'

  import {
    addDiemChay
  } from "@/api/diemchay";
  import router from '@/router'
  import OrderPopup from './OrderPopup'
  export default {
    components: {
      OrderPopup
    },
    props: {
      address: {
        type: Object
      }
    },
    data() {
      return {
        timeout: null,
        them: true,
        addressdc: {},
        search:'',
        dataAddresses: [],
      };
    },
    watch: {
      search(val) {
        if (val != '' && val != null) {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            document.getElementById('suggest').style.display = 'table'
            document.getElementById('suggest').style.backgroundColor = 'white'
            this.getLatLng(val)
          }, 500)
        } else {
          this.dataAddresses = []
          document.getElementById('suggest').style.display = 'none'
        }
      },
      address(vale) {
        this.addressdc = vale
        //console.log(vale)
      }
    },
    methods: {
      setMarker(item) {
        this.$emit('getMarker', item)
      },
      getLatLng(search) {
        getLatLongByAddressText({ search: search })
          .then(res => {
            //console.log(res);
            this.dataAddresses = res
            if (res == null || res == []) {
              document.getElementById('suggest').style.display = 'none'
            }

          })
      },
      taoDiemChay() {
        this.them = false
        this.$emit('htDiemchay1', false)
        // this.map.on('click', e => {
        //   // this.deleteMarker()
        //   // this.makeMarker(e.latlng)
        // })
      },
      xoaDiemChay() {
        this.them = true
        this.dataAddresses = []
        this.$emit('htDiemchay1', true)
        // var controler = this
        // this.deleteMarker()
        // this.map.off('click')
      },
    },
    mounted() {
    },

  };
</script>
<style lang="css" scoped>
    #boxsearch {
        border: none;
        padding: 10px 5px;
        width: 100%;
        border: 1px solid #409eff;
        border-radius: 50px;
        z-index: 999999999999999;
    }

    #suggest {
        position: absolute;
        top: 60px;
        z-index: 999999999999999999999999;
        width: auto;
        box-shadow: 0 3px 12px 0 rgba(0,0,0,.8)
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


    #xoa-toa-nha {
        position: absolute;
        top: 10px;
        z-index: 99999;
        right: 25px;
    }
</style>
