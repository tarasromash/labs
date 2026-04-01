<script setup lang="ts">
useSeoMeta({ title: 'Список продуктів' })

// ── fetch all products via our API route ──────────────────────────────────────
const { data: raw, pending } = await useFetch('/api/products')

const allProducts = computed(() => (raw.value as any)?.products ?? [])

// ── column definitions ────────────────────────────────────────────────────────
const columns = [
  { key: 'thumbnail', label: 'Фото', sortable: false },
  { key: 'title',       label: 'Назва',     sortable: true },
  { key: 'description', label: 'Опис',      sortable: false },
  { key: 'price',       label: 'Ціна ($)',  sortable: true },
  { key: 'rating',      label: 'Оцінка',    sortable: true },
  { key: 'brand',       label: 'Бренд',     sortable: true },
  { key: 'category',    label: 'Категорія', sortable: true },
]

// ── global filter ─────────────────────────────────────────────────────────────
const globalFilter = ref('')

// ── sorting ───────────────────────────────────────────────────────────────────
const sort = ref<{ column: string; direction: 'asc' | 'desc' }>({
  column: 'title',
  direction: 'asc',
})

// ── pagination ────────────────────────────────────────────────────────────────
const page     = ref(1)
const pageSize = ref(10)

// ── derived data (filter → sort → paginate) ───────────────────────────────────
const filtered = computed(() => {
  const q = globalFilter.value.toLowerCase().trim()
  if (!q) return allProducts.value
  return allProducts.value.filter((p: any) =>
      [p.title, p.description, p.brand, p.category]
          .some((v: string) => String(v ?? '').toLowerCase().includes(q))
  )
})

const sorted = computed(() => {
  const { column, direction } = sort.value
  return [...filtered.value].sort((a: any, b: any) => {
    const av = a[column] ?? ''
    const bv = b[column] ?? ''
    const cmp = typeof av === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
    return direction === 'asc' ? cmp : -cmp
  })
})

const totalRows  = computed(() => sorted.value.length)
const totalPages = computed(() => Math.ceil(totalRows.value / pageSize.value))

const pageRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sorted.value.slice(start, start + pageSize.value)
})

// reset to page 1 when filter changes
watch(globalFilter, () => { page.value = 1 })
watch(sort,        () => { page.value = 1 }, { deep: true })

function toggleSort(col: string) {
  if (sort.value.column === col) {
    sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value = { column: col, direction: 'asc' }
  }
}

function sortIcon(col: string) {
  if (sort.value.column !== col) return '⇅'
  return sort.value.direction === 'asc' ? '↑' : '↓'
}
</script>

<template>
  <div class="page">

    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <h1>Список продуктів</h1>
      <p class="subtitle">Перегляд, пошук та сортування товарів</p>
    </header>

    <!-- ── Loading ────────────────────────────────────────────────────── -->
    <div v-if="pending" class="loading">
      <span class="spinner"></span> Завантаження…
    </div>

    <template v-else>

      <!-- ── Controls ──────────────────────────────────────────────────── -->
      <div class="controls">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
              v-model="globalFilter"
              class="search-input"
              placeholder="Пошук за назвою, брендом, категорією…"
          />
        </div>

        <div class="page-size-wrap">
          <label for="page-size">Рядків:</label>
          <select id="page-size" v-model="pageSize" @change="page = 1">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <!-- ── Table ─────────────────────────────────────────────────────── -->
      <div class="table-wrap">
        <table class="products-table">
          <thead>
          <tr>
            <th v-for="col in columns" :key="col.key"
                :class="{ sortable: col.sortable, active: sort.column === col.key }"
                @click="col.sortable && toggleSort(col.key)">
              {{ col.label }}
              <span v-if="col.sortable" class="sort-icon">{{ sortIcon(col.key) }}</span>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="product in pageRows" :key="product.id" class="product-row">

            <!-- Фото -->
            <td class="cell-thumb">
              <img :src="product.thumbnail" :alt="product.title"
                   width="100" height="100" class="thumb" />
            </td>

            <!-- Назва -->
            <td class="cell-title">{{ product.title }}</td>

            <!-- Опис -->
            <td class="cell-desc">{{ product.description }}</td>

            <!-- Ціна -->
            <td class="cell-price">${{ product.price }}</td>

            <!-- Оцінка (color coded) -->
            <td class="cell-rating"
                :class="product.rating >= 4.5 ? 'rating-high' : 'rating-low'">
              ★ {{ product.rating }}
            </td>

            <!-- Бренд -->
            <td class="cell-brand">{{ product.brand ?? '—' }}</td>

            <!-- Категорія -->
            <td class="cell-category">
              <span class="badge">{{ product.category }}</span>
            </td>
          </tr>

          <tr v-if="pageRows.length === 0">
            <td :colspan="columns.length" class="empty-row">
              Нічого не знайдено
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Pagination ─────────────────────────────────────────────────── -->
      <div class="pagination">
        <span class="pagination-info">
          Показано {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, totalRows) }}
          з {{ totalRows }} товарів
        </span>

        <div class="pagination-controls">
          <button :disabled="page === 1" @click="page = 1">«</button>
          <button :disabled="page === 1" @click="page--">‹</button>

          <template v-for="p in totalPages" :key="p">
            <button
                v-if="Math.abs(p - page) <= 2 || p === 1 || p === totalPages"
                :class="{ active: p === page }"
                @click="page = p">
              {{ p }}
            </button>
            <span
                v-else-if="p === page - 3 || p === page + 3"
                class="ellipsis">…</span>
          </template>

          <button :disabled="page === totalPages" @click="page++">›</button>
          <button :disabled="page === totalPages" @click="page = totalPages">»</button>
        </div>
      </div>

    </template>
  </div>
