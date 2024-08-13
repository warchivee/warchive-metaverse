import "zep-script";
import { ObjectEffectType, ScriptPlayer, TileEffectType } from "zep-script";

let stick = ScriptApp.loadSpritesheet("stick.png");
let leg = ScriptApp.loadSpritesheet("broken_leg.png");
let caroline = ScriptApp.loadSpritesheet("caroline.png");

let chell = ScriptApp.loadSpritesheet("0.png", 48, 64, {
  down: [0, 1, 2, 3, 4],
  left: [5, 6, 7, 8],
  right: [9, 10, 11, 12],
  up: [13, 14, 15, 16, 17],
});

let companion = ScriptApp.loadSpritesheet("2.png", 48, 64, {  
  down: [0],
  left: [5],
  right: [9],
  up: [13],
});

let companionWalk = ScriptApp.loadSpritesheet("2.png", 48, 64, {
  down: [0, 1, 2, 3, 4],
  left: [5, 6, 7, 8],
  right: [9, 10, 11, 12],
  up: [13, 14, 15, 16, 17],
});

let securityGuard = [
  ScriptApp.loadSpritesheet("bot1.png"),
  ScriptApp.loadSpritesheet("bot2.png"),
  ScriptApp.loadSpritesheet("bot3.png"),
  ScriptApp.loadSpritesheet("bot4.png"),
];

let securityGuardXY = [
  [33, 23],
  [33, 29],
  [38, 20],
  [48, 26],
  [38, 26],
  [25, 33],
  [22, 25],
  [45, 33]
];

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

interface Area {
  name: string;
  type: number;
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
}

const areas: Area[] = [
  { name: '개발실 A 문 앞', type: 1, topLeftX: 87, topLeftY: 83, bottomRightX: 90, bottomRightY: 84 },
  { name: '개발실 A 컴퓨터 1', type: 2, topLeftX: 74, topLeftY: 79, bottomRightX: 74, bottomRightY: 79 },
  { name: '개발실 A 컴퓨터 2', type: 3, topLeftX: 76, topLeftY: 78, bottomRightX: 76, bottomRightY: 78 },
  { name: '개발실 A 기계 1', type: 4, topLeftX: 86, topLeftY: 82, bottomRightX: 87, bottomRightY: 82 },
  { name: '개발실 A 기계 2', type: 5, topLeftX: 82, topLeftY: 79, bottomRightX: 86, bottomRightY: 81 },
  { name: '개발실 A 기계 3', type: 6, topLeftX: 80, topLeftY: 78, bottomRightX: 81, bottomRightY: 79 },
  { name: '개발실 B 모니터', type: 7, topLeftX: 82, topLeftY: 107, bottomRightX: 87, bottomRightY: 109 },
  { name: '개발실 B 캐비닛', type: 8, topLeftX: 76, topLeftY: 106, bottomRightX: 79, bottomRightY: 108 },
  { name: '개발실 B 기계', type: 9, topLeftX: 69, topLeftY: 104, bottomRightX: 74, bottomRightY: 108 },
  { name: '실험소모품창고 캐비닛 1', type: 10, topLeftX: 80, topLeftY: 172, bottomRightX: 83, bottomRightY: 173 },
  { name: '실험소모품창고 캐비닛 2', type: 11, topLeftX: 83, topLeftY: 174, bottomRightX: 85, bottomRightY: 174 },
  { name: '실험소모품창고 캐비닛 3', type: 12, topLeftX: 85, topLeftY: 175, bottomRightX: 87, bottomRightY: 176 },
  { name: '실험소모품창고 상자', type: 13, topLeftX: 83, topLeftY: 175, bottomRightX: 84, bottomRightY: 176 },
  { name: '비상계단', type: 14, topLeftX: 39, topLeftY: 35, bottomRightX: 45, bottomRightY: 39 },
  { name: '엘리버에터', type: 15, topLeftX: 53, topLeftY: 26, bottomRightX: 59, bottomRightY: 29 },
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

// ZEP functions
ScriptApp.onInit.Add(function() {
  ScriptApp.cameraEffect = 1;
  ScriptApp.cameraEffectParam1 = 500;
  ScriptApp.displayRatio = 1;

  //@ts-ignore
  ScriptApp.enableFreeView = false;

  ScriptMap.putObjectWithKey(82, 77, stick, { key: "stick" });
  ScriptMap.putObjectWithKey(72, 133, caroline, { 
    type: ObjectEffectType.INTERACTION_WITH_ZEPSCRIPTS,
    impassable: true,
    key: "caroline",
  });
  ScriptMap.putObjectWithKey(76, 138, leg, { 
    type: ObjectEffectType.INTERACTION_WITH_ZEPSCRIPTS,
    impassable: true,
    key: "leg",
  });
  for (let i = 0; i < securityGuardXY.length; i++) {
    const randomIndex = Math.floor(Math.random() * securityGuard.length);
    ScriptMap.putObjectWithKey(securityGuardXY[i][0], securityGuardXY[i][1], securityGuard[randomIndex], {
        key: "guard" + `${i}`,
        overlap: true,
    });
  }
});

ScriptApp.onUpdate.Add(function (dt) {  
	let _players = ScriptApp.players;
	for (let i in _players) {
		let p = _players[i];
    if (p.tag.hasCompanion) {
      if (p.isMoving !== p.tag.isWalking) {
				p.tag.isWalking = p.isMoving;
				if (p.isMoving) {
					p.setEffectSprite(companionWalk, 35, 0, 0);
				} else {
					p.setEffectSprite(companion, 35, 0, 0);
				}
				p.sendUpdated();
			}
    }
	}
});

ScriptApp.onJoinPlayer.Add(function(player) {
  player.tag = {
    isOpenedLabA: false,
    isOpenedStairs: false,
    foundCompanion: false,
    hasCompanion: false,
    isWalking: false,
    hasStick: false,
    hasCard: false,
    hasLeg: false,
    oldLeg: false,
    widget: null,
  }

  player.name = "첼";
  player.sprite = chell;
  player.hidden = true;

  player.tag.widget = player.showWidget("narration.html", "middle", 960, 620);
	player.tag.widget.onMessage.Add(function (player, data) {
		if (data.type == "close") {
			player.tag.widget.destroy();
			player.tag.widget = null;
      
      player.showCenterLabel(getRegionName(player.tileX, player.tileY));
		}
	});
  player.tag.widget.sendMessage({
    narration: "2",
  });

	player.sendUpdated();
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
    ScriptApp.spawnPlayer(`${player.id}`, 36, 21);
    player.showCustomLabel(htmlStr, 0xffffff, 0xf51400, 200, 60, 0.5);
  }
});

