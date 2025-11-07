<template>
  <section class="container">
    <div v-if="debug" class="debugbar">
      <button class="dbgbtn" @click="simulateLoading">Simulate Loading (1.5s)</button>
      <button class="dbgbtn" @click="toggleStock">
        {{ product.stock === 0 ? "Set Stok: 12" : "Set Stok: 0" }}
      </button>
      <span class="dbgmeta">Stock: {{ product.stock }}</span>
    </div>

    <Breadcrumb :items="[{ label: 'Beranda', to: '/' }, { label: 'Detail Produk' }]" />

    <div class="cols">
      <div class="col col--left">
        <div v-if="loading" class="media skel">
          <div class="sk-hero-actions">
            <span class="sk-sq skel"></span>
            <span class="sk-sq skel"></span>
          </div>
        </div>

        <template v-else>
          <figure class="media" @touchstart="ts = $event.touches[0].clientX"
            @touchend="te = $event.changedTouches[0].clientX; onSwipe();">
            <img :src="product.images[current] || product.image" :alt="product.name" />
            <div class="badge">
              <svg class="badge__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="#DBAD1B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
              </svg>
              <span class="badge__text">Highly Recommend</span>
            </div>
            <figcaption class="pager">{{ current + 1 }} / {{ total }}</figcaption>
            <div class="navgroup">
              <button class="navbtn" :class="{ 'navbtn--white': current > 0 }" aria-label="Sebelumnya" @click="prevImg">
                <svg class="navico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button class="navbtn navbtn--white" aria-label="Berikutnya" @click="nextImg">
                <svg class="navico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </figure>

          <section class="desc hidden-mobile">
            <h3 class="desc__title">Deskripsi</h3>
            <p ref="descBodyEl" class="desc__body" :class="{ 'is-clamped': canToggle && !isExpanded }"
              :style="{ '--clamp': String(currentClamp) }">
              {{ product.description || "—" }}
            </p>
            <button v-if="canToggle" class="desc__read" type="button" @click="toggleDesc"
              :class="{ 'is-open': isExpanded }" :aria-expanded="isExpanded">
              {{ isExpanded ? 'Tutup' : 'Baca semua' }}
              <img class="caret" src="/img/icons/CaretDownOrange.svg" alt="" />
            </button>

          </section>
        </template>
      </div>

      <div class="col col--right">
        <template v-if="loading">
          <div class="sk-wrap">
            <div class="skline sk-title skel"></div>
            <div class="skline sk-cat skel"></div>
            <div class="skchip sk-pricechip skel"></div>
            <div class="skline sk-tax skel"></div>
            <div class="skblock">
              <div class="skline sk-size-label skel"></div>
              <div class="skgrid">
                <div v-for="i in 6" :key="'sksize' + i" class="skopt skel"></div>
              </div>
            </div>
            <div class="skblock">
              <div class="skline sk-color-label skel"></div>
              <div class="skgrid">
                <div v-for="i in 6" :key="'skcolor' + i" class="skopt skel"></div>
              </div>
            </div>
            <div class="skline sk-qty-label skel"></div>
            <div class="skbtn sk-input skel"></div>
            <div class="skline skel" style="width: 100px; height: 16px; margin-top: 12px;"></div>
            <div class="skbtn skel" style="height: 44px; border-radius: 10px; margin-top: 12px;"></div>
            <section class="desc desc--mobile">
              <div class="skline sk-desc-head skel"></div>
              <div class="skline sk-desc-1 skel"></div>
              <div class="skline sk-desc-2 skel"></div>
            </section>
            <section class="ship">
              <div class="skline sk-ship-head skel"></div>
              <div class="ship__row">
                <div class="skbox skel"></div>
                <div class="skline sk-ship-1 skel"></div>
              </div>
              <div class="ship__row">
                <div class="skbox skel"></div>
                <div class="skline sk-ship-2 skel"></div>
              </div>
              <div class="ship__row">
                <div class="skbox skel"></div>
                <div class="skline sk-ship-3 skel"></div>
              </div>
            </section>
          </div>
        </template>

        <template v-else>
          <h1 class="title">{{ product.name }}</h1>
          <div class="category">{{ product.category || "Produk" }}</div>
          <div class="price">Rp{{ formatIDR(displayPrice) }}</div>
          <div class="tax">Termasuk pajak.</div>

          <div v-if="product.sizes?.length" class="block">
            <div class="block__head">
              <span class="block__label">Pilih Ukuran</span>
              <button class="sizeguide" type="button">Size Guide</button>
            </div>
            <div class="optgrid">
              <button v-for="size in product.sizes" :key="size.name" class="opt"
                :class="{ 'is-disabled': !size.available, 'is-active': selectedSize === size.name }"
                :disabled="!size.available" @click="() => { selectedSize = size.name; selectedSizeId = size.id; }">
                {{ size.name }}
              </button>
            </div>
          </div>

          <div v-if="product.colors?.length" class="block">
            <div class="block__head"><span class="block__label">Pilih Warna</span></div>
            <div class="optgrid">
              <button v-for="color in product.colors" :key="color.name" class="opt"
                :class="{ 'is-disabled': !color.available, 'is-active': selectedColor === color.name }"
                :disabled="!color.available" @click="() => { selectedColor = color.name; selectedColorId = color.id; }">
                {{ color.name }}
              </button>
            </div>
          </div>

          <div class="block">
            <div class="block__head"><span class="block__label">Jumlah</span></div>
            <div class="optgrid" style="grid-template-columns: 1fr">
              <input class="input" type="number" min="1" :max="displayStock" v-model.number="qty" />
            </div>
          </div>

          <div class="stock">
            Stok: {{ displayStock }}
            <span v-if="displayStock <= 0" class="stock-alert">Stok Habis</span>
          </div>
          <button class="cta" :disabled="!canAdd" @click="onAddToCart">Tambahkan ke Keranjang</button>

          <section class="desc desc--mobile">
            <h3 class="desc__title">Deskripsi</h3>
            <p ref="descBodyElMobile" class="desc__body" :class="{ 'is-clamped': canToggle && !isExpanded }"
              :style="{ '--clamp': String(currentClamp) }">
              {{ product.description || "—" }}
            </p>
            <button v-if="canToggle" class="desc__read" type="button" @click="toggleDesc"
              :class="{ 'is-open': isExpanded }" :aria-expanded="isExpanded">
              {{ isExpanded ? 'Tutup' : 'Baca semua' }}
              <img class="caret" src="/img/icons/CaretDownOrange.svg" alt="" />
            </button>

          </section>

          <section class="ship">
            <h3 class="ship__title">Informasi Pengiriman</h3>
            <div class="ship__row">
              <img src="/img/icons/truck.svg" alt="" class="ship__icon" />
              <p class="ship__text">Estimasi 12–15 hari (Jawa), 20–22 hari (luar Jawa) setelah pemesanan.</p>
            </div>
            <div class="ship__row">
              <img src="/img/icons/package.svg" alt="" class="ship__icon" />
              <p class="ship__text">Pengemasan aman. Butuh tambahan kemasan? Hubungi layanan kami.</p>
            </div>
            <div class="ship__row">
              <img src="/img/icons/box.svg" alt="" class="ship__icon" />
              <p class="ship__text">Kerusakan saat pengantaran di luar tanggung jawab kami.</p>
            </div>
          </section>
        </template>
      </div>
    </div>

    <template v-if="!loading">
      <Recommendations v-if="rec.length" class="product-recs" title="Rekomendasi Untuk di Beli" :items="rec" />
      <div v-else class="rec-empty"></div>
    </template>

    <div v-else class="rec-skeleton">
      <div class="rec-skeleton__head">
        <div class="skline skel" style="width: 200px; height: 24px;"></div>
        <div class="rec-skeleton__nav">
          <div class="skel" style="width: 36px; height: 36px; border-radius: 8px;"></div>
          <div class="skel" style="width: 36px; height: 36px; border-radius: 8px;"></div>
        </div>
      </div>
      <div class="rec-skeleton__grid">
        <div v-for="i in 4" :key="'recs' + i" class="card">
          <div class="skthumb skel"></div>
          <div class="skline skel sk-name"></div>
          <div class="sktags">
            <span class="sktag skel"></span>
            <span class="sktag skel"></span>
          </div>
          <div class="skline skel sk-price"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, onServerPrefetch, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import ApiService from "@/core/services/ApiService";
