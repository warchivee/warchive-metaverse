/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";
import { ObjectEffectType } from "zep-script";

interface Region {
  name: string;
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
}

const regions: Region[] = [
  { name: "서류보관실", topLeftX: 15, topLeftY: 17, bottomRightX: 60, bottomRightY: 41 },
  { name: "폐기물보관실", topLeftX: 73, topLeftY: 75, bottomRightX: 91, bottomRightY: 86 },
  { name: "부품창고", topLeftX: 68, topLeftY: 103, bottomRightX: 88, bottomRightY: 1 },
  { name: "휴게실", topLeftX: 65, topLeftY: 130, bottomRightX: 86, bottomRightY: 141 },
  { name: "폐기처리실", topLeftX: 77, topLeftY: 171, bottomRightX: 88, bottomRightY: 178 },
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
  { name: "마네킹 앞", type: 3, topLeftX: 105, topLeftY: 109, bottomRightX: 107, bottomRightY: 110 },
  { name: "보안카드 앞", type: 4, topLeftX: 21, topLeftY: 165, bottomRightX: 22, bottomRightY: 168 },
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
    hasCard: false,
    hasNewArm: false,
    hasOldArm: false,
    hasNewBody: false,
    hasOldBody: false,
  };
}

// App 실행 시에 최초로 호출되는 이벤트 (유저 진입 전)
// Normal App과 Sidebar App은 Script 적용 후 맵이 실행될 때 호출 [ Enter ]
ScriptApp.onInit.Add(function () {
  //@ts-ignore
  ScriptApp.enableFreeView = false;
  ScriptApp.cameraEffect = 1; // 1 = 비네팅 효과
  ScriptApp.cameraEffectParam1 = 650; // 비네팅 효과의 범위
  ScriptApp.displayRatio = 1.5; //화면의 줌을 컨트롤 하는 값
  ScriptApp.sendUpdated(); // 앱의 Field값이 변경되면 App.sendUpdated()로 변경값을 적용
});

// 해당하는 모든 플레이어가 이 이벤트를 통해 App에 입장
// 이후 플레이어가 입장 할 때마다 호출 [ Events ]
ScriptApp.onJoinPlayer.Add(function (player) {
  player.hidden = true;
  player.name = "첼";

  initTag(player);
  player.sendUpdated();

  player.showCenterLabel("지하 1층");
});

// 플레이어와 오브젝트가 부딪힐 때 실행
ScriptApp.onObjectTouched.Add(function (sender, x, y, tileID, obj) {
  if (obj !== null) {
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
      sender.sendUpdated();
      sender.spawnAt(119, 42, 2);
    }
  }
});

ScriptApp.onLeavePlayer.Add(function (player) {});

ScriptApp.onTriggerObject.Add(function (player, layerID, x, y, key) {
  // ScriptApp.sayToAll(
  //   `test! / layerId: ${layerID} / x: ${x} / y: ${y} / key: ${key}`
  // );
  // if (key) {
  //   player.disappearObject(key);
  // }
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
            player.showAlert("", function () {}, {
              content: "캐롤린의 안색이 창백해졌다.",
            });
          },
          {
            content: "오늘 당직 연구원의 이름은 앤이다. 이름이 같은 것을 보니 앤을 개발 담당한 사람인 듯하다.",
            confirmText: "다음으로"
          }
        );
        break;

        case 2:
          if(!player.tag.hasNewArm) {
            //@ts-ignore
            player.showAlert("",function () {
              //@ts-ignore
              player.showAlert("", function () {
                //@ts-ignore
                player.showAlert("", function() {
                }, {
                  content: "인벤토리에 '팔 한 쌍'을 넣었다."
                })
              }, {
                content: "아이템 '팔 한 쌍'을 얻었다.",
                confirmText: "다음으로"
              });
            },
            {
              content: "커다란 상자에 들어있던 것은 쓰레기처럼 아무렇게나 처박혀 있던 앤과 메리였다. 폐기 대기중이었던 것 같다.",
              confirmText: "다음으로"
            });
            player.tag.hasNewArm = true;
          }
          break;

        case 3:
          if(!player.tag.hasOldArm) {
            //@ts-ignore
            player.showAlert("",function () {
              //@ts-ignore
              player.showAlert("", function () {
                //@ts-ignore
                player.showAlert("", function() {}, {
                  content: "아이템 ‘캐롤린의 원본 팔 한 쌍’을 얻었다."
                })
              }, {
                content: "인벤토리에 아이템 ‘캐롤린의 원본 팔 한 쌍’을 넣었다.",
                confirmText: "다음으로"
              });
            },
            {
              content: "캐롤린은 누구에게 사과하는 것인지, 팔을 교체하는 동안 내내 흐느꼈다.",
              confirmText: "다음으로"
            });
            player.tag.hasOldArm = true;
          }
        break;

        case 4:
          if(!player.tag.hasCard) {
            //@ts-ignore
            player.showAlert("", function() {
              //@ts-ignore
              player.showAlert("", function() {}, {
                content: "인벤토리에 ‘지하 1층 보안카드’를 넣었다."
              })
            }, {
              content: "아이템 ‘지하 1층 보안카드’를 얻었다.",
              confirmText: "다음으로"
            });
            player.tag.hasCard = true;
          }
    }
  }
});
