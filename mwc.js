try{
var wes=require("ws");
var portm = 19133
var wss=new wes.Server({port:portm});
const os = require("os");
var localhost = ''
try {
    var network = os.networkInterfaces()
    localhost = network[Object.keys(network)[0]][1].address
} catch (e) {
    localhost = 'localhost'
}
console.log("Please connect Client to "+ localhost + ":" + portm);
}catch(errst){
console.log("Error when loading ws: %s.",errst.message);
process.exit(1);
}

var clients=[];

wss.on("connection",function (ws){
ws.send(JSON.stringify({
		"body": {
			"eventName": "PlayerMessage"
		},
		"header": {
			"requestId": "0ffae098-00ff-ffff-abbbbbbbbbdf3344",
			"messagePurpose": "subscribe",
			"version": 1,
			"messageType": "commandRequest"
		}
	}));

function gamecmds(cmd) {
		ws.send(JSON.stringify({
			"body": {
				"origin": {
					"type": "player"
				},
				"commandLine": cmd,
				"version": 1
			},
			"header": {
				"requestId": "00000000-0001-0000-000000000000",
				"messagePurpose": "commandRequest",
				"version": 1,
				"messageType": "commandRequest"
			}
		}));
	}
	
	gamecmds("say MWC Connected!");
	console.log("Client Connected!");
	
  ws.on("message",function (msg){
  if (JSON.parse(msg).body.eventName == "PlayerMessage"
		/* && JSON.parse(message).body.properties.MessageType=="chat"*/
		&& JSON.parse(msg).header.requestId != "00000000-0001-0000-000000000000") {
			if (JSON.parse(msg).body.properties.Message.substring(0,10) == "*/connect ") {	
				switch (JSON.parse(msg).body.properties.Message.substring(10, 40)) {
					case "127.0.0.1:" + portm :	
						console.log("Bad IP!");
						gamecmds("say We don't suggest you to connect to self.");
						break;
					case localhost + ":" + portm :	
						console.log("Bad IP!");
						gamecmds("say We don't suggest you to connect to self.");
						break;
					case "localhost:" + portm :	
						console.log("Bad IP!");
						gamecmds("say We don't suggest you to connect to self.");
						break;
					default:
						var con=JSON.parse(msg).body.properties.Message.split(" ")[1];
						if(con.substring(0,5)!="ws://"){
							con="ws://"+con;
						}
						var wsc=new wes(con);
						wsc.on("open",function(){
							clients.push(wsc);
							gamecmds("say Connected to websocket: "+con);
							console.log("say Connected to websocket: "+con);
						});
						wsc.on("message",function(msgg){ws.send(msgg);});
						wsc.on("error",function(err){
							gamecmds("say Failed to connect to websocket: "+err.message);
							console.log("say Failed to connect to websocket: "+err.message);
						});
						break;
				}
				//var con=JSON.parse(msg).body.properties.Message.split(" ")[1];
				//if(con.substring(0,5)!="ws://"){
					//con="ws://"+con;
				//}
       //try{
				//var wsc=new wes(con);
				//wsc.on("open",function(){clients.push(wsc);gamecmds("say Connected to websocket: "+con);});
				//wsc.on("message",function(msgg){ws.send(msgg);});
				//wsc.on("error",function(err){gamecmds("say Failed to connect to websocket: "+err.message);});
       /*}catch(erro){
        gamecmds("say Failed to connect to websocket: "+erro.message);
        return;
      }*/
				return;
			}
		}
clients.forEach(function(wscc,i){
wscc.send(msg);
});


  });
  
  });
  

