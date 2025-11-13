<template>
    <section class="container">
        <nav class="bc" aria-label="Breadcrumb">
            <ol class="bc__list">
                <li v-for="(it, i) in crumbsView" :key="i" class="bc__item"
                    :class="{ current: i === crumbsView.length - 1 }">
                    <span v-if="i > 0" class="bc__sep">›</span>
                    <NuxtLink v-if="it.to && !it.isEllipsis && i !== crumbsView.length - 1" :to="it.to"
                        class="bc__link">{{ it.label }}</NuxtLink>
                    <NuxtLink v-else-if="it.isEllipsis" to="/detail-product" class="bc__link bc__dots">…</NuxtLink>
                    <span v-else class="bc__text" :aria-current="i === crumbsView.length - 1 ? 'page' : undefined">{{
                        it.label }}</span>
                </li>
            </ol>
        </nav>

        <div class="cols">
            <section class="left">
                <div v-if="showErr && !valid" class="error-banner">Mohon lengkapi data yang wajib diisi dan pastikan
                    format sudah benar.</div>

                <template v-if="dbg.loading">
                    <div class="skel skel--title"></div>
                    <div class="skel skel--input"></div>
                    <div class="skel skel--input"></div>
                    <div class="skel skel--input"></div>
                </template>

                <template v-else>
                    <header class="sec-head">
                        <h2 class="sec-title">Dikirim Ke</h2>
                        <NuxtLink to="/Help" class="sec-link">Baca dulu informasi pengirimannya yuk!</NuxtLink>
                    </header>

                    <div class="field">
                        <label class="label">Nama Lengkap</label>
                        <input class="input" :class="{ 'input--error': shouldShowError('name') }"
                            v-model.trim="form.name" placeholder="John" @blur="touched.name = true" />
                        <p v-if="!form.name && shouldShow('name')" class="error-text">Harap masukkan nama lengkap Anda
                        </p>
                        <p v-else-if="form.name.length < 3 && shouldShow('name')" class="error-text">Nama harus minimal
                            3 karakter</p>
                        <p v-else-if="!nameValid(form.name) && shouldShow('name')" class="error-text">Hanya boleh
                            menggunakan huruf</p>
                    </div>

                    <div class="field">
                        <label class="label">Alamat</label>
                        <input class="input" :class="{ 'input--error': shouldShowError('address') }"
                            v-model.trim="form.address" placeholder="Perumahan ..." @blur="touched.address = true" />
                        <p v-if="!form.address && shouldShow('address')" class="error-text">Mohon masukkan alamat Anda
                        </p>
                    </div>

                    <div class="field">
                        <div class="label-row">
                            <label class="label">Detail Alamat</label><span class="opt">Optional</span>
                        </div>
                        <input class="input" v-model.trim="form.detail" placeholder="Rumah, Apartemen, dll" />
                    </div>

                    <div class="grid-2">
                        <div class="field">
                            <label class="label">Provinsi</label>
                            <template v-if="provLoading">
                                <div class="skel skel--input"></div>
                            </template>
                            <template v-else>
                                <CustomSelect :key="provKey" v-model="selProvinsi" :options="provinsiOpts"
                                    placeholder="Pilih provinsi" :invalid="shouldShowError('provinsi')"
                                    @update:modelValue="touched.provinsi = true" />
                            </template>
                            <p v-if="!selProvinsi && shouldShow('provinsi')" class="error-text">Pilih provinsi terlebih
                                dahulu</p>
                        </div>

                        <div class="field">
                            <label class="label">Kota</label>
                            <div class="select-wrap" :class="{ 'is-disabled': kotaDisabled }">
                                <CustomSelect v-model="selKota" :options="kotaOpts" placeholder="Pilih kota"
                                    :invalid="shouldShowError('kota')" />
                                <div v-if="kotaDisabled" class="select-guard" @click="onKotaGuardClick"></div>
                            </div>
                            <p v-if="kotaDisabled && showKotaHint" class="error-text">Pilih provinsi terlebih dahulu</p>
                            <p v-else-if="!selKota && shouldShow('kota')" class="error-text">Pilih kota sesuai provinsi
                            </p>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Kode Pos</label>
                        <input class="input" :class="{ 'input--error': shouldShowError('postalcode') }"
                            v-model.trim="form.postalcode" placeholder="50268" inputmode="numeric" maxlength="5"
                            @input="digitsOnly('postalcode')" @blur="touched.postalcode = true" />
                        <p v-if="!form.postalcode && shouldShow('postalcode')" class="error-text">Masukkan kode pos Anda
                        </p>
                        <p v-else-if="form.postalcode && !/^[0-9]+$/.test(form.postalcode) && shouldShow('postalcode')"
                            class="error-text">
                            Hanya boleh mengandung angka</p>
                        <p v-else-if="form.postalcode && form.postalcode.length !== 5 && shouldShow('postalcode')"
                            class="error-text">Kode
                            pos harus 5 digit</p>
                    </div>

                    <header class="sec-head mt-20">
                        <h2 class="sec-title">Informasi Kontak</h2>
                        <p class="sec-sub">Mengisi informasi kontak membantu pengiriman dengan cepat</p>
                    </header>

                    <div class="field">
                        <label class="label">Email</label>
                        <input class="input" :class="{ 'input--error': shouldShowError('email') }"
                            v-model.trim="form.email" placeholder="johndoe@gmail.com" @blur="touched.email = true" />
                        <p v-if="!emailOk(form.email) && shouldShow('email')" class="error-text">Harap masukkan alamat
                            email yang valid</p>
                    </div>

                    <div class="field">
                        <label class="label">Nomor Telepon</label>
                        <input class="input" :class="{ 'input--error': shouldShowError('phone') }"
                            v-model.trim="form.phone" placeholder="082000000000" inputmode="tel"
                            @input="digitsOnly('phone', 15)" @blur="touched.phone = true" />
                        <p v-if="!form.phone && shouldShow('phone')" class="error-text">Harap masukkan nomor telepon
                            yang aktif</p>
                        <p v-else-if="form.phone && !/^[0-9]+$/.test(form.phone) && shouldShow('phone')"
                            class="error-text">Hanya boleh
                            mengandung angka</p>
                        <p v-else-if="form.phone && normalizePhone(form.phone).length < 10 && shouldShow('phone')"
                            class="error-text">Nomor
                            terlalu pendek (minimal 10 digit)</p>
                        <p v-else-if="form.phone && normalizePhone(form.phone).length > 13 && shouldShow('phone')"
                            class="error-text">Nomor
                            terlalu panjang (maksimal 13 digit)</p>
                    </div>

                    <label class="agree">
                        <input type="checkbox" v-model="agreed" />
                        <span>Dengan menekan, saya menyetujui syarat & ketentuan yang telah ditentukan oleh PHRI
                            Shop</span>
                    </label>

                    <NoticeInfo>
                        Pesanan dilakukan sebelum jam 15.00 dari hari Senin–Jumat. Biasanya diproses di hari yang sama.
                        Harga pengiriman mungkin diperbarui setelah alamat dimasukkan.
                    </NoticeInfo>

                    <button class="btn btn--primary btn--block" :disabled="!canProceed || sending" @click="submit">
                        {{ sending ? 'Mengirim...' : 'Lanjutkan ke Pembayaran' }}
                    </button>
                </template>
            </section>

            <aside v-if="dbg.loading" class="right skelwrap">
                <div class="skel skel--title"></div>
                <div class="skel skel--mini"></div>
                <div class="skel skel--mini"></div>
            </aside>

            <aside v-else class="right">
                <SummaryBox title="Ringkasan Pembelian" :count-label="`${displayedItems.length} Item`"
                    :lines="[...displayedItems.map(it => ({ name: `${it.qty}× ${it.name}`, price: it.price * it.qty })), ...(paymentFee > 0 ? [{ name: 'Payment Fee', price: paymentFee }] : [])]"
                    total-label="Total Pembayaran" :total="grandTotalWithFee"
                    :links="[{ label: 'Butuh Bantuan?', to: '/Help' }, { label: 'Hubungi Kami', to: '/contact', underline: true }, { label: 'Informasi Pengiriman', to: '/Help', underline: true }]">
                    <template #extra>
                        <div style="margin-top:4px">
                            <MiniCartItem v-for="it in displayedItems" :key="it.id" :image="it.image" :name="it.name"
                                :color="it.color" :size="it.size" :qty="it.qty" :price="it.price" />
                        </div>
                    </template>
                </SummaryBox>
            </aside>
        </div>

        <div v-if="success.open" class="modal">
            <div class="modal__overlay" @click="closeSuccess"></div>
            <div class="modal__card" role="dialog" aria-modal="true" aria-label="Order Berhasil">
                <div class="modal__icon">✔</div>
                <h3 class="modal__title">Order Berhasil</h3>
                <p class="modal__desc">Terima kasih, pesananmu sudah kami terima<span v-if="success.orderCode"> (#{{
                    success.orderCode }})</span>. Silakan cek email untuk instruksi pembayaran dan detail
                    pengiriman.</p>
                <button class="btn btn--primary btn--block modal__btn" @click="closeSuccess">Oke</button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import ApiService from '@/core/services/ApiService'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { ensureSession } from '@/composables/useSession'

