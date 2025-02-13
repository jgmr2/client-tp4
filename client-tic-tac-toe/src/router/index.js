import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import { isAuthenticated } from "@/services/AuthProvider";

import GameView from "@/views/GameView.vue"; // Importa la vista del juego

const routes = [
  { path: "/login", name: "Login", component: LoginView, meta: { requiresGuest: true } },
  { path: "/register", name: "Register", component: RegisterView, meta: { requiresGuest: true } },
  { path: "/", name: "Dashboard", component: DashboardView, meta: { requiresAuth: true } },
  { path: "/game/:gameId", name: "Game", component: GameView, meta: { requiresAuth: true } }, // Nueva ruta
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated();

  if (to.meta.requiresAuth && !loggedIn) {
    next("/login");
  } else if (to.meta.requiresGuest && loggedIn) {
    next("/");
  } else {
    next();
  }
});

export default router;
