export function formatToDateTime(timestamp) {
   return new Date(timestamp).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function formatToDate(timestamp) {
    return new Date(timestamp).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    })
}

export function daysBetween(a, b) {
    return Math.ceil(Math.abs(b - a) / (1000 * 60 * 60 * 24));
}