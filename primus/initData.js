module.exports = function (data) {
  if (!global.param) {
    /**默认值, 如果没有接收到数据*/
    global.param = {
      fish_type: 1,
      fish_num: 0
    };
  }
  let fish_type = global.param.fish_type || 1;
  let fish_num = global.param.fish_num || 0;

  if (fish_type) {
    data.fish[0].typeId = fish_type;
  }
  if (fish_num) {
    data.fish_num = fish_num;
  }

  return data;
};