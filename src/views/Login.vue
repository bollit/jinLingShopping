<template>
  <div class="login">
    <el-form
      :label-position="labelPosition"
      :model="formLabelAlign"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item prop="name">
        <el-input
          v-model="formLabelAlign.name"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
          @input="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="type">
        <el-input
          v-model="formLabelAlign.type"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          show-password
          @input="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>

      <!-- 按键 -->
      <el-form-item>
        <Vcode :show="isShow" @success="success" @close="close" />
        <el-button type="primary" @click="submit" :disabled="isDisabled"
          >登录</el-button
        >
        <el-button plain @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";
export default {
  props: {},
  data() {
    return {
      isDisabled: true,
      isShow: false, // 验证码模态框是否出现
      labelPosition: "right",
      formLabelAlign: {
        name: "admin",
        type: "123456",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 2,
            max: 6,
            message: "长度在 2 到 8 个字符",
            trigger: "change",
          },
        ],
        type: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.isShow = true;
    },
    // 用户通过了验证
    async success(msg) {
      this.isShow = false; // 通过验证后，需要手动隐藏模态框

      // 调用登录的接口
      let res = await this.axios.post("/login", {
        username: this.formLabelAlign.name,
        password: this.formLabelAlign.type,
      });
      if (res.meta.status == 200) {
        this.$message({
          type: "success",
          message: res.meta.msg,
          duration: 1000,
          onClose: () => {
            this.$router.push("/home").catch((error) => {});
          },
        });
        // 存储token
        sessionStorage.setItem("token", res.data.token);
      } else {
        this.$message.error({
          message: res.meta.msg,
          duration: 1000,
        });
      }
    },
    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.isShow = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDisabled = false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  components: {
    Vcode,
  },
  mounted() {
    this.submitForm("ruleForm");
  },
};
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: url(@/assets/bj.jpg) no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-form {
    width: 300px;
    padding: 30px;
    background-color: #fff;
    border-radius: 16px;
  }
}
</style>
