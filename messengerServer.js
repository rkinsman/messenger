var net = require("net");
var helper = require("./helpers.js");

var server = net.createServer(function(con){
		console.log('connecting...');

		var username = '';


		con.on('end', function(){
			if(username){
				Users(username).get().online = false;
			}	
			console.log(username + ' is disconnecting...');
		});



		con.on('data', function(input){
			data = input.toString().trim();
			console.log('Client says: ' + data);
			
				if(data === 'exit'){
					con.end();
				}
				else if(data === '-help' || data === '-h'){	// display available commands
					con.write("-status or -s will reveal friends online. To send a message, send:[user]:[msg]. Press return to check for new messeges. Type exit to quit.\r\n");
				}
				else if(data === '-status' || data === '-s'){	// show online users
					var stati = '';
					userList.forEach(function(el){
						var stat = el.online ? 'Online' : 'Offline';
						stati += el.name + ' : ' + stat + ' | ';
					});		
					con.write(stati + '\r\n');
				}
				else{
					// Process Client Input
					if(username && Users(username).get().online){	//if properly logged in

					//check for new messeges
						userList.forEach(function(el){
							if(el.name === username){
								var post = '';
								while(el.conversations.length){
									console.log(el.conversations.length);
									con.write('Press return to view messeges['+ el.conversations.length +']\r\n');
									post = el.conversations.shift();
									con.write(post.from + ' --> ' + post.text + '\r\n');
								}
							}
						});




						// data in the form of - cmd:usr[:msg] <--optional
						var args = data.split(':');
						if(args[0] === 'send'){
							//send logic
							var usr = args[1];
							var msg = args[2];
							valid = usr && msg;
							if(valid){
								Users(usr).send(username, msg);
								con.write('message sent...\r\n');
							} 
							else{
								con.write('Command ill-formed. type \'-h\' for help...\r\n');
							}
						}
/*						else if(args[0] === 'view'){
							//view logic
							var usr = args[1].trim();
							if(usr){
								var convo = Users(username).get().conversations;
								convo.forEach(function(el){
									if(el.from === usr || el.from === username){
										con.write(el.from + '-->' + el.text + '\r\n');
									}
								});
							}
							else{
								con.write('Command ill-formed. type \'-h\' for help...\r\n');
							}
						}*/
						else{
							//Blow chuncks
							con.write('command ' + args[0] + ' not found...\r\n');
						}
					}
					else if(username){ //if waiting on password
						if(Users(username).get().pass !== data){	// validate password
							username = '';
							con.write('password doesn\'t match... Please enter a username: \r\n');
						}
						else{	//log user on
							Users(username).logOn();
							con.write('Welcome, ' + username + '! Enter a command or type \'-help\' for a list of commands. ');
						
							var unused = true;

							//check for new messeges
							userList.forEach(function(el){
								if(el.name === username){
									var post = '';
									while(el.conversations.length){
										console.log(el.conversations.length);
										con.write('Press return to view messeges['+ el.conversations.length +']\r\n');
										post = el.conversations.shift();
										con.write(post.from + ' --> ' + post.text + '\r\n');
										unused = false;
									}
								}
							});

							if(unused){
								con.write('\r\n');
							}
						}
					}
					else if(!username){	// if no user identified

						if(!(Users(data).get())){	//authenticate user
							con.write('...Please enter a valid  username: \r\n')
						}
						else if(Users(data).get().online){
							con.write('This user is already online... Please enter a username: \r\n');
						}
						else{	// ask for password
							username = data;
							con.write('Please enter your password: \r\n');
						}
					}
				}
			
		});

});


var userList = [
	{name : 'Ross', pass : '12345', online : false, conversations : [], queue : []},
	{name : 'Bud', pass : '54321', online : false, conversations : [], queue : []},
	{name : 'KDawg', pass : '11111', online : false, conversations : [], queue : []},
	{name : 'Adam', pass : '22222', online : false, conversations : [], queue : []},
	{name : 'Devon', pass : '33333', online : false, conversations : [], queue : []}
];

var Users = function(target){
	
	var getUser = function(){
		var user = 0;
		userList.forEach(function(el){
			if(target === el.name){
				user = el; 
			}
		});
		return user || 0;
	};

	var logUserOn = function(){
		userList.forEach(function(el){
			if(el.name === target){
				el.online = true;
				console.log(el.name + ' signed on...');
			}
		});
	};

	var logUserOff =  function(){
		userList.forEach(function(el){
			if(el.name === target){el.online = false;}
		});
	};

	var sendTo = function(from, text){
		userList.forEach(function(el){
			if(el.name === target){
				el.conversations.push({'from':from, 'text':text});
				helper.atc(el.conversations);
			}
		});
	};

/*	var viewFrom = function(usr){
		userList.forEach(function(el){
			if(el.name === target){
				return el.conversations;
			}
		});	
	};
*/

	return {get:getUser, logOn:logUserOn, logOff:logUserOff, send:sendTo};

};


server.listen('2280', function(){
	console.log('Server listening on port 2280...');
});
