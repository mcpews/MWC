try{
var wes=require("ws");
var wss=new wes.Server({port:19133});
}catch(errst){
console.log("Error when loading ws: %s.",errst.message);l
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
  ws.on("message",function (msg){
  if (JSON.parse(msg).body.eventName == "PlayerMessage"
		/* && JSON.parse(message).body.properties.MessageType=="chat"*/
		&& JSON.parse(msg).header.requestId != "00000000-0001-0000-000000000000") {
			if (JSON.parse(msg).body.properties.Message.substring(0,10) == "*/connect ") {
       var con=JSON.parse(msg).body.properties.Message.split(" ")[1];
       try{
       var wsc=new wes(con);
       wsc.on("open",function(){clients.push(wsc);gamecmds("say Connected to websocket: "+con);});
       wsc.on("message",function(msgg){ws.send(msgg);});
       }catch(erro){
        gamecmds("say Failed to connect to websocket: "+erro.message);
        return;
      }
      return;
}}
clients.forEach(function(wscc,i){
wscc.send(msg);
});


  });
  
  });
  

