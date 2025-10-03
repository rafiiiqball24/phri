<template>
  <footer>
    <div class="footer-hero">
      <div class="footer-hero__inner">
        <div class="footer-hero__left">
          <p class="footer-hero__title">Temukan Kami di:</p>
          <nav class="footer-hero__socials" aria-label="Sosial Media">
            <a href="https://facebook.com" target="_blank" rel="noopener" class="soc" aria-label="Facebook">
              <img src="/Icons/Facebook.svg" alt="https://www.facebook.com/PHRIOnline" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener" class="soc" aria-label="X">
              <img src="/Icons/X.svg" alt="https://x.com/PHRIOnline" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" class="soc" aria-label="Instagram">
              <img src="/Icons/Instagram.svg" alt="https://www.instagram.com/phrionline/" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener" class="soc" aria-label="YouTube">
              <img src="/Icons/Youtube.svg" alt="" />
            </a>
          </nav>
        </div>

        <!-- kanan: tombol -->
        <button class="backtop" @click="scrollTop">
          <span class="backtop__icon">↑</span>
          <span class="backtop__text">Kembali ke atas</span>
        </button>
      </div>
    </div>

    <!-- BAGIAN BAWAH -->
    <div class="footer-legal">
      <div class="footer-legal__inner">
        <div class="footer-legal__left">
          <span class="footer-legal__year">© 2021 — Copyright</span>
          <span class="footer-legal__rights">All Rights reserved</span>
        </div>
        <NuxtLink to="/privacy" class="footer-legal__link">Kebijakan Privasi</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.footer-hero,
.footer-legal {
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
  max-width: 100vw;
  box-sizing: border-box;
}


.footer-hero {
  background-image: url('/Images/footer.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 32px 0;
}

.footer-hero__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.footer-hero__left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  text-align: left;
}

.footer-hero__title {
  margin: 0;
  color: #fff;
  font: 600 15px/22px 'Urbanist', sans-serif;
}

.footer-hero__socials {
  display: flex;
  gap: 16px;
}

.soc {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: transform .15s, background .15s;
}

.soc:hover {
  background: rgba(255, 255, 255, .15);
  transform: translateY(-1px);
}

.soc img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}


.backtop {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  color: #F79F24;
  border-radius: 12px;
  padding: 10px 16px;
  font: 600 14px 'Urbanist', sans-serif;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .12);
  white-space: nowrap;
  transition: background .15s, transform .15s;
}

.backtop__icon {
  font-size: 16px;
  line-height: 1;
}

.backtop:hover {
  background: #fefefe;
  transform: translateY(-1px);
}


.footer-legal {
  background: #f5f5f5;
  padding: 22px 0;
}

.footer-legal__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font: 400 13px 'Urbanist', sans-serif;
  color: #555;
  box-sizing: border-box;
}

.footer-legal__left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-legal__year,
.footer-legal__rights {
  margin: 0;
  line-height: 18px;
}

.footer-legal__link {
  color: #F79F24;
  font-weight: 500;
  text-decoration: none;
  font-size: 18px;
  line-height: 18px;
  transition: color .15s, text-decoration-color .15s;
}

.footer-legal__link:hover {
  text-decoration: underline;
}


@media (min-width:1440px) {

  .footer-hero__inner,
  .footer-legal__inner {
    max-width: 1280px;
  }
}


@media (min-width:1280px) and (max-width:1439px) {

  .footer-hero__inner,
  .footer-legal__inner {
    max-width: 1200px;
  }
}


@media (min-width:1025px) and (max-width:1279px) {

  .footer-hero__inner,
  .footer-legal__inner {
    max-width: 1080px;
    padding: 0 28px;
  }
}


@media (max-width:1024px) {
  .footer-hero {
    padding: 28px 0;
  }

  .footer-hero__inner {
    padding: 0 24px;
    gap: 24px;
  }

  .footer-legal {
    padding: 20px 0;
  }

  .footer-legal__inner {
    padding: 0 24px;
  }
}


@media (min-width:600px) and (max-width:899px) {
  .footer-hero__inner {
    gap: 20px;
  }

  .soc {
    width: 30px;
    height: 30px;
  }

  .backtop {
    padding: 8px 14px;
  }
}

@media (max-width:599px) {

  .footer-hero {
    display: flex;
    padding: 20px 16px !important;
    align-items: center;
    border-bottom: 1px solid #EDEDED;
    background:
      url('/Images/footer.webp') lightgray -60px -64px/130% 274% no-repeat,
      linear-gradient(90deg, #F79F24 0%, #FABE59 100%);
  }

  .footer-hero__inner {
    padding: 0 !important;
    width: 100% !important;
    gap: 16px !important;
  }

  .footer-hero__left {
    margin: 0 !important;
  }

  .footer-hero__title {
    color: #FFF !important;
    font: 600 14px/22px 'Urbanist', sans-serif !important;
  }

  .footer-hero__socials {
    gap: 8px !important;
  }

  .soc {
    width: 32px !important;
    height: 32px !important;
  }

  .soc img {
    width: 16px !important;
    height: 16px !important;
  }

  .backtop {
    margin-left: auto !important;
    display: flex !important;
    padding: 6px 12px !important;
    gap: 4px !important;
    border-radius: 8px !important;
    background: #FDFAED !important;
    color: #F79F24 !important;
    font: 500 12px/18px 'Urbanist', sans-serif !important;
    box-shadow: 0 0 2px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .14) !important;
  }

  .footer-legal {
    display: flex !important;
    padding: 10px 16px !important;
    background: #F5F5F5 !important;
  }

  .footer-legal__inner {
    padding: 0 !important;
    width: 100% !important;
    gap: 12px !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  .footer-legal__left {
    margin: 0 !important;
    gap: 2px !important;
    align-items: flex-start !important;
  }

  .footer-legal__year,
  .footer-legal__rights {
    color: #9E9E9E !important;
    font: 400 12px/18px 'Urbanist', sans-serif !important;
  }

  .footer-legal__link {
    margin: 0 !important;
    padding: 4px 12px !important;
    border-radius: 8px !important;
    color: #F79F24 !important;
    font: 500 12px/18px 'Urbanist', sans-serif !important;
  }
}


@media (max-width:360px) {
  .footer-hero__socials {
    gap: 0 !important;
  }

  .soc {
    width: 36px !important;
    height: 36px !important;
  }

  .soc img {
    width: 18px !important;
    height: 18px !important;
  }

  .footer-legal__title {
    font-size: 12.5px !important;
  }
}
</style>
