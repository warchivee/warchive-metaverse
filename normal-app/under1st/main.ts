/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";
import { ObjectEffectType } from "zep-script";

let chell = ScriptApp.loadSpritesheet('chell.png', 48, 64, {
  left: [5, 6, 7, 8],
  up: [13, 14, 15, 16, 17],
  down: [0, 1, 2, 3, 4],
  right: [9, 10, 11, 12]
});
let armbrokeCaroline = ScriptApp.loadSpritesheet('armbrokeCaroline.png', 48, 64, {
  left: [5],
  up: [13],
  down: [0],
  right: [9]
});
let armbrokeCarolineWalk = ScriptApp.loadSpritesheet('armbrokeCaroline.png', 48, 64, {
  left: [5,6,7,8],
  up: [13,14,15,16,17],
  down: [0,1,2,3,4],
  right: [9,10,11,12]
});
let armFixedCaroline = ScriptApp.loadSpritesheet('armFixedCaroline.png', 48, 64, {
  left: [5],
  up: [13],
  down: [0],
  right: [9]
});
let armFixedCarolineWalk = ScriptApp.loadSpritesheet('armFixedCaroline.png', 48, 64, {
  left: [5,6,7,8],
  up: [13,14,15,16,17],
  down: [0,1,2,3,4],
  right: [9,10,11,12]
});
let caroline = ScriptApp.loadSpritesheet('caroline.png');

let securityGuard = [
  ScriptApp.loadSpritesheet("bot1.png"),
  ScriptApp.loadSpritesheet("bot2.png"),
  ScriptApp.loadSpritesheet("bot3.png"),
  ScriptApp.loadSpritesheet("bot4.png"),
  ];

let securityGuardXY = [
  [118, 40],
  [108, 39],
  [103, 36],
  [124, 39],
  [129, 36],
  [117, 35],
  [124, 33], // destroy
  [120, 30], // destroy
];

let destroyGuard = [6, 7];

interface Region {
  name: string;
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
}

const regions: Region[] = [
  { name: "서류보관실", topLeftX: 98, topLeftY: 78, bottomRightX: 118, bottomRightY: 88 },
  { name: "폐기물보관실", topLeftX: 95, topLeftY: 104, bottomRightX: 112, bottomRightY: 115 },
  { name: "부품창고", topLeftX: 95, topLeftY: 139, bottomRightX: 109, bottomRightY: 145 },
  { name: "휴게실", topLeftX: 13, topLeftY: 163, bottomRightX: 33, bottomRightY: 174 },
  { name: "폐기처리실", topLeftX: 79, topLeftY: 194, bottomRightX: 97, bottomRightY: 201 },
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
  { name: "서류 앞", type: 1, topLeftX: 99, topLeftY: 80, bottomRightX: 99, bottomRightY: 80 },
  { name: "상자 앞", type: 2, topLeftX: 100, topLeftY: 106, bottomRightX: 102, bottomRightY: 107 },
  { name: "보안카드 앞", type: 3, topLeftX: 21, topLeftY: 165, bottomRightX: 22, bottomRightY: 168 },
  { name: "누군가의 몸뚱이 앞", type: 4, topLeftX: 90, topLeftY: 196, bottomRightX: 90, bottomRightY: 196 },
  { name: "계단 앞", type: 5, topLeftX: 121, topLeftY: 44, bottomRightX: 129, bottomRightY: 49 },
  { name: "폐기물보관실 문 앞", type: 6, topLeftX: 110, topLeftY: 112, bottomRightX: 111, bottomRightY: 113 },
];

function getRegionName(x: number, y: number): string | null {
  for (const region of regions) {
    if (
      x >= region.topLeftX &&
      x <= region.bottomRightX &&
      y >= region.topLeftY &&
      y <= region.bottomRightY
    ) {
      return region.name;
    }
  }
  return "";
}

function getAreaNumber(x: number, y: number): number {
  for (const area of areas) {
    if (
      x >= area.topLeftX &&
      x <= area.bottomRightX &&
      y >= area.topLeftY &&
      y <= area.bottomRightY
    ) {
      return area.type;
    }
  }
  return -1;
}

