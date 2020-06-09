<template>
  <div class="app-container">
    <h3>Danh sách báo cáo</h3>
    <el-table :data="list" v-loading="listLoading" style="width: 100%" border>
      <el-table-column label="STT" type="index" width="90" align="center">
      </el-table-column>
      <el-table-column sortable prop="name" label="Tên" >
        <template slot-scope="scope">{{ scope.row.ten }}</template>
      </el-table-column>

       <el-table-column sortable prop="name" label="Mô tả" >
        <template slot-scope="scope">{{ scope.row.ten }}</template>
      </el-table-column>
      
      <el-table-column width="200" fixed="right" align="center" >
        <template slot-scope="scope">
             <el-button size="mini" type="primary" @click="exportExcel(scope.row.ten,scope.row.link)">Download</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <video id="my-video" ref="my-video" class="video-js" controls preload="auto" width="640" height="604" >
      <source src="rtmp://media22.cloudcam.vn:1935/cloud-camera/sitb7101506911225461.stream" type="rtmp/mp4">                                                                                                                           
      <p class="vjs-no-js">
      </p>
    </video> -->
  </div>
</template>

<script>

import axios from "axios";
import { getToken } from "@/utils/auth";
// var videojs = require('video.js');
// require('video.js/dist/video-js.css')
  import videojs from 'video.js'
  import 'video.js/dist/video-js.css'
  import 'videojs-flash'

export default {
  data() {
    return {
    list:[
        {
            ten:"Báo cáo 1",
            mo_ta:"Báo cáo",
            link:"/diemchay/export/excel"
        },
        {
            ten:"Báo cáo 2",
            mo_ta:"Báo cáo",
             link:"/diemchay/export/excel"
        },
    ],
    listLoading: false,
    labelPosition: "top",
     options : {
             autoplay: false,
             preload: true,
             techOrder: ['flash', 'html5'],
             fluid: true
         }
    };
  },
  mounted(){
    
    // videojs('#my-video', this.options, function(){

    //  })
  },
  beforeDestroy() {
    
    // videojs(this.$refs["my-video"]).dispose();
  },
  methods: {
    exportExcel(name,link){
      axios({
        url: process.env.VUE_APP_BASE_API+'diemchay/export/excel',
        method: 'GET',
        headers:{["Authorization"]:"Bearer " + getToken()},
        responseType: 'blob', // important
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name+'.xlsx');
        document.body.appendChild(link);
        link.click();
      });
    },
  }
};
</script>
<style >
.search {
  margin-bottom: 20px;
}
</style>
