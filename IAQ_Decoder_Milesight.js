/**
 * Payload Decoder
 *
 * Copyright 2024 Atomsenses IoT
 *
 * @product Atomsenses Sensor
 */
// Chirpstack v4
function decodeUplink(input) {
    var decoded = atomsensesDeviceDecode(input.bytes);
    return { data: decoded };
}

// Chirpstack v3
function Decode(fPort, bytes) {
    return atomsensesDeviceDecode(bytes);
}

// The Things Network
function Decoder(bytes, port) {
    return atomsensesDeviceDecode(bytes);
}

function atomsensesDeviceDecode(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var type = bytes[i++];
        var valueBytes = bytes.slice(i, i + 4);
        i += 4;

        switch (type) {
            case 0x01:
                decoded.temperature = readFloat32LE(valueBytes);
                break;
            case 0x02:
                decoded.humidity = readFloat32LE(valueBytes);
                break;
            case 0x03:
                decoded.pressure = readFloat32LE(valueBytes);
                break;
            case 0x04:
                decoded.pm1_0 = readUInt16LE(valueBytes.slice(0, 2));
                break;
            case 0x05:
                decoded.pm2_5 = readUInt16LE(valueBytes.slice(0, 2));
                break;
            case 0x06:
                decoded.pm10 = readUInt16LE(valueBytes.slice(0, 2));
                break;
            case 0x07:
                decoded.co2 = readUInt16LE(valueBytes.slice(0, 2));
                break;
            case 0x08:
                decoded.tvoc = readFloat32LE(valueBytes);
                break;
            case 0x09:
                decoded.light = readUInt16LE(valueBytes.slice(0, 2)) / 100;
                break;
            case 0x11:
                decoded.h2s = readUInt16LE(valueBytes.slice(0, 2)) / 100;
                break;
            case 0x12:
                decoded.nh3 = readUInt16LE(valueBytes.slice(0, 2)) / 100;
                break;
            case 0x13:
                decoded.co = readUInt16LE(valueBytes.slice(0, 2)) / 10;
                break;
            case 0x14:
                decoded.hcho = readUInt16LE(valueBytes.slice(0, 2));
                break;
            case 0x15:
                decoded.o3 = readUInt16LE(valueBytes.slice(0, 2));
                break;
            case 0x16:
                decoded.no2 = readUInt16LE(valueBytes.slice(0, 2)) / 1000;
                break;
            case 0x17:
                decoded.so2 = readUInt16LE(valueBytes.slice(0, 2)) / 1000;
                break;
            case 0x20:
                decoded.voltage = readFloat32LE(valueBytes);
                break;
            default:
                break;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readFloat32LE(bytes) {
    var buffer = new ArrayBuffer(4);
    var view = new DataView(buffer);
    bytes.forEach(function (b, i) {
        view.setUint8(i, b);
    });
    return view.getFloat32(0, true);
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}