definePageMeta({ ssr: false })
useHead({ title: 'Checkout' })

type Opt = { value: string; label: string }
type Crumb = { label: string; to?: string; isEllipsis?: boolean }

const crumbs = ref<Crumb[]>([
    { label: 'Beranda', to: '/' },
    { label: 'Detail Produk', to: '/detail-product' },
    { label: 'Keranjang', to: '/cart' },
    { label: 'Pemesanan' }
])

const isMobile = ref(false)
const setBp = () => (isMobile.value = window.matchMedia('(max-width: 480px)').matches)
onMounted(() => { setBp(); window.addEventListener('resize', setBp) })
onBeforeUnmount(() => window.removeEventListener('resize', setBp))
const crumbsView = computed<Crumb[]>(() => {
    const arr = crumbs.value || []
    if (!isMobile.value || arr.length <= 3) return arr
    return [arr[0], { label: '…', isEllipsis: true }, arr[arr.length - 2], arr[arr.length - 1]]
})

const router = useRouter()
const { items, total, clearAll } = useCart()
const displayedItems = computed(() => items.value)

const dbg = ref({ loading: false })

const config = useRuntimeConfig()
const apiKey = (config.public.xApiKey || config.public.apiKey || '') as string
const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' }
if (apiKey) headers['x-api-key'] = apiKey

