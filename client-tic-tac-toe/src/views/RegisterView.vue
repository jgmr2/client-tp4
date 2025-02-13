<template>
  <div class="container">
    <h1>Inscription</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirmez le mot de passe" required />
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit">S'inscrire</button>
    </form>
    <p>Déjà un compte ? <router-link to="/login">Se connecter</router-link></p>
  </div>
</template>

<script>
import { register } from "@/services/httpClient";

export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      error: null,
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.error = "Les mots de passe ne correspondent pas.";
        return;
      }
      try {
        await register(this.username, this.password);
        this.$router.push("/login"); // Redirige vers la page de connexion
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
