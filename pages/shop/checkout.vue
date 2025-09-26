<template>
    <div class="checkout">
        <div v-if="showDebug" class="debug">
            <label class="debug__item">
                <input type="checkbox" v-model="loading" />
                <span>Loading (Skeleton)</span>
            </label>
            <label class="debug__item">
                <input type="checkbox" v-model="showErrors" />
                <span>Paksa Tampilkan Error</span>
            </label>
            <button class="debug__btn" @click="tryState('normal')">Normal</button>
            <button class="debug__btn" @click="tryState('loading')">Coba Loading</button>
            <button class="debug__btn" @click="tryState('invalid')">Tandai Invalid</button>
            <button class="debug__btn" @click="tryState('filled')">Auto Isi Valid</button>
        </div>

        <nav class="breadcrumb">
            <NuxtLink to="/" class="bc bc--home">Beranda</NuxtLink>
            <img src="/Icons/chevron-right.svg" alt="" class="bc__icon" />
            <span class="bc">Furniture</span>
            <img src="/Icons/chevron-right.svg" alt="" class="bc__icon" />
            <NuxtLink to="/shop/detail-product" class="bc bc--home">Pajamas Unisex</NuxtLink>
            <img src="/Icons/chevron-right.svg" alt="" class="bc__icon" />
            <NuxtLink to="/shop/cart" class="bc bc--home">keranjang</NuxtLink>
            <img src="/Icons/chevron-right.svg" alt="" class="bc__icon" />
            <span class="bc bc--current">Pemesanan</span>
        </nav>

        <div class="cols" :class="{ isLoading: loading }">
            <section class="left">
                <template v-if="loading">
                    <div class="skeleton skeleton__title"></div>
                    <div class="skeleton skeleton__button"></div>
                    <div class="skeleton skeleton__input"></div>
                    <div class="skeleton skeleton__input"></div>
                    <div class="skeleton skeleton__input"></div>
                    <div class="skeleton skeleton__row">
                        <div class="skeleton skeleton__input half"></div>
                        <div class="skeleton skeleton__input half"></div>
                    </div>
                    <div class="skeleton skeleton__input"></div>
                    <div class="skeleton skeleton__title mt-12"></div>
                    <div class="skeleton skeleton__input"></div>
                    <div class="skeleton skeleton__input"></div>
                    <div class="skeleton skeleton__checkbox"></div>
                    <div class="skeleton skeleton__notice"></div>
                    <div class="skeleton skeleton__cta"></div>
                </template>

                <template v-else>
                    <header class="sec-head">
                        <h2 class="sec-title">Dikirim Ke</h2>
                        <button type="button" class="sec-link sec-link--below">
                            Baca dulu informasi pengirimannya yuk!
                        </button>
                    </header>

                    <div class="field">
                        <label class="label">Nama Lengkap</label>
                        <input class="input" :class="errorClass('name')" type="text" placeholder="John"
                            v-model.trim="form.name" @blur="touched.name = true" />
                        <p v-if="showFieldError('name')" class="error-text">Nama wajib diisi.</p>
                    </div>

                    <div class="field">
                        <label class="label">Alamat</label>
                        <input class="input" :class="errorClass('address')" type="text"
                            placeholder="Perumahan Pandawa 5, Banyumanik, Kota Semarang" v-model.trim="form.address"
                            @blur="touched.address = true" />
                        <p v-if="showFieldError('address')" class="error-text">Alamat wajib diisi.</p>
                    </div>

                    <div class="field">
                        <div class="label-row">
                            <label class="label">Detail Alamat</label>
                            <span class="opt">Optional</span>
                        </div>
                        <input class="input" type="text" placeholder="Rumah, Apartement, dll"
                            v-model.trim="form.detail" />
                    </div>

                    <div class="grid-2">
                        <div class="field">
                            <label class="label">Provinsi</label>
                            <div class="cselect" :class="[{ open: openWhich === 'provinsi' }, errorClass('provinsi')]"
                                @click.stop="toggle('provinsi'); touched.provinsi = true">
                                <button type="button" class="cselect__control" :aria-expanded="openWhich === 'provinsi'"
                                    aria-haspopup="listbox">
                                    <span>{{ selProvinsi?.label || 'Pilih provinsi' }}</span>
                                    <img src="/Icons/CaretDownBlack.svg" class="caret" alt="" />
                                </button>
                                <ul v-if="openWhich === 'provinsi'" class="cselect__menu" role="listbox">
                                    <li v-for="opt in provinsiOpts" :key="opt.value" class="cselect__option"
                                        :class="{ isSelected: selProvinsi?.value === opt.value }" role="option"
                                        @click.stop="choose('provinsi', opt)">
                                        {{ opt.label }}
                                    </li>
                                </ul>
                            </div>
                            <p v-if="showFieldError('provinsi')" class="error-text">Provinsi wajib dipilih.</p>
                        </div>

                        <div class="field">
                            <label class="label">Kota</label>
                            <div class="cselect" :class="[{ open: openWhich === 'kota' }, errorClass('kota')]"
                                @click.stop="toggle('kota'); touched.kota = true">
                                <button type="button" class="cselect__control" :aria-expanded="openWhich === 'kota'"
                                    aria-haspopup="listbox">
                                    <span>{{ selKota?.label || 'Pilih kota' }}</span>
                                    <img src="/Icons/CaretDownBlack.svg" class="caret" alt="" />
                                </button>
                                <ul v-if="openWhich === 'kota'" class="cselect__menu" role="listbox">
                                    <li v-for="opt in kotaOpts" :key="opt.value" class="cselect__option"
                                        :class="{ isSelected: selKota?.value === opt.value }" role="option"
                                        @click.stop="choose('kota', opt)">
                                        {{ opt.label }}
                                    </li>
                                </ul>
                            </div>
                            <p v-if="showFieldError('kota')" class="error-text">Kota wajib dipilih.</p>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Kode Pos</label>
                        <div class="cselect" :class="[{ open: openWhich === 'kodepos' }, errorClass('kodepos')]"
                            @click.stop="toggle('kodepos'); touched.kodepos = true">
                            <button type="button" class="cselect__control" :aria-expanded="openWhich === 'kodepos'"
                                aria-haspopup="listbox">
                                <span>{{ selKodepos?.label || 'Pilih kode pos' }}</span>
                                <img src="/Icons/CaretDownBlack.svg" class="caret" alt="" />
                            </button>
                            <ul v-if="openWhich === 'kodepos'" class="cselect__menu" role="listbox">
                                <li v-for="opt in kodeposOpts" :key="opt.value" class="cselect__option"
                                    :class="{ isSelected: selKodepos?.value === opt.value }" role="option"
                                    @click.stop="choose('kodepos', opt)">
                                    {{ opt.label }}
                                </li>
                            </ul>
                        </div>
                        <p v-if="showFieldError('kodepos')" class="error-text">Kode pos wajib dipilih.</p>
                    </div>

                    <header class="sec-head mt-20">
                        <h2 class="sec-title">Informasi Kontak</h2>
                        <p class="sec-sub">Mengisi informasi kontak membantu pengiriman dengan cepat</p>
                    </header>

                    <div class="field">
                        <label class="label">Email</label>
                        <input class="input" :class="errorClass('email')" type="email" placeholder="johndoe@gmail.com"
                            v-model.trim="form.email" @blur="touched.email = true" />
                        <p v-if="showFieldError('email')" class="error-text">Mohon masukkan email yang valid.</p>
                    </div>

                    <div class="field">
                        <label class="label">Nomor Telepon</label>
                        <input class="input" :class="errorClass('phone')" type="tel" placeholder="082000000000"
                            v-model.trim="form.phone" @blur="touched.phone = true" />
                        <p v-if="showFieldError('phone')" class="error-text">Nomor telepon wajib diisi (angka 9–15
                            digit).</p>
                    </div>

                    <label class="agree">
                        <input type="checkbox" v-model="agreed" />
                        <span>Dengan menekan, saya menyetujui syarat & ketentuan yang telah ditentukan oleh PHRI
                            Shop</span>
                    </label>

                    <div class="notice">
                        <div class="notice__left">
                            <img src="/Icons/Info.svg" alt="Info" class="notice__icon" />
                            <p>
                                Pesanan dilakukan sebelum jam 15.00 dari hari Senin–Jumat. Biasanya diproses di hari
                                yang sama. Harga pengiriman mungkin dapat diperbarui sewaktu-waktu setelah alamat
                                dimasukan.
                            </p>
                        </div>
                        <img class="notice__img" src="/Icons/BoxBlue.svg" alt="BoxBlue" />
                    </div>

                    <button class="btn-next" :class="{ enabled: canProceed }" :disabled="!canProceed" @click="submit">
                        Lanjutkan ke Pembayaran
                    </button>
                </template>
            </section>

            <aside class="right">
                <div class="summary" v-if="!loading">
                    <div class="summary__top">
                        <h4 class="summary__title">Ringkasan Pembelian</h4>
                        <span class="summary__count">2 Item</span>
                    </div>

                    <ul class="summary__list">
                        <li class="summary__line">
                            <span class="summary__name">2× PUMA Travel Backpack</span>
                            <span class="summary__price">Rp580.000</span>
                        </li>
                        <li class="summary__line">
                            <span class="summary__name">1× Pajamas Unisex</span>
                            <span class="summary__price">Rp290.000</span>
                        </li>
                        <li class="summary__line">
                            <span class="summary__name">Biaya Pembayaran</span>
                            <span class="summary__price">Rp5.000</span>
                        </li>
                    </ul>

                    <div class="summary__total">
                        <span>Total Pembayaran</span>
                        <b>Rp870.000</b>
                    </div>

                    <div class="cart-mini">
                        <h5 class="cart-mini__title">Di Keranjang</h5>

                        <article class="mini">
                            <figure class="mini__thumb">
                                <img src="/Images/shop/product3.webp" alt="" />
                            </figure>
                            <div class="mini__main">
                                <p class="mini__name">PUMA Travel Backpack</p>
                                <p class="mini__meta">
                                    <span class="meta-label">Warna:</span> <span class="meta-value">Orange</span> •
                                    <span class="meta-label">Ukuran:</span> <span class="meta-value">XL</span> •
                                    <span class="meta-label">Qty:</span> <span class="meta-value">2</span>
                                </p>
                            </div>
                            <div class="mini__price">Rp290.000</div>
                        </article>

                        <article class="mini">
                            <figure class="mini__thumb">
                                <img src="/Images/shop/product.webp" alt="" />
                            </figure>
                            <div class="mini__main">
                                <p class="mini__name">PUMA Travel Backpack</p>
                                <p class="mini__meta">
                                    <span class="meta-label">Warna:</span> <span class="meta-value">Orange</span> •
                                    <span class="meta-label">Ukuran:</span> <span class="meta-value">XL</span> •
                                    <span class="meta-label">Qty:</span> <span class="meta-value">2</span>
                                </p>
                            </div>
                            <div class="mini__price">Rp290.000</div>
                        </article>
                    </div>

                    <div class="summary__links">
                        <NuxtLink to="/help" class="link">Butuh Bantuan?</NuxtLink>
                        <NuxtLink to="/contact" class="link"><u>Hubungi Kami</u></NuxtLink>
                        <NuxtLink to="/shipping" class="link" style="text-decoration: underline">Informasi Pengiriman
                        </NuxtLink>
                    </div>
                </div>

                <div v-else class="summary">
                    <div class="skeleton skeleton__title sm"></div>
                    <div class="skeleton skeleton__row-list"></div>
                    <div class="skeleton skeleton__row-list"></div>
                    <div class="skeleton skeleton__row-list"></div>
                    <div class="skeleton skeleton__total"></div>
                    <div class="skeleton skeleton__mini"></div>
                    <div class="skeleton skeleton__mini"></div>
                    <div class="skeleton skeleton__links"></div>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const showDebug = ref(false)