const form = ref({ name: '', address: '', detail: '', email: '', phone: '', postalcode: '' })
const agreed = ref(false)

const selProvinsi = ref<Opt | null>(null)
const selKota = ref<Opt | null>(null)
const provinsiOpts = ref<Opt[]>([])
const kotaOpts = ref<Opt[]>([])
const provLoading = ref(true)
const provKey = computed(() => provinsiOpts.value.length + '-' + (provinsiOpts.value[0]?.value || ''))

const sending = ref(false)

const nameValid = (v: string) => /^[a-zA-Z\s]*$/.test(v)
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const postalOk = (v: string) => /^[0-9]{5}$/.test(v)
const normalizePhone = (raw: string) => {
    const d = String(raw || '').replace(/\D+/g, '')
    if (!d) return d
    if (d.startsWith('0')) return '62' + d.slice(1)
    return d
}
const phoneOk = (v: string) => /^[0-9]{10,13}$/.test(normalizePhone(v))

const showErr = ref(false)
const touched = ref({ name: false, address: false, provinsi: false, kota: false, postalcode: false, email: false, phone: false })

const shouldShow = (k: keyof typeof touched.value) => showErr.value || touched.value[k]
const shouldShowError = (field: keyof typeof touched.value) => {
    if (!shouldShow(field)) return false
    switch (field) {
        case 'name': return !form.value.name || form.value.name.length < 3 || !nameValid(form.value.name)
        case 'address': return !form.value.address
        case 'provinsi': return !selProvinsi.value
        case 'kota': return !selKota.value
        case 'postalcode': return !form.value.postalcode || !/^[0-9]+$/.test(form.value.postalcode) || form.value.postalcode.length !== 5
        case 'email': return !emailOk(form.value.email)
        case 'phone': {
            const phone = form.value.phone
            const n = normalizePhone(phone)
            return !phone || !/^[0-9]+$/.test(phone) || n.length < 10 || n.length > 13
        }
        default: return false
    }
}

