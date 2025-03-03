/**
 * Payload Decoder for Chirpstack and Milesight network server
 * 
 * Copyright 2025 AS
 * 
 * @product AS Series
 * @params
 *     - fPort: 85
 *     - bytes: [0x01, 0x75, 0x64]
 */
function Decode(fPort, bytes) {
  var hexString = bytesToHex(bytes);

  // 验证输入是否为有效的十六进制字符串
  if (!/^[0-9a-fA-F]+$/.test(hexString)) {
    return { message: "Invalid hex string" };
  }

  // 确保字符串长度为10的倍数（每10个字符为一组）
  if (hexString.length % 10 !== 0) {
    return { message: "Hex string length must be a multiple of 10" };
  }

  var data = {};

  for (var i = 0; i < hexString.length; i += 10) {
    var endIndex = i + 10;
    var group = hexString.substring(i, endIndex);
    var type = group.substring(0, 2);
    var value = group.substring(2, 10).toLowerCase();
    var value2 = group.substring(6, 10).toLowerCase();

    if (value === "ffffffff" || value2 === "ffff") continue;

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
        data.CO2 = (parseInt(value2.substr(0, 2), 16) << 8) + parseInt(value2.substr(2, 2), 16);
        break;
      case "08":
        data.TVOC = Number(hexToFloat32(value).toFixed(3));
        break;
      case "09":
        data.Light = parseInt(value2, 16) / 100;
        break;
      case "11":
        data.H2S = ((parseInt(value2.substr(0, 2), 16) << 8) + parseInt(value2.substr(2, 2), 16)) / 100;
        break;
      case "12":
        data.NH3 = ((parseInt(value2.substr(0, 2), 16) << 8) + parseInt(value2.substr(2, 2), 16)) / 100;
        break;
      case "13":
        data.CO = ((parseInt(value2.substr(0, 2), 16) << 8) + parseInt(value2.substr(2, 2), 16)) / 10;
        break;
      case "14":
        data.HCHO = (parseInt(value2.substr(0, 2), 16) << 8) + parseInt(value2.substr(2, 2), 16);
        break;
      case "15":
        data.O3 = (parseInt(value2.substr(0, 2), 16) << 8) + parseInt(value2.substr(2, 2), 16);
        break;
      case "16":
        data.NO2 = ((parseInt(value2.substr(0, 2), 16) << 8) + parseInt(value2.substr(2, 2), 16)) / 1000;
        break;
      case "17":
        data.SO2 = ((parseInt(value2.substr(0, 2), 16) << 8) + parseInt(value2.substr(2, 2), 16)) / 1000;
        break;
      case "20":
        data.Voltage = Number(hexToFloat32(value).toFixed(3));
        break;
    }
  }
  return data;
}

/* ******************************************
 * bytes to number
 ********************************************/
function bytesToHex(bytes) {
  var hex = [];
  for (var i = 0; i < bytes.length; i++) {
    hex.push(('0' + bytes[i].toString(16)).slice(-2));
  }
  return hex.join('');
}

// 替换原 hexToFloat32，使用纯 JavaScript 实现
function hexToFloat32(hex) {
  var int = parseInt(hex, 16);
  var byte1 = (int >> 24) & 0xff;
  var byte2 = (int >> 16) & 0xff;
  var byte3 = (int >> 8) & 0xff;
  var byte4 = int & 0xff;

  var sign = (byte1 >> 7) & 0x01;
  var exponent = ((byte1 & 0x7f) << 1) | (byte2 >> 7);
  var mantissa = ((byte2 & 0x7f) << 16) | (byte3 << 8) | byte4;

  if (exponent === 0 && mantissa === 0) return sign === 1 ? -0.0 : 0.0;
  if (exponent === 0xff) return mantissa !== 0 ? NaN : (sign ? -Infinity : Infinity);

  var bias = 127;
  var adjustedExponent = exponent - bias;
  var significand = 1 + mantissa / 0x800000; // 2^23

  return (sign ? -1 : 1) * Math.pow(2, adjustedExponent) * significand;
}

function calculateBattery(voltage) {
  if (voltage > 3.6) return 100;
  return ((voltage - 2.8) / (3.6 - 2.8) * 100).toFixed(1);
}