const loading = ref(false)
const showErrors = ref(false)

function tryState(which: 'normal' | 'loading' | 'invalid' | 'filled') {
    if (which === 'normal') {
        loading.value = false
        showErrors.value = false
        resetForm()
    }
    if (which === 'loading') {
        loading.value = true
        showErrors.value = false
    }
    if (which === 'invalid') {
        loading.value = false
        showErrors.value = true
        resetForm(true)
        markAllTouched()
    }
    if (which === 'filled') {
        loading.value = false
        showErrors.value = false
        autoFill()
        markAllTouched()
    }
}

type Which = 'provinsi' | 'kota' | 'kodepos'
type Opt = { value: string; label: string }

const openWhich = ref<Which | null>(null)

const provinsiOpts: Opt[] = [
    { value: 'jateng', label: 'Jawa Tengah' },
    { value: 'jabar', label: 'Jawa Barat' },
    { value: 'dki', label: 'DKI Jakarta' },
    { value: 'jatim', label: 'Jawa Timur' }
]
const kotaOpts: Opt[] = [
    { value: 'semarang', label: 'Semarang' },
    { value: 'bandung', label: 'Bandung' },
    { value: 'jakarta', label: 'Jakarta' },
    { value: 'surabaya', label: 'Surabaya' }
]
const kodeposOpts: Opt[] = [
    { value: '50272', label: '50272 (Semarang)' },
    { value: '40115', label: '40115 (Bandung)' },
    { value: '10110', label: '10110 (Jakarta Pusat)' },
    { value: '60234', label: '60234 (Surabaya)' }
]

