<template>
  <div class="welcome">
    <img src="@/assets/jinglingBg2.png" alt="" />
    <p>欢迎来到<span>精灵购物</span>后台管理</p>
    <p>山河科技邹沛霖版权所有&copy;</p>
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
.welcome {
  user-select: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: #fff;

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
</style>
