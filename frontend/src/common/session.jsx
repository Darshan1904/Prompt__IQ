const storeInSession = (key, value) => {
    sessionStorage.setItem(key, value);
}

const getFromSession = (key) => {
    return sessionStorage.getItem(key);
}

const removeFromSession = (key) => {
    sessionStorage.removeItem(key);
}

const clearSession = () => {
    sessionStorage.clear();
}

export {storeInSession, getFromSession, removeFromSession, clearSession};