const valid = computed(() =>
    !!form.value.name &&
    form.value.name.length >= 3 &&
    nameValid(form.value.name) &&
    !!form.value.address &&
    !!selProvinsi.value &&
    !!selKota.value &&
    postalOk(form.value.postalcode) &&
    emailOk(form.value.email) &&
    phoneOk(form.value.phone)
)

const canProceed = computed(() => agreed.value && valid.value && !dbg.value.loading && displayedItems.value.length > 0)

function digitsOnly(field: 'postalcode' | 'phone', maxLen = 5) {
    form.value[field] = String(form.value[field] ?? '').replace(/\D+/g, '').slice(0, maxLen) as any
}

const LS_PROV = 'phri_provinsi_boot'
const LS_REG_MAP = 'phri_reg_map'
const LS_NAME_INDEX = 'phri_prov_name_index'
const LS_KOTA_PREFIX = 'phri_kota_'

const norm = (s: string) => String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toUpperCase()

const regByProvId = ref<Record<string, Opt[]>>({})
const provNameToValidId = ref<Record<string, string>>({})

async function bootstrapRegions() {
    const cacheProv = localStorage.getItem(LS_PROV)
    const cacheMap = localStorage.getItem(LS_REG_MAP)
    const cacheIndex = localStorage.getItem(LS_NAME_INDEX)
    if (cacheProv && cacheMap && cacheIndex) {
        provinsiOpts.value = JSON.parse(cacheProv)
        regByProvId.value = JSON.parse(cacheMap)
        provNameToValidId.value = JSON.parse(cacheIndex)
        provLoading.value = false
        return
    }
    try {
        const [{ data: pData }, { data: rData }] = await Promise.all([
            ApiService.query('/province', { params: { search: '' }, headers }),
            ApiService.query('/regency', { params: {}, headers })
        ])
        const provinces: Array<{ id: string; name: string; external_id?: any }> =
            ((pData.value as any)?.data?.provinces ?? []).map((p: any) => ({
                id: String(p.id),
                name: String(p.name ?? '').trim(),
                external_id: p.external_id
            }))
        const regencies: Array<{ id: string; name: string; province_id: string | number }> =
            ((rData.value as any)?.data?.regencies ?? []).map((r: any) => ({
                id: String(r.id),
                name: String(r.name ?? '').trim(),
                province_id: String(r.province_id)
            }))

        const map: Record<string, Opt[]> = {}
        for (const r of regencies) {
            ; (map[r.province_id] ??= []).push({ value: r.id, label: r.name })
        }
        for (const k of Object.keys(map)) map[k].sort((a, b) => a.label.localeCompare(b.label))

        const groups = new Map<string, Array<{ id: string; name: string }>>()
        for (const p of provinces) {
            const key = p.external_id != null ? `EXT:${p.external_id}` : `NM:${norm(p.name)}`
                ; (groups.get(key) ?? groups.set(key, []).get(key))!.push({ id: p.id, name: p.name })
        }

        const opts: Opt[] = []
        const nameIndex: Record<string, string> = {}
        for (const g of groups.values()) {
            const withReg = g.find(x => map[x.id]?.length)
            const chosen = withReg ?? g[0]
            opts.push({ value: chosen.id, label: chosen.name })
            nameIndex[norm(chosen.name)] = chosen.id
        }
        opts.sort((a, b) => a.label.localeCompare(b.label))

        provinsiOpts.value = opts
        regByProvId.value = map
        provNameToValidId.value = nameIndex

        localStorage.setItem(LS_PROV, JSON.stringify(opts))
        localStorage.setItem(LS_REG_MAP, JSON.stringify(map))
        localStorage.setItem(LS_NAME_INDEX, JSON.stringify(nameIndex))
    } finally {
        provLoading.value = false
    }
}

