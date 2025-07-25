function decodeUplink(input) {
  return {
    data: Decode(input.fPort, input.bytes),
  };
}
function Decode(fPort, bytes) {
    var payload = {};
	var dataLength = bytes.length;
	
	payload["battery_voltage"] = readUInt16BE(bytes.slice(4,6))
	payload["battery_voltage_state"] = bytes[7]=='0'?'normal':'low battery'
	//payload["Data_Packet_Type"] = bytes[9]=='0'?'Heart beat':'Data packet';
	payload["tamper_state"] = bytes[9]=='0'?'no':'yes';
	payload["temperature"] = readInt16BE(bytes.slice(11,13))/100
	payload["smoke_state"] = bytes[14]=='0'?'normal':'alarm';
	

	
	if(dataLength >15){
		var eventLength = dataLength -15
		
		for (var i = 0; i < eventLength-1;i+=2 ){
		    if (bytes[15+i].toString(16) == '05'||bytes[15+i].toString(16) == '5') {
		        payload["battery_voltage_event"] = bytes[16+i]=='0'?'normal':'Low_voltage'
		
		    }
			if (bytes[15+i].toString(16) == '03'||bytes[15+i].toString(16) == '3') {
			    payload["tamper_state_event"] = bytes[16+i]=='0'?'no':'yes'
					
			}
			
			if (bytes[15+i].toString(16) == '31') {
			    payload["smoke_event"] = bytes[16+i]=='0'?'normal':'alarm'
					
			}
			if (bytes[15+i].toString(16) == '82') {
			    payload["self_check_event"] = bytes[16+i]=='0'?'normal':'self-inspection'
					
			}


		}
	}
	
	
	


    return payload;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) {
    return (bytes & 0xFF);
}

function readInt8LE(bytes) {
    var ref = readUInt8LE(bytes);
    return (ref > 0x7F) ? ref - 0x100 : ref;
}
function readUInt16BE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}
function readInt16BE(bytes) {
    var ref = readUInt16BE(bytes);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}
function readUInt32BE(bytes) {
    var value = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    return (value & 0xFFFFFFFF);
}

function timestampToDate(timestamp) {
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份是从0开始的
  var day = ('0' + date.getDate()).slice(-2);
  var hours = ('0' + date.getHours()).slice(-2);
  var minutes = ('0' + date.getMinutes()).slice(-2);
  var seconds = ('0' + date.getSeconds()).slice(-2);
 
  //return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
  return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds
}
