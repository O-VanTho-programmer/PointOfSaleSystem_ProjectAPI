import http from 'k6/http';
import { check, sleep } from 'k6';

// Read baseUrl from environment or default to local API HTTPS port
const BASE_URL = __ENV.BASE_URL || 'https://localhost:44356/api';

export const options = {
    // Defines the stress testing stages
    stages: [
        { duration: '10s', target: 20 }, // Ramp-up to 20 users over 10 seconds
        { duration: '30s', target: 20 }, // Stay at 20 users for 30 seconds
        { duration: '10s', target: 0 },  // Ramp-down to 0 users over 10 seconds
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'],    // Error rate should be less than 1%
    },
};

export default function () {
    const headers = {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // Uncomment if authentication is required
    };

    // 1. Create a new Order (POST /api/Orders)
    const orderPayload = JSON.stringify({
        Status: 1, // 1: e.g., Pending
        DiscountId: 0,
        UserId: 1, // Mock user ID
        Items: [
            { ItemId: 1, Quantity: 2 },
            { ItemId: 3, Quantity: 1 }
        ],
        CreatedDate: new Date().toISOString()
    });

    const postRes = http.post(`${BASE_URL}/Orders`, orderPayload, { headers });

    // Validate POST response
    check(postRes, {
        'POST /api/Orders status is 200 or 201': (r) => r.status === 200 || r.status === 201,
        'POST /api/Orders responds within 500ms': (r) => r.timings.duration < 500,
    });

    // Extract Order ID to use in subsequent requests (fallback to 1 if parsing fails)
    let orderId = 1;    
    if (postRes.status === 200 || postRes.status === 201) {
        try {
            const order = postRes.json();
            orderId = order.id || order.Id || 1;
        } catch (e) {
            // Ignore parse errors if the response format is unexpected
        }
    }

    // 2. Get Orders List (GET /api/Orders)
    const getListRes = http.get(`${BASE_URL}/Orders?pageNumber=1&pageSize=10`, { headers });

    check(getListRes, {
        'GET /api/Orders status is 200': (r) => r.status === 200,
    });

    // 3. Get Single Order (GET /api/Orders/{id})
    const getSingleRes = http.get(`${BASE_URL}/Orders/${orderId}`, { headers });

    check(getSingleRes, {
        'GET /api/Orders/{id} status is 200': (r) => r.status === 200,
    });

    // 4. Update Order Status (PATCH /api/Orders/{id}/status)
    const patchPayload = JSON.stringify({
        Status: 2 // 2: e.g., Processing
    });

    const patchRes = http.patch(`${BASE_URL}/Orders/${orderId}/status`, patchPayload, { headers });

    check(patchRes, {
        'PATCH /api/Orders/{id}/status status is 200': (r) => r.status === 200,
    });

    // Think time between iterations
    sleep(1);
}
