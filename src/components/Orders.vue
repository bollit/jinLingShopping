<template>
  <div>
    <!-- 顶部导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcom' }"
        ><span>首页</span></el-breadcrumb-item
      >
      <el-breadcrumb-item><span>订单管理</span></el-breadcrumb-item>
      <el-breadcrumb-item><span>订单列表</span></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">

</style>
