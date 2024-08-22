import "zep-script";

// ZEP functions
ScriptApp.onInit.Add(function() {
  ScriptApp.cameraEffect = 1;
  ScriptApp.cameraEffectParam1 = 500;
  ScriptApp.displayRatio = 1;

  //@ts-ignore
  ScriptApp.enableFreeView = false;
});

ScriptApp.onJoinPlayer.Add(function(player) {
  player.name = "첼";
  player.hidden = true;
  player.sendUpdated();

  ScriptApp.sayToAll("오류 없음", 0xFFFFFF); // DEBUG

  player.tag = {
		widget: null,
	};
});


ScriptApp.addOnKeyDown(70, function(player) {
  // 'F' 키를 누를 때의 동작
  player.tag.widget = player.showWidget("narration.html", "middle", 480, 620);
	player.tag.widget.onMessage.Add(function (player, data) {
		if (data.type == "close") {
			player.tag.widget.destroy();
			player.tag.widget = null;
		}
	});
  player.tag.widget.sendMessage({
    narration: "1",
  });
	player.sendUpdated();
});

ScriptApp.addOnKeyDown(27, function (player) {
  // escape 키를 누를 때의 동작
  if (player.tag.widget) {
    player.tag.widget.destroy();
  }
});

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});
