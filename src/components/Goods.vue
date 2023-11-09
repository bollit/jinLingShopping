<template>
  <div>
    <!-- 顶部导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcom' }"
        ><span>首页</span></el-breadcrumb-item
      >
      <el-breadcrumb-item><span>商品管理</span></el-breadcrumb-item>
      <el-breadcrumb-item><span>商品列表</span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体部分 -->
    <el-card class="box-card">
      <el-row>
        <el-input placeholder="请输入内容" v-model="input" clearable>
        </el-input>
        <el-button slot="append" icon="el-icon-search"></el-button>
        <el-button type="primary">主要按钮</el-button>
      </el-row>

      <!-- 商品列表表格 -->
      <el-table :data="goodsForm" stripe style="width: 100%" :border="true">
        <el-table-column width="50" type="index"> </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          v-model="goodsForm.goods_name"
        >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          v-model="goodsForm.goods_price"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          v-model="goodsForm.goods_weight"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          v-model="goodsForm.add_time"
          width="140"
        >
        </el-table-column>
        <el-table-column label="操作" width="140"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      input: "",

      // 从后台请求的商品列表数据
      goodsForm: {},
      // 列表参数
      goodsInfo: {
        query: "",
        pagenum: 1,
        pagesize: 3,
      },
      total: 0,
    };
  },
  methods: {
    // 请求商品分类数据
    async getGoods() {
      try {
        let res = await this.axios.get("goods", { params: this.goodsInfo });
        if (res.meta.status != 200) {
          throw new Error(res.meta.msg);
        }
        this.goodsForm = res.data.goods;
      } catch (error) {
        console.error(error);
      }
    },
  },
  components: {},
  mounted() {
    this.getGoods();
  },
};
</script>

<style scoped lang="scss">
.el-row {
  .el-input {
    width: 300px;
  }
}
.el-table {
  margin: 15px 0;
}
</style>
