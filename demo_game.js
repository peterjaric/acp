'use strict';
start_game({
    start: {
	action: 'nop',
	next: 'init', 
    },
    init: {
	action: 'set',
	values: {
	    hp: 10,
	    potions: 1,
	    assassin_dead: false
	},
	next: 'enter_name'
    },
    enter_name: {
	action: 'input',
	text: 'What is your name, brave adventurer?',
	default_value: 'Misha Foobarion',
	variable: 'name',
	next: 'greetings'
    },
    greetings: {
	action: 'nop',
	next: ['greetings1', 'greetings2', 'greetings3', 'someone_else_got_off']
    },
    greetings1: {
	action: 'info',
	text: 
	'Greetings, {0}!\n\n' + 
	    'You have just arrived at the Komppoka train station. The rim-train\n' +
	    'you came with is just leaving and will not return for at least two weeks.',
	variables: ['name']
    },
    greetings2: {
	action: 'info',
	text: 
	'Komppoka is a small city by the looks of it, but it will have to do. You\n' +
	    'just *had* to get away from the guild, and hopefully they will not think of\n' +
	    'looking for you here.'
    },
    greetings3: {
	action: 'info',
	text: 'You take a good look at yourself, and what you have at your disposal.',
	next: 'stats'
    },
    stats: {
	action: 'info',
	text: 'Your current stats:\n\nHP:\t\t{0}\nPotions:\t{1}',
	variables: ['hp', 'potions']
    },
    someone_else_got_off: {
	action: 'choose',
	text: 'You notice that someone else got off the train before it left.\n' +
	    'It is getting dark, do you want to go closer to investigate?\n' +
	    'Otherwise you will go the other way towards the center of the village.',
	ok: 'investigate_passenger',
	cancel: 'village_center'
    },
    investigate_passenger: {
	action: 'info',
	text: 'When you approach the other passenger, she turns around and you\n' +
	    'recognize her. It is the guild assassin!\n' +
	    '\n' + 
	    'She attacks!',
	next: 'assassin_fight'
    },
    village_center: {
	action: 'choose',
	text: 'It is a small place. There is a pub and a small shop.\n' +
	    'Do you want to visit the pub?\n' +
	    'Otherwise you will go to the shop for supplies.',
	ok: 'pub',
	cancel: 'shop'
    },
    pub: {
	action: 'info',
	text: 
	'A small pub'
    },
    shop: {
	action: 'info',
	text: 
	'A small shop'
    },
    assassin_fight: {
	action: 'nop'
/*
	action: 'fight',
	enemy: 'guild assassin',
	hp: 6,
	victory: 'Luckily, the Potters\' guild does not value fighting prowess.\n' +
	    'You leave the body on the platform and continue to the village center.\n',
	next: ['assassin_died', 'village_center']
*/
    },
    assassin_died: {
	action: 'set',
	values: {
	    assassin_dead: true
	}
    },
    game_over: {
	action: 'info',
	text: 'GAME OVER'
    }
});
