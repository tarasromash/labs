import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscription', () => {
    const selectedPlan = ref<any>(null)

    const hasSelectedPlan = computed(() => selectedPlan.value !== null)

    function selectPlan(plan: any) {
        selectedPlan.value = plan
    }

    function clearSelection() {
        selectedPlan.value = null
    }

    return {
        selectedPlan,
        hasSelectedPlan,
        selectPlan,
        clearSelection
    }
})