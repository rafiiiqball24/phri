<template>
  <section class="contact container">
    <div class="headrow">
      <div class="headcopy">
        <h1 class="title">Hubungi Kami</h1>
        <p class="sub">
          Kami siap mendengar dan membantu. Silakan hubungi kami untuk pertanyaan, kerja sama, atau informasi lebih
          lanjut. Tim kami akan merespons dengan cepat dan ramah.
        </p>
      </div>

      <div class="miniinfo">
        <span class="ico ico--pin" aria-hidden="true">
          <img src="/img/icons/MapPin.svg" alt="" />
        </span>
        <p class="miniinfo__title">Alamat Kami</p>
        <p class="miniinfo__desc">
          Hotel Grand Sahid Jaya | Shopping Arcade No. 04-05, Jalan Jend. Sudirman No. 86, Jakarta
        </p>
      </div>

      <div class="miniinfo">
        <span class="ico ico--phone" aria-hidden="true">
          <img src="/img/icons/Phone.svg" alt="" />
        </span>
        <p class="miniinfo__title">Kontak Kami</p>
        <p class="miniinfo__desc">
          <a href="tel:+6221684118" class="link link--phone">
            <img src="/img/icons/Phone.svg" alt="" class="link-icon" /> +62 21684118 </a
          ><br />
          <a href="mailto:bppphri@phri.or.id" class="link link--mail">
            <img src="/img/icons/Envelope.svg" alt="" class="link-icon" /> bppphri@phri.or.id
          </a>
        </p>
      </div>
    </div>

    <div class="layout">
      <section class="formcard" aria-label="Formulir kontak">
        <form @submit.prevent="onSubmit" novalidate>
          <div class="field">
            <label for="name">Nama Lengkap</label>
            <div class="iwrap">
              <img src="/img/icons/User.svg" class="icon" alt="" aria-hidden="true" />
              <input id="name" v-model.trim="form.name" class="input" placeholder="Dino" autocomplete="name" required />
            </div>
            <p v-if="errors.name" class="err">{{ errors.name }}</p>
          </div>

          <div class="field">
            <label for="email">Alamat Email</label>
            <div class="iwrap">
              <img src="/img/icons/Envelope.svg" class="icon" alt="" aria-hidden="true" />
              <input
                id="email"
                v-model.trim="form.email"
                class="input"
                placeholder="Masukkan emailmu"
                type="email"
                autocomplete="email"
                required />
            </div>
            <p v-if="errors.email" class="err">{{ errors.email }}</p>
          </div>

          <div class="field">
            <label for="phone">Nomor Ponsel</label>
            <div class="phonewrap">
              <button type="button" class="codebtn" aria-label="Kode negara Indonesia">
                <img src="/img/icons/FlagID.svg" alt="" class="flag" />
                <span>+62</span>
              </button>
              <div class="iwrap iwrap--plain">
                <input
                  id="phone"
                  v-model.trim="form.phone"
                  class="input input--phone"
                  placeholder="853xxxxxxx"
                  inputmode="numeric"
                  autocomplete="tel-national"
                  @input="digitsOnly('phone')" />
              </div>
            </div>
            <p v-if="errors.phone" class="err">{{ errors.phone }}</p>
          </div>

<<<<<<< HEAD
          <div class="field">
            <label for="message">Pesan</label>
            <textarea
              id="message"
              v-model.trim="form.message"
              class="textarea"
              rows="6"
              placeholder="Sampaikan catatanmu untuk kami"
              required />
            <p v-if="errors.message" class="err">{{ errors.message }}</p>
          </div>

          <p v-if="alert.type" :class="['alert', `alert--${alert.type}`]">{{ alert.text }}</p>

          <button type="submit" class="btn" :disabled="submitting">
            <span v-if="!submitting">Kirim</span>
            <span v-else>Mengirim…</span>
          </button>
        </form>
      </section>

      <aside class="mapwrap" aria-label="Peta lokasi PHRI">
        <iframe
          class="map"
          src="https://www.google.com/maps?q=-6.2108424,106.8186673&z=18&output=embed"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Lokasi PHRI" />
      </aside>
    </div>
  </section>
