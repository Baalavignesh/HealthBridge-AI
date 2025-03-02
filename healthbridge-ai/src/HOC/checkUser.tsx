const checkUser = () => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo") || "{}");
    if (userInfo.type) {
        return userInfo.type.toLowerCase();
    }
    return null;
}   