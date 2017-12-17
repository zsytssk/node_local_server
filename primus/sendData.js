let roomShowData = require('./testData/roomShow.json');
let shoalData1 = require('./testData/shoal1.json');
let shoalData2 = require('./testData/shoal2.json');
let shoalData3 = require('./testData/shoal3.json');
let roomListData = require('./testData/roomList.json');
let initData = require('./initData.js');
let crypt = require('./crypt');

/**
 *
 * @param {*} data
 * @param {sparkIO.spark} spark
 * @param {SocketIO.Server} primus
 */
function sendData(data, spark, primus) {
  let res;
  data = crypt.decrypto(data, spark);
  let cmd = data.cmd;
  switch (cmd) {
    case 'roomShow':
      roomShow(data, spark, primus);
      break;
    case 'roomList':
      roomList(data, spark, primus);
      break;
    case 'drawLottery':
      drawLottery(data, spark, primus);
      break;
    case 'hit':
      hit(data, spark, primus);
      break;
    case 'updateAmount':
      updateAmount(data, spark, primus);
      break;
    case 'dropItem':
      dropItem(data, spark, primus);
      break;
    case 'rewardTask':
      rewardTask(data, spark, primus);
      break;
    case 'updateTaskFish':
      updateTaskFish(data, spark, primus);
      break;
    case 'finishRewardTask':
      finishRewardTask(data, spark, primus);
      break;
    case 'clearRewardTask':
      clearRewardTask(data, spark, primus);
      break;
    case 'setAutoFire':
      setAutoFire(data, spark, primus);
      break;
    case 'nextAchieve':
      nextAchieve(data, spark, primus);
      break;
    case 'heartBeat':
      heartBeat(data, spark, primus);
      break;
    case 'getFish':
      getFish(data, spark, primus);
      break;
    case 'getShoal':
      getShoal(data, spark, primus);
      break;
    case 'specialFish':
      specialFish(data, spark, primus);
      break;
    case 'roomLeave':
      roomLeave(data, spark, primus);
      break;
    case 'removeUser':
      removeUser(data, spark, primus);
      break;
    case 'upBattery':
      upBattery(data, spark, primus);
      break;
    case 'changeBattery':
      changeBattery(data, spark, primus);
      break;
    case 'getUpBatteryInfo':
      getUpBatteryInfo(data, spark, primus);
      break;
    case 'batteryInfoList':
      batteryInfoList(data, spark, primus);
      break;
    case 'fishTicketInfo':
      fishTicketInfo(data, spark, primus);
      break;
    case 'activeItem':
      activeItem(data, spark, primus);
      break;
    case 'useItem':
      useItem(data, spark, primus);
      break;
    case 'chatSend':
      chatSend(data, spark, primus);
      break;
    case 'levelGift':
      levelGift(data, spark, primus);
      break;
    case 'setNewUserRecord':
      setNewUserRecord(data, spark, primus);
      break;
    default:
      transToOther(data, spark, primus);
      break;
  }
}

/**
 *
 * @param {*} data
 * @param {*} spark
 * @param {*} primus
 */
function roomShow(data, spark, primus) {
  roomShowData = initData(roomShowData);
  let res_data = {};
  let fish_num = roomShowData.fish_num;
  let res = {};
  res_data.code = 200;
  res_data.cmd = data.cmd;

  // player
  res.users = [];
  res.users = roomShowData.users;
  res.userId = data.params.uid;

  // fish
  res.fish = [];
  let new_fish_data1 = JSON.parse(JSON.stringify(roomShowData.fish[0]));
  new_fish_data1.fishId = undefined;
  res.fish.push(new_fish_data1);

  res.userItems = roomShowData.userItems;
  res.tableInfo = roomShowData.tableInfo;

  res_data.res = res;
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);

  // let new_fish_data2 = JSON.parse(JSON.stringify(roomShowData.fish[1]));
  // new_fish_data2.fishId = createRandomNum(3);
  // res.fish.push(new_fish_data2);

  // addUser
  // setTimeout(function () {
  //   addUser(spark, primus, roomShowData.users[1]);
  // }, 2000);
  // setTimeout(function () {
  //   addUser(spark, primus, roomShowData.users[2]);
  // }, 4000);

  // addshoal
  // setTimeout(function () {
  //   addShoal(spark, primus);
  // }, 2500);

}

