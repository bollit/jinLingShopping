<template>
  <div>
    <!-- 顶部导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcom' }"
        ><span>首页</span></el-breadcrumb-item
      >
      <el-breadcrumb-item><span>权限管理</span></el-breadcrumb-item>
      <el-breadcrumb-item><span>角色列表</span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体卡片 -->
    <el-card class="box-card">
      <!-- 顶部按钮 -->
      <el-button
        class="primary"
        type="primary"
        @click="rolesDialogVisible = true"
        >添加角色</el-button
      >

      <!-- 添加角色会话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="rolesDialogVisible"
        width="30%"
      >
        <el-form ref="rolesForm" :model="rolesForm" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="rolesForm.roleName"></el-input>
          </el-form-item>

          <el-form-item label="角色描述">
            <el-input v-model="rolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="rolesDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 中间角色列表 -->
      <el-table :data="rolesForm" stripe style="width: 100%" :border="true">
        <!-- 展开显示权限信息 -->
        <el-table-column prop="date" width="50" type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[
                'expandActive',
                'center',
                index == 0 ? 'expandTopActive' : '',
              ]"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col class="fristCol" :span="5"
                ><el-tag @close="deletRight(scope.row, item.id)" closable>{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['center', index == 0 ? '' : 'expandActive2']"
                  v-for="(itemChildren, index) in item.children"
                  :key="itemChildren.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6" class="center"
                    ><el-tag
                      @close="deletRight(scope.row, itemChildren.id)"
                      closable
                      type="success"
                      >{{ itemChildren.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i
                  ></el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18"
                    ><el-tag
                      closable
                      @close="deletRight(scope.row, itemChildren2.id)"
                      type="warning"
                      v-for="itemChildren2 in itemChildren.children"
                      :key="itemChildren2.id"
                      >{{ itemChildren2.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="date" width="50" type="index"> </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          v-model="rolesForm.roleName"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          v-model="rolesForm.roleDesc"
        >
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              @click="rigthsDialogVisible(scope.row)"
              type="warning"
              icon="el-icon-setting"
              size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      @close="clearCheckedKeys"
    >
      <!-- 树状分配列表 -->
      <el-tree
        :data="rightForm"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkedKeys"
        ref="treeRef"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getKeys">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      rolesForm: {},
      rolesDialogVisible: false,

      // 分配权限对话框的弹出与否
      dialogVisible: false,

      // 分配权限的树状结构
      props: {
        label: "name",
        children: "zones",
      },
      count: 1,

      // 请求到的全部权限列表信息
      rightForm: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 树状中需要默认展开的节点
      checkedKeys: [],

      // 树状中所有选中后节点的key
      keys: [],
      // 存放角色id
      roleId: "",
    };
  },
  methods: {
    // 请求所有角色权限数据
    async getRoles() {
      let res = await this.axios.get("roles");
      if (res.meta.status != 200) return;
      this.rolesForm = res.data;
    },

    // 删除权限
    async deletRight(role, rightId) {
      let deletRightResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => {});
      if (deletRightResult !== "confirm") {
        return this.$message.info("已取消删除操作!");
      }

      // 发起删除权限请求
      let res = await this.axios
        .delete(`roles/${role.id}/rights/${rightId}`)
        .catch((error) => {});
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      } else {
        role.children = res.data;
      }
    },
    // 弹出分配权限对话框
    async rigthsDialogVisible(role) {
      // 请求获取权限列表
      let res = await this.axios.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      }
      this.rightForm = res.data;
      this.getCheckedKeys(role, this.checkedKeys);
      this.dialogVisible = true;

      // 将角色id存放进data中
      this.roleId = role.id;
    },

    // 递归查找出三级权限节点，并将其id传入数数组中
    getCheckedKeys(node, array) {
      if (!node.children) {
        return array.push(node.id);
      }
      node.children.forEach((item) => {
        this.getCheckedKeys(item, array);
      });
    },

    // 当分配权限对话框关闭时清空CheckedKeys数组
    clearCheckedKeys() {
      this.checkedKeys = [];
    },

    // 获取所有点击的树节点的key
    async getKeys() {
      // 将获取到的所有key放入数组中
      this.keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      this.keys = this.keys.join(",");

      // 发送角色授权请求
      let res = await this.axios
        .post(`roles/${this.roleId}/rights`, {
          rids: this.keys,
        })
        .catch((error) => {});
      if (res.meta.status != 200) {
        return this.$message.error("角色授权失败！");
      }
      this.getRoles();
      this.dialogVisible = false;
    },
  },
  components: {},
  mounted() {
    this.getRoles();
  },
};
</script>

<style scoped lang="scss">
.primary {
  margin-bottom: 15px;
}

.expandActive {
  border-bottom: 1px solid rgb(233, 233, 233);
  margin-left: 50px;
}
.expandTopActive {
  border-top: 1px solid rgb(233, 233, 233);
}
.el-tag {
  margin: 10px;
}

.expandActive2 {
  border-top: 1px solid rgb(233, 233, 233);
}

.center {
  display: flex;
  align-items: center;
}
</style>
