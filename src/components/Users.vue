<template>
  <div>
    <!-- 顶部导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcom' }"
        ><span>首页</span></el-breadcrumb-item
      >
      <el-breadcrumb-item><span>用户管理</span></el-breadcrumb-item>
      <el-breadcrumb-item><span>用户列表</span></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row>
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          class="input-with-select"
          clearable
          @clear="getUsers()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUsers()"
          ></el-button>
        </el-input>

        <!-- 添加信息的会话框 -->
        <el-button type="primary" @click="dialogVisible = true"
          >添加用户</el-button
        >
      </el-row>

      <!-- 数据列表 -->
      <el-table :data="users" stripe :border="border" style="width: 100%">
        <el-table-column width="50px" type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
              active-color="#409eff"
            >
            </el-switch
          ></template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row.id)"
            ></el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="editDelete(scope.row.id)"
            ></el-button>

            <!-- 分配角色按钮悬浮提示信息 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 分配角色按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="settingDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 信息会话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @closed="addDialogClosed"
    >
      <!-- 会话框表单 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobil">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 会话框表单底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑按钮会话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <!-- 编辑表单 -->
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobil">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsersInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="settingDialogVisible"
      width="30%"
      @close="dialogCloseed"
    >
      <!-- 分配角色表单 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="settingInfo"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="当前的用户" prop="username">
          <el-input v-model="settingInfo.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="当前的角色" prop="role_name">
          <el-input v-model="settingInfo.role_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select v-model="rolesSelectedId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="settingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="settingDialogRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    // 表单验证
    // 验证邮箱
    var checkEmail = (rule, value, callback) => {
      const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的邮箱！"));
    };
    // 验证手机号
    var checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号！"));
    };

    return {
      input: "",
      border: true,
      users: [],
      total: 0,

      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 3,
      },

      // 会话框
      dialogVisible: false,
      // 会话框表单
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入正确的用户名", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "长度在 2 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入正确的密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入正确的邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入正确的手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 编辑按钮
      editDialogVisible: false,
      editForm: {},
      // 关闭会话框清空
      editDialogClosed() {
        this.$refs.editForm.resetFields();
      },

      // 修改并提交用户信息
      editUsersInfo: () => {
        this.$refs.editForm.validate(async (valid) => {
          if (!valid) return;
          // 发起修改请求
          let res = await this.axios.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          });
          if (res.meta.status !== 200) {
            this.$message.error("修改失败！");
          } else {
            this.$message.success("修改成功！");
          }
          this.editDialogVisible = false;
          this.getUsers();
        });
      },

      // 分配角色
      settingDialogVisible: false,
      form: {
        region: "",
      },

      // 存放点击分配权限后获取到的该用户信息
      settingInfo: {},
      // 获取到的角色列表
      rolesList: [],
      // 已选中的角色
      rolesSelectedId: "",
    };
  },
  methods: {
    async getUsers() {
      let { data: res } = await this.axios.get("/users", {
        params: this.queryInfo,
      });
      this.users = res.users;
      this.total = res.total;
      console.log(res);
    },

    // 分页方法
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUsers();
    },
    // 状态按钮事件
    async userStateChanged(val) {
      let { data: res } = await this.axios.put(
        `users/${val.id}/state/${val.mg_state}`
      );
      if (res.meta.status != 200) {
        val.mg_state = !val.mg_state;
        return this.$message.error("用户状态更新失败！");
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 当添加信息对话框关闭时清空已填内容
    addDialogClosed() {
      this.$refs.ruleForm.resetFields();
    },

    // 点击确定按钮添加信息
    addUser() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        let res = await this.axios.post("users", this.ruleForm);
        if (res.meta.status != 201) {
          return this.$message.error("添加用户信息失败！");
        }
        this.$message.success("成功添加用户信息！");
        this.editDialogVisible = false;
        this.dialogVisible = false;
        this.getUsers();
        this.handleCurrentChange(this.total);
      });
    },

    // 编辑按钮
    async edit(id) {
      let res = await this.axios.get(`users/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.$message.success("查询用户信息成功！");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    // 删除按钮
    async editDelete(id) {
      let res = await this.axios.delete(`users/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("删除该用户信息失败！");
      }
      this.$message.success(res.meta.msg);
      this.getUsers();
    },

    // 点击分配角色
    async settingDialog(settingInfo) {
      this.settingInfo = settingInfo;

      // 请求获取角色列表
      let res = await this.axios.get("roles").catch((error) => {});
      if (res.meta.status != 200) {
        return this.$message.error("角色列表获取失败！");
      }
      this.rolesList = res.data;

      // 展示对话框
      this.settingDialogVisible = true;
    },

    // 点击确认按钮分配角色
    async settingDialogRole() {
      if (!this.rolesSelectedId) {
        return this.$message.error("请先为该用户分配角色！");
      }
      // 提交角色分配
      try {
        let res = await this.axios.put(`users/${this.settingInfo.id}/role`, {
          rid: this.rolesSelectedId,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("角色更新失败！");
        } else {
          this.$message.success(res.meta.msg);
        }
        this.settingDialogVisible = false;
      } catch (error) {
        console.error("请求失败：", error);
        this.$message.error("请求失败！");
      }
    },

    // 分配角色对话框关闭时清空选择器
    dialogCloseed() {
      this.rolesSelectedId = [];
      this.getUsers();
    },
  },
  components: {},
  mounted() {
    this.getUsers();
  },
};
</script>

<style scoped lang="scss">
div {
  .el-card {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .el-row {
      .el-input {
        width: 400px;
      }
      > .el-button {
        margin-left: 20px;
      }
    }
    .el-table {
      margin: 15px 0;
    }
  }
}
</style>
