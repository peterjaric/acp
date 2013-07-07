'use strict';

function start_game(game_graph) {
    function validate_graph(graph) {
	var key, node, nodes, i;
	if (!graph['start']) {
	    throw 'No start node in graph.';
	}
	for (key in graph) {
	    if (graph.hasOwnProperty(key)) {
		console.log('Validating ' + key);
		node = graph[key];
		if (!node.action) {
		    throw 'Node ' + key + ' has no action';
		} 
		

		if (!handlers[node.action]) {
		    throw 'Node ' + key + ' has an invalid action: ' + graph[key].action;
		}
		
		nodes = [];
		if (node.next) {
		    nodes = nodes.concat((typeof node.next === 'string') ? [node.next] : node.next);
		}
		if (node.ok) {
		    nodes = nodes.concat((typeof node.ok === 'string') ? [node.ok] : node.ok);
		}
		if (node.cancel) {
		    nodes = nodes.concat((typeof node.cancel === 'string') ? [node.cancel] : node.cancel);
		}
		
		for (i = 0; i < nodes.length; i++) {
		    console.log('Validating next value: ' + nodes[i]);
		    if (!graph[nodes[i]]) {
			throw 'Node ' + key + ' has an invalid next value ' + nodes[i];
		    }
		}

		// Add validation of specific actions here
	    }
	}
    }

    function State() {
	this.variables = {};
    }
    
    var handlers = {
	nop: handle_nop,
	info: handle_info,
	input: handle_input, 
	choose: handle_choose, 
	set: handle_set
    }

    function handle_nop(node, state) {
    }

    function handle_info(node, state) {
	var text, args, i;
	if (node.variables) {
	    // Collect values for the node's variables to send as arguments to format
	    args = [];
	    for (i = 0; i < node.variables.length; i++) {
		args.push(state.variables[node.variables[i]]);
	    }
	    text = node.text.format(args);
	} else {
	    text = node.text;
	}
	alert(text + '\n\n');
    }

    function handle_input(node, state) {
	var value = prompt(node.text, node.default_value);
	if (!value) {
	    value = node.default_value;
	}
	state.variables[node.variable] = value;
    }

    function handle_choose(node, state) {
	var ok = confirm(node.text);
	return ok ? node.ok : node.cancel;
    }

    function handle_node(game_graph, node_name, state) {
	var node = game_graph[node_name];
	var nodes, i;
	
	if (!node) {
	    throw 'Missing node ' + node_name;
	} 

	var handle = handlers[node.action];
	if (!handle) {
	    throw 'Missing handler for ' + node.action + ' (in node ' + node_name + ')';
	} 
	var optional_next = handle(node, state);
	var next = optional_next || node.next;

	if (next) {
	    nodes = (typeof next === 'string') ? [next] : next;
	    for (i = 0; i < nodes.length; i++) {
		handle_node(game_graph, nodes[i], state);
	    }
	}
    }

    function handle_set(node, state) {
	for (name in node.values) {
	    if (node.values.hasOwnProperty(name)) {
		state.variables[name] = node.values[name];
	    }
	}

    }

    try {
	// Format function adapted from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
	// Usage: "{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET")
	// First, checks if format isn't implemented yet
	if (!String.prototype.format) {
	    String.prototype.format = function(args) {
		return this.replace(/{(\d+)}/g, function(match, number) { 
		    return typeof args[number] != 'undefined'
			? args[number]
			: match
		    ;
		});
	    };
	}

	
	validate_graph(game_graph);
	var state = new State();
	handle_node(game_graph, 'start', state);
    } catch (e) {
	console.error(e);
    }
};