function initTag(player) {
  player.tag = {
    isOpenedStairs: false,
    isWasteNarration: false,
    isWalking: false,
    hasCard: false,
    hasNewArm: false,
    hasOldArm: false,
    hasNewBody: false,
    hasOldBody: false,
    widget: null,
  };
}

function showNarration(player, narrationNumber:string) {
  player.tag.widget = player.showWidget("narration.html", "middle", 480, 620);
  player.tag.widget.onMessage.Add(function (player, data) {
      if (data.type == "close") {
          player.tag.widget.destroy();
          player.tag.widget = null;
          if(narrationNumber === "4") {
            getNewArm(player);
          }
          if(narrationNumber === "5") {
            player.spawnAt(93, 198, 4);
          }
      }
  });
  player.tag.widget.sendMessage({
    narration: narrationNumber,
  });
}

function getNewArm(player) {
  //@ts-ignore
  player.showAlert("", function () {
    //@ts-ignore
     player.showAlert("", function() {
      //한쌍 넣은 후
      player.tag.hasNewArm = true;
    }, {
      content: "인벤토리에 '팔 한 쌍'을 넣었다."
    })
  }, {
    content: "아이템 '팔 한 쌍'을 얻었다.",
    confirmText: "다음"
  });
}

function changeBody(player) {
  if(!player.tag.hasOldBody) {
     //@ts-ignore
     player.showAlert("",function () {
      //@ts-ignore
      player.showAlert("", function () {
        //@ts-ignore
        player.showAlert("", function () {
          //@ts-ignore
          player.showAlert("", function () {
            //@ts-ignore
            player.showAlert("", function() {
              showNarration(player, "6");
              //@ts-ignore
              player.disappearObject("guard" + `${destroyGuard[1]}`);
            }, {
              content: "아이템 ‘캐롤린의 원본 몸통’을 얻었다."
            })
          }, {
            content: "인벤토리에 아이템 ‘캐롤린의 원본 몸통’을 넣었다.",
            confirmText: "다음"
          });
        }, {
          content: "캐롤린은 정신을 잃었다.",
          confirmText: "다음"
        })
      }, {
        content: "캐롤린: …….",
        confirmText: "다음"
      });
    },
    {
      content: "캐롤린은 숨을 쉬기 어려워 보인다. 빠르게 몸을 교체해주었다.",
      confirmText: "다음"
    });
    player.tag.hasOldBody = true;
    player.sendUpdated();
  }
}

// App 실행 시에 최초로 호출되는 이벤트 (유저 진입 전)
// Normal App과 Sidebar App은 Script 적용 후 맵이 실행될 때 호출 [ Enter ]
ScriptApp.onInit.Add(function () {
  //@ts-ignore
  ScriptApp.enableFreeView = false; //스크립트 줌인 방지
  ScriptApp.cameraEffect = 1; // 1 = 비네팅 효과
  ScriptApp.cameraEffectParam1 = 500; // 비네팅 효과의 범위
  ScriptApp.displayRatio = 1; //화면의 줌을 컨트롤 하는 값
  //@ts-ignore
  ScriptMap.putObjectWithKey(97, 105, caroline, {type: ObjectEffectType.INTERACTION_WITH_ZEPSCRIPTS,
    impassable: true,
    key: "caroline",
  })
  ScriptApp.sendUpdated(); // 앱의 Field값이 변경되면 App.sendUpdated()로 변경값을 적용

  for (let i = 0; i < securityGuardXY.length; i++) {
    const randomIndex = Math.floor(Math.random() * securityGuard.length);
    ScriptMap.putObjectWithKey(securityGuardXY[i][0], securityGuardXY[i][1], securityGuard[randomIndex], {
        key: "guard" + `${i}`,
        overlap: true,
    });
  }
});

// 해당하는 모든 플레이어가 이 이벤트를 통해 App에 입장
// 이후 플레이어가 입장 할 때마다 호출 [ Events ]
ScriptApp.onJoinPlayer.Add(function (player) {
  player.hidden = true;
  player.sprite = chell;
  player.name = "첼";

  player.setEffectSprite(armbrokeCaroline, 35, 0, 0);

  initTag(player);
  showNarration(player, "3");
  player.sendUpdated();

  player.showCenterLabel("지하 1층");  
});

