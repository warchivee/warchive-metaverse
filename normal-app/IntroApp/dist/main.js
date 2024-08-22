let chell = App.loadSpritesheet("0.png", 48, 64, {
  down: [0, 1, 2, 3, 4],
  left: [5, 6, 7, 8],
  right: [9, 10, 11, 12],
  up: [13, 14, 15, 16, 17]
});

// ZEP functions
App.onInit.Add(function () {
  App.cameraEffect = 1;
  App.cameraEffectParam1 = 800;
  App.displayRatio = 1;

  //@ts-ignore
  App.enableFreeView = false;
});
App.onJoinPlayer.Add(function (player) {
  player.name = "첼";
  player.sprite = chell;
  player.hidden = true;
  player.sendUpdated();
  if (player.isMobile) {
    //@ts-ignore
    player.showAlert("", function () {}, {
      content: "이 게임은 모바일 환경에서는 플레이할 수 없습니다. PC 환경에서 다시 접속해 주세요."
    });
  }
});
App.onDestroy.Add(function () {
  Map.clearAllObjects();
});