import { useCurrency } from "@/composables/useCurrency";
import { useCart } from "@/composables/useCart";

const { formatIDR } = useCurrency();
useHead({ title: "Detail Product" });

type VariantOpt = { id: string; name: string };
type Variant = { name: string; options: VariantOpt[] };
type Combination = { id: string; price: number | null; sku?: string | null; quantity?: number | null; optionIds: string[] };
type ProductApi = {
  id: string; name: string; slug: string; thumbnail?: string; price: number;
  quantity: number | string; description?: string; product_category?: { id: string; name: string }
  variants?: Variant[]; images?: any[]; gallery?: any[]; medias?: any[]; combinations?: any[]
};

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { addItem } = useCart();

const apiKey = (config.public.xApiKey || config.public.apiKey || "") as string;
const headers = apiKey ? { "x-api-key": apiKey } : undefined;
const assetBase = (config.public.assetBase as string) || (config.public.baseURL as string)?.replace(/\/api\/?$/, "") || "";
const asset = (p?: string) => (!p ? "" : p.startsWith("http") ? p : `${assetBase}/${p.replace(/^\/+/, "")}`);

function ensureSession(): string {
  try {
    let sid = localStorage.getItem("phri_session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("phri_session_id", sid);
    }
    return sid;
  } catch {
    return crypto.randomUUID();
  }
}

