<template>
  <div class="homeBox">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <img src="@/assets/jingling_logo.0ada255b.png" @click="goHome" alt="" />
        <h3>精灵购物平台管理系统</h3>
        <el-popconfirm
          title="你将要退出登录，点击确认将继续"
          @confirm="loginOut"
        >
          <el-button slot="reference">退出</el-button>
        </el-popconfirm>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-menu
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            background-color="#303641"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            router
          >
            <el-submenu
              :index="item.id.toString()"
              v-for="(item, index) in menusList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="icons[index]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
                :index="childrenItem.id.toString()"
                v-for="childrenItem in item.children"
                :key="childrenItem.id"
                :route="{ path: '/home/' + childrenItem.path }"
                ><i class="el-icon-menu"></i>{{ childrenItem.authName }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 主体部分 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      menusList: [],
      icons: [
        "el-icon-s-goods",
        "el-icon-s-help",
        "el-icon-s-cooperation",
        "el-icon-s-shop",
        "el-icon-s-claim",
      ],
      defaultActive: "/users",
    };
  },
  methods: {
    // 点击logo回到首页
    goHome() {
      this.$router.push("/home").catch((error) => {});
    },
    loginOut() {
      sessionStorage.removeItem("token");
      this.$router.push("/login").catch((error) => {});
    },
    async getMenus() {
      let res = await this.axios.get("/menus");
      this.menusList = res.data;
    },
  },
  components: {},
  mounted() {
    this.getMenus();
  },
};
</script>

<style scoped lang="scss">
.homeBox {
  user-select: none;
  [v-clock] {
    display: none;
  }

  width: 100%;
  height: 100%;

  .is-vertical {
    height: 100%;

    header {
      background-color: #353c3e;
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: #fff;
      letter-spacing: 3px;

      img {
        width: 40px;

        &:hover {
          cursor: pointer;
        }
      }

      h3 {
        flex: 1;
      }

      .el-icon-switch-button {
        transform: scale(1.7);

        &:hover {
          cursor: pointer;
        }
      }
    }

    aside {
      background-color: #353c3e;
      > ul {
        width: 100%;
        height: 100%;
      }
    }
    main {
      background: url(@/assets/bj.jpg) no-repeat;

      > img {
        width: 600px;
      }
      > p {
        font-size: 35px;
        letter-spacing: 20px;
        flex: 1;

        &:last-child {
          font-size: 14px;
          letter-spacing: 3px;
        }

        > span {
          font-size: 65px;
          color: aqua;
        }
      }
    }
  }
}
</style>
