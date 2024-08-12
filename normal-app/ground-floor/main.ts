/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";

let securityGuard = [
    ScriptApp.loadSpritesheet("bot1.png"),
    ScriptApp.loadSpritesheet("bot2.png"),
    ScriptApp.loadSpritesheet("bot3.png"),
    ScriptApp.loadSpritesheet("bot4.png"),
    ];
let transparentObject = ScriptApp.loadSpritesheet("transparent.png", 48, 64);
let plantPot = ScriptApp.loadSpritesheet("plant_pot.png");
let carolineA = ScriptApp.loadSpritesheet("3.png", 48, 64, {
    down: [0],
    left: [5],
    right: [9],
    up: [13],
});

let carolineA_Walk = ScriptApp.loadSpritesheet("3.png", 48, 64, {
    down: [0, 1, 2, 3, 4],
    left: [5, 6, 7, 8],
    right: [9, 10, 11, 12],
    up: [13, 14, 15, 16, 17],
});

ScriptApp.onUpdate.Add(function (dt) {  
    let _players = ScriptApp.players;
    for (let i in _players) {
        let p = _players[i];
        if (!p.tag.hasOriginalHead) {
            if (p.isMoving !== p.tag.isWalking) {
                p.tag.isWalking = p.isMoving;
                if (p.isMoving) {
                    p.setEffectSprite(carolineA_Walk, 35, 0, 0);
                } else {
                    p.setEffectSprite(carolineA, 35, 0, 0);
                }
                p.sendUpdated();
                }
        }
    }
});

let carolineB = ScriptApp.loadSpritesheet("5.png", 48, 64, {
    down: [0],
    left: [1],
    right: [2],
    up: [3],
});

let chell = ScriptApp.loadSpritesheet("0.png", 48, 64, {
    down: [0,1,2,3,4],
    left: [5,6,7,8],
    right: [9,10,11,12],
    up: [13,14,15,16,17],
});

let securityGuardXY = [
    [140, 29],
    [133, 33],
    [130, 36],
    [118, 30],
    [124, 31],
    [126, 26],
    [118, 36],
    [133, 25],
    [149, 33],
    [124, 37]
];

let transparentObjectXY = [
    [24, 88],
    [24, 97]
];

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
    { name: '화분', type: 2, topLeftX: 130, topLeftY: 18, bottomRightX: 133, bottomRightY: 25 },
    { name: '샘플실 입구', type: 3, topLeftX: 89, topLeftY: 137, bottomRightX: 94, bottomRightY: 142},
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
    player.sprite = chell;
    //@ts-ignore
    player.setEffectSprite(carolineA, 35, 0, 0);
	player.sendUpdated();

    player.showCenterLabel(getRegionName(player.tileX, player.tileY));

    player.tag = {
        hasItem: false,
        hasPlant: true,
        hasOriginalHead: false,
        isWalking: false,
        }
})

ScriptApp.onStart.Add(function () {
    ScriptMap.putObjectWithKey(130, 18, plantPot, {
        key: "plant",
        overlap: true,
        //@ts-ignore
        impassable: true,
        offsetX: -20,
        offsetY: 3,
    });
    
    for (let i = 0; i < transparentObjectXY[1][1] - transparentObjectXY[0][1] + 1; i++) {
        ScriptMap.putObjectWithKey(transparentObjectXY[0][0], transparentObjectXY[0][1] + i, transparentObject, {
            key: "transparent" + `${i}`,
            overlap: true,
        })
    };

    for (let i = 0; i < securityGuardXY.length; i++) {
        const randomIndex = Math.floor(Math.random() * securityGuard.length);
        ScriptMap.putObjectWithKey(securityGuardXY[i][0], securityGuardXY[i][1], securityGuard[randomIndex], {
            key: "guard" + `${i}`,
            overlap: true,
        });
    }
});

ScriptApp.onAppObjectTouched.Add(function (player, key, x, y) {
    if(key.startsWith("guard")) {
        const parentStyle = `display: flex; 
        flex-direction: column; 
        align-items: center; 
        text-align: center;`;

        const warn = `font-size: 20px;
        font-weight: bold;`;

        let htmlStr = `<span style="${parentStyle}">
        <span style="${warn}">경고</span>
        <span style="firstRow">경비 로봇에게 들키지 않도록 주의하세요.</span>
        </span>`;

        ScriptMap.sayObjectWithKey(key, "불량 안드로이드를 처리했다!");
        ScriptApp.spawnPlayer(`${player.id}`, 133, 41);
        player.showCustomLabel(htmlStr, 0xffffff, 0xf51400, 200, 60, 0.5);
    }

    if(key.startsWith("transparent")) {
        const parentStyle = `display: flex; 
        flex-direction: column; 
        align-items: center; 
        text-align: center;`;

        const warn = `font-size: 20px;
        font-weight: bold;`;

        let htmlStr = `<span style="${parentStyle}">
        <span style="${warn}">경고</span>
        <span style="firstRow">연구원에게 들키지 않도록 주의하세요.</span>
        </span>`;
        
        ScriptApp.spawnPlayer(`${player.id}`, 133, 41);
        player.showCustomLabel(htmlStr, 0xffffff, 0xf51400, 200, 60, 0.5);
    }
});

