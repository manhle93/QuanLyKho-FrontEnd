<template>
  <div>
    <router-link tag="span" :to="url">
      <el-button style="float: right" type="primary">Quay lại</el-button>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "BackButton",
  props: {
    url: {
      type: String
    }
  }
};
</script>