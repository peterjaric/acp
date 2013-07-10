'use strict';

if (!window.ACP) {
    window.ACP = (function() {
	function validate_graph(graph) {
	    var key, node, nodes, i;

	    for (key in graph) {
		if (graph.hasOwnProperty(key)) {
		    console.log('Validating ' + key);
		    node = graph[key];
		    
		    var action = actionFromName(key);
		    if (!handlers[action]) {
			throw 'Node ' + key + ' has an invalid action: ' + action;
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
	    add: handle_add, 
	    set: handle_set,
	    roll: handle_roll,
	    equals: handle_equals
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
	    text = text || '';
	    
	    alert(text + '\n\n');
	}

	function handle_input(node, state) {
	    var text = node.text || '';
	    var value = prompt(text, node.default_value);
	    if (!value) {
		value = node.default_value;
	    }
	    state.variables[node.variable] = value;
	}

	function handle_choose(node, state) {
	    var text = node.text || '';
	    var ok = confirm(text + '\n' + '[Choose cancel for more options]');
	    return ok ? node.ok : node.cancel;
	}

	function handle_node(game_graph, node_name, state) {
	    var node = game_graph[node_name];
	    var nodes, i;
	    
	    if (!node) {
		throw 'Missing node ' + node_name;
	    } 
	    
	    var action = actionFromName(node_name);
	    var handle = handlers[action];
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

	function handle_add(node, state) {
	    for (name in node.values) {
		if (node.values.hasOwnProperty(name)) {
		    state.variables[name] += node.values[name];
		}
	    }
	}

	function handle_equals(node, state) {
	    for (name in node.values) {
		if (node.values.hasOwnProperty(name)) {
		    // Defaults to OR by returning out of the loop at once
		    if (state.variables[name] === node.values[name]) {
			return node.success;
		    } else {
			return node.failure;
		    }
		}
	    }
	}

	function handle_roll(node, state) {
	    if (Math.random() < node.chance) {
		return node.success;
	    } else {
		return node.failure;
	    }
	}

	function actionFromName(name) {
	    if (!name) {
		return '';
	    }
	    var parts = name.split('_');
	    return parts[0];
	}
	
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

	function start(game_graph, start_node) {
	    validate_graph(game_graph);
	    var state = new State();
	    handle_node(game_graph, start_node, state);
	}

	return {
	    start: start,
	    handle_node: handle_node,
	};
    })();
}