ScriptApp.addOnKeyDown(70, function(player) {
    const layer = ScriptMap.getTile(2, player.tileX, player.tileY);
  
    if(layer === 8) {
      player.showCenterLabel(getRegionName(player.tileX, player.tileY));
    } else if(layer === -1) {
      const area = getAreaNumber(player.tileX, player.tileY);
        switch (area) {
            case 1:
                if(!player.tag.hasItem) {
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
                            confirmText: "다음",
                        });
                    },
                {
                    content: "유리 장식장을 열고 안드로이드의 머리를 꺼냈다. 메모리 칩은 초기화가 되어 있는 것 같다.",
                    confirmText: "다음",
                });
                    player.tag.hasItem = true;
                }
                break;

            case 2:
                if(!player.tag.hasItem) {
                    player.showNoteModal("생물이라고는 연구원들 뿐인 이 연구소에 살아있는 진짜 식물이 있었다니.");
                }

                if(player.tag.hasOriginalHead && player.tag.hasPlant) {
                    //@ts-ignore
                    player.showAlert("", function () {
                        //@ts-ignore
                        player.showAlert("", function () {
                            //@ts-ignore
                            player.disappearObject("plant");
                            player.tag.hasPlant = false;

                            //@ts-ignore
                            player.showAlert("", function () {
                            },
                            {
                                content: "공기의 흐름이 느껴진다.",
                            });
                        },
                        {
                            content: "벽을 더듬어 만지니 아주 미세하게 갈라진 틈이 있다. 힘주어 당기니 아주 작고 기나긴 통로가 나왔다.",
                            confirmText: "다음",
                        });
                    },
                    {
                        content: "생물이라고는 연구원들 뿐인 이 연구소에 살아있는 진짜 식물이 있었다니. 신기하기도 하고 의아하기도 해 가까이 다가가니 벽에 위화감이 느껴진다.",
                        confirmText: "다음",
                    });
                }
            break;

            case 3:
                if(!player.tag.hasItem) {
                    player.showNoteModal("아직 샘플실을 나갈 수 없다.");
                }
            
                if(player.tag.hasOriginalHead) {
                    //@ts-ignore
                    ScriptApp.spawnPlayer(player.id, 140, 28);
                }

                if(player.tag.hasItem && !player.tag.hasOriginalHead) {
                    //@ts-ignore
                    player.showAlert("", function () {
                        //@ts-ignore
                        player.showAlert("", function () {
                            player.tag.hasOriginalHead = true;
                            //@ts-ignore
                            player.setEffectSprite(carolineB, 35, 0, 0);
                            player.sendUpdated();
                            //@ts-ignore
                            player.showAlert("", function () {
                                //@ts-ignore
                                player.showAlert("", function () {
                                    //@ts-ignore
                                    player.showAlert("", function () {
                                        // @ts-ignore
                                        player.tag.widget = player.showWidget("narration.html", "middle", 480, 620);
                                        player.tag.widget.onMessage.Add(function (player, data) {
                                            if (data.type == "close") {
                                                player.tag.widget.destroy();
                                                player.tag.widget = null;
                                            }
                                        });
                                        player.tag.widget.sendMessage({
                                            narration: "7", // 솜님 기획서에 있는 나레이션 번호
                                        })
                                            player.sendUpdated();
                                    },
                                    {
                                        content:"인벤토리에 ‘캐롤린의 원본 머리’를 넣었다."
                                    });
                                },
                                {
                                    content: "아이템 ‘캐롤린의 원본 머리’를 얻었다.",
                                    confirmText: "다음",
                                });
                            },
                            {
                                content: "나는 새로운 안드로이드의 머리에 캐롤린의 메모리를 복사해 이식했다.",
                                confirmText: "다음",
                            });
                            },
                        {
                            content: "캐롤린을 눕히고 머리를 확인하자 다행히 메모리 칩은 무사하다. 캐롤린과 함께 하려면 이 방법밖에 없다…",
                            confirmText: "다음",
                        });
                        },
                    {
                        content: "캐롤린의 걸음이 조금씩 느려진다. 아까 공격받았던 머리의 충격이 큰 것 같다.",
                        confirmText: "다음",
                    });
                }
                break;
            }
    }
});