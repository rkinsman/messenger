var net = require("net");


var server = net.createServer(function(con){
		console.log('connecting...');

		var username = '';

		con.on('end', function(){
			if(username){
				Users.get(username).online = false;
			}	
			console.log(username + ' is disconnecting...');
		});


		con.write('Welcome to Messenger. Please enter a username: '); 

		con.on('data', function(data){
			console.log('Client says: ' + data.toString());
			
			if(!username){	// validate username
				if(!(Users.get(data))){
					con.write('This user does not exist... Please enter a username: ')
				}
				else if(Users.get(data).online){
					con.write('This user is already online... Please enter a username: ');
				}
				else{	// ask for password
					username = data;
					con.write('Please enter your password: ');
				}
			}

			if(Users.get(username).pass !== data){	// validate password
				username = '';
				con.write('password doesn\'t match... Please enter a username: ');
			}
			else{	//log user on
				Users.logOn(username);
				cons.write('Welcome, ' + username + '! Enter a command or type \'-help\' for a list of commands');
			}

			// Process Client Input

			if(data === '-help'){	// display available commands
					
			}

		});

});



var sendMsg = function(msgText, sender, recipient){
	var msg = {from:sender, text:msgText};
}


var Users = function(){
	var userList = [
		{name : 'Ross', pass : 12345, online : false, conversations : [], queue : []},
		{name : 'Bud', pass : 54321, online : false, conversations : [], queue : []},
		{name : 'KDawg', pass : 11111, online : false, conversations : [], queue : []},
		{name : 'Adam', pass : 22222, online : false, conversations : [], queue : []},
		{name : 'Devon', pass : 33333, online : false, conversations : [], queue : []}
	];

	return{
		get : function(target){
			user = 0;
			userList.some(function(){
				if(el.name === target){user = el; return 1;}
			});
			return user || 0;
		},

		logOn :  function(target){
				userList.some(el, function(){
					if(el.name === target){el.online = true; return 1;}
				});
		},

		logOff :  function(target){
				userList.some(el, function(){
					if(el.name === target){el.online = false; return 1;}
				});
		}
	};

};


server.listen('2280', function(){
	console.log('Server listening on port 2280...');
});
