function formatDate(rawDate) {
    const date = typeof rawDate === 'object' && rawDate instanceof Date ? rawDate : new Date(rawDate);
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date).replace(/\//g, '-');
}

function isoFormatDate(date) {
    return date.toISOString().split('T')[0];  // Converts to 'yyyy-mm-dd'
}

function subtractDays(rawDate, days) {
    const resultDate = typeof rawDate === 'object' && rawDate instanceof Date ? rawDate : new Date(rawDate);
    resultDate.setDate(resultDate.getDate() - days);
    return resultDate;
}

module.exports = {
    formatDate,
    subtractDays
}