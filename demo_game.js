(function() {
	"use strict";

	var game_graph = {
		nop_start: {
			next: ['set_init', 'info_acp', 'info_game', 'info_cell', 'info_game_over', 'choose_restart']
		},
		info_acp: {
			text: 'Agessa\'s World - A demo game for ACP\n' +
				'\n' +
				'(by @peterjaric)',
		},
		info_game: {
			text: 'REDISCOVERED WORLD #12\n' +
				'Standard name: Kepler-62 e\n' +
				'Local name: Agessa\'s World\n' +
				'Lost for: 850 standard years',
		},


		/************* GENERAL *************/
		set_init: {
			values: {
				score: 0,
				has_sword: false
			}
		},
		add_1_score: {
			values: {
				score: 1
			}
		},
		set_got_sword: {
			values: {
				has_sword: true
			}
		},
		info_game_over: {
			text: 'GAME OVER\n' + 
				'\n' +
				'Your score: {0}\n',
			variables: ['score']
		},
		choose_restart: {
			text: '[Choose OK to play again]',
			ok: 'nop_start'
		},

		/************* THE SLAVE PITS *************/
		info_cell: {
			text: 'The door to your cell swings shut. The guard outside ' +
				'shouts: "Well fought, but I hear your next opponent will ' +
				'be Giant Jim. I\'m sorry."',
			next: 'choose_call_guard'
		},
		choose_call_guard: {
			text: 'You will never survive a fight against him! Maybe you ' +
				'can talk your way out of this. Do you try to stop the ' +	
				'guard by calling out to her? ',
			ok: 'info_call_guard',
			cancel: 'choose_remove_block'
		},
		choose_remove_block: {
			text: 'For many months you have been scratching away between the ' +
				'bricks in the wall of your cell. Maybe you can remove one of them ' +
				'tonight.\nDo you want to wait and try that?',
			ok: 'info_remove_block',
			cancel: 'choose_call_guard'
		},
		info_call_guard: {
			text: '"Hey! I\'m wounded! Take me to the healers!"',
			next: 'info_show_wound'
		},
		info_show_wound: {
			text: 'You hear the guard turn and the hatch to the cell opens.\n' +
				'"Show me your wound!" she says.',
			next: 'choose_show_arm'
		},
		choose_show_arm: {
			text: 'Your biggest scratch is on your arm. Do you hold it up?',
			ok: 'info_show_arm',
			cancel: 'choose_faint'
		},
		info_show_arm: {
			text: 'The guard looks at your arm and drops the hatch. You hear ' +
				'her mumble something about "not getting any tougher".\n' + 
				'You decide to try removing a block from the wall instead.',
			next: 'info_remove_block'
		},
		choose_faint: {
			text: 'Do you try to trick her instead by pretending to faint?',
			ok: 'info_faint',
			cancel: 'choose_show_arm'
		},
		info_remove_block: {
			text: 'When it finally is dark, you find your spoon and get to work. ' +
				'You were right, a block falls out of the wall and then it is ' +
				'easy work to remove a few more. The way out is open! You crawl ' +
				'through the small opening.',
			next: 'info_wait_for_dawn'
		},
		info_faint: {
			text: 'You drop to the floor and moan loudly. After a while the ' +
				'guard unlocks your door and comes in. This is your chance!',
			next: 'info_fight_guard'
		},
		info_fight_guard: {
			text: 'You may be tired, but you are a fighter of the Royal Slave ' +
				'Pits and you know many dirty tricks. When the guard is close ' +
				'enough you lash out with your foot. She falls and within ' +
				'seconds you are out of the cell with her sword in your hand.',
			next: ['add_1_score', 'set_got_sword', 'info_wait_for_dawn']
		},
		info_wait_for_dawn: {
			text: 'Quickly you find your way up from the slave pits and hide ' +
				'in an empty stable. You decide to sleep and figure out where ' +
				'to go in the morning.',
			next: 'info_the_city'
		},
		

		/************* THE CITY *************/
		info_the_city: {
			text: 'The Royal City of Agessa! The center of the world and a ' +
				'place of almost endless possibilities. Not the place for an ' +
				'escaped slave pit fighter, though. You must get out quick, ' +
				'before you are found and brought to "justice".',
			next: 'choose_street'
		},
		choose_street: {
			text: 'Do you want to leave through the front door? This would be ' +
				'the shortest way to the city exit. You hear some kind of ' +
				'commotion in the street.',
			ok: 'info_guards_in_street',
			cancel: 'choose_back_door'
		},
		choose_back_door: {
			text: 'Do you want to leave through the back door? It is unclear ' +
				'what lies in that direction.',
			ok: 'info_back_yard',
			cancel: 'choose_street'
		},
		info_back_yard: {
			text: 'Behind the stable is a small backyard. It is surrounded by a ' +
				'high fence. The fence has seen better days and you manage ' +
				'to squeeze through a hole.',
			next: 'info_dog_attack'
		},
		info_dog_attack: {
			text: 'As soon as you get to your feet, your hear dogs barking. ' +
				'In an instant you are surrounded by a pack of big fighting ' + 
				'dogs. There is a ladder behind them, leading to safety. You ' +
				'decide to try a surprise rush. There\'s a fifty-fifty chance ' +
				'you\'ll make it.',
			next: 'roll_dog_attack'
		},
		roll_dog_attack: {
			chance: 0.5,
			success: ['add_1_score', 'info_back_streets'],
			failure: 'info_eaten_by_dogs'
		},
		info_eaten_by_dogs: {
			text: 'You run a few steps, but something gets caught on your foot ' +
				'and you stumble. The dogs seize the opportunity and you are ' +
				'dragged down. You are eaten alive.',
		},
		info_back_streets: {
			text: 'The dogs do not expect your sudden maneuver and scatter. ' +
				'You make it to the ladder and scramble over the brick wall ' +
				'into a dark street. You spend the rest of the day sneaking ' +
				'through the back streets. Finally you can exit the city.',
			next: 'info_the_plains'
		},
		info_guards_in_street: {
			text: 'When you enter the street you understand where the noise ' + 
				'comes from. Five royal guards are questioning the peddlers ' +
				'and the people moving through the street. They see you at ' +
				'at once and surround you.',
			next: 'equals_has_sword_in_street'
		},
		equals_has_sword_in_street: {
			values: {
				has_sword: true
			},
			success: 'info_wins_fight_in_street',
			failure: 'info_dies_in_street'
		},
		info_wins_fight_in_street: {
			text: 'Luckily you have the sword you nicked from the cell guard. ' +
				'With it, five ordinary guards are no match for a rested ' +
				'pit fighter. After dealing with them you run for the city exit.',
			next: 'info_the_plains'
		},
		info_dies_in_street: {
			text: 'Unfortunately you are unarmed and only manage to take two ' +
				'of the guards with you before you are cut down.\n' +
				'Maybe you should have stolen a weapon in the pits...'
		},
		

		/************* THE PLAINS *************/
		info_the_plains: {
			text: 'You pass the gates without trouble. Outside you find a ' +
				'big camp. Apparently a nomad tribe is passing the city ' +
				'and is staying here to rest. There is a strange tent ' +
				'at the edge of the camp.',
			next: 'info_tent'
		},
		info_tent: {
			text: 'You enter the tent. Inside is an old woman. After exchanging ' +
				'greetings with you she tells you unsettling things. "Strangers ' +
				'have come to Agessa\'s World. They say that they are from space!"',
			next: 'info_strangers'
		},
		info_strangers: {
			text: 'If the strangers has come from space, maybe they will return ' +
				'there? As long as you are on this world, you will be hunted. ' +
				'You decide to find them. The old woman suddenly says, as if reading ' +
				'your mind: "We are going there, and I need a new servant..."',
			next: 'info_nomads_leave'
		},
		info_nomads_leave: {
			text: 'The next day the nomads pack their tents and start the long ' +
				'journey to the north. There the strangers have set up a big ' +
				'city of towers. Some say the towers can fly! You begin your ' +
				'new job, catering to every need of Catherinne, the old woman.',
			next: 'info_quarrel'
		},
		info_quarrel: {
			text: 'Several weeks go by. You take care of Catherinne\'s needs, but ' +
				'you are not used to spend so much time with the same person. ' +
				'Catherinne is not happy with how you serve her and tells you:\n' +
				'"Shape up or I\'ll throw you out!"',
			next: 'choose_leave_wagon'
		},
		choose_leave_wagon: {
			text: 'You do feel fed up with Catherinne. Do you want to tell her that ' +
				'and try your luck on the road by yourself?',
			ok: 'info_die_on_road',
			cancel: ['add_1_score', 'choose_swallow_pride']
		},
		info_die_on_road: {
			text: '"I\'m not a servant! I\'m a free being!"\n' +
				'You run out and take off on the road alone. ' +
				'Three days later you are close to die of thirst, but the nomads, ' +
				'who knew this would happen, are close by.',
			next: 'info_arrive_at_towers'
		},
		choose_swallow_pride: {
			text: 'On the other hand, staying with the nomads will help you attain ' +
				'your goal. Do you want to swallow your pride and start behaving ' +
				'better?',
			ok: 'info_arrive_at_towers',
			cancel: 'choose_leave_wagon'
		},
		info_arrive_at_towers: {
			text: 'Even though you have asked many questions, you are not prepared ' +
				'for the sight of the city of the strangers, the City of Towers. ' +
				'Everywhere you look, enormous towers loom into the sky. They ' +
				'stand on legs and they sparkle in the sunlight.',
			next: 'info_goodbye_nomads'
		},


		/************* THE STRANGERS *************/	
		info_goodbye_nomads: {
			text: 'After saying goodbye to Catherinne and the rest of the nomads, ' +
				'you start exploring the city. The strangers are easily recognized ' +
				'and you decide to observe them until you know more. You hide under ' +
				'one of the towers.',
			next: 'choose_hide_in_nozzle'
		},
		choose_hide_in_nozzle: {
			text: 'Looking up, you notice that the roof is a kind of a cave. It is ' +
				'black, as if there has been a big fire in it. It looks like a good ' +
				'place to hide. Do you climb into it?',
			ok: 'info_die_in_nozzle',
			cancel: 'choose_ladder'
		},
		info_die_in_nozzle: {
			text: 'After a while your hear a big noise, and suddenly you are engulfed ' +
				'in flames. At least you die quickly.'
		},
		choose_ladder: {
			text: 'At the outside of the cave, there is a ladder leading up. Do you ' +
				'want to climb it?',
			ok: 'info_climb_ladder',
			cancel: 'choose_hide_in_nozzle'
		},
		info_climb_ladder: {
			text: 'At the top of the ladder is a small door and a walkway that goes all ' +
				'the way around the tower. You hear voices approaching on the walkway. ' +
				'The accent is thick, but you make out: "The launch code is 12528."\n' +
				'Quickly, you enter the tower through the door.',
			next: 'info_launch_code'
		},
		info_launch_code: {
			text: 'Happily for you, the strangers climb down the ladder. You find yourself ' +
				'in a room full of blinking lights.',
			next: 'input_launch_code'
		},
		input_launch_code: {
			text: 'A voice says from nowhere:\n' +
				'"To commence take-off, state the launch code."',
			variable: 'launch_code',
			default_value: '',
			next: 'equals_launch_code'
		},
		equals_launch_code: {
			values: {
				launch_code: '12528'
			},
			success: ['add_1_score', 'info_launch_code_correct'],
			failure: 'info_hide_in_cupboard'
		},
		info_launch_code_correct: {
			text: 'The voice says: "Launch code correct. Take-off initiated."\n' +
				'Something makes you think it\'s best to find somewhere to ' +
				'sit down. You find a peculiar chair made of leather and as ' + 
				'soon you are seated, straps automatically envelop you.',
			next: 'info_takeoff'
		},
		info_hide_in_cupboard: {
			text: 'The voice says: "Launch code incorrect. Take-off canceled."\n' +
				'Suddenly someone comes through the door and you rush for ' +
				'cover. There is a kind of cupboard where you manage to ' +
				'squeeze in.',
			next: 'info_pilots_launch'
		},
		info_pilots_launch: {
			text: 'The man who entered the room sits down in a chair in front ' +
				'of the blinking lights and says:\n' +
				'"Initiate take-off. Launch code is 12528."\n' +
				'The spooky voice answers: "Take-off initiated."',
			next: 'info_takeoff'
		},
		info_takeoff: {
			text: 'The tower starts to shake! The noise is deafening. The oddest thing ' +
				'happens: your are pressed towards the floor, as if you weighed much ' +
				'more than usual. After a long while the noise stops and you feel ' +
				'weightless instead.',
			next: 'info_space'
		},
		info_space: {
			text: 'In a bout of inspiration it dawns on you: you are in space! You have ' +
				'left Agessa\'s world! You are free.'
		}
	};

	try {
		ACP.start(game_graph, 'nop_start');
	} catch (e) {
		alert(e + '\n' + e.stack);
	}

})();