=======
        <div v-if="alert.type" :class="['top-alert', `top-alert--${alert.type}`]">
            <span>{{ alert.text }}</span>
        </div>

        <div class="layout">
            <!-- Tambah class float-left-up agar form sedikit naik & melebar ke kiri -->
            <section class="formcard float-left-up">
                <form @submit.prevent="onSubmit" novalidate>
                    <div class="field">
                        <label for="name">Nama Lengkap</label>
                        <div class="iwrap">
                            <img src="/Icons/User.svg" class="icon" alt="" />
                            <input id="name" v-model.trim="form.name" class="input" placeholder="Dino"
                                autocomplete="name" />
                        </div>
                        <p v-if="errors.name" class="err">{{ errors.name }}</p>
                    </div>

                    <div class="field">
                        <label for="email">Alamat Email</label>
                        <div class="iwrap">
                            <img src="/Icons/Envelope.svg" class="icon" alt="" />
                            <input id="email" v-model.trim="form.email" class="input" placeholder="Masukkan emailmu"
                                type="email" autocomplete="email" />
                        </div>
                        <p v-if="errors.email" class="err">{{ errors.email }}</p>
                    </div>

                    <div class="field">
                        <label for="phone">Nomor Ponsel</label>
                        <div class="phonewrap">
                            <button type="button" class="codebtn">
                                <img src="/Icons/FlagID.svg" alt="" class="flag" />
                                <span>+62</span>
                            </button>
                            <div class="iwrap iwrap--plain">
                                <input id="phone" v-model.trim="form.phone" class="input input--phone"
                                    placeholder="853xxxxxxx" inputmode="numeric" @input="digitsOnly('phone')" />
                            </div>
                        </div>
                        <p v-if="errors.phone" class="err">{{ errors.phone }}</p>
                    </div>

                    <div class="field">
                        <label for="message">Pesan</label>
                        <textarea id="message" v-model.trim="form.message" class="textarea"
                            placeholder="Sampaikan catatanmu untuk kami"></textarea>
                        <p v-if="errors.message" class="err">{{ errors.message }}</p>
                    </div>

                    <button type="submit" class="btn" :disabled="submitting">
                        <span v-if="!submitting">Kirim</span>
                        <span v-else>Mengirim…</span>
                    </button>
                </form>
            </section>

            <aside class="mapwrap">
                <iframe class="map" src="https://www.google.com/maps?q=-6.2108424,106.8186673&z=18&output=embed"
                    allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                    title="Lokasi PHRI"></iframe>
            </aside>
        </div>
    </section>
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const form = reactive({ name: "", email: "", phone: "", message: "" });
const errors = reactive<Record<string, string>>({});
const submitting = ref(false);
const alert = reactive<{ type: "" | "success" | "error"; text: string }>({ type: "", text: "" });

<<<<<<< HEAD
useHead({
  title: "Contact",
});
=======
useHead({ title: 'Contact' })
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)

function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k]);
}

function validate() {
  clearErrors();
  if (!form.name) errors.name = "Nama wajib diisi.";
  if (!form.email) errors.email = "Email wajib diisi.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Format email tidak valid.";
  if (!form.message) errors.message = "Pesan wajib diisi.";
  return Object.keys(errors).length === 0;
}

function digitsOnly(field: "phone") {
  form[field] = form[field].replace(/\D+/g, "");
}