// 플레이어와 오브젝트가 부딪힐 때 실행
ScriptApp.onObjectTouched.Add(function (sender, x, y, tileID, obj) {
  if (obj !== null) {
    //@ts-ignore
    if (obj.param1 === "staff") {
      const parentStyle = `display: flex; 
                           flex-direction: column; 
                           align-items: center; 
                           text-align: center;`;

      const warn = `font-size: 20px;
                    font-weight: bold;`;

      let htmlStr = `<span style="${parentStyle}">
                      <span style="${warn}">주의</span>
                      <span style="firstRow">연구원에게 들키지 않게 조심하세요</span>
                      <span style="secondRow">연구원에게 들킬 시 처음으로 돌아갑니다.</span>
                    </span>`;

      sender.showCustomLabel(htmlStr, 0xffffff, 0xf51400, 200, 60, 0.5);
      initTag(sender);
      sender.setEffectSprite(armbrokeCaroline, 35, 0, 0);
      sender.sendUpdated();
      sender.spawnAt(119, 42, 2);
    }
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
      ScriptApp.spawnPlayer(`${player.id}`, 119, 45);
      player.showCustomLabel(htmlStr, 0xffffff, 0xf51400, 200, 60, 0.5);
  }
});

//@ts-ignore
ScriptApp.onTriggerObject.Add(function (player, layerID, x, y, key) {
  if(key==="caroline") {
    if(player.tag.hasNewArm) {
      if(!player.tag.hasOldArm) {
        //@ts-ignore
        player.showAlert("",function () {
          //@ts-ignore
          player.showAlert("", function () {
            //@ts-ignore
           player.showAlert("", function () {
            //@ts-ignore
            player.showAlert("", function() {
              player.disappearObject(key);
              player.setEffectSprite(armFixedCaroline, 35, 0, 0);
              player.sendUpdated();
              player.tag.hasOldArm = true;
            }, {
              content: "아이템 ‘캐롤린의 원본 팔 한 쌍’을 얻었다."
            })
          }, {
            content: "인벤토리에 아이템 ‘캐롤린의 원본 팔 한 쌍’을 넣었다.",
            confirmText: "다음"
          });
          }, {
            content: "캐롤린: 미안해…",
            confirmText: "다음"
          } );
        },
        {
          content: "캐롤린은 누구에게 사과하는 것인지, 팔을 교체하는 동안 내내 흐느꼈다.",
          confirmText: "다음"
        });
      } 
    } else {
      player.showNoteModal("캐롤린의 새로운 팔을 먼저 찾으세요.");
    }

  }
});

