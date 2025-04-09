import { apiClient } from "./client"

const fetchProfileInfo = async () => {
    const response = await apiClient.get("user/profile-info")   
    return response.data.data
}

const userSignIn = async (data) => {
    const response = await apiClient.post("user/signin", data, { NoAuth : true })
    return response.data.data
}

const userSignUp = async (data) => {
    try {
        const response = await apiClient.post("user/signup", data, { NoAuth : true })
        return response.data.data
    } catch (error) {
        console.log("Error in sign up ", error)
    }
}

const subscribe = async (channelId) => {
    const response = await apiClient.post("user/subscribe", {channelId})
    return response
}
// router.post("/update-profile", authenticate, uploadProfileCover, validate(setupProfileSchema), asyncHandler(setupProfile))
const updateProfile = async (data) => {
    const response = await apiClient.post("user/update-profile",data)
    return response.data.data
}

const getUser = async (userId) => {
    const response = await apiClient.get(`user/profile/${userId}`)
    return response.data.data
}

const fetchSubscriptions = async (userId) => {
    const response = await apiClient.get(`user/${userId}`)
    return response.data.data
}

const getSubscriberCount = async () => {
    const response = await apiClient.get(`user/subscribers/count`)
    return response.data.data
}

export default { 
    fetchProfileInfo,
    updateProfile, 
    userSignIn,
    userSignUp,
    subscribe,
    getUser,
    fetchSubscriptions,
    getSubscriberCount
}