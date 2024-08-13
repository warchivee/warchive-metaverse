import "zep-script";

let chell = ScriptApp.loadSpritesheet("0.png", 48, 64, {
  down: [0, 1, 2, 3, 4],
  left: [5, 6, 7, 8],
  right: [9, 10, 11, 12],
  up: [13, 14, 15, 16, 17],
});

let companion = ScriptApp.loadSpritesheet("5.png", 48, 64, {  
  down: [0],
  left: [1],
  right: [2],
  up: [3],
});

function isDoor(x: number, y: number): boolean {
  if (x >= 21 && x <= 26 && y >= 20 && y <= 21) return true;
  if (x >= 51 && x <= 56 && y >= 20 && y <= 21) return true;
  return false;
}

function showEnding(player, choice) {
  ScriptApp.spawnPlayer(player.id, 100, 50);
  player.tag.widget = player.showWidget("result.html", "middle", 480, 620);
  player.tag.widget.onMessage.Add(function (player, data) {
    if (data.type == "close") {
      player.tag.widget.destroy();
      player.tag.widget = null;
      ScriptApp.spawnPlayer(player.id, 100, 60);
    }
  });
  player.tag.widget.sendMessage({
    choice: choice,
  });
}

// ZEP functions
ScriptApp.onInit.Add(function() {
  ScriptApp.cameraEffect = 1;
  ScriptApp.cameraEffectParam1 = 500;
  ScriptApp.displayRatio = 1;

  //@ts-ignore
  ScriptApp.enableFreeView = false;
});

ScriptApp.onJoinPlayer.Add(function(player) {
  player.tag = {
    hasCompanion: true,
    widget: null,
  }
  
  player.name = "첼";
  player.sprite = chell;
  player.setEffectSprite(companion, 35, 0, 0);
  player.sendUpdated();
  player.hidden = true;

  player.tag.widget = player.showWidget("narration.html", "middle", 960, 620);
	player.tag.widget.onMessage.Add(function (player, data) {
		if (data.type == "close") {
			player.tag.widget.destroy();
			player.tag.widget = null;
      
      player.showCenterLabel("탈출구");
		}
	});
  player.tag.widget.sendMessage({
    narration: "8",
  });

	player.sendUpdated();
});

ScriptApp.addOnKeyDown(70, function(player) {
  if(isDoor(player.tileX, player.tileY)) {
    if(player.tag.hasCompanion) {
      //@ts-ignore
      player.showAlert("", function () {
        player.tag.widget = player.showWidget("narration.html", "middle", 960, 620);
        player.tag.widget.onMessage.Add(function (player, data) {
          if (data.type == "close") {
            player.tag.widget.destroy();
            player.tag.widget = null;
            player.tag.hasCompanion = false;
            player.setEffectSprite(null);
            player.sendUpdated();

            ScriptApp.spawnPlayer(player.id, 53, 28);
            ScriptApp.cameraEffectParam1 = 300;
          }
        });
        player.tag.widget.sendMessage({
          narration: "9",
        });
       }, {
        content: "바깥으로 나갈 수 있는 문이다. 굉장히 무거워 혼자서는 열 수 없다. 누군가 한 명이 문을 잡아줘야만 밖으로 나갈 수 있다…",
      });
    } else {
      player.tag.widget = player.showWidget("ending.html", "middle", 480, 620);
      player.tag.widget.onMessage.Add(function (player, data) {
        player.tag.widget.destroy();
        player.tag.widget = null;
        showEnding(player, data.type);
      });
      
    }
  }

});

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});
