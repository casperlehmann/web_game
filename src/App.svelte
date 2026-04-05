<script>
  import GameCanvas from "./components/GameCanvas.svelte";
  import ScoreBoard from "./components/ScoreBoard.svelte";

  let score = $state(0);
  let totalCarrots = $state(0);
  let gameStatus = $derived(score >= totalCarrots && totalCarrots > 0 ? "won" : "playing");

  function onScore(points) {
    score += points;
  }

  function onLevelLoaded(carrotCount) {
    totalCarrots = carrotCount;
  }
</script>

<div class="game-container">
  <GameCanvas {onScore} {onLevelLoaded} />
  <ScoreBoard {score} {totalCarrots} {gameStatus} />
</div>

<style>
  .game-container {
    position: relative;
    display: inline-block;
    max-width: 100%;
    max-height: 100%;
  }
</style>