const selProvinsi = ref<Opt | null>(null)
const selKota = ref<Opt | null>(null)
const selKodepos = ref<Opt | null>(null)

const form = ref({
    name: '',
    address: '',
    detail: '',
    email: '',
    phone: ''
})
const agreed = ref(false)

const touched = ref<Record<string, boolean>>({
    name: false,
    address: false,
    provinsi: false,
    kota: false,
    kodepos: false,
    email: false,
    phone: false
})

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isPhone = (v: string) => /^[0-9]{9,15}$/.test(v)

const validators = {
    name: () => form.value.name.length > 0,
    address: () => form.value.address.length > 0,
    provinsi: () => !!selProvinsi.value,
    kota: () => !!selKota.value,
    kodepos: () => !!selKodepos.value,
    email: () => isEmail(form.value.email),
    phone: () => isPhone(form.value.phone)
}

function fieldValid(key: keyof typeof validators) {
    return validators[key]()
}

function showFieldError(key: keyof typeof validators) {
    return (touched.value[key] || showErrors.value) && !fieldValid(key)
}

function errorClass(key: keyof typeof validators) {
    return { 'is-error': showFieldError(key) }
}

const formValid = computed(
    () =>
        fieldValid('name') &&
        fieldValid('address') &&
        fieldValid('provinsi') &&
        fieldValid('kota') &&
        fieldValid('kodepos') &&
        fieldValid('email') &&
        fieldValid('phone')
)

