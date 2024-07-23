import "zep-script";

interface Region {
  name: string;
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
}

const regions: Region[] = [
  { name: '중앙실험실', topLeftX: 15, topLeftY: 17, bottomRightX: 60, bottomRightY: 41 },
  { name: '개발실 A', topLeftX: 73, topLeftY: 75, bottomRightX: 91, bottomRightY: 86 },
  { name: '개발실 B', topLeftX: 68, topLeftY: 103, bottomRightX: 88, bottomRightY: 113 },
  { name: '분석실', topLeftX: 65, topLeftY: 130, bottomRightX: 86, bottomRightY: 141 },
  { name: '실험소모품창고', topLeftX: 77, topLeftY: 171, bottomRightX: 88, bottomRightY: 178 }
];

// custom functions
function getRegionName(x: number, y: number): string | null {
  for (const region of regions) {
    if (x >= region.topLeftX && x <= region.bottomRightX && y >= region.topLeftY && y <= region.bottomRightY) {
      return region.name;
    }
  }
  return "";
}

// ZEP functions
ScriptApp.onInit.Add(function() {
  ScriptApp.cameraEffect = 1;
  ScriptApp.cameraEffectParam1 = 650;
  ScriptApp.displayRatio = 1.5;
  
  //@ts-ignore
  ScriptApp.enableFreeView = false;
});

ScriptApp.onJoinPlayer.Add(function(player) {
  player.name = "첼";
  player.hidden = true;
  player.sendUpdated();
  
  player.showCenterLabel(getRegionName(player.tileX, player.tileY));
});

ScriptApp.onUpdate.Add(function(dt) {
});

ScriptApp.addOnKeyDown(70,function(player){
  let layer = ScriptMap.getTile(2, player.tileX, player.tileY);
  if(layer === 8) player.showCenterLabel(getRegionName(player.tileX, player.tileY));
});

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});
