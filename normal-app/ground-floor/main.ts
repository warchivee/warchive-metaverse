/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";

let hasItem: boolean = false;
let testObject = ScriptApp.loadSpritesheet("robot.png", 190, 120);
let testObjectXY = [
    [135, 36],
    [141, 35],
    [145, 35],
];
let _stateMove = 0;
let moveObjectXY = [
    [5, 0],
    [0, 5],
    [0, 0],
]

interface Region {
    name: string;
    topLeftX: number;
    topLeftY: number;
    bottomRightX: number;
    bottomRightY: number;
  }

  const regions: Region[] = [
    { name: '지상 1층', topLeftX: 111, topLeftY: 21, bottomRightX: 154, bottomRightY: 45 },
    { name: '휴게실', topLeftX: 7, topLeftY: 85, bottomRightX: 33, bottomRightY: 99 },
    { name: '샘플실', topLeftX: 85, topLeftY: 132, bottomRightX: 108, bottomRightY: 145 },
  ];
  
  interface Area {
    name: string;
    type: number;
    topLeftX: number;
    topLeftY: number;
    bottomRightX: number;
    bottomRightY: number;
  }
  
  const areas: Area[] = [
    { name: '누군가의 머리', type: 1, topLeftX: 105, topLeftY: 137, bottomRightX: 108, bottomRightY: 183 },
    { name: '화분', type: 2, topLeftX: 131, topLeftY: 23, bottomRightX: 132, bottomRightY: 23 },

  ];
  
  function getRegionName(x: number, y: number): string | null {
    for (const region of regions) {
      if (x >= region.topLeftX && x <= region.bottomRightX && y >= region.topLeftY && y <= region.bottomRightY) {
        return region.name;
      }
    }
    return "";
  }
  
  function getAreaNumber(x: number, y: number): number {
    for (const area of areas) {
      if (x >= area.topLeftX && x <= area.bottomRightX && y >= area.topLeftY && y <= area.bottomRightY) {
        return area.type;
      }
    }
    return -1;
  }

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
	player.sendUpdated();

    player.showCenterLabel(getRegionName(player.tileX, player.tileY));
})

ScriptApp.onAppObjectTouched.Add(function (player, key, x, y) {
	ScriptMap.sayObjectWithKey(key, "불량 안드로이드를 처리했다!");
    player.showCenterLabel(
        `경비 로봇에 들키지 않도록 주의하세요.`
	);
   ScriptApp.spawnPlayer(`${player.id}`, 133, 41);
});

ScriptApp.addOnKeyDown(70, function(player) {
    const layer = ScriptMap.getTile(2, player.tileX, player.tileY);
  
    if(layer === 8) {
      player.showCenterLabel(getRegionName(player.tileX, player.tileY));
    } else if(layer === -1) {
      const area = getAreaNumber(player.tileX, player.tileY);
        switch (area) {
            case 1:
                if(!hasItem) {
                    //@ts-ignore
                    player.showAlert("", function () {
                        //@ts-ignore
                        player.showAlert("", function () {
                            //@ts-ignore
                            player.showAlert("", function () {
                            },
                            {
                                content: "인벤토리에 ‘누군가의 머리’를 넣었다.",
                            });
                        },
                        {
                            content: "아이템 ‘누군가의 머리’를 얻었다.",
                        });
                    },
                {
                    content: "유리 장식장을 열고 안드로이드의 머리를 꺼냈다. 메모리 칩은 초기화가 되어 있는 것 같다.",
                });
                    hasItem = true;
                }
                break;
        }
    }
});