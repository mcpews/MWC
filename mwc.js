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


process.stdin.resume();
process.on("SIGINT",function(){wss.close();console.log("Websocket Closed.");});
//var clients=[];

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
	try{
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
		}));}catch(undefined){}
	}


	var wss=[];
	var idp=1;

	function findid(id){
		var fdd=undefined;
		wss.forEach(function(e,i){
			if(e.id==id)fdd=e;
		});
		return fdd;
	}

	function killall(){
		wss.forEach(function(e,i){try{e.terminate()}catch(undefined){}});
	}
	
	gamecmds("say §2§lMWC Connected!");
	console.log("Client Connected!");
	
  ws.on("message",function (msg){
  if (JSON.parse(msg).body.eventName == "PlayerMessage"
		/* && JSON.parse(message).body.properties.MessageType=="chat"*/
		&& JSON.parse(msg).header.requestId != "00000000-0001-0000-000000000000") {
	  var spl=JSON.parse(msg).body.properties.Message.split(" ");
	  if(JSON.parse(msg).body.properties.Message.split(" ")[0]=="*/dc"||spl[0]=="*/disconnect"){
		  try{findid(spl[1]).ws.terminate();gamecmds("say Done");}catch(undefined){gamecmds("say Unable to disconnected.\nMaybe: Server is disconnected.");}return;
	  }
	  if(spl[0]=="*/dcm"){
		  try{ws.terminate()}catch(undefined){}
		  wss.forEach(function(e,i){try{e.ws.close();}catch(undefined){}});
		  wss=[];
		  return;
	  }
	  if(spl[0]=="*/reset"||spl[0]=="*/killall"){
		  killall();
		  idp=0;
		  wss=[];
		  gamecmds("say Done");
	  }
	  if(spl[0]=="*/listid"){
		  wss.forEach(function(e,i){
			  try{
				  e.ws.send("");
				  gamecmds("say "+e.id+":"+e.ip);
			  }catch(undefined){}
		  });
		  gamecmds("IDPool: "+idp);
		  return;
	  }
	  
			if (spl[0] == "*/connect") {	
				switch (spl[1]) {
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
							//clients.push(wsc);
							wss.push({id:idp,ws:wsc,ip:wsc.url});
							gamecmds("say Connected to websocket: "+con+",ID:"+idp);
							idp++;
							console.log("Connected to websocket: "+con);
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
wss.forEach(function(wscc,i){
try{wscc.ws.send(msg);}catch(undefined){}
});


  });
  
  });
  

