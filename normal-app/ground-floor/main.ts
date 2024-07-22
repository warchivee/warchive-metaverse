/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";

ScriptApp.onInit.Add(function() {
    ScriptApp.cameraEffect = 1; // 1 = vignette effect
	ScriptApp.cameraEffectParam1 = 500; // Sets the range of the vignette effect to 500
    ScriptApp.displayRatio = 1;
    //@ts-ignore
    ScriptApp.enableFreeView = false;
});

ScriptApp.onJoinPlayer.Add(function(player){
	player.hidden = true;
    player.name = "첼";
    player.disableVideo = true;
    player.disableAudio = true;
    player.showWidget("test.html", "top", 300, 300);
	player.sendUpdated();

    player.showCenterLabel("지상 1층");
});