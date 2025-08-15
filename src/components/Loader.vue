<template>
    <div class="d-flex justify-content-center align-items-center m-5">
        <div class="line-wobble"></div>
    </div>

</template>

<script>

export default {
    name: 'ContentLoader',
}
</script>

<style scoped lang="scss">
.line-wobble {
  --uib-size: 100px;
  --uib-speed: 1.2s;
  --uib-color: var(--primary-color);
  --uib-line-weight: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--uib-line-weight);
  width: var(--uib-size);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  margin: 2rem auto;
}

.line-wobble::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, var(--gray-200), var(--gray-100));
  border-radius: var(--radius-2xl);
}

.line-wobble::after {
  content: '';
  height: 100%;
  width: 60%;
  border-radius: var(--radius-2xl);
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light), var(--secondary-color));
  background-size: 200% 100%;
  animation: wobble var(--uib-speed) ease-in-out infinite,
             shimmer 2s ease-in-out infinite;
  transform: translateX(-90%);
  box-shadow: 0 0 20px var(--primary-color)/30;
}

@keyframes wobble {
  0%, 100% {
    transform: translateX(-90%);
  }
  50% {
    transform: translateX(130%);
  }
}

@keyframes shimmer {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
}

// Alternative pulse loader for variety
.pulse-loader {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem auto;
  
  .dot {
    width: 12px;
    height: 12px;
    background: var(--primary-color);
    border-radius: 50%;
    animation: pulseScale 1.5s ease-in-out infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
      background: var(--primary-light);
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
      background: var(--secondary-color);
    }
  }
}

@keyframes pulseScale {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>
