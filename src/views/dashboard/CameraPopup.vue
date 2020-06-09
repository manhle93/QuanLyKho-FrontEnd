<template>
  <!-- <div style="width:540;height:364">
    <video  id="my-video" class="video-js" controls preload="auto" width="540" height="364" data-setup='{"techorder" : ["flash"]}'>
      <source src="rtmp://media22.cloudcam.vn:1935/cloud-camera/sitb7101506911225461.stream" type="rtmp/mp4">                                                                                                                           
      <p class="vjs-no-js">
      </p>
    </video>
  <br/>
  </div> -->
  <div id="videoDiv">
    <h4>{{order.ten}}</h4>
    <iframe v-if="order && order.link" width="430" height="300" :src="order.link" frameborder="0" allowfullscreen></iframe> 
    <img v-else src="http://pcccapi.howizbiz.com/storage/images/avatar/1589343255.png" width="430" height="300">
  </div>
</template>

<script>
  
  import videojs from 'video.js'
  import 'video.js/dist/video-js.css'
  import 'videojs-flash'
  export default {
    name: 'CameraPopup',
    
    data () {
      return {
        show:false,
        order: {
          construction: {},
          reports: []
        }
      }
    },
    beforeDestroy() {
      // var oldPlayer = document.getElementById('my-video');
      // videojs(oldPlayer).dispose();
    },
    created(){
    },
    methods:{
      view(){

        //  var videoDiv = document.getElementById('videoDiv');
        //   videoDiv.style.height="400px";
        //      videoDiv.style.paddingTop="11px";
        // var video = document.createElement('video');
        // var source = document.createElement('source');
        // video.id = 'my-video';
        // video.className = 'video-js vjs-default-skin';
        // video.setAttribute('controls', 'controls');
        // source.setAttribute('src', 'rtmp://media22.cloudcam.vn:1935/cloud-camera/sitb7101506911225461.stream');
        // source.setAttribute('type', 'rtmp/mp4');
        //   video.setAttribute('width', "378px");
        //    video.setAttribute('height', "378px");
        // video.appendChild(source);
        // videoDiv.appendChild(video);

        //  videojs('#my-video', this.options, function(){

        // });
      },
      dispose(){
        // var oldPlayer = document.getElementById('my-video');
        // videojs(oldPlayer).dispose();
      }
    },
  }
</script>

<style scoped>
.video-js {
    width: 520px !important;
    height: 421px !important;
}
  .order-popup {
    color: #afafaf;
  }

  .order-item {
    display: flex;
    padding: 10px 0;
    cursor: pointer;
  }

  .construction-icon {
    font-size: 38px;
    line-height: 42px;
    margin-right: 5px;
    flex: none;
  }

  .order-info {
    flex: 1;
  }

  .highlight-text {
    color: var(&#45;&#45;brand-primary-light);
    font-weight: bold;
    font-size: 15px;
  }

  .title-text {
    font-weight: bold;
    color: rgb(26, 26, 26);
    font-size: 15px;
  }

  .reports-container {
    max-height: 340px;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 8px !important;
  }

  .report-item:not(:last-child) {
    margin-bottom: 5px;
  }

  .report-header {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }

  .images-container {
    position: relative;
    width: 100%;
    background-color: #cccccc;
    height: 180px;
  }

  .images-container-img {
    width: 100%;
    height: 100%;
    margin: auto;
    object-fit: cover;
  }

  .image-description {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1005;
    padding: 4px;
    color: white;

    background-color: rgba(0,0,0,0.5);
  }
</style>