async function onSubmit() {
<<<<<<< HEAD
  if (!validate()) return;
  submitting.value = true;
  alert.type = "";
  alert.text = "";
  try {
    await $fetch(`${import.meta.env.VITE_APP_BASE_URL}contact-us`, {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_APP_API_KEY as string,
        Accept: "application/json",
      },
      body: {
        name: form.name,
        email: form.email,
        phone: form.phone ? `+62${form.phone}` : "",
        message: form.message,
      },
    });
    alert.type = "success";
    alert.text = "Pesan berhasil dikirim.";
    form.name = "";
    form.email = "";
    form.phone = "";
    form.message = "";
  } catch (e: any) {
    if (e?.status === 422 && e?.data?.errors) {
      Object.keys(e.data.errors).forEach((k) => {
        errors[k] = e.data.errors[k][0];
      });
      alert.type = "error";
      alert.text = e?.data?.message || "Validasi gagal.";
    } else {
      alert.type = "error";
      alert.text = "Gagal mengirim. Coba lagi.";
=======
    if (!validate()) return
    submitting.value = true
    alert.type = ''
    alert.text = ''
    try {
        await $fetch(`${import.meta.env.VITE_APP_BASE_URL}contact-us`, {
            method: 'POST',
            headers: {
                'x-api-key': import.meta.env.VITE_APP_API_KEY as string,
                Accept: 'application/json'
            },
            body: {
                name: form.name,
                email: form.email,
                phone: form.phone ? `+62${form.phone}` : '',
                message: form.message
            }
        })
        alert.type = 'success'
        alert.text = 'Berhasil mengirim Pesan ke Admin'
        form.name = ''
        form.email = ''
        form.phone = ''
        form.message = ''
        setTimeout(() => (alert.type = ''), 4000)
    } catch (e: any) {
        alert.type = 'error'
        alert.text = 'Gagal mengirim Pesan ke Admin'
        setTimeout(() => (alert.type = ''), 4000)
    } finally {
        submitting.value = false
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 20px;
}

.headrow {
  display: grid;
  grid-template-columns: minmax(360px, 1fr) 1fr 1fr;
  gap: 32px;
  align-items: start;
  margin-bottom: 32px;
}

@media (max-width: 1100px) {
  .headrow {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }
}

.title {
  color: #0a0a0a;
  font-family: Urbanist, sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  margin: 0 0 8px;
}

.sub {
  color: #757575;
  font-family: Urbanist, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  margin: 0;
}

.miniinfo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.ico {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ico img {
  width: 18px;
  height: 18px;
}

.ico--pin {
  background: #fdfaed;
}

.ico--phone {
  background: #dcfce7;
}

.miniinfo__title {
  margin-top: 8px;
  color: #0a0a0a;
  font-family: Urbanist, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.miniinfo__desc {
  margin-top: 2px;
  color: #757575;
  font-family: Urbanist, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0a0a0a;
  font-size: 13px;
  text-decoration: none;
}

.link:hover {
  color: #f59e0b;
}

.link-icon {
  width: 16px;
  height: 16px;
}


.layout {
<<<<<<< HEAD
  display: grid;
  grid-template-columns: minmax(0, 1fr) 520px;
  gap: 28px;
  align-items: start;
=======
    display: grid;
    grid-template-columns: 1.7fr 600px;
    gap: 24px;
    align-items: start;
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.formcard {
<<<<<<< HEAD
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 16px;
  padding: 22px;
=======
    background: #fff;
    border-radius: 16px;
    padding: 22px 28px;
    width: 100%;
    max-width: 100%;
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)
}


.float-left-up {
    margin-top: -28px;
}


.mapwrap {
    width: 600px;
    height: 460px;
    border: 1px solid #E6E6E6;
    border-radius: 12px;
    overflow: hidden;
}

@media (max-width:1024px) {
    .mapwrap {
        width: 100%;
        height: 360px;
    }
}

.map {
    width: 100%;
    height: 100%;
    border: 0;
}


.field {
  margin-bottom: 18px;
}

.field label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #0a0a0a;
}

.iwrap {
<<<<<<< HEAD
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 0 12px;
  min-height: 48px;
  background: #fff;
=======
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #E6E6E6;
    border-radius: 12px;
    padding: 0 14px;
    height: 48px;
    background: #fff;
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)
}

.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  height: 48px;
}

.input::placeholder {
  color: #a1a1aa;
}


.textarea {
<<<<<<< HEAD
  width: 100%;
  min-height: 140px;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 12px 16px;
  outline: none;
  resize: none;
  color: var(--Text-color-text-neutral-secondary, #757575);
  font-family: var(--Font-Family-Text-Body, Urbanist);
  font-size: var(--Font-Size-SM, 16px);
  font-style: normal;
  font-weight: var(--Weight-weight-400, 400);
  line-height: var(--Font-Line-Height-SM, 24px);
=======
    width: 100%;
    height: 90px;
    border: 1px solid #E6E6E6;
    border-radius: 12px;
    padding: 12px 16px;
    outline: none;
    resize: none;
    color: #757575;
    font-family: Urbanist, sans-serif;
    font-size: 16px;
    line-height: 22px;
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)
}

.textarea::placeholder {
  color: #a1a1aa;
}

.phonewrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
}

.codebtn {
<<<<<<< HEAD
  appearance: none;
  border: 1px solid #e6e6e6;
  background: #fff;
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #0a0a0a;
  cursor: default;
=======
    border: 1px solid #E6E6E6;
    background: #fff;
    height: 48px;
    padding: 0 14px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #0A0A0A;
    cursor: default;
    min-width: 96px;
    justify-content: center;
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)
}

.flag {
  width: 18px;
  height: 18px;
}

.iwrap--plain {
<<<<<<< HEAD
  flex: 1 1 auto;
  border: none !important;
  padding: 0 !important;
  min-height: unset;
  background: transparent;
=======
    flex: 1 1 auto;
    border: none !important;
    padding: 0 !important;
    background: transparent;
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)
}

.input--phone {
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  height: 48px;
  padding: 0 16px;
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  outline: none;
  font-size: 14px;
}

.input--phone::placeholder {
  color: #a1a1aa;
}

.err {
  color: #dc2626;
  font-size: 12px;
  margin-top: 6px;
}

<<<<<<< HEAD
.alert {
  margin: 12px 0;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
}

.alert--success {
  background: #ecfdf5;
  color: #065f46;
}

.alert--error {
  background: #fef2f2;
  color: #991b1b;
}
=======
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)

.btn {
  background: #f59e0b;
  color: #fff;
  border: none;
  border-radius: 10px;
  height: 48px;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover:not(:disabled) {
  background: #d97706;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

<<<<<<< HEAD
.mapwrap {
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 500px;
  border: 0;
=======

.top-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 10px rgba(0, 0, 0, .1);
}

.top-alert--success {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
}

.top-alert--error {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
>>>>>>> 83d9b82 (fix navbar link and improve contact form alert handling)
}
</style>
