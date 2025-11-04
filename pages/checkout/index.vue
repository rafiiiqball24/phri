<template>
    <section class="container">
        <Breadcrumb :items="[
            { label: 'Beranda', to: '/' },
            { label: 'Detail Produk', to: '/detail-product' },
            { label: 'Keranjang', to: '/cart' },
            { label: 'Pemesanan' }
        ]" />

        <div class="cols">
            <section class="left">
                <div v-if="showErr && !valid" class="error-banner">
                    Mohon lengkapi data yang wajib diisi dan pastikan format sudah benar.
                </div>

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
                        <input class="input" v-model.trim="form.name" placeholder="John" @blur="touched.name = true" />
                        <p v-if="!form.name && shouldShow('name')" class="error-text">Nama lengkap wajib diisi.</p>
                    </div>

                    <div class="field">
                        <label class="label">Alamat</label>
                        <input class="input" v-model.trim="form.address" placeholder="Perumahan ..."
                            @blur="touched.address = true" />
                        <p v-if="!form.address && shouldShow('address')" class="error-text">Alamat wajib diisi.</p>
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
                            <CustomSelect v-model="selProvinsi" :options="provinsiOpts" placeholder="Pilih provinsi"
                                :invalid="!selProvinsi && shouldShow('provinsi')"
                                @update:modelValue="touched.provinsi = true" />
                            <p v-if="!selProvinsi && shouldShow('provinsi')" class="error-text">Provinsi wajib dipilih.
                            </p>
                        </div>
                        <div class="field">
                            <label class="label">Kota</label>
                            <CustomSelect v-model="selKota" :options="kotaOpts" placeholder="Pilih kota"
                                :invalid="!selKota && shouldShow('kota')" @update:modelValue="touched.kota = true" />
                            <p v-if="!selKota && shouldShow('kota')" class="error-text">Kota wajib dipilih.</p>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Kode Pos</label>
                        <input class="input" v-model.trim="form.postalcode" placeholder="50268" inputmode="numeric"
                            maxlength="5" @input="digitsOnly('postalcode')" @blur="touched.postalcode = true" />
                        <p v-if="!postalOk(form.postalcode) && shouldShow('postalcode')" class="error-text">Kode pos
                            wajib 5 digit angka.</p>
                    </div>

                    <header class="sec-head mt-20">
                        <h2 class="sec-title">Informasi Kontak</h2>
                        <p class="sec-sub">Mengisi informasi kontak membantu pengiriman dengan cepat</p>
                    </header>

                    <div class="field">
                        <label class="label">Email</label>
                        <input class="input" v-model.trim="form.email" placeholder="johndoe@gmail.com"
                            @blur="touched.email = true" />
                        <p v-if="!emailOk(form.email) && shouldShow('email')" class="error-text">Mohon masukkan email
                            yang valid.</p>
                    </div>

                    <div class="field">
                        <label class="label">Nomor Telepon</label>
                        <input class="input" v-model.trim="form.phone" placeholder="082000000000" inputmode="tel"
                            @input="digitsOnly('phone', 15)" @blur="touched.phone = true" />
                        <p v-if="!phoneOk(form.phone) && shouldShow('phone')" class="error-text">Nomor telepon wajib
                            diisi (angka 9–15 digit).</p>
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
                <SummaryBox title="Ringkasan Pembelian" :count-label="`${displayedItems.length} Item`" :lines="[
                    ...displayedItems.map(it => ({ name: `${it.qty}× ${it.name}`, price: it.price * it.qty })),
                    ...(paymentFee > 0 ? [{ name: 'Payment Fee', price: paymentFee }] : [])
                ]" total-label="Total Pembayaran" :total="grandTotalWithFee" :links="[
                    { label: 'Butuh Bantuan?', to: '/Help' },
                    { label: 'Hubungi Kami', to: '/contact', underline: true },
                    { label: 'Informasi Pengiriman', to: '/Help', underline: true }
                ]">
                    <template #extra>
                        <div style="margin-top: 4px">
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
                <p class="modal__desc">
                    Terima kasih, pesananmu sudah kami terima<span v-if="success.orderCode"> (#{{ success.orderCode
                        }})</span>.
                    Silakan cek email untuk instruksi pembayaran dan detail pengiriman.
                </p>
                <button class="btn btn--primary btn--block modal__btn" @click="closeSuccess">Oke</button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import ApiService from '@/core/services/ApiService'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { ensureSession, getSession } from '@/composables/useSession'

useHead({ title: 'Checkout' })

type Opt = { value: string; label: string }
type ProvinceItem = { id: string; name: string; external_id?: number | null }

const router = useRouter()
const { items, total, clearAll } = useCart()
const displayedItems = computed(() => items.value)

const showDebug = false
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

