/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";

ScriptApp.onInit.Add(function() {
    ScriptApp.cameraEffect = 1; // 1 = vignette effect
	ScriptApp.cameraEffectParam1 = 650; // Sets the range of the vignette effect to 500
    ScriptApp.displayRatio = 1.5;
});

ScriptApp.onJoinPlayer.Add(function(player){
	player.hidden = true;
	player.sendUpdated();
})