const canProceed = computed(() => agreed.value && formValid.value)

function toggle(which: Which) {
    openWhich.value = openWhich.value === which ? null : which
}

function choose(which: Which, opt: Opt) {
    if (which === 'provinsi') selProvinsi.value = opt
    if (which === 'kota') selKota.value = opt
    if (which === 'kodepos') selKodepos.value = opt
    openWhich.value = null
}

function onDocClick() {
    openWhich.value = null
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

function markAllTouched() {
    Object.keys(touched.value).forEach(k => (touched.value[k] = true))
}

function resetForm(empty = false) {
    selProvinsi.value = null
    selKota.value = null
    selKodepos.value = null
    agreed.value = false
    form.value = {
        name: empty ? '' : '',
        address: empty ? '' : '',
        detail: '',
        email: empty ? '' : '',
        phone: empty ? '' : ''
    }
    Object.keys(touched.value).forEach(k => (touched.value[k] = false))
}

function autoFill() {
    form.value = {
        name: 'John Doe',
        address: 'Perum Pandawa 5, Banyumanik, Kota Semarang',
        detail: 'Blok C No.12 (Rumah)',
        email: 'john@example.com',
        phone: '081234567890'
    }
    selProvinsi.value = provinsiOpts[0]
    selKota.value = kotaOpts[0]
    selKodepos.value = kodeposOpts[0]
    agreed.value = true
}

function submit() {
    if (!formValid.value) {
        markAllTouched()
        showErrors.value = true
        return
    }
    alert('Form valid. Lanjut ke pembayaran!')
}
</script>

<style scoped>
.debug {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 10px 12px;
    border: 1px dashed #e0e0e0;
    border-radius: 10px;
    margin: 12px 0 8px;
    background: #fafafa;
}

.debug__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: 500 13px/18px var(--Font-Family-Text-Body, Urbanist);
    color: #424242;
}