const debug = false;
const loading = ref(true);
const selectedSize = ref("");
const selectedColor = ref("");
const qty = ref(1);
const selectedSizeId = ref<string>("");
const selectedColorId = ref<string>("");
const current = ref(0);
const ts = ref(0);
const te = ref(0);

const product = ref<{
  id?: string; name: string; price: number; stock: number; image: string; images: string[];
  description?: string; category?: string;
  sizes: { id: string; name: string; available: boolean }[];
  colors: { id: string; name: string; available: boolean }[];
}>({
  name: "—",
  price: 0,
  stock: 0,
  image: "/",
  images: [],
  sizes: [],
  colors: [],
});

const rec = ref<Array<{ to: any; name: string; image: string; price: number; tags: string[]; soldOut: boolean }>>([]);

const comboMap = new Map<string, Combination>();
const keyFor = (ids: string[]) => ids.slice().sort().join("+");

const total = computed(() => product.value.images.length || (product.value.image ? 1 : 0));
const hasMulti = computed(() => product.value.images.length > 1);
const needSize = computed(() => product.value.sizes?.length > 0);
const needColor = computed(() => product.value.colors?.length > 0);

const chosenIds = computed(() => {
  const ids: string[] = [];
  if (selectedSizeId.value) ids.push(selectedSizeId.value);
  if (selectedColorId.value) ids.push(selectedColorId.value);
  return ids;
});
const matchedCombo = computed<Combination | undefined>(() => {
  if (!chosenIds.value.length) return undefined;
  return comboMap.get(keyFor(chosenIds.value));
});
const displayPrice = computed(() => matchedCombo.value?.price ?? product.value.price);
const displayStock = computed(() => matchedCombo.value?.quantity ?? product.value.stock);

const canAdd = computed(() => {
  if (displayStock.value <= 0) return false;
  if (qty.value <= 0) return false;
  if (needSize.value && !selectedSizeId.value) return false;
  if (needColor.value && !selectedColorId.value) return false;
  return true;
});

