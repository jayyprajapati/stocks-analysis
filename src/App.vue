<template>
  <div class="container">
    <nav>
      <router-link :to="{ name: 'home' }"><img src="./assets/svg/TradeTactix.svg" alt=""></router-link>
      <div class="d-md-flex gap-5 d-none">
        <router-link :to="{ name: 'about' }">
          <div>How this works?</div>
        </router-link>
        <a href="https://jayprajapati.dev" target="_blank">Contact</a>
        <!-- <router-link :to="{name: 'contact'}"><div>Contact</div></router-link> -->
      </div>
      <div class="d-md-none">
        <i class="fa-solid fa-bars d-md-none" @click="toggleNav"></i>
      </div>
      <div class="nav-items-mobile d-md-none" v-if="isNavOpen">
        <router-link :to="{ name: 'about' }">
          <div>How this works?</div>
        </router-link>
        <a href="https://jayprajapati.dev" target="_blank">Contact</a>
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
  padding: 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-primary);
  backdrop-filter: blur(10px);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-lg);
  font-weight: 500;
  font-size: 1.125rem;
  margin: 1rem 0 1rem 0;
  border-radius: var(--radius-2xl);
  color: var(--text-primary);
  position: relative;
  transition: all var(--transition-normal);
  animation: slideUp 0.6s ease-out;

  &:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-2px);
  }

  img {
    height: 2.5rem;
    transition: transform var(--transition-normal);
    
    &:hover {
      transform: scale(1.05);
    }
  }

  a {
    color: var(--text-secondary) !important;
    font-weight: 500;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-lg);
    transition: all var(--transition-fast);
    position: relative;
    
    &:hover {
      color: var(--primary-color) !important;
      background: var(--gray-50);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  .fa-bars {
    font-size: 1.5rem;
    color: var(--text-secondary);
    padding: 0.5rem;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    cursor: pointer;
    
    &:hover {
      color: var(--primary-color);
      background: var(--gray-50);
    }
  }

  @media only screen and (max-width: 768px) {
    margin: 1rem 3% 1.5rem 3%;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  @media only screen and (max-width: 560px) {
    margin: 0.5rem 2% 1rem 2%;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-xl);
    
    img {
      height: 2rem;
    }
  }
}

.nav-items-mobile {
  background: var(--bg-primary);
  backdrop-filter: blur(10px);
  border: 1px solid var(--gray-200);
  z-index: 1000;
  padding: 0.75rem;
  border-radius: var(--radius-xl);
  position: absolute;
  top: 100%;
  right: 1rem;
  min-width: 200px;
  font-size: 1rem;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.3s ease-out;
  
  a {
    display: block;
    padding: 0.75rem 1rem !important;
    margin: 0.25rem 0;
    border-radius: var(--radius-md) !important;
    color: var(--text-secondary) !important;
    transition: all var(--transition-fast);
    
    &:hover {
      background: var(--gray-50) !important;
      color: var(--primary-color) !important;
      transform: translateX(4px);
    }
  }
  
  @media only screen and (max-width: 560px) {
    right: 0.5rem;
    min-width: 180px;
  }
}
</style>
