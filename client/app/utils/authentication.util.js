const getAuthenticationToken = () => {
    return localStorage.getItem("SessionInfo")
}

const setAuthenticationToken = (token) => {
    localStorage.setItem("SessionInfo", token)
}

const removeAuthenticationToken = () => {
    localStorage.removeItem("SessionInfo")
}

const isUserSessionExists = () => {
    return !!getAuthenticationToken()
}

const clearAllSession = () => {
    localStorage.clear();
    window.location.href = '/'
}

export {
    getAuthenticationToken,
    setAuthenticationToken,
    removeAuthenticationToken,
    isUserSessionExists,
    clearAllSession,
}