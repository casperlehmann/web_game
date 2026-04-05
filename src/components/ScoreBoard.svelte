<script>
  let { score, totalCarrots, gameStatus } = $props();
</script>

<div class="hud">
  <div class="score">Carrots: {score} / {totalCarrots}</div>
</div>

{#if gameStatus === "won"}
  <div class="overlay">
    <div class="win-message">
      <h1>You Win!</h1>
      <p>You collected all the carrots!</p>
      <p class="hint">Refresh to play again</p>
    </div>
  </div>
{/if}

<style>
  .hud {
    position: absolute;
    top: 12px;
    left: 12px;
    pointer-events: none;
  }

  .score {
    font-family: monospace;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
    background: rgba(0, 0, 0, 0.3);
    padding: 6px 14px;
    border-radius: 6px;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    pointer-events: none;
  }

  .win-message {
    text-align: center;
    color: #fff;
    font-family: monospace;
  }

  .win-message h1 {
    font-size: 48px;
    color: #FFD700;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
    margin-bottom: 8px;
  }

  .win-message p {
    font-size: 20px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  }

  .hint {
    margin-top: 16px;
    font-size: 14px !important;
    opacity: 0.7;
  }
</style>
