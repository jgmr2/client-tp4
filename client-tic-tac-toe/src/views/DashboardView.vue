<template>
  <div>
    <h1>Tableau de bord</h1>
    <p>Bienvenue, {{ user?.username }}</p>
    <button @click="handleLogout">Se déconnecter</button>

    <h2>Parties disponibles</h2>
    <button @click="handleCreateGame">Créer une nouvelle partie</button>

    <ul>
      <li v-for="game in games" :key="game.id">
        Partie #{{ game.id }} - Statut: {{ game.status }}
        <button v-if="game.status === 'waiting'" @click="handleJoinGame(game.id)">Rejoindre</button>
        <router-link v-if="game.status === 'in_progress'" :to="`/game/${game.id}`">Reprendre</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { getGames, createGame, joinGame } from "@/services/httpClient";
import { removeToken, getUserIdentity } from "@/services/AuthProvider";

export default {
  data() {
    return {
      user: null,
      games: [],
    };
  },
  async mounted() {
    this.user = getUserIdentity();
    this.fetchGames();
  },
  methods: {
    async fetchGames() {
      try {
        this.games = await getGames();
      } catch (error) {
        console.error("Erreur de récupération des parties", error);
      }
    },
    async handleCreateGame() {
      try {
        await createGame();
        this.fetchGames(); // Recargar lista de partidas
      } catch (error) {
        console.error("Erreur de création de partie", error);
      }
    },
    async handleJoinGame(gameId) {
      try {
        await joinGame(gameId);
        this.fetchGames();
      } catch (error) {
        console.error("Erreur lors de la connexion à la partie", error);
      }
    },
    handleLogout() {
      removeToken();
      this.$router.push("/login");
    },
  },
};
</script>