function normalizeImages(p: ProductApi): string[] {
  const arr =
    (Array.isArray(p.images) && p.images) ||
    (Array.isArray(p.gallery) && p.gallery) ||
    (Array.isArray(p.medias) && p.medias) ||
    [];
  const imgs = arr
    .map((it: any) => {
      if (!it) return null;
      if (typeof it === "string") return it;
      return it.url || it.path || it.src || it.image_path || null;
    })
    .filter(Boolean)
    .map((u: string) => asset(u));

  const out: string[] = [];
  if (p.thumbnail) out.push(asset(p.thumbnail));
  for (const u of imgs) if (!out.includes(u)) out.push(u);
  return out;
}

function mapProduct(p: ProductApi) {
  const sizes = (p.variants?.find((v) => v.name?.toLowerCase() === "ukuran")?.options || []).map((o) => ({
    id: o.id,
    name: o.name,
    available: true,
  }));
  const colors = (p.variants?.find((v) => v.name?.toLowerCase() === "warna")?.options || []).map((o) => ({
    id: o.id,
    name: o.name,
    available: true,
  }));
  const images = normalizeImages(p);

  comboMap.clear();
  const combos = p.combinations || [];
  if (Array.isArray(combos)) {
    for (const c of combos) {
      const optionIds = (c as any).product_variant_option_ids || [];
      if (Array.isArray(optionIds) && optionIds.filter(Boolean).length) {
        const clean = optionIds.filter(Boolean);
        comboMap.set(keyFor(clean), {
          id: (c as any).id,
          price: (c as any).price ?? null,
          sku: (c as any).sku ?? null,
          quantity: (c as any).quantity ?? null,
          optionIds: clean,
        });
      }
    }
  }

  product.value = {
    id: p.id,
    name: p.name,
    price: Number(p.price ?? 0),
    stock: Number(p.quantity ?? 0),
    image: images[0] || asset(p.thumbnail) || "",
    images,
    description: p.description,
    category: p.product_category?.name,
    sizes,
    colors,
  };
  selectedSize.value = "";
  selectedSizeId.value = "";
  selectedColor.value = "";
  selectedColorId.value = "";
  current.value = 0;
}

async function fetchDetailById(slug: string) {
  const detail = await ApiService.query(`/product/${slug}`, {});
  if (!detail.error.value && detail.data.value) {
    const raw = (detail.data.value as any)?.data?.product || (detail.data.value as any)?.data || (detail.data.value as any);
    if (raw && raw.id) {
      const list = await ApiService.query("/product", { params: { page: 1 } });
      const arr: ProductApi[] = (list.data.value as any)?.data?.products?.data || [];
      rec.value = arr
        .filter((p) => p.slug !== slug)
        .slice(0, 10)
        .map((p) => ({
          to: { path: "/detail-product", query: { slug: p.slug } },
          name: p.name,
          image: asset(p.thumbnail),
          price: p.price,
          tags: (p.variants?.find((v) => v.name?.toLowerCase() === "warna")?.options || [])
            .map((o) => String(o.name ?? "").trim())
            .filter(Boolean),
          soldOut: Number(p.quantity ?? 0) <= 0,
        }));
      return raw as ProductApi;
    }
  }
  throw new Error("Produk tidak ditemukan.");
}

async function fetchPage() {
  loading.value = true;
  try {
    const slug = String(route.query.slug || route.query.id || "");
    if (!slug) throw new Error("Parameter slug tidak ada.");
    const raw = await fetchDetailById(slug);
    mapProduct(raw);
  } catch (e: any) {
    product.value.description = e?.message || "Gagal memuat data.";
  } finally {
    loading.value = false;
  }
}

function nextImg() {
  if (!hasMulti.value) return;
  if (current.value >= product.value.images.length - 1) return;
  current.value++;
}

function prevImg() {
  if (!hasMulti.value) return;
  if (current.value <= 0) return;
  current.value--;
}

