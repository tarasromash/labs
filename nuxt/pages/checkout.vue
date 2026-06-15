<script setup lang="ts">
useHead({ title: 'Оплата за підписку' })

const { data } = await useFetch('/api/checkout-plan')
const subscriptionStore = useSubscriptionStore()
const { selectedPlan } = storeToRefs(subscriptionStore)

const form = ref({
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  fullName: 'dev4 dev4',
  address: '',
  termsAccepted: false
})

const submitForm = async () => {
  if (!form.value.termsAccepted) {
    alert('Погодьтеся з правилами')
    return
  }

  await $fetch('/api/subscription/create', {
    method: 'POST',
    body: form.value
  })

  alert('Дані успішно відправлено!')
}
</script>

<template>
  <div class="checkout-page">
    <div class="top-bar">Checkout</div>

    <div class="container">
      <NuxtLink to="/" class="back">&lt;&lt; back</NuxtLink>

      <h1>You’re Almost In - Start Your 3-Day Free Trial Now!</h1>
      <p class="subtitle">
        Set up your account to gain instant access! You won’t be charged if you decide to cancel within 3 days
      </p>

      <div v-if="data" class="checkout-grid">
        <div class="plan-card">
          <div class="top-line"></div>

          <div class="plan-content">
            <h2>{{ selectedPlan?.title || data.plan.title }}</h2>

            <div class="label">3-days free then:</div>

            <div class="price">
              ${{ selectedPlan?.price || data.plan.price }}<span>/month</span>
            </div>

            <p class="yearly">
              billed yearly at
              <span class="old">${{ data.plan.oldPrice }}</span>
              ${{ data.orderSummary.annualPlan }}
            </p>

            <div class="saving">
              ${{ selectedPlan?.savings || data.plan.savings }} in savings
            </div>

            <hr>

            <ul>
              <li v-for="(feature, index) in selectedPlan?.features || data.plan.features" :key="index">
                <span class="star">✦</span>
                <div>
                  <p class="feature-text">{{ feature.text }}</p>
                  <p v-if="feature.subtext" class="subtext">{{ feature.subtext }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="payment-card">
          <h2>Order Summary</h2>

          <div class="summary-row">
            <span>Annual Plan</span>
            <strong>${{ data.orderSummary.annualPlan.toFixed(2) }}</strong>
          </div>

          <div class="summary-row small">
            <span>Total Due <small>(not including sales tax where applicable)</small></span>
            <strong>${{ data.orderSummary.totalDue.toFixed(2) }}</strong>
          </div>

          <div class="summary-row bold">
            <span>Due Today</span>
            <strong>${{ data.orderSummary.dueToday.toFixed(2) }}</strong>
          </div>

          <div class="trial-box">Includes 3-Day Free Trial</div>

          <h2 class="billing-title">Billing Information</h2>

          <form @submit.prevent="submitForm">
            <label>Card Details</label>

            <div class="card-inputs">
              <input v-model="form.cardNumber" placeholder="▣  Number">
              <input v-model="form.cardExpiry" placeholder="MM / YY">
              <input v-model="form.cardCvc" placeholder="CVC">
            </div>

            <label>Address</label>

            <div class="address-box">
              <label>Full name</label>
              <input v-model="form.fullName">

              <label>Address</label>
              <input v-model="form.address">
            </div>

            <div class="terms">
              <input v-model="form.termsAccepted" type="checkbox">
              <span>
                I consent to <b><u>Terms of Use</u></b> and understand my 3-day free trial
                will automatically convert to $2,490.00 per year starting on 04/02/2026.
              </span>
            </div>

            <button type="submit" class="submit-btn">
              Try It Free
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #ffffff;
  font-family: Arial, sans-serif;
  color: #111827;
}

.top-bar {
  background: #333333;
  color: white;
  text-align: center;
  padding: 14px;
  font-size: 20px;
  font-weight: 700;
}

.container {
  max-width: 940px;
  margin: 0 auto;
  padding: 20px 0 50px;
}

.back {
  display: inline-block;
  color: #4b5563;
  font-size: 14px;
  margin-bottom: 26px;
  text-decoration: none;
}

h1 {
  font-size: 26px;
  margin: 0 0 12px;
}

.subtitle {
  font-size: 17px;
  margin-bottom: 36px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 330px 1fr;
  gap: 60px;
}

.plan-card,
.payment-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.top-line {
  height: 4px;
  background: linear-gradient(to right, #4ade80, #06b6d4);
}

.plan-content {
  padding: 30px 34px;
}

.plan-content h2,
.payment-card h2 {
  font-size: 19px;
  margin: 0 0 26px;
}

.label {
  display: inline-block;
  background: #f1f1f1;
  color: #666;
  font-size: 11px;
  padding: 4px 7px;
  border-radius: 3px;
  margin-bottom: 8px;
}

.price {
  font-size: 34px;
  font-weight: 800;
}

.price span {
  font-size: 13px;
  font-weight: 400;
  color: #6b7280;
}

.yearly {
  font-size: 12px;
  color: #6b7280;
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
  margin: 8px 0 24px;
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
}

.feature-text {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.subtext {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.payment-card {
  padding: 40px;
  box-shadow: none;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}

.summary-row.small {
  font-size: 13px;
}

.summary-row small {
  font-size: 10px;
}

.summary-row.bold {
  font-weight: 700;
  border-bottom: none;
}

.trial-box {
  background: #f0f0f0;
  text-align: center;
  padding: 18px;
  margin: 24px 0 32px;
  font-size: 15px;
}

.billing-title {
  margin-top: 0;
}

form label {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
}

.card-inputs {
  display: grid;
  grid-template-columns: 1fr 120px 80px;
  border: 1px solid #cfd4dc;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 14px;
}

.card-inputs input {
  border: none;
  border-right: 1px solid #cfd4dc;
  padding: 13px;
  font-size: 15px;
}

.card-inputs input:last-child {
  border-right: none;
}

.address-box {
  border: 1px solid #cfd4dc;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
}

.address-box input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 15px;
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
  color: #4b5563;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 24px;
}

.submit-btn {
  background: #d9d9d9;
  color: #6b7280;
  border: none;
  padding: 16px 34px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
}
</style>