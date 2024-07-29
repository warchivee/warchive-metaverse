import "zep-script";
import { TileEffectType } from "zep-script";

let isOpenedLabA: boolean = false;
let isOpenedStairs: boolean = false;
let hasCompanion: boolean = false;
let hasItems: boolean[] = Array(2).fill(false);

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
  { name: '개발실 A 문 앞', type: 1, topLeftX: 88, topLeftY: 83, bottomRightX: 89, bottomRightY: 84 },
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
  { name: '비상계단', type: 14, topLeftX: 40, topLeftY: 36, bottomRightX: 41, bottomRightY: 37 },
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

function setTileEffect(n: number) {
  const th = areas.findIndex(area => area.type === n);
  const area = areas[th];

  if(th === 0) { // 개발실 A 문 앞
    for (let x = area.topLeftX; x <= area.bottomRightX; x++) {
      for (let y = area.topLeftY; y <= area.bottomRightY; y++) {
        ScriptMap.putTileEffect(x, y, TileEffectType.PORTAL, {
          type: 1,
          locationName: '개발실A 앞',
          triggerByTouch: false,
          insivible: true,
        });
      }
    }
  } else if(th === 13) { // 비상계단
    for (let x = area.topLeftX; x <= area.bottomRightX; x++) {
      for (let y = area.topLeftY; y <= area.bottomRightY; y++) {
        ScriptMap.putTileEffect(x, y, TileEffectType.PORTAL, {
          type: 0,
          locationName: '계단 앞',
          targetMapID: "yO3pXN",
          triggerByTouch: false,
          insivible: true,
        });
      }
    }
  }

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

ScriptApp.addOnKeyDown(70, function(player) {
  const layer = ScriptMap.getTile(2, player.tileX, player.tileY);
  
  if(layer === 8) {
    player.showCenterLabel(getRegionName(player.tileX, player.tileY));
  } else if(layer === -1) {
    const area = getAreaNumber(player.tileX, player.tileY);
    
    switch (area) {
      case 1:
        if(isOpenedLabA) return;
        if(hasItems[0]) {
          setTileEffect(1);
          isOpenedLabA = true;
          player.showNoteModal("'긴 막대'로 소리나지 않게 조심해서 잠금장치를 떼어냈다! 경비로봇을 피해서 캐롤린을 찾아야겠다.");
        } else {
          player.showNoteModal("문이 잠긴 채로 잠금장치가 고장나 있다. 경비로봇이 쫓아 들어오지 못하도록 내가 망가뜨린 모양이다. 덕분에 나도 이곳에 갇혔다. 나가서 캐롤린을 찾아야 하는데.");
        }
        break;

      case 3:
        player.showNoteModal("경비로봇을 관리하는 컴퓨터 중 하나다. 지능이 없는 멍청한 놈들이지만 파괴력은 엄청나다.규정대로 움직이지 않는 실험체를 발견하면 행동불능이 될 때까지 공격한다.");
        break;
      
      case 4:
        if(hasCompanion) {
          player.showNoteModal("캐롤린은 기계 패널에 흘러가는 문자 중 나의 관리번호를 발견하고는 패널을 만지작거렸다. 패널에는 TES-0426이라고 쓰여 있다.");
        } else {
          player.showNoteModal("우리들을 관리하는 장치 중 하나다.");
        }
        break;
      
      case 5:
        if(hasCompanion) {
          player.showNoteModal("캐롤린은 참담한 표정으로 고개를 돌렸다.");
        } else {
          player.showNoteModal("우리들의 실험 결과를 관리하는 기계다. 앤과 메리의 실험 결과가 적혀 있다… 읽고 싶지 않다.");
        }
        break;
    
      case 6:
        player.showNoteModal("기계 장치의 부속품 손잡이를 떼어내서 문을 부술 수 있을 것 같다.");
        player.showNoteModal("아이템 '긴 막대'를 얻었다.");
        player.showNoteModal("인벤토리에 '긴 막대'를 넣었다.");
        hasItems[0] = true;
        break;
  
      case 7:
        if(hasCompanion) {
          player.showNoteModal("캐롤린은 얼굴을 찌푸렸다. 초조한 것 같다.");
        } else {
          player.showNoteModal("다음 실험에 대한 계획서인 것 같다. 자세히 읽을 시간은 없다.");
        }
        break;
      
      case 8:
        if(!hasItems[1]) {
          player.showNoteModal("캐비닛에서 보안카드를 찾았다.");
          player.showNoteModal("아이템 '지하 2층 보안카드'를 얻었다.");
          player.showNoteModal("인벤토리에 '지하 2층 보안카드'를 넣었다.");
          hasItems[1] = true;  
        }
        break;
  
      case 9:
        player.showNoteModal("건드리면 위험할 것 같다.");
        break;
      
      case 13:
        if(!hasItems[2]) {
          player.showNoteModal("약간 낡고 더럽지만 쓸만한 다리 한 쌍을 찾았다. 캐롤린의 원래 다리와는 조금 다르지만 어쩔 수 없지.");
          player.showNoteModal("아이템 '다리 한 쌍'을 얻었다.");
          player.showNoteModal("인벤토리에 '다리 한 쌍'을 넣었다.");
          hasItems[2] = true;  
        }
        break;
    
      case 14:
        if(isOpenedStairs) return;
        if(hasItems[1]) {
          setTileEffect(14);
          isOpenedStairs = true;
          player.showNoteModal("'지하 2층 보안카드'로 문을 열었다.");
        } else {
          player.showNoteModal("위층으로 올라가는 계단의 문은 잠겨 있다. 카드를 인식시킬 수 있는 보안 패드가 붙어 있다.");
        }
        break;
        
      default:
    }  
  }
  
});

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});
