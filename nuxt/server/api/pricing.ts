export default defineEventHandler(() => {
    return [
        {
            title: 'Starter - Annual',
            price: 83.25,
            oldPrice: 999,
            savings: 189,
            features: [
                'Primary user only',
                'Save unlimited properties',
                '10,000 exports',
                '500 free skip traces',
                'Imports $0.01',
                'FREE daily product trainings'
            ]
        },
        {
            title: 'Team - Annual',
            price: 207.50,
            oldPrice: 2490,
            savings: 498,
            features: [
                'Primary user + 2 free team members',
                'Save unlimited properties',
                '50,000 exports',
                '1,000 free skip traces',
                'Imports $0.01',
                'FREE daily product trainings'
            ]
        },
        {
            title: 'Business - Annual',
            price: 457.50,
            oldPrice: 5490,
            savings: 1098,
            features: [
                'Primary user + 6 free team members',
                'Save unlimited properties',
                '100,000 exports',
                '2,000 free skip traces',
                'Imports $0.01',
                'FREE daily product trainings'
            ]
        }
    ];
});