.debug__btn {
    height: 28px;
    padding: 0 10px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background: #fff;
    font: 600 12px/28px var(--Font-Family-Text-Body, Urbanist);
    cursor: pointer;
}

.debug__btn:hover {
    background: #f7f7f7;
}

.checkout {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px 56px;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 18px 0 14px;
}

.bc {
    color: #757575;
    text-align: center;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
}

.bc--home {
    color: #757575;
    text-decoration: none !important;
}

.bc--current {
    color: #0a0a0a;
}

.bc__icon {
    width: 14px;
    height: 14px;
}

.cols {
    display: grid;
    grid-template-columns: 1fr 392px;
    grid-template-areas: "left right";
    gap: 28px;
    align-items: start;
    margin-top: 20px;
}

.cols.isLoading {
    pointer-events: none;
}

.left {
    grid-area: left;
}

.right {
    grid-area: right;
    position: relative;
    margin-left: 60px;
}

.left {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.sec-head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}

.sec-link--below {
    color: var(--Text-color-text-neutral-secondary, #757575);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-SM, 16px);
    font-style: normal;
    font-weight: var(--Weight-weight-400, 400);
    line-height: var(--Font-Line-Height-SM, 24px);
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
}

.sec-title {
    margin: 30px 0 0 0;
    color: #000;
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-M, 20px);
    font-style: normal;
    font-weight: var(--Weight-weight-600, 600);
    line-height: var(--Font-Line-Height-M, 28px);
    letter-spacing: -0.003px;
}

.sec-link {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: #757575;
    font: 500 12px/18px var(--Font-Family-Text-Body, Urbanist);
    text-decoration: underline;
}

