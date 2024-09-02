<template>
  <nav>
    <img src="./assets/svg/TradeTactix.svg" alt="">
    <div class="d-flex gap-5">
      <div>How this works?</div>
      <div>Contact</div>
    </div>
  </nav>
  <router-view/>
</template>

<style lang="scss">
@import 'bootstrap/dist/css/bootstrap.min.css';
@import './assets/css/main.scss';

nav {
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
  font-weight: 500;
  font-size: 20px;
  margin-inline: 10%;
  margin-block: 1%;
  border-radius: 100px;
  color: #134B70;
}
</style>
