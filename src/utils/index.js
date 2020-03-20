/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
      '"}'
  );
}

/**
 * 获取数据的类型
 * @param {*} o
 */
export function getDataType(o) {
  if (o === null) {
    return "null";
  } else if (typeof o == "object") {
    if (typeof o.length == "number") {
      return "array";
    } else {
      return "object";
    }
  } else {
    return typeof o;
  }
}

/**
 * 深拷贝数组或对象
 * @param {*} data
 */
export function deepClone(data) {
  var type = getDataType(data);
  var obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === "array") {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

/**
 * 判断两个时间段有没有交集 true 说明没有交集
 * @param { Date.getTIme } date1
 * @param { Date.getTIme } date2
 * @param { Date } startTime
 * @param { Date } endTime
 */
export function judgeNoMix(date1, date2, startTime, endTime) {
  console.log(">>>>");
  console.log(date1, date2, startTime, endTime);
  if (date1 == null || date2 == null || startTime == null || endTime == null)
    return false;
  var d1 = date1.getTime();
  var d2 = date2.getTime();
  var v1 = d2 - d1;
  var v2 = endTime - startTime; // 做差
  var start = startTime;
  var end = endTime;

  if (v1 < 0 || v2 < 0) {
    console.log("时间段不符合要求");
    return false;
  }
  if (d1 - start <= 0 && d2 - start <= 0) {
    return true;
  } else if (d1 - end >= 0 && d2 - end >= 0) {
    return true;
  } else {
    return false;
  }
}
