<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
  background-color: #F0F1F5;
  overflow: auto;
}
</style>