.sec-sub {
    margin: 0;
    color: var(--Text-color-text-neutral-secondary, #757575);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-SM, 16px);
    font-style: normal;
    font-weight: var(--Weight-weight-400, 400);
    line-height: var(--Font-Line-Height-SM, 24px);
}

.mt-20 {
    margin-top: 6px;
}

.label {
    color: var(--Text-color-text-neutral-primary, #0a0a0a);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-S, 14px);
    font-style: normal;
    font-weight: var(--Weight-weight-500, 500);
    line-height: var(--Font-Line-Height-S, 22px);
    margin-bottom: 6px;
}

.label-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.opt {
    color: var(--Text-color-text-neutral-secondary, #757575);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-XS, 12px);
    font-style: normal;
    font-weight: var(--Weight-weight-400, 400);
    line-height: var(--Font-Line-Height-XS, 18px);
}

.field {
    display: flex;
    flex-direction: column;
}

.input {
    height: 40px;
    border: 1px solid #ededed;
    border-radius: 8px;
    padding: 0 12px;
    font: 400 14px/22px var(--Font-Family-Text-Body, Urbanist);
    color: #0a0a0a;
    background: #fff;
}

.input::placeholder {
    color: #9e9e9e;
}

.cselect {
    position: relative;
}

.cselect__control {
    width: 100%;
    height: 40px;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    background: #fff;
    padding: 0 36px 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font: 400 14px/22px var(--Font-Family-Text-Body, Urbanist);
    color: #0a0a0a;
    cursor: pointer;
}

.cselect__control:focus {
    outline: none;
    box-shadow: none;
    border-color: #eaeaea;
}

.cselect .caret {
    position: absolute;
    right: 12px;
    top: 50%;
    width: 14px;
    height: 14px;
    opacity: .8;
    transform: translateY(-50%) rotate(0);
    transition: transform .2s ease;
}

.cselect.open .caret {
    transform: translateY(-50%) rotate(180deg);
}

.cselect__menu {
    position: absolute;
    z-index: 40;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, .06);
    padding: 6px;
    max-height: 232px;
    overflow: auto;
    scrollbar-width: thin;
}

.cselect__option {
    padding: 10px 10px;
    border-radius: 8px;
    font: 400 14px/20px var(--Font-Family-Text-Body, Urbanist);
    color: #0a0a0a;
    cursor: pointer;
}

.cselect__option:hover {
    background: #fff4e5;
}

.cselect__option.isSelected {
    background: #ffe5c2;
}

.cselect.open,
.cselect:has(.cselect__control:focus) {
    border-radius: 8px;
    box-shadow: 0 0 0 2px rgba(247, 159, 36, 0.15);
}

.is-error .input,
.input.is-error {
    border-color: #E53935 !important;
    background: #FFF6F6;
}

.cselect.is-error .cselect__control {
    border-color: #E53935 !important;
    background: #FFF6F6;
}

.error-text {
    margin: 6px 0 0;
    color: #E53935;
    font: 600 12px/18px var(--Font-Family-Text-Body, Urbanist);
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.agree {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 30px;
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-XS, 12px);
    font-weight: var(--Weight-weight-400, 400);
    line-height: var(--Font-Line-Height-XS, 18px);
}

.agree input {
    width: 16px;
    height: 16px;
    accent-color: #D47E1A;
}

.input:focus,
.cselect__control:focus,
textarea:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: #eaeaea;
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
    box-shadow: 0 0 0px 1000px #fff inset !important;
    -webkit-text-fill-color: #0A0A0A !important;
}

.notice {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    background: #F3F8FF;
    border: 1px solid #E5F0FF;
    margin-top: 20px;
}

.notice__left {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    flex: 1;
}

.notice__left p {
    margin: 0;
    color: var(--Text-color-text-info, #1CA0D6);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-SM, 16px);
    font-weight: var(--Weight-weight-400, 400);
    line-height: var(--Font-Line-Height-SM, 24px);
}

.notice__img {
    width: 92px;
    height: auto;
    flex-shrink: 0;
}

.notice__icon {
    width: 18px;
    height: 18px;
    position: relative;
    top: 30px;
    left: 2px;
}

.btn-next {
    width: 100%;
    height: 40px;
    border-radius: 10px;
    border: 0;
    background: #ededed;
    color: #9e9e9e;
    font: 600 16px/24px var(--Font-Family-Text-Body, Urbanist);
    margin-top: 8px;
    cursor: not-allowed;
    transition: background .2s ease, color .2s ease, transform .02s ease;
}

.btn-next.enabled {
    background: var(--Bg-color-bg-button-primary-default, #F79F24);
    color: #fff;
    cursor: pointer;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .12), 0 1px 2px 0 rgba(0, 0, 0, .14);
}

.btn-next.enabled:active {
    transform: translateY(1px);
}

.summary {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid #ededed;
    border-radius: 16px;
    background: #fff;
    padding: 12px;
    width: min(392px, 100%);
    box-sizing: border-box;
}

.summary__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.summary__title,
.summary__count {
    margin: 0;
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-S, 16px);
    font-weight: var(--Weight-weight-600, 600);
    line-height: var(--Font-Line-Height-SM, 24px);
}

.summary__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.summary__line {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.summary__name {
    color: var(--Text-color-text-neutral-secondary, #757575);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-S, 14px);
    font-weight: var(--Weight-weight-400, 400);
    line-height: var(--Font-Line-Height-S, 22px);
}

.summary__price {
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-S, 14px);
    font-weight: var(--Weight-weight-600, 600);
    line-height: var(--Font-Line-Height-S, 22px);
}

.summary__total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-top: 1px dashed #eaeaea;
    border-bottom: 1px dashed #eaeaea;
}

.summary__total span,
.summary__total b {
    color: #0a0a0a;
    font: 600 16px/24px var(--Font-Family-Text-Body, Urbanist);
}

.cart-mini__title {
    margin: 0 0 12px;
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-S, 14px);
    font-weight: var(--Weight-weight-600, 600);
    line-height: var(--Font-Line-Height-S, 22px);
}