</template>

<style scoped>
/* ── CSS Variables ─────────────────────────────────────────────────────── */
:root {
  --c-bg:       #f5f7fa;
  --c-surface:  #ffffff;
  --c-border:   #e2e8f0;
  --c-accent:   #f0a500;
  --c-accent2:  #1a73e8;
  --c-text:     #1e293b;
  --c-muted:    #64748b;
  --c-green:    #16a34a;
  --c-red:      #dc2626;
}

/* ── Page ───────────────────────────────────────────────────────────────── */
.page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 2rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: var(--c-text);
}

/* ── Header ─────────────────────────────────────────────────────────────── */
.page-header {
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 .25rem;
  letter-spacing: -.5px;
}
.subtitle {
  color: var(--c-muted);
  font-size: .95rem;
  margin: 0;
}

/* ── Loading ────────────────────────────────────────────────────────────── */
.loading {
  display: flex;
  align-items: center;
  gap: .75rem;
  font-size: 1.1rem;
  color: var(--c-muted);
  padding: 3rem 0;
}
.spinner {
  display: inline-block;
  width: 20px; height: 20px;
  border: 3px solid #ddd;
  border-top-color: var(--c-accent2);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Controls ───────────────────────────────────────────────────────────── */
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.search-wrap {
  position: relative;
  flex: 1;
  max-width: 420px;
}
.search-icon {
  position: absolute;
  left: .85rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: .95rem;
}
.search-input {
  width: 100%;
  padding: .6rem 1rem .6rem 2.4rem;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  font-size: .95rem;
  background: #fff;
  outline: none;
  transition: border-color .2s;
  box-sizing: border-box;
}
.search-input:focus { border-color: var(--c-accent2); }

.page-size-wrap {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .9rem;
  color: var(--c-muted);
}
.page-size-wrap select {
  padding: .4rem .6rem;
  border: 1.5px solid var(--c-border);
  border-radius: 6px;
  font-size: .9rem;
  cursor: pointer;
  outline: none;
}

/* ── Table wrapper ──────────────────────────────────────────────────────── */
.table-wrap {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,.07);
  overflow-x: auto;
}

/* ── Table ──────────────────────────────────────────────────────────────── */
.products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .9rem;
}

/* Head */
.products-table thead tr {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}
.products-table th {
  color: #e2e8f0;
  font-weight: 600;
  text-transform: uppercase;
  font-size: .78rem;
  letter-spacing: .07em;
  padding: .9rem 1rem;
  white-space: nowrap;
  text-align: left;
  user-select: none;
}
.products-table th.sortable { cursor: pointer; }
.products-table th.sortable:hover { color: #fff; background: rgba(255,255,255,.05); }
.products-table th.active { color: #fbbf24; }

.sort-icon {
  margin-left: .35rem;
  opacity: .7;
  font-size: .8em;
}

/* Body rows */
.product-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background .15s;
}
.product-row:last-child { border-bottom: none; }
.product-row:hover { background: #f8fafc; }

.products-table td {
  padding: .75rem 1rem;
  vertical-align: middle;
}

/* Thumbnail */
.cell-thumb { width: 110px; }
.thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: block;
}

/* Title */
.cell-title {
  font-weight: 600;
  min-width: 150px;
  max-width: 200px;
  color: #0f172a;
}

/* Description */
.cell-desc {
  min-width: 220px;
  max-width: 300px;
  color: var(--c-muted);
  font-size: .85rem;
  line-height: 1.5;
}

/* Price */
.cell-price {
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* Rating */
.cell-rating {
  font-weight: 700;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.rating-high { color: var(--c-green); }
.rating-low  { color: var(--c-red); }

/* Brand */
.cell-brand { color: var(--c-muted); white-space: nowrap; }

/* Category badge */
.badge {
  display: inline-block;
  padding: .25rem .65rem;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: .78rem;
  font-weight: 600;
  white-space: nowrap;
  text-transform: capitalize;
}

/* Empty */
.empty-row {
  text-align: center;
  padding: 3rem;
  color: var(--c-muted);
  font-size: 1rem;
}

/* ── Pagination ─────────────────────────────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.25rem;
}

.pagination-info {
  font-size: .88rem;
  color: var(--c-muted);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: .35rem;
}
.pagination-controls button {
  min-width: 34px;
  height: 34px;
  padding: 0 .5rem;
  border: 1.5px solid var(--c-border);
  border-radius: 7px;
  background: #fff;
  cursor: pointer;
  font-size: .88rem;
  color: var(--c-text);
  transition: all .15s;
}
.pagination-controls button:hover:not(:disabled) {
  border-color: var(--c-accent2);
  color: var(--c-accent2);
}
.pagination-controls button.active {
  background: #1e293b;
  border-color: #1e293b;
  color: #fff;
  font-weight: 700;
}
.pagination-controls button:disabled {
  opacity: .35;
  cursor: not-allowed;
}
.ellipsis {
  color: var(--c-muted);
  font-size: .9rem;
  padding: 0 .25rem;
}
</style>