ScriptApp.onTriggerObject.Add(function (player, layerID, x, y, key) {
	if(key === "caroline") {
    if(!player.tag.foundCompanion) {
      player.tag.widget = player.showWidget("narration.html", "middle", 960, 620);
      player.tag.widget.onMessage.Add(function (player, data) {
        if (data.type == "close") {
          player.tag.widget.destroy();
          player.tag.widget = null;
        }
      });
      player.tag.widget.sendMessage({
        narration: "10",
      });
      player.tag.foundCompanion = true;
    } else {
      if(player.tag.hasLeg) {
        player.tag.widget = player.showWidget("narration.html", "middle", 960, 620);
        player.tag.widget.onMessage.Add(function (player, data) {
          if (data.type == "close") {
            player.tag.widget.destroy();
            player.tag.widget = null;
            //@ts-ignore
            player.showAlert("", function () { }, {
              content: "캐롤린의 다리를 교체하였기에 지금부터 캐롤린과 동행할 수 있다.",
            });
          }
        });
        player.tag.widget.sendMessage({
          narration: "11",
        });
      
        player.disappearObject(key);
        player.tag.hasCompanion = true;
        player.setEffectSprite(companion, 35, 0, 0);
        player.sendUpdated();
      }
    }
  }

  if(key === "leg") {
    if(player.tag.hasCompanion) {

      player.tag.widget = player.showWidget("narration.html", "middle", 960, 620);
      player.tag.widget.onMessage.Add(function (player, data) {
        if (data.type == "close") {
          player.tag.widget.destroy();
          player.tag.widget = null;
          //@ts-ignore
          player.showAlert("", function () { 
            //@ts-ignore
            player.showAlert("", function () { }, {
              content: "인벤토리에 아이템 ‘캐롤린의 원본 다리 한 쌍’을 넣었다.",
            })
          }, {
            content: "아이템 ‘캐롤린의 원본 다리 한 쌍’을 얻었다.",
            confirmText: "다음"
          })
        }
      });
      player.tag.widget.sendMessage({
        narration: "12",
      });

      player.disappearObject(key);
      player.tag.oldLeg = true;
    } else {
      player.showNoteModal("캐롤린의 다리가 형체를 알아볼 수 없을 정도로 완전히 산산조각나 있다. 경비로봇의 짓이 분명하다.");
    }
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
        if(player.tag.isOpenedLabA) {
          ScriptApp.spawnPlayer(player.id, 36, 21);
          return;
        }
        if(player.tag.hasStick) {
          player.tag.isOpenedLabA = true;
          player.showNoteModal("‘긴 막대’로 소리나지 않게 조심해서 잠금장치를 떼어냈다! 경비로봇을 피해서 캐롤린을 찾아야겠다.");
        } else {
          player.showNoteModal("문이 잠긴 채로 잠금장치가 고장나 있다. 경비로봇이 쫓아 들어오지 못하도록 내가 망가뜨린 모양이다. 덕분에 나도 이곳에 갇혔다. 나가서 캐롤린을 찾아야 하는데.");
        }
        break;

      case 3:
        player.showNoteModal("경비로봇을 관리하는 컴퓨터 중 하나다. 지능이 없는 멍청한 놈들이지만 파괴력은 엄청나다.규정대로 움직이지 않는 실험체를 발견하면 행동불능이 될 때까지 공격한다.");
        break;

      case 4:
        if(player.tag.hasCompanion) {
          player.showNoteModal("캐롤린은 기계 패널에 흘러가는 문자 중 나의 관리번호를 발견하고는 패널을 만지작거렸다. 패널에는 TES-0426이라고 쓰여 있다.");
        } else {
          player.showNoteModal("우리들을 관리하는 장치 중 하나다.");
        }
        break;
        
      case 5:
        if(player.tag.hasCompanion) {
          player.showNoteModal("캐롤린은 참담한 표정으로 고개를 돌렸다.");
        } else {
          player.showNoteModal("우리들의 실험 결과를 관리하는 기계다. 앤과 메리의 실험 결과가 적혀 있다… 읽고 싶지 않다.");
        }
        break;

      case 6:
        if(!player.tag.hasStick) {
          //@ts-ignore
          player.showAlert("", function () {
            //@ts-ignore
            player.showAlert("", function () {
              //@ts-ignore
              player.showAlert("", function () { }, {
                content: "인벤토리에 ‘긴 막대’를 넣었다.",
              });
            }, {
              content: "아이템 ‘긴 막대’를 얻었다.",
              confirmText: "다음"
            });
          }, {
            content: "기계 장치의 부속품 손잡이를 떼어내서 문을 부술 수 있을 것 같다.",
            confirmText: "다음"
          });
          
          player.disappearObject("stick");
          player.tag.hasStick = true;
        }
        break;

      case 7:
        if(player.tag.hasCompanion) {
          player.showNoteModal("캐롤린은 얼굴을 찌푸렸다. 초조한 것 같다.");
        } else {
          player.showNoteModal("다음 실험에 대한 계획서인 것 같다. 자세히 읽을 시간은 없다.");
        }
        break;

      case 8:
        if(!player.tag.hasCard) {
          //@ts-ignore
          player.showAlert("", function () {
            //@ts-ignore
            player.showAlert("", function () {
              //@ts-ignore
              player.showAlert("", function () { }, {
                content: "인벤토리에 ‘지하 2층 보안카드’를 넣었다.",
              });
            }, {
              content: "아이템 ‘지하 2층 보안카드’를 얻었다.",
              confirmText: "다음"
            });
          }, {
            content: "캐비닛에서 보안카드를 찾았다.",
            confirmText: "다음"
          });

          player.tag.hasCard = true;  
        }
        break;

      case 9:
        player.showNoteModal("건드리면 위험할 것 같다.");
        break;

      case 10:
        player.showNoteModal("인공 신경과 인공 피부를 적용하기 전의 팔이 잔뜩 들어 있다. 앙상하게 마른 뼈의 무덤을 보는 것 같다.");
        break;

      case 11:
        player.showNoteModal("잠겨 있다.");
        break;

      case 12:
        player.showNoteModal("망가진 머리들이 잔뜩 들어 있다. 전부 눈을 감고 있어서 자는 것처럼 보인다. 재활용하려는 의도인가? 복잡한 기분에 문을 닫았다.");
        break;
            
      case 13:
        if(!player.tag.hasLeg) {
          //@ts-ignore
          player.showAlert("", function () {
            //@ts-ignore
            player.showAlert("", function () {
              //@ts-ignore
              player.showAlert("", function () { }, {
                content: "인벤토리에 ‘다리 한 쌍’을 넣었다.",
              });
            }, {
              content: "아이템 ‘다리 한 쌍’을 얻었다.",
              confirmText: "다음"
            });
          }, {
            content: "약간 낡고 더럽지만 쓸만한 다리 한 쌍을 찾았다. 캐롤린의 원래 다리와는 조금 다르지만 어쩔 수 없지.",
            confirmText: "다음"
          });
          
          player.tag.hasLeg = true;  
        }
        break;

      case 14:
        if(player.tag.isOpenedStairs) {
          if(player.tag.oldLeg) {
            ScriptApp.spawnPlayer(player.id, 150, 10);
            return;  
          } else {
            player.showNoteModal("캐롤린의 부서진 다리가 신경쓰인다...");
            return;
          }
        }
        if(player.tag.hasCard) {
          player.tag.isOpenedStairs = true;
          player.showNoteModal("‘지하 2층 보안카드’로 문을 열었다.");
        } else {
          player.showNoteModal("위층으로 올라가는 계단의 문은 잠겨 있다. 카드를 인식시킬 수 있는 보안 패드가 붙어 있다.");
        }
        break;

      case 15:
        player.showNoteModal("작동하려면 연구원의 지문이 필요하다. 인공 피부의 지문은 통하지 않는다. 포기하고 다른 길을 찾아보자.");
        break;
      
      default:
    }  
  }
  
});

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});
