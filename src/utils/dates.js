export function formatDate(date) {
    const validDate = typeof date === 'object' && date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat('en-GB').format(validDate);
}


export function subtractDays() {

}