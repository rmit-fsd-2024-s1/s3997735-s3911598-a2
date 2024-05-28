import CryptoJs from 'crypto-js';
import axios from "axios";

const API_HOST = "http://localhost:4000";
const CURRENT_USER_KEY = "current_user";
const USERS_KEY = "users";
const CART_KEY = 'cartItems';

interface User {
  name: string;
  email: string;
  password: string;
  date: string;

}

interface CartItemModel {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

async function verifyUser(email:string, password:string) {
  const response = await axios.get(API_HOST + "/api/users/login", { params: { email, password } });
  const user = response.data;

  // NOTE: In this example the login is also persistent as it is stored in local storage.
  if(user !== null)
    // setUser(user);

  return user;
}

function signup(name: string, email: string, password: string) {
  //use md5 to hash password
  const pwd = CryptoJs.MD5(password).toString();
  const user = {
    name,
    email,
    pwd,
    date: new Date()
  };


  var users = [];
  const storedUsers: string | null = localStorage.getItem(USERS_KEY);
  if (storedUsers != null) {
    users = JSON.parse(storedUsers);
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, name);
  // Trigger the event
  window.dispatchEvent(new Event('myStorageEvent'));
}

function login(email: string, password: string): User | null {
  const storedUsers: string | null = localStorage.getItem(USERS_KEY);
  if (storedUsers == null) {
    return null;
  }
  const users = JSON.parse(storedUsers);
  const user = users.find((user: User) => user.email === email);
  //use md5 to hash password
  const pwd = CryptoJs.MD5(password).toString();
  if (user && user.pwd === pwd) {
    localStorage.setItem(CURRENT_USER_KEY, user.name);
    window.dispatchEvent(new Event('myStorageEvent'));
    return user;
  }
  return null;
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event('myStorageEvent'));
}

function getCurrentUser(): User | null {
  const username = localStorage.getItem(CURRENT_USER_KEY);
  const storedUsers: string | null = localStorage.getItem(USERS_KEY);
  if (storedUsers == null) {
    return null;
  }
  const users = JSON.parse(storedUsers);
  //find the user by username
  const user = users.find((user: User) => user.name === username);
  if (user) {
    return user;
  }
  return null;
}

function checkUserExists(email: string): boolean {
  const storedUsers = localStorage.getItem(USERS_KEY);
  if (!storedUsers) {
    return false;
  }
  const users: User[] = JSON.parse(storedUsers);
  return users.some((user: User) => user.email === email);
}


function UpdateUser(name: string, email: string) {
  const user = getCurrentUser();
  const storedUsers: string | null = localStorage.getItem(USERS_KEY);
  if (storedUsers == null) {
    return null;
  }
  const users = JSON.parse(storedUsers);
  users.forEach((u: User) => {
    if (u.email === user?.email) {
      u.name = name;
      u.email = email;
    }
  })
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, name);
  // Trigger the event
  window.dispatchEvent(new Event('myStorageEvent'));
  return true;
}

function deleteUser() {
  const user = getCurrentUser();
  const storedUsers: string | null = localStorage.getItem(USERS_KEY);
  if (storedUsers == null) {
    return null;
  }
  const users = JSON.parse(storedUsers);
  //filter out the user
  const newUsers = users.filter((u: User) => u.email !== user?.email);
  localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
  localStorage.removeItem(CURRENT_USER_KEY);
  // Trigger the event
  window.dispatchEvent(new Event('myStorageEvent'));
  return true;
}

function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

function addItem(newItem: CartItemModel) {
  const username = getCurrentUser()?.name;
  let prevItems: CartItemModel[] = JSON.parse(localStorage.getItem(CART_KEY + username) || '[]');
  const itemIndex = prevItems.findIndex(item => item.id === newItem.id);
  if (itemIndex > -1) {
    // if item already in shopping cart,update it
    const updatedItems = [...prevItems];
    updatedItems[itemIndex].quantity += newItem.quantity;
    localStorage.setItem(CART_KEY + username, JSON.stringify(updatedItems));
  }
  // add new item to shopping cart
  localStorage.setItem(CART_KEY + username, JSON.stringify([...prevItems, newItem]));
};

const removeItem = (id: string) => {
  const username = getCurrentUser()?.name;
  let prevItems: CartItemModel[] = JSON.parse(localStorage.getItem(CART_KEY + username) || '[]');
  //filter out the item and store
  localStorage.setItem(CART_KEY + username, JSON.stringify(prevItems.filter(item => item.id !== id)));
};

const updateQuantity = (id: string, quantity: number) => {
  const username = getCurrentUser()?.name;
  let prevItems: CartItemModel[] = JSON.parse(localStorage.getItem(CART_KEY + username) || '[]');
  //update the quantity of the item
  prevItems.map(item => {
        if (item.id === id) {
          item.quantity = quantity;
          return item;
        }
        return item;
      }
  );
  localStorage.setItem(CART_KEY + username, JSON.stringify(prevItems));
};

const clearCart = () => {
  const username = getCurrentUser()?.name;
  localStorage.removeItem(CART_KEY + username);
};

const getTotalPrice = () => {
  const username = getCurrentUser()?.name;
  let prevItems: CartItemModel[] = JSON.parse(localStorage.getItem(CART_KEY + username) || '[]');
  //calculate the total price
  return prevItems.reduce((total, item) => total + item.price * item.quantity, 0);

}

const getCartItems = (): CartItemModel[] => {
  const username = getCurrentUser()?.name;
  return JSON.parse(localStorage.getItem(CART_KEY + username) || '[]');

}



export type { User, CartItemModel as CartItem };

export {
  signup, login, logout, getCurrentUser, deleteUser, UpdateUser, isLoggedIn,
  addItem, removeItem, updateQuantity, clearCart, getTotalPrice, getCartItems,checkUserExists
};