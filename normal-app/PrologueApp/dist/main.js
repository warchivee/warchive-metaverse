let chell = App.loadSpritesheet("0.png", 48, 64, {
  down: [0, 1, 2, 3, 4],
  left: [5, 6, 7, 8],
  right: [9, 10, 11, 12],
  up: [13, 14, 15, 16, 17]
});
App.onInit.Add(function () {
  App.cameraEffect = 1;
  App.cameraEffectParam1 = 100;
  App.displayRatio = 1;

  //@ts-ignore
  App.enableFreeView = false;
});
App.onJoinPlayer.Add(function (player) {
  player.name = "첼";
  player.sprite = chell;
  player.hidden = true;
  player.tag = {
    widget: null
  };
  player.tag.widget = player.showWidget("narration.html", "middle", 480, 620);
  player.tag.widget.onMessage.Add(function (player, data) {
    if (data.type == "close") {
      App.spawnPlayer(player.id, 11, 10);
    }
  });
  player.tag.widget.sendMessage({
    narration: "1"
  });
});
App.onDestroy.Add(function () {
  Map.clearAllObjects();
});