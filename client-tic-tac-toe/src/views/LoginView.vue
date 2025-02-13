<template>
  <div class="container">
    <h1>Connexion</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit">Se connecter</button>
    </form>
    <p>Pas encore inscrit ? <router-link to="/register">Créer un compte</router-link></p>
  </div>
</template>

<script>
import { login } from "@/services/httpClient";
import { setToken } from "@/services/AuthProvider";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await login(this.username, this.password);
        setToken(response.token);
        this.$router.push("/"); // Redirige vers le Dashboard
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 300px;
  margin: auto;
  text-align: center;
}

input {
  display: block;
  width: 100%;
  margin: 5px 0;
}

.error {
  color: red;
}
</style>
