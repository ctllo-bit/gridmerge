// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});

window.addEventListener("load", function() {
  document.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") {
      window.focus();
    }
  });
});