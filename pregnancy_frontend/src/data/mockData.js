// src/data/mockData.js
const mockUserData = {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'Member',
};

const mockSubscriptionData = {
    planName: 'Premium Plan',
    price: 19.99,
    expiryDate: '2024-12-31',
};

const mockDashboardLinks = [
    {
        label: 'Track Fetal Growth',
        url: '/fetal-growth',
    },
    {
        label: 'Manage Appointments',
        url: '/appointments',
    },
    {
        label: 'Read Blog',
        url: '/blog',
    },
];

export { mockUserData, mockSubscriptionData, mockDashboardLinks };