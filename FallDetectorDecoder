// Decode decodes an array of bytes into an object.
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an object, e.g. {"temperature": 22.5}
function Decode(fPort, bytes, variables) {
        var str = "";
        for (var i = 0; i < bytes.length; i++) 
        {
                var tmp;
                var num=bytes[i];
                if (num < 0) 
                {
                   tmp =(255+num+1).toString(16);
                } 
                else 
                {
                   tmp = num.toString(16);
                }
                if (tmp.length == 1) 
                {
                        tmp = "0" + tmp;
                }
                str += tmp + " ";
        }
        var data = 
        {
                "raw" : [],         //原始数据
                   "len": 0,                 //原始数据长度
            "pid": 0,                //终端类型
            "cmd": 0,                //命令类型
            "cmd_ctx":{},         //命令内容
        };
        
        data.raw = str;
          data.len = bytes.length;
          data.cmd = bytes[0];
          data.pid = bytes[1];
          
          if (data.cmd == 1) //终端上报传感器数据
          {
                  var chn_num = bytes[2];
                var sensor_val;                /*传感器值*/
                var sensor_point;         /*小数点个数*/
                var chn_pos = 3;                
                chn_pos
                /*新建一个结构体*/
                data.cmd_ctx = {'type':"data_up",'data_list':[]};
                for (var i = 0; i < chn_num; i++) 
                {
                        var chn_ctx = {"code":"chn_"+i, "type":0, "val": 0};
                        sensor_point = bytes[chn_pos+1];
                        sensor_val = (bytes[chn_pos+2]+bytes[chn_pos+3]*256);
                        chn_ctx.type = bytes[chn_pos];                /*传感器类型*/
                        if (sensor_point == 1)
                        {
                                chn_ctx.val = sensor_val/10.0;
                        }
                        else if (sensor_point == 2)
                        {
                                chn_ctx.val = sensor_val/100.0;
                        }
                        else if (sensor_point == 3)
                        {
                                chn_ctx.val = sensor_val/1000.0;
                        }
                        else
                        {
                                chn_ctx.val = sensor_val;
                        }
                        data.cmd_ctx.data_list[i] = chn_ctx;
                        chn_pos += 4;
                }
          }
          else if (data.cmd == 2) //终端上报事件
          {
                  /*新建一个结构体*/
                data.cmd_ctx = {'type':"event_up",'events':{"identifier": "","params": {}}};
                if (bytes[2] == 0xF0) //功能执行结果上报事件
                {
                        data.cmd_ctx.events.identifier = "exec_ret";
                        var param = {"exec_idf": "", "ret": 0, "desc":""};
                        if (bytes[3] == 0xF0) //功能类型-执行一次数据上报
                        {
                                param.exec_idf = "get_data";
                                param.ret = bytes[4];
                                param.desc = "执行上报数据功能结果"+bytes[4];
                        }
                        else if (bytes[3] == 0xF1) //设置正常状态上报间隔
                        {
                                param.exec_idf = "set_normal_itl";
                                param.ret = bytes[4];
                                param.desc = "执行设置正常状态上报间隔结果"+bytes[4];
                        }
                        else if (bytes[3] == 0xF2) //设置报警状态上报间隔
                        {
                                param.exec_idf = "set_alarm_itl";
                                param.ret = bytes[4];
                                param.desc = "执行设置报警状态上报间隔结果"+bytes[4];
                        }
                        else if (bytes[3] == 0xF3) //设置状态功能
                        {
                                param.exec_idf = "set_status";
                                param.ret = bytes[4];
                                param.desc = "执行设置状态结果"+bytes[4];
                        }
                        else if (bytes[3] == 0xFF) //重启指令收到
                        {
                                param.exec_idf = "restart_device";
                                param.ret = bytes[4];
                                param.desc = "执行重启结果"+bytes[4];
                        }
                        else if (bytes[3] == 0x01) //设置参数
                        {
                                param.exec_idf = "set_param";
                                param.ret = bytes[4];
                                param.desc = "执行设置参数结果"+bytes[4];
                        }
                        else if (bytes[3] == 0x02) //设置模式
                        {
                                param.exec_idf = "set_mode";
                                param.ret = bytes[4];
                                param.desc = "执行设置模式结果"+bytes[4];
                        }
                        else if (bytes[3] == 0x03) //获取版本
                        {
                                param.exec_idf = "get_ver";
                                param.ret = bytes[4];
                                if (bytes[4] == 0)
                                {
                                        param.desc = "执行获取版本成功"+bytes[5]+"_"+bytes[6]+"_"+bytes[7];
                                }
                                else 
                                {
                                        param.desc = "执行获取版本失败";
                                }
                        }
                        else if (bytes[3] == 0x04) //获取参数
                        {
                                param.exec_idf = "get_param";
                                param.ret = bytes[4];
                                if (bytes[4] == 0)
                                {
                                        var hei, thr, sens, delay, xl, xr, zf, zb;
                                        hei = bytes[5]+bytes[6]*256;
                                        thr = bytes[7];
                                        sens = bytes[8];
                                        delay = bytes[9]+bytes[10]*256;
                                        xl = bytes[11]+bytes[12]*256;
                                        xr = bytes[13]+bytes[14]*256;
                                        zf = bytes[15]+bytes[16]*256;
                                        zb = bytes[17]+bytes[18]*256;
                                        param.desc = "执行获取参数成功"+"hei:"+hei+"thr:"+thr+"sens:"+sens+"delay:"+delay+"xl:"+xl+"xr:"+xr+"zf:"+zf+"zb:"+zb;
                                }
                                else 
                                {
                                        param.desc = "执行获取参数失败";
                                }
                        }
                        data.cmd_ctx.events.params = param;
                }
                else if (bytes[2] == 0xF1) //状态触发事件
                {
                        data.cmd_ctx.events.identifier = "status_change_up";
                        var param = {"status": 1, "desc":"雷达状态改变"};
                        param.status = bytes[3];
                        data.cmd_ctx.events.params = param;
                }
          }
          
          return data;
}
