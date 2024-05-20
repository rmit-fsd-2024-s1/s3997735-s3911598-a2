import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";
const USER_KEY = "user";

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(username, password) {
    // 使用 POST 方法进行用户登录
    const response = await axios.post(API_HOST + "/api/users/login", { username, password });
    const user = response.data;

    // 如果用户验证成功，将用户信息存储到 local storage
    if (user !== null) {
        setUser(user);
    }

    return user;
}

async function findUser(id) {
    const response = await axios.get(API_HOST + `/api/users/select/${id}`);
    return response.data;
}

async function createUser(user) {
    const response = await axios.post(API_HOST + "/api/users", user);
    return response.data;
}

// --- Post ---------------------------------------------------------------------------------------
async function getPosts() {
    const response = await axios.get(API_HOST + "/api/posts");
    return response.data;
}

async function createPost(post) {
    const response = await axios.post(API_HOST + "/api/posts", post);
    return response.data;
}

// --- Helper functions to interact with local storage --------------------------------------------
function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
}

function removeUser() {
    localStorage.removeItem(USER_KEY);
}

export {
    verifyUser, findUser, createUser,
    getPosts, createPost,
    getUser, removeUser
};