function resolveProvinceId(opt: Opt | null): string {
    if (!opt) return ''
    const pid = String(opt.value)
    if (regByProvId.value[pid]?.length) return pid
    const alt = provNameToValidId.value[norm(opt.label)] || ''
    return alt || pid
}

async function fetchProvinsi() {
    await bootstrapRegions()
}

async function fetchKota(provinceId: string) {
    const pid = resolveProvinceId({ value: provinceId, label: selProvinsi.value?.label || '' })
    const key = `${LS_KOTA_PREFIX}${pid}`
    const cached = localStorage.getItem(key)
    if (cached) {
        kotaOpts.value = JSON.parse(cached)
        return
    }
    let list = regByProvId.value[pid] || []
    if (!list.length) {
        const alt = provNameToValidId.value[norm(selProvinsi.value?.label || '')]
        if (alt && regByProvId.value[alt]?.length) {
            list = regByProvId.value[alt]
            const opt = provinsiOpts.value.find(o => o.value === provinceId)
            if (opt) opt.value = alt
            selProvinsi.value = opt ? { value: opt.value, label: opt.label } : selProvinsi.value
        }
    }
    kotaOpts.value = list
    localStorage.setItem(key, JSON.stringify(list))
}

watch(selProvinsi, val => {
    selKota.value = null
    kotaOpts.value = []
    const pid = val?.value || ''
    if (pid) fetchKota(pid)
})

onMounted(async () => {
    ensureSession()
    provLoading.value = true
    await fetchProvinsi()
    fetchCartFee()
})

const paymentFee = ref(0)
const grandTotalWithFee = computed(() => total.value + paymentFee.value)
async function fetchCartFee() { paymentFee.value = 0 }
watch(items, () => { fetchCartFee() }, { deep: true })

const success = ref<{ open: boolean; orderCode?: string | null }>({ open: false, orderCode: null })
function closeSuccess() { success.value.open = false; router.push('/') }

const kotaDisabled = computed(() => !selProvinsi.value)
const showKotaHint = ref(false)
let kotaHintTimer: any = null
function onKotaGuardClick() {
    touched.value.kota = true
    showKotaHint.value = true
    clearTimeout(kotaHintTimer)
    kotaHintTimer = setTimeout(() => (showKotaHint.value = false), 2500)
}

async function submit() {
    showErr.value = true
    if (!valid.value || !agreed.value) return
    const session_id = ensureSession()
    try {
        sending.value = true
        const payload = {
            session_id,
            name: form.value.name,
            email: form.value.email,
            phone: normalizePhone(form.value.phone),
            address: form.value.address,
            address_detail: form.value.detail || '',
            province_id: selProvinsi.value?.value,
            regency_id: selKota.value?.value,
            postalcode: form.value.postalcode
        }
        const { data, error } = await ApiService.post('/order', payload, { ...headers, 'Content-Type': 'application/json' })
        if (error.value) throw error.value
        const root = (data.value as any)?.data || data.value
        const code = root?.order?.code || root?.order_code || root?.code || null
        success.value.orderCode = code ? String(code) : null
        await clearAll()
        success.value.open = true
    } catch (e: any) {
        const msg = e?.message || 'Gagal membuat order'
        alert(`${msg}`)
    } finally {
        sending.value = false
    }
}
</script>





<style scoped>
.bc {
    display: flex;
    align-items: center;
    min-height: 36px;
    margin-top: 20px
}

.bc__list {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px;
    padding: 0;
    list-style: none;
    color: #6b7280
}

.bc__item {
    display: flex;
    align-items: center;
    gap: 8px;
    font: 400 14px/20px var(--ff, ui-sans-serif)
}

.bc__sep {
    color: #bdbdbd
}

.bc__link {
    color: #6b7280;
    text-decoration: none
}

.bc__link:hover {
    text-decoration: underline
}