function roomLeave(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'roomLeave';
  res_data.res = {};
  res_data.res.userId = data.params.uid;
  res_data.res.enterMatch = true;
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}
/**使用技能*/
function activeItem(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'activeItem';
  res_data.res = {};
  let itemId = data.params.itemId;
  res_data.res.itemId = itemId;
  /**食人鱼号角*/
  if (itemId == 2001 || itemId == 2006) {
    let new_fish_data1 = JSON.parse(JSON.stringify(roomShowData.fish[0]));
    new_fish_data1.fishId = createRandomNum(3);
    new_fish_data1.usedTime = 25;
    res_data.res.fish = [new_fish_data1];
  }

  /**核弹*/
  if (itemId > 4000) {
    let res_fish = {};
    let fish = data.params.fish;
    for (let i = 0; i < fish.length; i++) {
      let isHit = true;
      res_fish[fish[i]] = {
        isHit: isHit,
        awardAmount: 200
      };
    }
    res_data.res.fish = res_fish;
  }
  res_data.res.count = random(0, 10);
  res_data.res.status = 1;
  res_data.res.userId = data.params.uid;
  if (data.params.fromUserId) {
    res_data.res.userId = data.params.fromUserId;
  }
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}
/**激活技能*/
function useItem(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'useItem';
  res_data.res = {};
  let itemId = data.params.itemId;
  res_data.res.itemId = itemId;
  res_data.res.status = 1;
  res_data.res.userId = data.params.uid;
  if (data.params.fromUserId) {
    res_data.res.userId = data.params.fromUserId;
  }
  res_data.res.fishId = data.params.fishId;
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function changeBattery(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'changeBattery';
  res_data.res = {};
  res_data.res.itemId = data.params.itemId;
  res_data.res.status = 1;
  res_data.res.curBatteryLevel = random(1, 100);
  res_data.res.userId = data.params.uid;
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function upBattery(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'upBattery';
  res_data.res = {};
  res_data.res.itemId = data.params.itemId;
  res_data.res.costDiamond = 200;
  res_data.res.reward = {
    1001: 200,
    1002: 200
  };
  res_data.res.status = 1;
  res_data.res.curBatteryLevel = random(1, 100);
  res_data.res.userId = data.params.uid;
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function addUser(spark, primus, user_info) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'addUser';
  res_data.res = {};
  res_data.res.userInfo = user_info;
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function removeUser(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'roomLeave';
  res_data.res = {};
  res_data.res.userId = '3';
  console.log(res_data.res);
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}
/**用于测试的鱼的数据*/
function getFish(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'addFish';
  res_data.res = {};
  let fish = JSON.parse(JSON.stringify(roomShowData.fish[0]));
  fish.fishId = createRandomNum(3);
  // fish.funNo = "1";
  // fish.funParam = [100, -1 / 100, 750 / 2, [0, 1334]];
  if (data.params.funNo) {
    fish.funNo = data.params.funNo;
    fish.displaceType = 'function';
    fish.funParam = data.params.funParam;
  } else {
    fish.pathNo = data.params.pathNo || random(0, 30);
  }
  fish.typeId = data.params.typeId;
  if (fish.typeId == '38') {
    fish.centerFishTypeId = '10';
    fish.totalTime = 30;
  }
  fish.usedTime = undefined;
  res_data.res.fish = [];
  res_data.res.fish.push(fish);
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}
/**用于测试的鱼的数据*/
function addFish(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'addFish';
  res_data.res = {};
  let fish = JSON.parse(JSON.stringify(roomShowData.fish[0]));
  // fish.fishId = createRandomNum(3);
  fish.pathNo = random(1, 7);
  fish.typeId = data.params.typeId;
  res_data.res.fish = [];
  res_data.res.fish.push(fish);
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function getShoal(data, spark, primus) {
  let res_data = {};

  res_data.code = 200;
  res_data.cmd = 'addShoal';
  // shoalpfun
  let shoal = shoalData1;
  if (data.params.shoalType == 2) {
    shoal = shoalData2;
  }
  if (data.params.shoalType == 3) {
    shoal = shoalData3;
  }
  // shoal.usedTime = 80;
  for (let i = 0; i < shoal.fish.length; i++) {
    shoal.fish[i].fishId = createRandomNum(8);
  }

  res_data.res = shoal;
  specialFish(data, spark, primus);
  setTimeout(() => {
    primus.forEach(function (spark, id, connections) {
      let encrypt_res_data = crypt.encrypto(res_data, spark);
      spark.write(encrypt_res_data);
    });
  }, 2000);
}

/**通知*/
function specialFish(data, spark, primus) {
  let res_data = {};

  res_data.code = 200;
  res_data.cmd = 'specialFish';

  res_data.res = {
    type: 'shoal'
  };

  primus.forEach(function (spark, id, connections) {
    let encrypt_res_data = crypt.encrypto(res_data, spark);
    spark.write(encrypt_res_data);
  });
}

function addShoal(spark, primus) {
  let res_data = {};

  res_data.code = 200;
  res_data.cmd = 'addShoal';
  // shoal
  let res = {};
  let shoal = shoalData2;
  for (let i = 0; i < shoal.fish.length; i++) {
    shoal.fish[i].fishId = createRandomNum(3);
  }

  res_data.res = shoal;
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function roomList(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = data.cmd;
  roomListData.userId = data.params.uid;

  res_data.res = roomListData[data.params.type];
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function drawLottery(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = data.cmd;

  res_data.res = {
    userId: '1',
    "result": {
      data: [{
        "itemId": '1001',
        "count": 100
      }]
    }
  };
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function getUpBatteryInfo(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'getUpBatteryInfo';

  res_data.res = {
    batteryLevel: 1,
    costDiamond: 200,
    nextLevel: 2,
    prizeGold: 2,
    userDiamond: 364,
    canUp: 1,
    userId: data.params.uid
  };
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function batteryInfoList(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'batteryInfoList';

  res_data.res = {
    "levels": [{
      "level": 1,
      "isLock": 0
    }, {
      "level": 2,
      "isLock": 0
    }, {
      "level": 3,
      "isLock": 1,
      "costDiamond": 200,
      "prizeGold": 2,
      "isNextLevel": 1, // 是否下一个等级, 是则发光
    }, {
      "level": 4,
      "isLock": 1
    }, {
      "level": 5,
      "isLock": 1
    }],
    userId: data.params.uid
  };
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function fishTicketInfo(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = 'fishTicketInfo';

  res_data.res = {
    killedCount: 1,
    needCount: 200,
    ticketPool: 2,
    userId: data.params.uid
  };
  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function hit(data, spark, primus) {
  let res_data = {};
  let fish = data.params.fish;
  res_data.code = 200;
  res_data.cmd = data.cmd;
  let res_fish = {};
  for (let i = 0; i < fish.length; i++) {
    let isHit = false;
    let fish_id = fish[i];
    // let isHit = false;
    // if (i % 2 === 0) {
    //   isHit = true;
    // }
    res_fish[fish_id] = {
      isHit: isHit,
      awardAmount: 20
    };
    if (data.params.siblingFish && data.params.siblingFish[fish_id]) {

      let fish_s = data.params.siblingFish[fish_id];
      let killedFish = {};
      for (let j = 0; j < fish_s.length; j++) {
        killedFish[fish_s[j]] = {
          isHit: isHit
        };
      }
      res_fish[fish_id].killedFish = killedFish;
    }
  }

  res_data.res = {};
  res_data.res.userId = data.params.uid;
  res_data.res.fish = res_fish;
  res_data.res.amount = 1300; // 剩余金币
  res_data.res.score = 1300; // 剩余金币
  res_data.res.totalPrize = 1300; // 剩余金币
  res_data.res.remainBulletNum = 200; // 获得的奖励

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function updateAmount(data, spark, primus) {
  let res_data = {};
  let fish = data.params.fish;
  res_data.code = 200;
  res_data.cmd = data.cmd;

  res_data.res = {
    "gold": 111842, // 金币
    "diamond": 3964, // 元宝
    "fishTicket": 1600,
    "isBankrupt": false
  };
  res_data.res.userId = data.params.uid;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function dropItem(data, spark, primus) {
  let res_data = {};
  let fish = data.params.fish;
  res_data.code = 200;
  res_data.cmd = data.cmd;

  res_data.res = {
    bulletPos: {
      x: 500,
      y: 500
    },
    item: [{
      itemId: 4005,
      count: 10
    }]
  };
  res_data.res.userId = data.params.uid;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function chatSend(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = data.cmd;

  res_data.res = {
    type: 1,
    content: 'sdfsdfsdfsdf'
  };
  res_data.res.userId = data.params.uid;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function levelGift(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = data.cmd;

  res_data.res = {
    "newLevel": 12,
    "levelGift": {
      '1001': 4,
      '2001': 4,
      '2002': 4,
      '2003': 4
    }
  };
  res_data.res.userId = data.params.uid;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}
function setNewUserRecord(data, spark, primus) {
  let res_data = {};
  let params = data.params;
  res_data.code = 200;
  res_data.cmd = data.cmd;
  res_data.res = {
    content: {}
  };
  res_data.res.userId = data.params.uid;
  /*杀死小鱼 */
  if (params.recordName == 'kill_small_fish') {
    res_data.res.content = {
      reward: {
        1001: 3,
        1002: 2
      }
    }
  }
  if (params.recordName == 'kill_big_fish') {

  }

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}
/**/
function rewardTask(data, spark, primus) {
  let res_data = {};
  let fish = data.params.fish;
  res_data.code = 200;
  res_data.cmd = data.cmd;
  res_data.res = {
    "type": "cook",
    "prize": { // 奖励
      // "diamond": 20,
      "score": 20,
      // "gold": 20,
    },
    "time": 180, // 倒计时, 单位: 秒
    "taskFish": [{
      "fishTypeId": 7,
      "needNum": 3,
      "killedCount": 0,
      "pathNo ": 23
    }, {
      "fishTypeId": 19,
      "killedCount": 0,
      "needNum": 1,
      "pathNo": 15
    }]
  };
  res_data.res.userId = data.params.uid;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function updateTaskFish(data, spark, primus) {
  let res_data = {};
  let fish = data.params.fish;
  res_data.code = 200;
  res_data.cmd = data.cmd;
  res_data.res = {
    killedCounts: {
      7: 2,
      19: 3,
    }
  };
  res_data.res.userId = data.params.uid;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function finishRewardTask(data, spark, primus) {
  let res_data = {};
  let fish = data.params.fish;
  res_data.code = 200;
  res_data.cmd = data.cmd;
  res_data.res = {
    rank: [4, 1, 2, 3], // 用户id, 根据顺序排名
    myPrize: {
      gold: 110, // 奖励金币 或者 奖励元宝
      diamond: 200, // 奖励元宝
      score: 200 // 奖励元宝
    }
  };
  res_data.res.userId = data.params.uid;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function clearRewardTask(data, spark, primus) {
  let res_data = {};
  let fish = data.params.fish;
  res_data.code = 200;
  res_data.cmd = data.cmd;
  res_data.res = {
    unfinishUserIds: ['2']
  };
  res_data.res.userId = data.params.uid;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function setAutoFire(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = data.cmd;
  let res = {
    status: 1
  };
  res.status = 1;
  res.userId = data.params.uid;
  res_data.res = res;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function nextAchieve(data, spark, primus) {
  let res_data = {};
  res_data.code = 200;
  res_data.cmd = data.cmd;
  let res = {
    status: 0,
    prize: 100,
    radio: 0,
    score: 250,
    taskScore: 240,
    rank: 240
  };
  res.userId = data.params.uid;
  res_data.res = res;

  res_data = crypt.encrypto(res_data, spark);
  spark.write(res_data);
}

function transToOther(data, cur_spark, primus) {
  let res_data = {};
  res_data.code = data.params.code || 200;
  res_data.cmd = data.cmd;
  let res = {};
  for (let p in data.params) {
    res[p] = data.params[p];
  }
  res.status = 1;
  res.userId = data.params.uid;
  if (data.params.fromUserId) {
    res_data.res.userId = data.params.fromUserId;
    res_data.res.fishId = data.params.fishId;
  }
  res_data.res = res;
  primus.forEach(function (spark, id, connections) {
    let encrypt_res_data = crypt.encrypto(res_data, spark);
    spark.write(encrypt_res_data);
  });
}

function decode(content) {
  return new Buffer(content, 'base64').toString('utf8');
}

function encode(content) {
  return new Buffer(content).toString('base64');
}

function createRandomNum(num) {
  let random = Math.random();
  return Number(random.toFixed(num).slice(2));
}

function random(start, end) {
  let random = Math.random();
  let space = end - start;
  let num;
  let space_radio_arr = [];
  for (let i = 0; i < space; i++) {
    space_radio_arr.push((i + 1) / space);
  }
  for (let i = 0; i < space; i++) {
    if (random <= space_radio_arr[i]) {
      random = i;
      break;
    }
  }
  random = start + random;
  return random;
}

module.exports = sendData;