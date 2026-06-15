<script setup lang="ts">
useHead({ title: 'Список продуктів' })

const { data: pricingPlans } = await useFetch('/api/pricing')

const subscriptionStore = useSubscriptionStore()

const goToCheckout = (plan: any) => {
  subscriptionStore.selectPlan(plan)
  navigateTo('/checkout')
}
</script>

<template>
  <div class="page">
    <div class="header">
      <h1>Start Your 3 Day Free Trial</h1>

      <div class="switcher">
        <span>Save up to 20%</span>
        <button class="active">Annual</button>
        <button>Monthly</button>
      </div>
    </div>

    <div class="cards">
      <div v-for="plan in pricingPlans" :key="plan.title" class="card">
        <div class="top-line"></div>

        <div class="card-content">
          <h2>{{ plan.title }}</h2>

          <div class="label">3-days free then:</div>

          <div class="price">
            ${{ plan.price }}<span>/month</span>
          </div>

          <p class="yearly">
            billed yearly at
            <span class="old">${{ plan.originalMonthly }}</span>
            ${{ plan.oldPrice }}
          </p>

          <div class="saving">
            ${{ plan.savings }} in savings
          </div>

          <button class="try-btn" @click="goToCheckout(plan)">
            Try It Free
          </button>

          <hr>

          <ul>
            <li v-for="(feature, index) in plan.features" :key="index">
              <span class="star">✦</span>
              <div>
                <p class="feature-text">{{ feature.text }}</p>
                <p v-if="feature.subtext" class="subtext">{{ feature.subtext }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 40px;
  font-family: Arial, sans-serif;
  color: #1f2937;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 26px;
  font-weight: 700;
  margin: 0;
}

.switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.switcher span {
  color: #16a34a;
  font-size: 12px;
}

.switcher button {
  border: 1px solid #ddd;
  background: #f8f8f8;
  padding: 8px 13px;
  cursor: pointer;
}

.switcher .active {
  background: white;
  font-weight: 700;
  border-radius: 4px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.card {
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
}

.top-line {
  height: 4px;
  background: linear-gradient(to right, #4ade80, #06b6d4);
}

.card-content {
  padding: 30px 35px;
}

.card h2 {
  font-size: 19px;
  margin: 0 0 22px;
  font-weight: 700;
}

.label {
  display: inline-block;
  background: #f1f1f1;
  color: #777;
  font-size: 11px;
  padding: 4px 7px;
  border-radius: 3px;
  margin-bottom: 8px;
}

.price {
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
}

.price span {
  font-size: 13px;
  font-weight: 400;
  color: #6b7280;
}

.yearly {
  font-size: 12px;
  color: #6b7280;
  margin: 10px 0;
}

.old {
  text-decoration: line-through;
}

.saving {
  display: inline-block;
  background: #e5eef5;
  color: #059669;
  font-size: 14px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.try-btn {
  width: 100%;
  border: none;
  background: linear-gradient(to right, #ffd21c, #ff850b);
  color: #111827;
  font-weight: 700;
  padding: 14px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 24px;
}

.try-btn:hover {
  opacity: 0.9;
}

hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

li {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.star {
  color: #7ee36d;
  font-size: 16px;
}

.feature-text {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.subtext {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6b7280;
}
</style>