export const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

export const formatVND = (usdValue: number) => {
    const EXCHANGE_RATE = 25400;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(usdValue * EXCHANGE_RATE);
};