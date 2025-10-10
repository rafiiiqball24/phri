<template>
  <header class="navbar">
    <div class="navbar__inner">
      <div class="navbar__left">
        <NuxtLink to="/" class="navbar__logoWrap">
          <img src="/Icons/Logo.svg" alt="PHRI Logo" class="navbar__logo" />
          <span class="navbar__brand">PHRI</span>
        </NuxtLink>
      </div>

      <nav class="navbar__menu">
        <NuxtLink :class="['navbar__link', isExact('/') && 'active']" to="/">Beranda</NuxtLink>
        <NuxtLink :class="['navbar__link', isActive('/aboutus') && 'active']" to="/aboutus">Tentang Kami
        </NuxtLink>
        <NuxtLink :class="['navbar__link', isActive('/contact') && 'active']" to="/contact">Kontak</NuxtLink>
        <NuxtLink :class="['navbar__link', isActive('/help') && 'active']" to="/help">Bantuan</NuxtLink>
      </nav>

      <div class="navbar__right">
        <NuxtLink to="/cart" class="navbar__cart" aria-label="Cart">
          <img src="/Icons/Cart.svg" alt="Cart" />
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </NuxtLink>

        <div v-if="showLang" class="lang" :class="{ 'is-open': langOpen }" tabindex="0" role="button"
          :aria-expanded="String(langOpen)" @click="toggleLang" @keydown.enter.prevent="toggleLang"
          @keydown.space.prevent="toggleLang" @blur="langOpen = false">
          <span class="lang__code">{{ currentLabel }}</span>
          <svg class="lang__caret" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 9l5 6 5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
          <ul v-if="langOpen" class="lang__menu" role="menu">
            <li class="lang__item" role="menuitem" @click.stop="setLocale('id')">ID</li>
            <li class="lang__item" role="menuitem" @click.stop="setLocale('en')">EN</li>
          </ul>
        </div>

        <button class="hamburger" @click="mobileOpen = true" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="mobileOpen" class="mm__backdrop" @click="mobileOpen = false"></div>
    </transition>
    <transition name="slide">
      <aside v-if="mobileOpen" class="mm">
        <div class="mm__head">
          <NuxtLink to="/" class="mm__brand" @click="mobileOpen = false">
            <img src="/Icons/Logo.svg" alt="" /><span>PHRI</span>
          </NuxtLink>
          <button class="mm__close" @click="mobileOpen = false" aria-label="Tutup">✕</button>
        </div>
        <nav class="mm__nav">
          <NuxtLink class="mm__link" to="/" @click="mobileOpen = false">Beranda</NuxtLink>
          <NuxtLink class="mm__link" to="/aboutus" @click="mobileOpen = false">Tentang Kami</NuxtLink>
          <NuxtLink class="mm__link" to="/contact" @click="mobileOpen = false">Kontak</NuxtLink>
          <NuxtLink class="mm__link" to="/help" @click="mobileOpen = false">Bantuan</NuxtLink>
        </nav>
        <NuxtLink to="S/cart" class="mm__cart" @click="mobileOpen = false">
          <img src="/Icons/Cart.svg" alt="" /><span>Keranjang</span>
          <em v-if="cartCount > 0" class="mm__badge">{{ cartCount }}</em>
        </NuxtLink>
      </aside>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'

const { items } = useCart()

const cartCount = computed(() => items.value.reduce((sum, it) => sum + it.qty, 0))

const localeRef = ref<'id' | 'en'>('id')
const langOpen = ref(false)
const mobileOpen = ref(false)
const currentLabel = computed(() => String(localeRef.value || 'id').toUpperCase())

function toggleLang() { langOpen.value = !langOpen.value }
function setLocale(code: 'id' | 'en') { localeRef.value = code; langOpen.value = false }

function onDocClick(e: MouseEvent) {
  const el = document.querySelector('.lang')
  if (el && !el.contains(e.target as Node)) langOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

const showLang = false

onMounted(() => {
  if (showLang) document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  if (showLang) document.removeEventListener('click', onDocClick)
})


const route = useRoute()
const isExact = (path: string) => route.path === path
const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')
</script>

<style scoped>
.navbar {
  background: #fff;
  border-bottom: 1px solid #E5E5E5;
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
  color: #0A0A0A;
  font-family: var(--Font-Family-Text-Tittle, Urbanist);
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: -.005px;
}

.navbar__menu {
  display: none;
  gap: 32px;
}

.navbar__link {
  color: #0A0A0A;
  font: 500 16px/24px 'Urbanist', sans-serif;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  transition: color .2s, background .2s;
}

.navbar__link:hover {
  color: #F79F24;
}

.navbar__link.active,
.navbar__link.active:hover {
  background: #F79F24;
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
  background: #FF4D4F;
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

.lang {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.lang__code {
  font: 600 16px 'Urbanist', sans-serif;
  color: #F79F24;
  line-height: 1;
}

.lang__caret {
  width: 18px;
  height: 18px;
  color: #F79F24;
  transition: transform .18s;
}

.lang.is-open .lang__caret {
  transform: rotate(180deg);
}

.lang__menu {
  list-style: none;
  margin: 0;
  padding: 6px 0;
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: #fff;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  min-width: 90px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .08);
  z-index: 50;
  font-size: 14px;
}

.lang__item {
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Urbanist', sans-serif;
  color: #F79F24;
  text-align: left;
}

.lang__item:hover {
  background: #FFF3E3;
}

.hamburger {
  display: none;
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
  background: url('/Icons/List.svg') center/contain no-repeat;
}

.mm__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .3);
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
  color: #0A0A0A;
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
  font: 400 16px 'Urbanist', sans-serif;
  color: #0A0A0A;
  text-decoration: none;
  padding: 8px 0;
}

.mm__cart {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F79F24;
  color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 600;
  text-decoration: none;
}

.mm__cart img {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.mm__badge {
  margin-left: auto;
  background: #FF4D4F;
  color: #fff;
  border-radius: 999px;
  padding: 0 6px;
  font-size: 12px;
  line-height: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform .25s, opacity .25s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media (min-width:900px) {
  .navbar__menu {
    display: flex;
  }

  .hamburger {
    display: none !important;
  }

  .navbar__cart,
  .lang {
    display: inline-flex;
  }
}

@media (max-width:899px) {
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

@media (max-width:599px) {
  .navbar__inner {
    padding: 12px 16px;
    gap: 12px;
  }

  .navbar__brand {
    display: none !important;
  }

  .navbar__menu,
  .navbar__cart,
  .lang {
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
