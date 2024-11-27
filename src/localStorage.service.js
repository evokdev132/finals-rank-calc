const CURRENT_POINTS = 'rankPoints';

export function getCurrentPoints() {
    return getInt(CURRENT_POINTS)
}

export function saveCurrentPoints(points) {
    setInt(CURRENT_POINTS, points);
}

function setInt(key, value) {
    localStorage.setItem(key, `${value}`)
}

function getInt(key) {
    return Number.parseInt(localStorage.getItem(key))
}


function setString(key, value) {
    localStorage.setItem(key, `${value}`)
}

function getString(key) {
    return `${localStorage.getItem(key)}`
}