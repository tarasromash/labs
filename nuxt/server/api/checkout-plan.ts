export default defineEventHandler(() => {
    return {
        plan: {
            title: 'Team - Annual',
            price: 207.50,
            oldPrice: 2490,
            savings: 498,
            features: [
                { text: 'Primary user + 2 free team members', subtext: '(extra team members for $25/month)' },
                { text: 'Save unlimited properties', subtext: '' },
                { text: '50,000 exports', subtext: '(additional exports at $0.01 each)' },
                { text: '1,000 free skip traces', subtext: '(additional skip tracing at $0.08 each)' },
                { text: 'Imports $0.01', subtext: '' },
                { text: 'FREE daily product trainings and support', subtext: '' },
                { text: 'Full suite of next-gen investing tools', subtext: '' },
                { text: 'Industry first AI powered comp tool', subtext: '' },
                { text: 'Includes dedicated support agent', subtext: '' }
            ]
        },
        orderSummary: {
            annualPlan: 2490.00,
            totalDue: 2490.00,
            dueToday: 0.00
        }
    }
})