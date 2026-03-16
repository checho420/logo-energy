/**
 * Formats a number as currency string with thousand separators and decimals.
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    const value = parseFloat(amount);
    if (isNaN(value)) return '$0';

    // Show 2 decimal places only if there is a fractional part
    const hasDecimals = value % 1 !== 0;

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

/**
 * Formats a number with thousand separators but without the currency symbol.
 * @param {number|string} number - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
    const value = parseFloat(number);
    if (isNaN(value)) return '0';

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
};