const sending = ref(false)
const serverErrors = ref<Record<string, string[]>>({})

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const postalOk = (v: string) => /^[0-9]{5}$/.test(v)
const normalizePhone = (raw: string) => {
    const d = String(raw || '').replace(/\D+/g, '')
    if (!d) return d
    if (d.startsWith('0')) return '62' + d.slice(1)
    return d
}
const phoneOk = (v: string) => /^[0-9]{10,15}$/.test(normalizePhone(v))

const showErr = ref(false)
const touched = ref({ name: false, address: false, provinsi: false, kota: false, postalcode: false, email: false, phone: false })
const shouldShow = (k: keyof typeof touched.value) => showErr.value || touched.value[k]

const isSelected = (opt: any) => (typeof opt === 'string' ? !!opt.trim() : !!opt?.value)
const optValue = (opt: any): string => (typeof opt === 'string' ? opt : opt?.value)

const valid = computed(() =>
    !!form.value.name &&
    !!form.value.address &&
    isSelected(selProvinsi.value) &&
    isSelected(selKota.value) &&
    postalOk(form.value.postalcode) &&
    emailOk(form.value.email) &&
    phoneOk(form.value.phone)
)
const canProceed = computed(() => agreed.value && valid.value && !dbg.value.loading && displayedItems.value.length > 0)

function digitsOnly(field: 'postalcode' | 'phone', maxLen = 5) {
    form.value[field] = String(form.value[field] ?? '').replace(/\D+/g, '').slice(0, maxLen) as any
}

async function fetchProvinsi(search = '') {
    try {
        const [{ data: pData }, { data: rData }] = await Promise.all([
            ApiService.query('/province', { params: { search } }),
            ApiService.query('/regency', { params: {} })
        ])
        const provinces: ProvinceItem[] = ((pData.value as any)?.data?.provinces ?? []).map((p: any) => ({
            id: String(p.id), name: String(p.name ?? '').trim(), external_id: p.external_id ?? null
        }))
        const regencies = (rData.value as any)?.data?.regencies ?? []
        const whitelist = new Set<string>(regencies.map((r: any) => String(r.province_id)))
        const buckets = new Map<string, ProvinceItem[]>()
        for (const p of provinces) {
            const k = p.external_id != null ? `ext:${p.external_id}` : `name:${p.name.toUpperCase()}`
                ; (buckets.get(k) ?? buckets.set(k, []).get(k))!.push(p)
        }
        provinsiOpts.value = Array.from(buckets.values()).map(dupes => dupes[0]).filter(p => whitelist.has(p.id)).map(p => ({ value: p.id, label: p.name }))
    } catch {
        provinsiOpts.value = []
    }
}
async function fetchKota(provinceId: string, search = '') {
    try {
        const { data } = await ApiService.query('/regency', { params: { province_id: provinceId, search } })
        const raw = (data.value as any)?.data?.regencies ?? []
        kotaOpts.value = raw.map((k: any) => ({ value: String(k.id), label: String(k.name ?? '').trim() }))
    } catch {
        kotaOpts.value = []
    }
}
watch(selProvinsi, val => {
    selKota.value = null
    kotaOpts.value = []
    const pid = optValue(val)
    if (pid) fetchKota(pid)
})

onMounted(() => {
    ensureSession()
    fetchProvinsi()
    fetchCartFee()
})

const paymentFee = ref(0)
const grandTotalWithFee = computed(() => total.value + paymentFee.value)
async function fetchCartFee() {
    const sid = getSession()
    if (!sid) { paymentFee.value = 0; return }
    try {
        const { data } = await ApiService.query('/cart', { params: { session_id: sid }, headers })
        const root = (data.value as any)?.data || {}
        paymentFee.value = Number(root?.payment_fee ?? 0)
    } catch {
        paymentFee.value = 0
    }
}
watch(items, () => { fetchCartFee() }, { deep: true })