function onSwipe() {
  const d = te.value - ts.value;
  if (Math.abs(d) < 50) return;
  d < 0 ? nextImg() : prevImg();
}

function recomputeAvailability() {
  if (selectedSizeId.value && product.value.colors?.length) {
    product.value.colors = product.value.colors.map((c) => ({
      ...c,
      available: !!comboMap.get(keyFor([selectedSizeId.value!, c.id])),
    }));
  } else if (product.value.colors?.length) {
    product.value.colors = product.value.colors.map((c) => ({ ...c, available: true }));
  }

  if (selectedColorId.value && product.value.sizes?.length) {
    product.value.sizes = product.value.sizes.map((s) => ({
      ...s,
      available: !!comboMap.get(keyFor([s.id, selectedColorId.value!])),
    }));
  } else if (product.value.sizes?.length) {
    product.value.sizes = product.value.sizes.map((s) => ({ ...s, available: true }));
  }
}

watch([selectedSizeId, selectedColorId], recomputeAvailability);

watch(qty, (v) => {
  if (v == null || Number.isNaN(v)) qty.value = 1;
  else if (v < 0) qty.value = 1;
});

function scrollTopForce() {
  if (!process.client) return;
  const jump = (y = 0) => {
    window.scrollTo({ top: y, behavior: "auto" });
    document.documentElement.scrollTop = y;
    document.body.scrollTop = y;
  };
  jump(0);
  requestAnimationFrame(() => jump(0));
  setTimeout(() => jump(0), 80);
  setTimeout(() => jump(0), 180);
}

async function onAddToCart() {
  if (qty.value <= 0) {
    alert("Jumlah minimal 1.");
    qty.value = 1;
    return;
  }
  if (!canAdd.value) return;
  addItem({
    id: product.value.id as string,
    name: product.value.name,
    image: product.value.images[current.value] || product.value.image,
    price: displayPrice.value,
    qty: qty.value,
    stock: displayStock.value,
    size: selectedSize.value || undefined,
    color: selectedColor.value || undefined,
    optionIds: [selectedSizeId.value, selectedColorId.value].filter(Boolean) as string[],
    combinationId: matchedCombo.value?.id || null,
  });
  router.push("/cart");
}

onServerPrefetch(fetchPage);
onMounted(async () => {
  await nextTick();
  scrollTopForce();
  fetchPage();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImg();
    if (e.key === "ArrowLeft") prevImg();
  };
  window.addEventListener("keydown", onKey);
  onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
});

watch(() => route.query.slug || route.query.id, async () => {
  await nextTick();
  scrollTopForce();
  fetchPage();
});

watch(loading, async (v) => {
  if (v === false) {
    await nextTick();
    scrollTopForce();
  }
});

function simulateLoading() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 1500);
}
function toggleStock() {
  product.value.stock = product.value.stock === 0 ? 12 : 0;
}

const descBodyEl = ref<HTMLElement | null>(null);
const descBodyElMobile = ref<HTMLElement | null>(null);
const isExpanded = ref(false);
const canToggle = ref(false);
const totalLines = ref(0);
const currentClamp = computed(() => {
  if (!canToggle.value) return 999;
  return isExpanded.value ? Math.min(totalLines.value, 7) : 5;
});
function readLineCount(el: HTMLElement | null) {
  if (!el) return 0;
  const prevClamp = el.style.getPropertyValue("--clamp");
  el.style.setProperty("--clamp", "999");
  el.classList.remove("is-clamped");
  const cs = getComputedStyle(el);
  const lhStr = cs.lineHeight;
  const lineHeight = lhStr === "normal" ? 24 : parseFloat(lhStr);
  const lines = Math.round(el.scrollHeight / lineHeight);
  el.style.setProperty("--clamp", prevClamp || String(currentClamp.value));
  if (canToggle.value && !isExpanded.value) el.classList.add("is-clamped");
  return lines;
}
function measureDesc() {
  const el = descBodyEl.value || descBodyElMobile.value;
  if (!el) return;
  totalLines.value = readLineCount(el);
  canToggle.value = totalLines.value > 5;
  if (!canToggle.value) isExpanded.value = false;
}
function toggleDesc() {
  isExpanded.value = !isExpanded.value;
  requestAnimationFrame(() => {
    const el = descBodyEl.value || descBodyElMobile.value;
    if (!el) return;
    el.style.setProperty("--clamp", String(currentClamp.value));
  });
}
onMounted(() => {
  nextTick(measureDesc);
  window.addEventListener("resize", measureDesc);
});
onBeforeUnmount(() => window.removeEventListener("resize", measureDesc));
watch(() => product.value.description, () => {
  isExpanded.value = false;
  nextTick(measureDesc);
});
</script>

