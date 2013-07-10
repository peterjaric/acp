'use strict';

(function() {
    var game_graph = {
	nop_start: {
	    next: ['set_init', 'info_acp', 'info_game', 'info_cell', 'info_game_over']
	},
	info_acp: {
	    text: '------  Agessa\'s World  ------\n' + 
		  '      A demo game for ACP\n' +
		  '\n' +
		  '          by @peterjaric',
	},
	info_game: {
	    text: 'REDISCOVERED WORLD #12\n' +
		'Standard name: Kepler-62 e\n' +
		'Local name: Adessa\'s World\n' +
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
		'Your score: {0}\n' +
		'[Choose OK to play again]',
	    variables: ['score'],
	    next: 'nop_start'
	},


	/************* THE SLAVE PITS *************/
	info_cell: {
	    text: 'The door to your cell swings shut. The guard outside\n' +
		'shouts: "Well fought, but I hear your next opponent will\n' +
		'be Giant Jim. I\'m sorry."',
	    next: 'choose_call_guard'
	},
	choose_call_guard: {
	    text: 'You will never survive a fight against him! Maybe you\n' +
		'can talk your way out of this. Do you try to stop the\n' + 
		'guard by calling out to her? ',
	    ok: 'info_call_guard',
	    cancel: 'choose_remove_block'
	},
	choose_remove_block: {
	    text: 'For many months you have been scratching away between the\n' +
		'bricks in the wall of your cell. Maybe you can remove one of them\n' +
		'tonight. Do you want to wait and try that?',
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
	    text: 'The guard looks at your arm and drops the hatch. You hear\n' +
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
	    text: 'When it finally is dark, you find your spoon and get to work.\n' +
		'You were right, a block falls out of the wall and then it is\n' +
		'easy work to remove a few more. The way out is open! You crawl\n' +
		'through the small opening.',
	    next: 'info_wait_for_dawn'
	},
	info_faint: {
	    text: 'You drop to the floor and moan loudly. After a while the\n' +
		'guard unlocks your door and comes in. This is your chance!',
	    next: 'info_fight_guard'
	},
	info_fight_guard: {
	    text: 'You may be tired, but you are a fighter of the Royal Slave\n' +
		'Pits and you know many dirty tricks. When the guard is close\n' +
		'enough you lash out with your foot. She falls and within\n' +
		'seconds you are out of the cell with her sword in your hand.',
	    next: ['add_1_score', 'set_got_sword', 'info_wait_for_dawn']
	},
	info_wait_for_dawn: {
	    text: 'Quickly you find your way up from the slave pits and hide\n' +
		'in an empty stable. You decide to sleep and figure out where\n' +
		'to go in the morning.',
	    next: 'info_the_city'
	},
	

	/************* THE CITY *************/
	info_the_city: {
	    text: 'The Royal City of Agessa! The center of the world and a\n' +
		'place of almost endless possibilities. Not the place for an\n' +
		'escaped slave pit fighter, though. You must get out quick,\n' +
		'before you are found and brought to "justice".',
	    next: 'choose_street'
	},
	choose_street: {
	    text: 'Do you want to leave through the front door? This would be\n' +
		'the shortest way to the city exit. You hear some kind of\n' +
		'commotion in the street.',
	    ok: 'info_guards_in_street',
	    cancel: 'choose_back_door'
	},
	choose_back_door: {
	    text: 'Do you want to leave through the back door? It is unclear\n' +
		'what lies in that direction.',
	    ok: 'info_back_yard',
	    cancel: 'choose_street'
	},
	info_back_yard: {
	    text: 'Behind the stable is a small backyard. It is surrounded by a\n' +
		'high fence. The fence has seen better days and you manage\n' +
		'to squeeze through a hole.',
	    next: 'roll_dog_attack'
	},
	roll_dog_attack: {
	    text: 'As soon as you get to your feet, your hear dogs barking.\n' +
		'In an instant you are surrounded by a pack of big fighting\n' + 
		'dogs. There is a ladder behind them, leading to safety. You\n' +
		'decide to try a surprise rush. There\'s a fifty-fifty chance\n' +
		'you\'ll make it.',
	    chance: 0.5,
	    success: ['add_1_score', 'info_back_streets'],
	    failure: 'info_eaten_by_dogs'
	},
	info_eaten_by_dogs: {
	    text: 'You run a few steps, but something gets caught on your foot\n' +
		'and you stumble. The dogs seize the opportunity and you are\n' +
		'dragged down. You are eaten alive.',
	},
	info_back_streets: {
	    text: 'The dogs do not expect your sudden maneuver and scatter.\n' +
		'You make it to the ladder and scramble over the brick wall\n' +
		'into a dark street. You spend the rest of the day sneaking\n' +
		'through the back streets. Finally you can exit the city.',
	    next: 'info_the_plains'
	},
	info_guards_in_street: {
	    text: 'When you enter the street you understand where the noise\n' + 
		'comes from. Five royal guards are questioning the peddlers\n' +
		'and the people moving through the street. They see you at\n' +
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
	    text: 'Luckily you have the sword you nicked from the cell guard.\n' +
		'With it, five ordinary guards are no match for a rested\n' +
		'pit fighter. After dealing with them you run for the city exit.',
	    next: 'info_the_plains'
	},
	info_dies_in_street: {
	    text: 'Unfortunately you are unarmed and only managed to take two\n' +
		'of the guards with you before you are cut down.\n' +
		'Maybe you should have stolen a weapon in the pits...'
	},
	

	/************* THE PLAINS *************/
	info_the_plains: {
	}
    };

    try {
	ACP.start(game_graph, 'nop_start');
    } catch (e) {
	console.error(e);
    }

})();

