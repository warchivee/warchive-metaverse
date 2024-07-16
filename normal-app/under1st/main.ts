/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";
import { ObjectEffectType } from "zep-script";

let hp = 0;

ScriptApp.onInit.Add(function () {
  ScriptApp.cameraEffect = 1; // 1 = 비네팅 효과
  ScriptApp.cameraEffectParam1 = 650; // 비네팅 효과의 범위
  ScriptApp.displayRatio = 1.5; //화면의 줌을 컨트롤 하는 값
  ScriptApp.sendUpdated(); // 앱의 Field값이 변경되면 App.sendUpdated()로 변경값을 적용
});

// ScriptApp.showCenterLabel("지하 1층 입니다.");
ScriptApp.onJoinPlayer.Add(function (player) {
  // 해당하는 모든 플레이어가 이 이벤트를 통해 App에 입장
  ScriptApp.showCenterLabel("지하 1층");
});

// 플레이어와 오브젝트가 부딪힐 때 실행
ScriptApp.onObjectTouched.Add(function (sender, x, y, tileID, obj) {
  if (obj !== null) {
    if (obj.type == ObjectEffectType.INTERACTION_WITH_ZEPSCRIPTS) {
      if (obj.param1 === "robot") {
        if (hp === 3) {
          ScriptApp.showCenterLabel("GAME OVER");
          sender.spawnAtMap("Arvq0o", "D6gb3K");
        } else {
          ++hp;
          ScriptApp.showCenterLabel("경비 로봇과 3번 부딪히면 사망합니다.");
          ScriptApp.showCenterLabel(`${hp}번 부딪혔습니다.`);
        }
      }
    }
  }
});