<style scoped>
.debugbar {
  position: sticky;
  top: 8px;
  z-index: 10;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px;
  border: 1px dashed #ffd699;
  border-radius: 10px;
  background: #fffaf2;
  margin-bottom: 8px;
}

.dbgbtn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ffd699;
  background: #fff;
  cursor: pointer;
}

.dbgmeta {
  font: 600 12px/1 var(--ff);
  color: #db8a00;
}

.cols {
  display: grid;
  gap: 28px;
  align-items: start;
  grid-template-columns: clamp(300px, 38vw, 480px) minmax(0, 1fr);
  margin-top: 40px;

}

.col {
  min-width: 0;
}

@media (max-width: 1280px) {
  .cols {
    grid-template-columns: repeat(2, minmax(1, 1fr));
    gap: 24px;
  }
}

@media (max-width: 1024px) {
  .cols {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.recs--compact :deep(.recs-grid) {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
}

@media (min-width: 1280px) {
  .recs--compact :deep(.recs-grid) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
  }
}

.recs--compact :deep(.card) {
  padding: 10px;
  border-radius: 12px;
}

.recs--compact :deep(.card__thumb) {
  height: 240px;
}

.recs--compact :deep(.card__name) {
  font-size: 14px;
  line-height: 20px;
}

.recs--compact :deep(.card__price) {
  font-size: 14px;
  line-height: 20px;
}

.recs--compact :deep(.card-link) {
  display: block;
}

.recs--compact :deep(.card) {
  max-width: 100%;
}

.media {
  position: relative;
  width: 440px;
  height: 440px;
  border-radius: 12px;
  overflow: hidden;
  margin: 0;
  background: #f2f2f2;
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
  display: block;
}

.media.skel {
  background: linear-gradient(270deg, rgba(219, 219, 219, 0.05) 0%, #dbdbdb 50%, rgba(219, 219, 219, 0.05) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 12px;
}

@media (max-width: 1024px) {

  .media,
  .media img {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
  }

  .media.skel {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
    max-width: 320px;
    margin: 0 auto;
  }
}

/* mobile strict like mockup */
@media (max-width: 520px) {
  .cols {
    gap: 16px;
    margin-top: 16px;
  }

  .media,
  .media img {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
  }

  .media.skel {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
    max-width: none;
    border-radius: 12px;
    margin: 0 0 12px 0;
  }

  .sk-title {
    width: 68%;
    height: 26px;
  }

  .sk-cat {
    width: 34%;
    height: 14px;
  }

  .sk-pricechip {
    width: 160px;
    height: 26px;
  }

  .sk-tax {
    width: 44%;
    height: 14px;
    margin-top: 4px;
  }

  .skgrid {
    grid-template-columns: repeat(3, 1fr);
    column-gap: 8px;
    row-gap: 10px;
    margin-top: 8px;
  }

  .skopt {
    height: 34px;
    border-radius: 8px;
  }

  .sk-qty-label {
    width: 64px;
    height: 14px;
  }

  .sk-input {
    height: 42px;
    border-radius: 10px;
  }

  .sk-wrap>* {
    margin-bottom: 10px;
  }

  .sk-desc-head {
    width: 120px;
    height: 16px;
  }

  .sk-desc-1 {
    width: 100%;
    height: 14px;
  }

  .sk-desc-2 {
    width: 84%;
    height: 14px;
  }

  .sk-ship-head {
    width: 180px;
    height: 18px;
    margin-bottom: 6px;
  }

  .skbox {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }

  .sk-ship-1 {
    width: 85%;
    height: 14px;
    flex: 1;
  }

  .sk-ship-2 {
    width: 80%;
    height: 14px;
    flex: 1;
  }

  .sk-ship-3 {
    width: 72%;
    height: 14px;
    flex: 1;
  }

  .rec-skeleton__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .skthumb {
    height: 140px;
    border-radius: 12px;
  }

  .sk-name {
    height: 14px;
    width: 70%;
    margin: 6px 0 8px;
  }

  .sktag {
    width: 54px;
    height: 20px;
  }

  .sk-price {
    height: 16px;
    width: 90px;
  }
}

@media (max-width: 360px) {
  .rec-skeleton__grid {
    grid-template-columns: 1fr;
  }
}

.badge {
  position: absolute;
  top: 16px;
  left: 16px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  height: 26px;
  border-radius: 40px;
  background: #fffceb;
}

.badge__icon {
  width: 16px;
  height: 16px;
}

.badge__text {
  color: #dbad1b;
  font: 500 12px/16px Inter, sans-serif;
}

.pager {
  position: absolute;
  left: 16px;
  bottom: 16px;
  font: 600 16px/24px var(--ff);
  color: var(--text);
}

.navgroup {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  gap: 8px;
}

.navbtn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .06);
  color: #111;
  transition: all .2s ease;
}

