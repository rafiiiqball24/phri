<template>
  <header class="navbar">
    <div class="navbar__inner">
      <div class="navbar__left">
        <NuxtLink to="/" class="navbar__logoWrap">
          <img src="/img/icons/Logo.svg" alt="PHRI Logo" class="navbar__logo" />
          <span class="navbar__brand">PHRI</span>
        </NuxtLink>
      </div>

      <nav class="navbar__menu">
        <NuxtLink :class="['navbar__link', isExact('/') && 'active']" to="/">Beranda</NuxtLink>
        <NuxtLink :class="['navbar__link', isActive('/about-us') && 'active']" to="/about-us">Tentang Kami</NuxtLink>
        <NuxtLink :class="['navbar__link', isActive('/contact') && 'active']" to="/contact">Kontak</NuxtLink>
        <NuxtLink :class="['navbar__link', isActive('/help') && 'active']" to="/help">Bantuan</NuxtLink>
      </nav>

      <div class="navbar__right">
        <NuxtLink to="/cart" class="navbar__cart" aria-label="Cart">
          <img src="/img/icons/Cart.svg" alt="Cart" />
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </NuxtLink>
        <button class="hamburger" @click="mobileOpen = true"
          aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="mobileOpen" class="mm__backdrop" @click="mobileOpen = false"></div>
    </transition>

    <transition name="slide">
      <aside v-if="mobileOpen" class="mm">
        <div class="mm__head">
          <NuxtLink to="/" class="mm__brand" @click="mobileOpen = false">
            <img src="/img/icons/Logo.svg" alt="" /><span>PHRI</span>
          </NuxtLink>
          <button class="mm__close" @click="mobileOpen = false" aria-label="Tutup">✕</button>
        </div>

        <nav class="mm__nav">
          <NuxtLink class="mm__link" to="/" @click="mobileOpen = false">Beranda</NuxtLink>
          <NuxtLink class="mm__link" to="/about-us" @click="mobileOpen = false">Tentang Kami</NuxtLink>
          <NuxtLink class="mm__link" to="/contact" @click="mobileOpen = false">Kontak</NuxtLink>
          <NuxtLink class="mm__link" to="/help" @click="mobileOpen = false">Bantuan</NuxtLink>

          <NuxtLink to="/cart" class="mm__cart" @click="mobileOpen = false">
            <span class="mm__cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                <path
                  d="M6.75 13.5C6.75 13.7225 6.68402 13.94 6.5604 14.125C6.43679 14.31 6.26109 14.4542 6.05552 14.5394C5.84995 14.6245 5.62375 14.6468 5.40552 14.6034C5.18729 14.56 4.98684 14.4528 4.8295 14.2955C4.67217 14.1382 4.56502 13.9377 4.52162 13.7195C4.47821 13.5012 4.50049 13.275 4.58564 13.0695C4.67078 12.8639 4.81498 12.6882 4.99998 12.5646C5.18499 12.441 5.4025 12.375 5.625 12.375C5.92337 12.375 6.20952 12.4935 6.4205 12.7045C6.63147 12.9155 6.75 13.2016 6.75 13.5ZM12.9375 12.375C12.715 12.375 12.4975 12.441 12.3125 12.5646C12.1275 12.6882 11.9833 12.8639 11.8981 13.0695C11.813 13.275 11.7907 13.5012 11.8341 13.7195C11.8775 13.9377 11.9847 14.1382 12.142 14.2955C12.2993 14.4528 12.4998 14.56 12.718 14.6034C12.9363 14.6468 13.1625 14.6245 13.368 14.5394C13.5736 14.4542 13.7493 14.31 13.8729 14.125C13.9965 13.94 14.0625 13.7225 14.0625 13.5C14.0625 13.2016 13.944 12.9155 13.733 12.7045C13.522 12.4935 13.2359 12.375 12.9375 12.375ZM16.2921 3.52547L14.4893 10.0139C14.3902 10.3683 14.1782 10.6808 13.8854 10.9039C13.5927 11.1269 13.2352 11.2485 12.8672 11.25H5.9175C5.54838 11.2498 5.18945 11.1289 4.89544 10.9058C4.60143 10.6826 4.38848 10.3694 4.28906 10.0139L1.8225 1.125H0.5625C0.413316 1.125 0.270242 1.06574 0.164752 0.960248C0.0592632 0.854758 0 0.711684 0 0.5625C0 0.413316 0.0592632 0.270242 0.164752 0.164752C0.270242 0.0592632 0.413316 0 0.5625 0H2.25C2.37298 0 2.49257 0.040255 2.59048 0.11467C2.68839 0.189085 2.75921 0.293535 2.79211 0.412031L3.45867 2.8125H15.75C15.8367 2.81248 15.9223 2.83252 16 2.87103C16.0777 2.90955 16.1454 2.96551 16.1979 3.03454C16.2504 3.10357 16.2862 3.1838 16.3025 3.26896C16.3189 3.35412 16.3153 3.44191 16.2921 3.52547ZM15.0096 3.9375H3.77156L5.37539 9.71297C5.40829 9.83147 5.47911 9.93592 5.57702 10.0103C5.67493 10.0847 5.79452 10.125 5.9175 10.125H12.8672C12.9902 10.125 13.1098 10.0847 13.2077 10.0103C13.3056 9.93592 13.3764 9.83147 13.4093 9.71297L15.0096 3.9375Z"
                  fill="currentColor" />
              </svg>
            </span>
            <span class="mm__cart-text">Keranjang</span>
            <em v-if="cartCount > 0" class="mm__badge">{{ cartCount }}</em>
          </NuxtLink>

        </nav>
      </aside>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCart } from "@/composables/useCart";