.mini {
    display: grid;
    grid-template-columns: 64px 1fr;
    grid-auto-rows: auto;
    column-gap: 12px;
    row-gap: 4px;
    align-items: start;
    padding: 8px 6px;
    border-radius: 12px;
}

.mini+.mini {
    margin-top: 10px;
    padding-top: 12px;
    border-top: 1px solid #EEE;
}

.mini__thumb {
    width: 64px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    background: #F2F2F2;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mini__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.mini__name {
    grid-column: 2;
    margin: 0;
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-S, 14px);
    font-weight: var(--Weight-weight-600, 600);
    line-height: var(--Font-Line-Height-S, 22px);
}

.mini__meta {
    grid-column: 2;
    margin: 2px 0 0;
    color: #757575;
    font: 500 12px/18px var(--Font-Family-Text-Body, Urbanist);
    letter-spacing: .2px;
}

.mini__price {
    grid-column: 2;
    margin-top: -30px;
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-S, 14px);
    font-weight: var(--Weight-weight-700, 700);
    line-height: var(--Font-Line-Height-S, 22px);
}

.meta-label {
    color: var(--Text-color-text-neutral-primary, #0A0A0A);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-XS, 12px);
    font-weight: var(--Weight-weight-500, 500);
    line-height: var(--Font-Line-Height-XS, 18px);
}

.meta-value {
    color: var(--Text-color-text-neutral-secondary, #757575);
    font-family: var(--Font-Family-Text-Body, Urbanist);
    font-size: var(--Font-Size-XS, 12px);
    font-weight: var(--Weight-weight-400, 400);
    line-height: var(--Font-Line-Height-XS, 18px);
    margin-left: 2px;
}

.summary__links {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
}

.summary__links .link {
    color: #757575;
    text-decoration: none;
    font: 400 14px/22px var(--Font-Family-Text-Body, Urbanist);
}

.summary__links .link:hover {
    color: #0a0a0a;
}

.skeleton {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    background: #f1f1f1;
}

.skeleton::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .7) 50%, rgba(255, 255, 255, 0) 100%);
    transform: translateX(-100%);
    animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

.skeleton__title {
    height: 22px;
    width: 40%;
}

.skeleton__title.sm {
    width: 55%;
}

.skeleton__button {
    height: 18px;
    width: 280px;
    border-radius: 6px;
    margin-top: 6px;
}

.skeleton__input {
    height: 40px;
    width: 100%;
}

.skeleton__input.half {
    width: 100%;
}

.skeleton__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.skeleton__checkbox {
    height: 18px;
    width: 70%;
    border-radius: 6px;
}

.skeleton__notice {
    height: 76px;
    width: 100%;
    border-radius: 12px;
}

.skeleton__cta {
    height: 40px;
    width: 100%;
    border-radius: 10px;
}

.skeleton__row-list {
    height: 18px;
    width: 100%;
    border-radius: 6px;
}

.skeleton__total {
    height: 42px;
    width: 100%;
    border-radius: 10px;
}

.skeleton__mini {
    height: 84px;
    width: 100%;
    border-radius: 12px;
}

