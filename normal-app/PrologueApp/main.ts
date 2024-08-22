import "zep-script";

let chell = ScriptApp.loadSpritesheet("0.png", 48, 64, {
  down: [0, 1, 2, 3, 4],
  left: [5, 6, 7, 8],
  right: [9, 10, 11, 12],
  up: [13, 14, 15, 16, 17],
});

ScriptApp.onInit.Add(function() {
  ScriptApp.cameraEffect = 1;
  ScriptApp.cameraEffectParam1 = 100;
  ScriptApp.displayRatio = 1;

  //@ts-ignore
  ScriptApp.enableFreeView = false;
});

ScriptApp.onJoinPlayer.Add(function(player) {
  player.name = "첼";
  player.sprite = chell;
  player.hidden = true;

  player.tag = {
    widget: null,
  }

  player.tag.widget = player.showWidget("narration.html", "middle", 5000, 5000);
	player.tag.widget.onMessage.Add(function (player, data) {
		if (data.type == "close") {      
      ScriptApp.spawnPlayer(player.id, 11, 10);
		}
	});
});

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});