.navico {
  width: 26px;
  height: 26px;
  stroke-width: 2.2;
  display: block;
}

.navbtn--white {
  background: #fff;
  border: 1px solid #e6e6e6;
}

.navbtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* hero skeleton additional squares */
.sk-hero-actions {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  gap: 10px;
  z-index: 2;
}

.sk-hero-actions .sk-sq {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .04);
}

.desc {
  margin-top: 60px;
}

.desc__title {
  margin: 0 0 8px;
  font: 600 16px/24px var(--ff);
  color: var(--text);
}

.desc__body {
  margin: 0 0 8px;
  font: 400 16px/24px var(--ff);
  color: var(--text);
}

.desc__body.is-clamped {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: var(--clamp, 5);
}

.desc__read {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  background: none;
  border: 0;
  cursor: pointer;
  color: var(--brand);
  font: 500 12px/18px var(--ff);
}

.desc__read .caret {
  width: 16px;
  height: 16px;
  transition: transform .2s ease;
}

.desc__read.is-open .caret {
  transform: rotate(180deg);
}

.desc--mobile {
  display: none;
}

@media (max-width: 1024px) {
  .desc--mobile {
    display: block;
    margin-top: 16px;
  }

  .hidden-mobile {
    display: none;
  }
}

.title {
  margin: 8px 0 2px;
  font: 600 20px/28px var(--ff);
  color: var(--text);
}

.category {
  font: 500 14px/22px var(--ff);
  color: #757575;
}

.price {
  margin-top: 18px;
  font: 700 20px/28px var(--ff);
  color: var(--text);
}

.tax {
  margin-top: 8px;
  font: 700 14px/22px var(--ff);
  color: var(--text);
}

.block {
  margin-top: 18px;
}

.block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.block__label {
  font: 500 14px/22px var(--ff);
}

.sizeguide {
  color: #9e9e9e;
  background: none;
  border: 0;
  cursor: pointer;
  font: 400 12px/18px var(--ff);
}

.optgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 8px;
  row-gap: 12px;
}

.opt {
  display: flex;
  height: 36px;
  padding: 8px 0;
  justify-content: center;
  align-items: center;
  min-width: 80px;
  border-radius: 4px;
  border: 1px solid #ededed;
  background: #fff;
  color: #000;
  font: 400 14px/22px var(--ff);
  cursor: pointer;
}