.skeleton__links {
    height: 24px;
    width: 70%;
    border-radius: 6px;
}

.mt-12 {
    margin-top: 12px;
}

@media (min-width: 1440px) {
    .checkout {
        max-width: 1280px;
    }

    .cols {
        gap: 32px;
    }

    .summary {
        width: 420px;
    }
}

@media (min-width: 1280px) and (max-width: 1439px) {
    .checkout {
        max-width: 1200px;
    }

    .cols {
        gap: 28px;
    }

    .summary {
        width: 392px;
    }
}

@media (min-width: 1025px) and (max-width: 1279px) {
    .checkout {
        max-width: 1080px;
    }

    .cols {
        gap: 24px;
        grid-template-columns: 1fr 360px;
    }

    .summary {
        width: 360px;
    }
}

@media (max-width: 1024px) {
    .cols {
        grid-template-columns: 1fr;
        grid-template-areas:
            "right"
            "left";
        gap: 16px;
    }

    .summary {
        width: 100%;
    }

    .right {
        margin-left: 0;
    }

    .summary__list {
        gap: 8px;
    }

    .mini {
        padding: 8px;
    }
}

@media (max-width: 768px) {
    .checkout {
        padding: 0 18px 48px;
    }

    .bc {
        font-size: 13px;
        line-height: 20px;
    }

    .sec-title {
        font-size: 18px;
        line-height: 26px;
    }

    .summary__title,
    .summary__count {
        font-size: 15px;
        line-height: 22px;
    }

    .summary__name,
    .summary__price {
        font-size: 13px;
        line-height: 20px;
    }

    .notice__left p {
        font-size: 15px;
        line-height: 22px;
    }

    .cselect__menu {
        max-height: min(50vh, 280px);
    }
}

@media (max-width: 600px) {
    .checkout {
        padding: 0 16px 48px;
    }

    .grid-2 {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .summary {
        display: flex;
        flex-direction: column;
    }

    .cart-mini {
        order: 1;
    }

    .summary__top {
        order: 2;
    }

    .summary__list {
        order: 3;
    }

    .summary__total {
        order: 4;
    }

    .summary__links {
        order: 5;
    }

    .cart-mini {
        padding-bottom: 8px;
        border-bottom: 1px dashed #eaeaea;
        margin-bottom: 8px;
    }

    .mini {
        grid-template-columns: 56px 1fr;
    }

    .mini__thumb {
        width: 56px;
        height: 72px;
    }

    .mini__price {
        margin-top: -24px;
    }

    .notice {
        gap: 10px;
        padding: 12px;
    }

    .notice__img {
        width: 72px;
    }

    .btn-next {
        position: sticky;
        bottom: 12px;
        z-index: 20;
    }
}

@media (max-width: 480px) {
    .checkout {
        padding: 0 14px 44px;
    }

    .input,
    .cselect__control {
        height: 38px;
    }

    .btn-next {
        height: 38px;
        border-radius: 10px;
    }

    .summary {
        padding: 10px;
        border-radius: 14px;
    }

    .mini {
        grid-template-columns: 52px 1fr;
        column-gap: 10px;
    }

    .mini__thumb {
        width: 52px;
        height: 68px;
        border-radius: 10px;
    }

    .mini__price {
        margin-top: -20px;
    }

    .notice {
        padding: 10px 12px;
        gap: 8px;
        border-radius: 10px;
    }

    .notice__img {
        width: 68px;
    }

    .cselect__option {
        padding: 9px 10px;
    }
}

@media (max-width: 360px) {
    .checkout {
        padding: 0 12px 40px;
    }

    .summary__title,
    .summary__count {
        font-size: 14px;
    }

    .summary__name,
    .summary__price {
        font-size: 12.5px;
    }

    .mini {
        grid-template-columns: 48px 1fr;
    }

    .mini__thumb {
        width: 48px;
        height: 62px;
    }

    .notice__img {
        display: none;
    }
}
</style>