// F키 눌렸을 때
ScriptApp.addOnKeyDown(70, function (player) {
  const layer = ScriptMap.getTile(2, player.tileX, player.tileY);

  if (layer === 8) {
    player.showCenterLabel(getRegionName(player.tileX, player.tileY));
  } else if (layer === -1) {
    const area = getAreaNumber(player.tileX, player.tileY);

    switch (area) {
      case 1:
        //@ts-ignore
        player.showAlert("",function () {
            //@ts-ignore
            player.showAlert("", function () {
              //@ts-ignore
              player.showAlert("", function () {}, {
                content: "캐롤린: 당직 연구원 앤…. …그렇구나. 앤의 실험이 결국 끝난 거야. 앤은 그 아이들을 폐기하려 남아있는 거야. …그 아이들에게는 폐기되는 편이 더 행복할까? 아니면 자신의 몸이 누구의 것인지 영원히 다투며 살아가는 게 행복할까?",
              })
            }, {
              content: "캐롤린의 안색이 창백해졌다.",
              confirmText: "다음"
            });
          },
          {
            content: "오늘 당직 연구원의 이름은 앤이다. 이름이 같은 것을 보니 앤을 개발 담당한 사람인 듯하다.",
            confirmText: "다음"
          }
        );
        break;

      case 2:
        if(!player.tag.hasNewArm) {
          //@ts-ignore
          player.showAlert("",function () {
            showNarration(player, "4");
          },
          {
            content: "커다란 상자에 들어있던 것은 쓰레기처럼 아무렇게나 처박혀 있던 앤과 메리였다. 폐기 대기중이었던 것 같다.",
          });
        }
        break;

      case 3:
        if(!player.tag.hasCard) {
          //@ts-ignore
          player.showAlert("", function() {
            //@ts-ignore
            player.showAlert("", function() {
              player.tag.hasCard = true;
            }, {
              content: "인벤토리에 ‘지하 1층 보안카드’를 넣었다.",
            })
          }, {
            content: "아이템 ‘지하 1층 보안카드’를 얻었다.",
            confirmText: "다음"
          });
        }
        break;
      
      case 4:
        if(!player.tag.hasNewBody) {
          //@ts-ignore
          player.showAlert("", function () {
            //@ts-ignore
            player.showAlert("", function() {
              //@ts-ignore
              player.showAlert("", function() {
                player.tag.hasNewBody = true;
                player.sendUpdated();
                if(player.tag.hasNewBody) {
                  changeBody(player);
                }
              }, {
                content: "인벤토리에 ‘누군가의 몸뚱이’를 넣었다."
              })
            }, {
              content: "아이템 ‘누군가의 몸뚱이’를 얻었다.",
              confirmText: "다음"
            });
          }, {
            content: "컨베이어 벨트 위에 아무렇게나 놓여진 누군가의 몸뚱이가 보인다. 머리만 누군가 떼어간 듯이 손상되지 않은 멀쩡한 몸이다. 머리만…?",
            confirmText: "다음"
          });
        }
        break;

      case 5:
        if(player.tag.isOpenedStairs) {
          player.spawnAtMap("Arvq0o", "8j4AjQ");
        }

        if(player.tag.hasCard) {
          if(!player.tag.isOpenedStairs) {
            player.tag.isOpenedStairs = true;
            player.sendUpdated();
            player.showNoteModal("‘지하 1층 보안카드’로 문을 열었다.");
          }
        } else {
          player.showNoteModal("위층으로 올라가는 계단의 문은 잠겨 있다. 카드를 인식시킬 수 있는 보안 패드가 붙어 있다.");
        }
        break;
      
      case 6:
        if(player.tag.hasNewArm & player.tag.hasOldArm) {
          if(!player.tag.isWasteNarration) {
            showNarration(player, "5");
            player.tag.isWasteNarration = true;
            //@ts-ignore
            player.disappearObject("guard" + `${destroyGuard[0]}`);
            player.spawnAt(111, 36, 4);
          } else {
            player.spawnAt(111, 36, 4);
          }
        } else {
          player.showNoteModal("모든 미션을 끝내야 나갈 수 있습니다.");
        }
    }
  }
});

ScriptApp.onUpdate.Add(function (dt) {  
  let _players = ScriptApp.players;
  for (let i in _players) {
      let p = _players[i];
      if(p.tag.hasOldArm) {
        if(p.isMoving !== p.tag.isWalking) {
          p.tag.isWalking = p.isMoving;
          if(p.isMoving) {
            p.setEffectSprite(armFixedCarolineWalk, 35, 0, 0);
          } else {
            p.setEffectSprite(armFixedCaroline, 35, 0, 0);
          }
          p.sendUpdated();
        }
      } else {
        if(p.isMoving !== p.tag.isWalking) {
          p.tag.isWalking = p.isMoving;
          if(p.isMoving) {
            p.setEffectSprite(armbrokeCarolineWalk, 35, 0, 0);
          } else {
            p.setEffectSprite(armbrokeCaroline, 35, 0, 0);
          }
          p.sendUpdated();
        }
      }
      // else {
      //   if(p.isMoving !== p.tag.isWalking) {
      //     p.tag.isWalking = p.isMoving;
      //     if(p.isMoving) {
      //       p.setEffectSprite(armbrokeCarolineWalk, 35, 0, 0);
      //     } else {
      //       p.setEffectSprite(armbrokeCaroline, 35, 0, 0);
      //     }
      //   }
      // }
  }
});

// App이 종료되거나 Game Block이 파괴 될 때 실행되는 함수
ScriptApp.onDestroy.Add(function () {
	// 앱으로 설치된 모든 오브젝트 삭제
	ScriptMap.clearAllObjects();
});