<template>
  <div class="home-wrapper">
    <AutoComplete />
  </div>
</template>

<script setup>
import AutoComplete from '@/components/AutoComplete.vue';
</script>

<style scoped lang="scss">
.home-wrapper {
  width: 100%;
  // height: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>