type ResolvedOpts = { optionIds: string[]; combinationId?: string | null }
async function resolveVariantOptionIds(productId: string, sizeName?: string, colorName?: string): Promise<ResolvedOpts> {
    try {
        const { data, error } = await ApiService.query(`/product/${productId}`, { headers })
        if (error.value) return { optionIds: [] }
        const raw = (data.value as any)?.data?.product || (data.value as any)?.data || (data.value as any)
        const variants: any[] = raw?.variants || []
        const combinations: any[] = raw?.combinations || []
        const pickId = (labelLower: 'ukuran' | 'warna', name?: string) => {
            if (!name) return null
            const v = variants.find(v => String(v.name ?? '').trim().toLowerCase() === labelLower)
            if (!v?.options?.length) return null
            const opt = v.options.find((o: any) => String((o.name ?? o?.option?.name) ?? '').trim().toLowerCase() === String(name).trim().toLowerCase())
            return opt?.id || opt?.option?.id || null
        }
        const sizeId = pickId('ukuran', sizeName)
        const colorId = pickId('warna', colorName)
        const ids = [sizeId, colorId].filter(Boolean) as string[]
        if (ids.length) {
            const set = new Set(ids)
            const combo = (combinations || []).find((c: any) => {
                const arr = (c?.product_variant_option_ids || []).filter(Boolean)
                return arr.length === set.size && arr.every((x: string) => set.has(String(x)))
            })
            return { optionIds: ids, combinationId: combo?.id || null }
        }
        if (Array.isArray(combinations) && combinations.length === 1) {
            const combo = combinations[0] as any
            const comboIds = combo?.product_variant_option_ids || []
            return { optionIds: (Array.isArray(comboIds) ? comboIds.filter(Boolean) : []) as string[], combinationId: combo?.id || null }
        }
        const singleVariantIds = variants
            .map(v => (Array.isArray(v.options) && v.options.length === 1 ? (v.options[0]?.id || v.options[0]?.option?.id || null) : null))
            .filter(Boolean)
        if (singleVariantIds.length && singleVariantIds.length === variants.length) {
            const set = new Set(singleVariantIds)
            const combo = (combinations || []).find((c: any) => {
                const arr = (c?.product_variant_option_ids || []).filter(Boolean)
                return arr.length === set.size && arr.every((x: string) => set.has(String(x)))
            })
            return { optionIds: singleVariantIds as string[], combinationId: combo?.id || null }
        }
        return { optionIds: [] }
    } catch {
        return { optionIds: [] }
    }
}

async function buildCartPayload(session_id: string) {
    const products = await Promise.all(
        displayedItems.value.map(async (it: any) => {
            const preset = Array.isArray(it.optionIds) ? it.optionIds.filter(Boolean) : []
            if (preset.length) {
                return { id: String(it.id), quantity: Number(it.qty), product_variant_option_ids: preset, combination_id: it.combinationId || undefined }
            }
            const resolved = await resolveVariantOptionIds(String(it.id), it.size, it.color)
            return { id: String(it.id), quantity: Number(it.qty), product_variant_option_ids: resolved.optionIds || [], combination_id: resolved.combinationId || undefined }
        })
    )
    const invalid = products.filter(p => !Array.isArray((p as any).product_variant_option_ids) || (p as any).product_variant_option_ids.length === 0)
    if (invalid.length) {
        throw new Error('Beberapa item belum memiliki varian lengkap. Mohon pilih ukuran/warna untuk semua item.')
    }
    try { console.debug('[cart:snapshot]', JSON.stringify({ session_id, products })) } catch { }
    return { session_id, products }
}
async function pushCartSnapshot(session_id: string) {
    if (displayedItems.value.length === 0) return
    const body = await buildCartPayload(session_id)
    const res = await ApiService.post('/cart', body, { ...headers, 'Content-Type': 'application/json' })
    if (res.error.value) {
        const err = (res.error.value as any)?.data?.errors || (res.error.value as any)?.errors || (res.error.value as any) || {}
        throw new Error(JSON.stringify(err, null, 2))
    }
}

const success = ref<{ open: boolean; orderCode?: string | null }>({ open: false, orderCode: null })

function closeSuccess() {
    success.value.open = false
    router.push('/')
}

async function submit() {
    showErr.value = true
    serverErrors.value = {}
    if (!valid.value || !agreed.value) return
    const session_id = ensureSession()
    try {
        sending.value = true
        await pushCartSnapshot(session_id)
        const payload = {
            session_id,
            name: form.value.name,
            email: form.value.email,
            phone: normalizePhone(form.value.phone),
            address: form.value.address,
            address_detail: form.value.detail || '',
            province_id: optValue(selProvinsi.value)!,
            regency_id: optValue(selKota.value)!,
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
        const errs = e?.errors || e?.data?.errors || e?.response?.errors || (e?.data && typeof e.data === 'object' ? e.data.errors : undefined) || {}
        serverErrors.value = errs
        alert(`${msg}\n\n${JSON.stringify(errs, null, 2)}`)
    } finally {
        sending.value = false
    }
}
</script>

<style scoped>
.cols {
    display: grid;
    grid-template-columns: 1fr 392px;
    gap: 28px;
    align-items: start;
    margin-top: 20px
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
    color: var(--text, #0a0a0a);
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
    outline: none
}

.input:focus {
    border-color: #c4c4c4
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
    background: #F5F5F5;
    border-radius: 12px
}

.skel--title {
    width: 220px;
    height: 20px;
    border-radius: 8px
}

.skel--mini {
    width: 100%;
    height: 88px;
    border-radius: 12px
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

@media (max-width:1024px) {
    .cols {
        grid-template-columns: 1fr;
        gap: 16px
    }
}

@media (max-width:768px) {
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

@media (max-width:420px) {
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
