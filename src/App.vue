<template>
  <div class="container">
    <nav>
      <router-link :to="{ name: 'home' }"><img src="./assets/svg/TradeTactix.svg" alt=""></router-link>
      <div class="d-md-flex gap-5 d-none">
        <router-link :to="{ name: 'about' }">
          <div>How this works?</div>
        </router-link>
        <a href="https://jayprajapati.me" target="_blank">Contact</a>
        <!-- <router-link :to="{name: 'contact'}"><div>Contact</div></router-link> -->
      </div>
      <div class="d-md-none">
        <i class="fa-solid fa-bars d-md-none" @click="toggleNav"></i>
      </div>
      <div class="nav-items-mobile d-md-none" v-if="isNavOpen">
        <router-link :to="{ name: 'about' }">
          <div>How this works?</div>
        </router-link>
        <a href="https://jayprajapati.me" target="_blank">Contact</a>
      </div>
    </nav>
  </div>

  <router-view />
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      isNavOpen: false
    }
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen
    }
  }
}
</script>

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
  background: #fff;
  position: relative;

  @media only screen and (max-width: 560px) {
    // flex-direction: column;
    // gap: 10px;
    // font-size: 12px;
    width: 100%;
    margin-inline: 0;
    margin-block: 10px;
    // border-radius: 10px;
  }
}

.nav-items-mobile {
  background: #fff;
  z-index: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dfe3e7;
  position: absolute;
  top: 70%;
  right: 8%;
  width: fit-content;
  font-size: 16px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
</style>
