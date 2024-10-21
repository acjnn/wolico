function formatDate(rawDate) {
    const date = rawDate instanceof Date ? rawDate : new Date(rawDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function isoFormatDate(date) {
    return date.toISOString().split('T')[0];  // Converts to 'yyyy-mm-dd'
}

function subtractDays(rawDate, days) {
    const resultDate = rawDate instanceof Date ? rawDate : new Date(rawDate);
    resultDate.setDate(resultDate.getDate() - days);
    return resultDate;
}

module.exports = {
    formatDate,
    subtractDays
}