.bc__text {
    color: #6b7280
}

.bc__item.current .bc__text {
    font-weight: 600;
    color: #111827
}

.cols {
    display: grid;
    grid-template-columns: 1fr 392px;
    gap: 28px;
    align-items: start;
    margin-top: 8px
}

.left {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-bottom: 40px
}

.right {
    position: relative
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px
}

.sec-head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px
}

.sec-title {
    margin: 30px 0 0;
    font: 600 20px/28px var(--ff);
    color: var(--text, #0a0a0a)
}

.sec-link {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: #757575;
    font: 500 12px/18px var(--ff);
    text-decoration: underline
}

.sec-sub {
    margin: 0;
    color: #757575;
    font: 400 16px/24px var(--ff)
}

.mt-20 {
    margin-top: 20px
}

.label {
    font: 500 14px/22px var(--ff);
    color: #0a0a0a;
    margin-bottom: 6px
}

.field {
    display: flex;
    flex-direction: column
}

.input {
    height: 40px;
    padding: 0 12px;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    outline: none;
    transition: border-color .2s ease
}

.input:focus {
    border-color: #c4c4c4
}

.input--error {
    border-color: #d92d20 !important
}

.label-row {
    display: flex;
    align-items: center;
    gap: 8px
}

.opt {
    font: 400 12px/18px var(--ff);
    color: #757575
}

.agree {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    font: 400 12px/18px var(--ff)
}

.error-text {
    margin: 6px 0 0;
    color: #d92d20;
    font: 400 12px/18px var(--ff)
}

.error-banner {
    padding: 10px 12px;
    border-radius: 10px;
    background: #ffe9e6;
    border: 1px solid #ffd0ca;
    color: #a90e00;
    font: 500 13px/20px var(--ff)
}

.skelwrap {
    width: 100%;
    box-sizing: border-box
}

.skel {
    background: #f5f5f5;
    border-radius: 12px
}

.skel--title {
    width: 220px;
    height: 20px;
    border-radius: 8px
}

.skel--input {
    width: 100%;
    height: 40px;
    border-radius: 8px
}

.skel--mini {
    width: 100%;
    height: 88px;
    border-radius: 12px
}

.select-wrap {
    position: relative
}

.select-wrap.is-disabled {
    opacity: .6
}

.select-guard {
    position: absolute;
    inset: 0;
    cursor: not-allowed
}

.modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 16px
}

.modal__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, .35);
    backdrop-filter: blur(2px)
}

.modal__card {
    position: relative;
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 16px;
    padding: 22px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, .12);
    text-align: center
}

.modal__icon {
    width: 56px;
    height: 56px;
    margin: 4px auto 12px;
    border-radius: 50%;
    background: #e7f7ef;
    display: grid;
    place-items: center;
    font-weight: 700;
    color: #0a7f41
}

.modal__title {
    margin: 0 0 8px;
    font: 700 20px/28px var(--ff);
    color: #0a0a0a
}

.modal__desc {
    margin: 0 0 16px;
    font: 400 14px/22px var(--ff);
    color: #4a4a4a
}

.modal__btn {
    margin-top: 6px
}

@media(max-width:1024px) {
    .cols {
        grid-template-columns: 1fr;
        gap: 16px
    }
}

@media(max-width:768px) {
    .cols {
        display: flex;
        flex-direction: column;
        gap: 16px
    }

    .right {
        order: 1;
        width: 100%
    }

    .left {
        order: 2
    }

    .container {
        padding: 0 12px 40px
    }

    .btn.btn--block {
        margin-top: 8px;
        margin-bottom: 28px;
        width: 100%
    }
}

@media(max-width:480px) {
    .bc {
        padding: 0 4px
    }

    .bc__item {
        font-size: 13px
    }
}

@media(max-width:420px) {
    .container {
        padding-left: 10px;
        padding-right: 10px
    }

    .sec-title {
        font-size: 17px;
        line-height: 24px
    }

    .btn.btn--block {
        min-height: 46px;
        margin-bottom: 32px
    }
}
</style>
