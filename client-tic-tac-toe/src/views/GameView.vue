<template>
  <div>
    <h1>Jeu de Tic-Tac-Toe</h1>
    <p v-if="loading">Chargement de la partie...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="game">
      <p>Joueur 1: {{ playerNames.player1 }}</p>
      <p>Joueur 2: {{ playerNames.player2 || "En attente d'un joueur..." }}</p>
      <p>Tour actuel: {{ game.currentPlayer === user?.id ? "Votre tour" : "Tour de l'adversaire" }}</p>

      <div class="board">
        <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
          <button
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :disabled="!canPlay(rowIndex, colIndex)"
            @click="makeMove(rowIndex, colIndex)"
          >
            {{ cell ? (cell === user.id ? "X" : "O") : "" }}
          </button>
        </div>
      </div>

      <p v-if="game.status === 'finished'">Partie terminée ! 🎉</p>
    </div>
  </div>
</template>

<script>
import { getGameState, request } from "@/services/httpClient";
import { getUserIdentity } from "@/services/AuthProvider";

export default {
  data() {
    return {
      game: null,
      board: Array(3).fill(null).map(() => Array(3).fill(null)), // Matriz 3x3
      user: null,
      error: null,
      loading: true,
      polling: null,
      playerNames: { player1: null, player2: null },
    };
  },
  async created() {
    this.user = getUserIdentity();
    await this.fetchGameState();
    this.startPolling();
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    async fetchGameState() {
      try {
        this.loading = true;
        const gameId = this.$route.params.gameId;
        this.game = await getGameState(gameId);
        this.updateBoard();
        this.updatePlayerNames();
        this.loading = false;
      } catch (error) {
        this.error = "Erreur de chargement de la partie.";
        console.error(error);
      }
    },
    updateBoard() {
      if (this.game && this.game.board) {
        this.board = [
          [this.game.board[0], this.game.board[1], this.game.board[2]],
          [this.game.board[3], this.game.board[4], this.game.board[5]],
          [this.game.board[6], this.game.board[7], this.game.board[8]],
        ];
      }
    },
    updatePlayerNames() {
      this.playerNames.player1 = this.game?.player1 || "Joueur 1";
      this.playerNames.player2 = this.game?.player2 || "Joueur 2";
    },
    async makeMove(row, col) {
      try {
        const gameId = this.$route.params.gameId;
        await request(`/games/${gameId}/move/${row}/${col}`, "POST");
        this.fetchGameState(); // Actualizar el estado del juego después del movimiento
      } catch (error) {
        this.error = "Erreur lors du mouvement.";
        console.error(error);
      }
    },
    canPlay(row, col) {
      return (
        this.game &&
        this.game.currentPlayer === this.user.id &&
        this.game.board[row * 3 + col] === null
      );
    },
    startPolling() {
      if (!this.polling) {
        this.polling = setInterval(this.fetchGameState, 5000); // Actualizar cada 5s
      }
    },
    stopPolling() {
      if (this.polling) {
        clearInterval(this.polling);
        this.polling = null;
      }
    },
  },
};
</script>

<style scoped>
.board {
  display: grid;
  grid-template-rows: repeat(3, 100px);
  gap: 5px;
  margin-top: 20px;
}

.row {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 5px;
}

button {
  width: 100px;
  height: 100px;
  font-size: 2rem;
}
.error {
  color: red;
}
</style>
