function decodeUplink(input) {
  return {
    data: Decode(input.fPort, input.bytes, input.variables),
  };
}

function Decode(fPort, bytes, variables) {
  var hexString = bytesToHex(bytes);
  // var hexString = bytes;

  // 验证输入是否为有效的十六进制字符串
  if (!/^[0-9a-fA-F]+$/.test(hexString)) {
    return {
      message: "Invalid hex string",
    };
  }

  // 确保字符串长度为10的倍数（因为4个个字节对应8个16进制字符）
  if (hexString.length % 10 !== 0) {
    return {
      message: "Hex string length must be a multiple of 10",
    };
  }

  // 初始化对象来存储键值对
  var data = {};

  // 遍历每10个字符的分组
  for (var i = 0; i < hexString.length; i += 10) {
    var endIndex = Math.min(i + 10, hexString.length);
    // 提取每组的10个字符
    var group = hexString.substring(i, endIndex);

    // 提取前两个字符作为类型，后面4个字符作为值
    var type = group.substring(0, 2); // 类型，一个字节
    
    var value = group.substring(2, 10).toLowerCase(); // 浮点运算值，4个字节
    var value2 = group.substring(6, 10).toLowerCase(); // 整形运算值,2个字节
    // 值，两个字节转为4个字符的十六进制字符串

    if (value === "ffffffff" || value2 === "ffff") {
      continue;
    }
    switch (type) {
      case "01":
        data.Temperature = Number(hexToFloat32(value).toFixed(3));
        break;
      case "02":
        data.Humidity = Number(hexToFloat32(value).toFixed(3));
        break;
      case "03":
        data.Pressure = Number(hexToFloat32(value).toFixed(3));
        break;
      case "04":
        data.PM1_0 = parseInt(value2, 16);
        break;
      case "05":
        data.PM2_5 = parseInt(value2, 16);
        break;
      case "06":
        data.PM10 = parseInt(value2, 16);
        break;
      case "07":
        data.CO2 =
          parseInt(value2.substring(0, 2), 16) * 256 +
          parseInt(value2.substring(2, 4), 16);
        break;
      case "08":
        data.TVOC = Number(hexToFloat32(value).toFixed(3));
        break;
      case "09":
        data.Light = parseInt(value2, 16) / 100;
        break;
      case "10":
        //NONE
        break;
      case "11":
        data.H2S =
          (parseInt(value2.substring(0, 2), 16) * 256 +
            parseInt(value2.substring(2, 4), 16)) /
          100;
        break;
      case "12":
        data.NH3 =
          (parseInt(value2.substring(0, 2), 16) * 256 +
            parseInt(value2.substring(2, 4), 16)) /
          100;
        break;
      case "13":
        data.CO =
          (parseInt(value2.substring(0, 2), 16) * 256 +
            parseInt(value2.substring(2, 4), 16)) /
          10;
        break;
      case "14":
        data.HCHO =
          parseInt(value2.substring(0, 2), 16) * 256 +
          parseInt(value2.substring(2, 4), 16);
        break;
      case "15":
        data.O3 =
          parseInt(value2.substring(0, 2), 16) * 256 +
          parseInt(value2.substring(2, 4), 16);
        break;
      case "16":
        data.NO2 =
          (parseInt(value2.substring(0, 2), 16) * 256 +
            parseInt(value2.substring(2, 4), 16)) /
          1000;
        break;
      case "17":
        data.SO2 =
          (parseInt(value2.substring(0, 2), 16) * 256 +
            parseInt(value2.substring(2, 4), 16)) /
          1000;
        break;
      case "20":
        data.Voltage = Number(hexToFloat32(value).toFixed(3));
        break;
      default:
        break;
    }
  }
  return data;
}

function bytesToHex(bytes) {
  var hexString = "";
  for (var i = 0; i < bytes.length; i++) {
    var hex = bytes[i].toString(16);
    hex = hex.length === 1 ? "0" + hex : hex;
    hexString += hex;
  }
  return hexString;
}

function hexToFloat32(hex) {
  // 创建一个足够存储32位浮点数的缓冲区
  var buffer = new ArrayBuffer(4);
  // 创建一个视图，用于操作缓冲区中的字节
  var view = new DataView(buffer);
  // 将十六进制字符串转换为32位整数
  var int = parseInt(hex, 16);
  // 将32位整数写入缓冲区
  view.setUint32(0, int);
  // 读取缓冲区中的浮点数
  return view.getFloat32(0);
}

function hexToFloat32_IE9(hex) {
  // 将十六进制字符串转换为32位整数
  var int = parseInt(hex, 16);

  // 将32位整数拆分为8位字节
  var byte1 = (int >> 24) & 0xff;
  var byte2 = (int >> 16) & 0xff;
  var byte3 = (int >> 8) & 0xff;
  var byte4 = int & 0xff;

  // 将字节按照 IEEE 754 标准组装为浮点数
  var sign = (byte1 >> 7) & 1;
  var exponent = ((byte1 & 0x7f) << 1) | (byte2 >> 7);
  var mantissa = ((byte2 & 0x7f) << 16) | (byte3 << 8) | byte4;

  var floatValue;
  if (exponent === 0 && mantissa === 0) {
    // 零值
    floatValue = 0;
  } else {
    var bias = 127;
    var power = Math.pow(2, exponent - bias);
    floatValue = Math.pow(-1, sign) * power * (1 + mantissa / Math.pow(2, 23));
  }

  return floatValue;
}

function calculateBattery(voltage) {
  if (voltage > 3.6) {
    return 100;
  }

  return parseFloat(
    (((voltage - 2.8) / (3.6 - 2.8).toFixed(3)) * 100).toFixed(1)
  );
}