.opt.is-disabled {
  border-color: #e0e0e0;
  background: #ededed;
  color: #9e9e9e;
  cursor: not-allowed;
}

.opt.is-active {
  border-color: var(--brand);
  color: #d47e1a;
}

.input {
  height: 36px;
  border: 1px solid #ededed;
  border-radius: 6px;
  padding: 0 10px;
  font: 400 14px/22px var(--ff);
}

.stock {
  margin-top: 12px;
  font: 500 14px/22px var(--ff);
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.stock-alert {
  background: #FFE9E9;
  color: #E53935;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
}

.cta {
  margin-top: 12px;
  width: 100%;
  border: 0;
  border-radius: 10px;
  padding: 8px 12px;
  background: var(--brand);
  color: #fff;
  font: 500 16px/24px var(--ff);
  cursor: pointer;
}

.cta:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}

.ship {
  margin-top: 36px;
}

.ship__title {
  margin: 0 0 6px;
  font: 600 16px/24px var(--ff);
  color: var(--text);
}

.ship__row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 8px 0;
}

.ship__icon {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  background: #fff;
}

.ship__text {
  font: 400 14px/22px var(--ff);
  color: var(--text);
}

.skel {
  background: linear-gradient(270deg, rgba(219, 219, 219, 0.05) 0%, #dbdbdb 50%, rgba(219, 219, 219, 0.05) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.sk-wrap>* {
  margin-bottom: 10px;
}

.skline {
  height: 18px;
  width: 60%;
  border-radius: 6px;
}

.sk-title {
  width: 72%;
  height: 28px;
  border-radius: 8px;
}

.sk-cat {
  width: 140px;
  height: 14px;
}

.sk-pricechip {
  width: 150px;
  height: 24px;
  border-radius: 8px;
}

.sk-tax {
  width: 120px;
  height: 16px;
  margin-top: 4px;
}

.skblock {
  margin-top: 14px;
}

.skgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 8px;
  row-gap: 12px;
  margin-top: 8px;
}

.skopt {
  height: 36px;
  border-radius: 4px;
}

.sk-qty-label {
  width: 90px;
  height: 16px;
}

.sk-input {
  height: 44px;
  border-radius: 10px;
  width: 100%;
}

.sk-desc-head {
  width: 110px;
  height: 16px;
}

.sk-desc-1 {
  width: 100%;
  height: 16px;
}

.sk-desc-2 {
  width: 80%;
  height: 16px;
}

.sk-ship-head {
  width: 180px;
  height: 18px;
  margin-bottom: 6px;
}

.skbox {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  margin-right: 12px;
}

.ship .ship__row {
  align-items: center;
}

.sk-ship-1 {
  width: 80%;
  height: 16px;
  flex: 1;
}

.sk-ship-2 {
  width: 78%;
  height: 16px;
  flex: 1;
}

.sk-ship-3 {
  width: 70%;
  height: 16px;
  flex: 1;
}

.rec-skeleton {
  margin-top: 24px;
}

.rec-skeleton__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.rec-skeleton__nav {
  display: flex;
  gap: 12px;
}

.rec-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.card {
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .04);
  background: #fff;
}

.skthumb {
  width: 100%;
  height: 240px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.sk-name {
  height: 17px;
  width: 60%;
  margin: 6px 0 10px;
  border-radius: 6px;
}

.sktags {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.sktag {
  width: 56px;
  height: 22px;
  border-radius: 999px;
  display: inline-block;
}

.sk-price {
  height: 18px;
  width: 80px;
  border-radius: 6px;
}

@media (max-width: 1024px) {
  .rec-skeleton__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 520px) {
  .rec-skeleton__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .sk-title {
    width: 68%;
  }

  .skline {
    width: 58%;
  }

  .sk-pricechip {
    width: 150px;
    height: 24px;
  }

  .sk-tax {
    width: 140px;
  }
}

@media (min-width: 1025px) {
  .cols {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
