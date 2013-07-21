if (!window.ACP) {
	window.ACP = (function() {
		"use strict";
		
		// Checks that the given graph does not contain errors.
		// Currently only checks that no node points to non-
		// existing nodes and that no nodes have invalid actions.
		function validate_graph(graph) {
			function concat_node(n, ns) {
				return ns.concat((typeof n === 'string') ? [n] : n);
			}

			var key, node, nodes, i;
			
			for (key in graph) {
				if (graph.hasOwnProperty(key)) {
					node = graph[key];
					
					var action = actionFromName(key);
					if (!handlers[action]) {
						throw 'Node ' + key + ' has an invalid action: ' + action;
					}

					nodes = [];
					if (node.next) {
						nodes = concat_node(node.next, nodes);
					}
					if (node.ok) {
						nodes = concat_node(node.ok, nodes);
					}
					if (node.cancel) {
						nodes = concat_node(node.cancel, nodes);
					}
					if (node.success) {
						nodes = concat_node(node.success, nodes);
					}
					if (node.failure) {
						nodes = concat_node(node.failure, nodes);
					}
					
					for (i = 0; i < nodes.length; i++) {
						if (!graph[nodes[i]]) {
							throw 'Node ' + key + ' has an invalid next value ' + nodes[i];
						}
					}

					// Add validation of specific actions here
				}
			}
		}

		// Holds the current state of a game
		function State() {
			this.variables = {};
		}

		// The map from action names to handlers
		var handlers = {
			nop: handle_nop,
			info: handle_info,
			input: handle_input, 
			choose: handle_choose, 
			add: handle_add, 
			set: handle_set,
			roll: handle_roll,
			equals: handle_equals
		};

		// The main function. Takes a game graph, the name
		// of the current node and the current state.
		// It chooses the correct handler, runs it, 
		// and then calls itself if there are more
		// nodes to process.
		function handle_node(game_graph, node_name, state) {
			var nodes, i;
			// Find the current node in the graph
			var node = game_graph[node_name];
			
			if (!node) {
				throw 'Missing node ' + node_name;
			} 
			
			// Get the action of the current node by looking at its
			// name.
			var action = actionFromName(node_name);

			// Find the handler for this action and call it
			var handle = handlers[action];
			if (!handle) {
				throw 'Missing handler for ' + node.action + ' (in node ' + node_name + ')';
			} 
			var optional_next = handle(node, state);

			// Get the next node(s). If the handler returned something,
			// use that, otherwise use the 'next' property of the current
			// node.
			var next = optional_next || node.next;

			if (next) {
				// If we got just the name of a node, wrap it in an array,
				// otherwise assume it is already an array and use that.
				nodes = (typeof next === 'string') ? [next] : next;

				// Handle all the nodes in the array, in order.
				for (i = 0; i < nodes.length; i++) {
					handle_node(game_graph, nodes[i], state);
				}
			}
		}

		// This action does nothing
		function handle_nop(node, state) {
		}

		// This action shows a text message, optionally with variables,
		// by displaying an alert dialog.
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

		// This action allows the user to input a text string, by
		// displaying a prompt dialog.
		// The string is saved in the variable specified in the node.
		function handle_input(node, state) {
			var text = node.text || '';
			var value = prompt(text, node.default_value);
			if (!value) {
				value = node.default_value;
			}
			state.variables[node.variable] = value;
		}

		// This action allows the user to choose an action
		// by displaying a confirm dialog.
		function handle_choose(node, state) {
			var text = node.text || '';
			if (node.cancel) {
				text += '\n' + '[Choose cancel for more options]';
			}
			var ok = confirm(text);
			return ok ? node.ok : node.cancel;
		}

		// This action sets a set of variables to specified values.
		function handle_set(node, state) {
			for (var name in node.values) {
				if (name && node.values.hasOwnProperty(name)) {
					state.variables[name] = node.values[name];
				}
			}
		}

		// This action adds specified values to a set of variables.
		function handle_add(node, state) {
			for (var name in node.values) {
				if (name && node.values.hasOwnProperty(name)) {
					state.variables[name] += node.values[name];
				}
			}
		}

		// This action checks a set of variables for equality to
		// a set of specified values. If one or more variables
		// match, the handler will return the 'success' property
		// of the node, otherwise the 'failure' property.
		function handle_equals(node, state) {
			for (var name in node.values) {
				if (name && node.values.hasOwnProperty(name)) {
					// Defaults to OR by returning out of the loop at once
					if (state.variables[name] === node.values[name]) {
						return node.success;
					} else {
						return node.failure;
					}
				}
			}
		}

		// This action makes a roll against a specified 'chance' property.
		// The range is "[0, 1) that is, from 0 (inclusive) up to but not
		// including 1 (exclusive)" 
		// (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
		// If the roll is successful, the handler will return the 'success' 
		// property of the node, otherwise the 'failure' property.
		function handle_roll(node, state) {
			if (Math.random() < node.chance) {
				return node.success;
			} else {
				return node.failure;
			}
		}

		// Takes the name of a node and returns the action type.
		// E.g. "info_boat_arrives" will result in "info".
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
					return typeof args[number] !== 'undefined' ? 
						args[number] : 
						match;
				});
			};
		}

		// Starts the game
		function start(game_graph, start_node) {
			validate_graph(game_graph);
			var state = new State();
			handle_node(game_graph, start_node, state);
		}

		// Returns the global ACP object.
		return {
			start: start,
			handle_node: handle_node,
		};
	})();
}