const { items } = useCart();
const cartCount = computed(() => {
  const ids = new Set(items.value.map(it => it.id));
  return ids.size;
});
const mobileOpen = ref(false);
const route = useRoute();
const isExact = (path: string) => route.path === path;
const isActive = (path: string) => route.path === path || route.path.startsWith(path + "/");
</script>

<style scoped>
.navbar {
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 20px 24px;
  box-sizing: border-box;
}

.navbar__logoWrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.navbar__logo {
  width: 40px;
  height: 40px;
  display: block;
}

.navbar__brand {
  color: #0a0a0a;
  font-family: var(--Font-Family-Text-Tittle, Urbanist);
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: -0.005px;
}

.navbar__menu {
  display: none;
  gap: 32px;
}

.navbar__link {
  color: #0a0a0a;
  font: 500 16px/24px "Urbanist", sans-serif;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}

.navbar__link:hover {
  color: #f79f24;
}

.navbar__link.active,
.navbar__link.active:hover {
  background: #f79f24;
  color: #fff;
}

.navbar__right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar__cart {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.navbar__cart img {
  width: 24px;
  height: 24px;
  display: block;
}

.badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: #ff4d4f;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  text-align: center;
}

.hamburger {
  border: none;
  background: transparent;
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.hamburger::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background: url("/img/icons/List.svg") center/contain no-repeat;
}

.mm__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 998;
}

.mm {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.mm__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.mm__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  text-decoration: none;
  color: #0a0a0a;
}

.mm__brand img {
  width: 28px;
  height: 28px;
}

.mm__close {
  font-size: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.mm__nav {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 12px;
}

.mm__link {
  font: 500 16px "Urbanist", sans-serif;
  color: #0a0a0a;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.mm__link:hover {
  background: #f5ba62;
  color: #fff;
}

.mm__link.router-link-exact-active {
  background: #f79f24;
  color: #fff;
}

.mm__cart {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  color: #0a0a0a;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.mm__cart:hover,
.mm__cart.router-link-exact-active {
  background: #f5ba62;
  color: #fff;
}

.mm__cart svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-right: 8px;
}

.mm__cart-text {
  flex: 1;
  text-align: left;
  font: 600 16px "Urbanist", sans-serif;
}

.mm__badge {
  background: #ff4d4f;
  color: #fff;
  border-radius: 999px;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
}

/* Hover state ikut putih */
.mm__cart:hover svg path,
.mm__cart.router-link-exact-active svg path {
  fill: white;
}



.mm__cart:hover svg path,
.mm__cart.router-link-exact-active svg path {
  fill: white;
}

.mm__badge {
  margin-left: 8px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 999px;
  padding: 0 6px;
  font-size: 12px;
  line-height: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s, opacity 0.25s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media (min-width: 900px) {
  .navbar__menu {
    display: flex;
  }

  .hamburger {
    display: none !important;
  }

  .navbar__cart {
    display: inline-flex;
  }
}

@media (max-width: 899px) {
  .navbar__inner {
    padding: 14px 20px;
    gap: 16px;
  }

  .navbar__menu {
    display: none !important;
  }

  .hamburger {
    display: flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
  }

  .hamburger::before {
    width: 26px;
    height: 26px;
    background-size: 26px 26px;
  }
}

@media (max-width: 599px) {
  .navbar__inner {
    padding: 12px 16px;
    gap: 12px;
  }

  .navbar__brand {
    display: none !important;
  }

  .navbar__menu,
  .navbar__cart {
    display: none !important;
  }

  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-right: 8px;
  }

  .hamburger::before {
    width: 28px;
    height: 28px;
    background-size: 28px 28px;
  }
}
</style>
