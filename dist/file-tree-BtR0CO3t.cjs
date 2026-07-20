//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let node_path = require("node:path");
node_path = __toESM(node_path, 1);
let node_fs = require("node:fs");
let neoevents = require("neoevents");
//#region src/utils/record.ts
/** Check if a value is a record. */
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object && Object.prototype.toString.call(value) === "[object Object]";
}
/** Checks if there are common keys in both object. */
function hasCommonKeys(value1, value2) {
	for (const key of Object.keys(value2)) if (Object.hasOwn(value1, key)) return true;
	return false;
}
//#endregion
//#region src/driver.ts
var HyperAPIDriver = class extends neoevents.NeoEventTarget {
	fetch(request) {
		return new Promise((resolve) => {
			this.emit("request", {
				request,
				callback: resolve
			});
		});
	}
};
//#endregion
//#region src/utils/methods.ts
/**
* Checks if the given value is a valid HyperAPI method.
* @param method The HTTP method to check.
* @returns -
*/
function isHyperApiMethod(method) {
	return method === "DELETE" || method === "GET" || method === "OPTIONS" || method === "PATCH" || method === "POST" || method === "PUT" || method === "QUERY" || method === "UNDEF";
}
//#endregion
//#region src/router/filename.ts
const RE_OPTIONAL_CATCH_ALL = /^\[\[\.\.\.(?<key>[a-z_][\da-z_]*)\]\]$/iu;
const RE_GREEDY = /^\[\.\.\.(?<key>[a-z_][\da-z_]*)\]$/iu;
/**
* Returns specificity for route.
*
* Values:
* - 0: static route (e.g. `/foo`)
* - 1: route with parameter (e.g. `/foo-:id`)
* - 2: route with optional parameter (e.g. `/foo-:id?`)
* - 3: route with greedy parameter (e.g. `/foo-:id+`)
* - 4: (NOT USED) route with wildcard (e.g. `/*`)
* @param name -
* @returns -
*/
function parseFilename(name) {
	if (name === "index" || name.length === 0) return { self: true };
	const match_optional_catch_all = RE_OPTIONAL_CATCH_ALL.exec(name);
	if (match_optional_catch_all) return {
		self: true,
		route: {
			part: `:${match_optional_catch_all.groups?.key}+`,
			specificity: {
				type: 3,
				static_length: 0
			}
		}
	};
	const match_greedy = RE_GREEDY.exec(name);
	if (match_greedy) return { route: {
		part: `:${match_greedy.groups?.key}+`,
		specificity: {
			type: 3,
			static_length: 0
		}
	} };
	let has_optional = false;
	let static_length = name.length;
	const route_part = name.replaceAll(/(\[([a-z_][\da-z_]*)\]|\[\[([a-z_][\da-z_]*)\]\])([^\da-z_]|$)/giu, (...args) => {
		static_length -= args[1].length;
		if (args[3] !== void 0) {
			has_optional = true;
			return `:${args[3]}?${args[4]}`;
		}
		return `:${args[2]}${args[4]}`;
	});
	if (name !== route_part) return { route: {
		part: route_part,
		specificity: {
			type: has_optional ? 2 : 1,
			static_length
		}
	} };
	if (name.includes("[") !== true) return { route: {
		part: route_part,
		specificity: {
			type: 0,
			static_length: 0
		}
	} };
	throw new Error(`Invalid filename "${name}".`);
}
//#endregion
//#region src/router/file-tree.ts
const RE_EXT = /\.(?<ext>[cm]?[jt]s)$/iu;
const RE_METHOD = /\+(?<method>delete|get|options|patch|post|put|query)$/iu;
/**
* Returns the routes for the given path.
* @param path The path to read files from.
* @returns The routes for the given path.
*/
function getRoutes(path) {
	const route_datas = [];
	(function walk(walk_state) {
		const result_directory = {
			specificity: walk_state.specificity,
			children: []
		};
		const result_routes = [];
		const entries = (0, node_fs.readdirSync)(walk_state.path, { withFileTypes: true });
		if (process.env.NODE_ENV === "test") for (let i = entries.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[entries[i], entries[j]] = [entries[j], entries[i]];
		}
		for (const entry of entries) {
			const entry_path = node_path.default.join(entry.parentPath, entry.name);
			if (entry.isFile()) {
				let name = entry.name.replace(RE_EXT, "");
				if (name.endsWith(".test")) continue;
				let method = "UNDEF";
				name = name.replace(RE_METHOD, (_, g1) => {
					const value = g1.toUpperCase();
					if (isHyperApiMethod(value) !== true) throw new Error(`Internal error: invalid method: ${value}`);
					method = value;
					return "";
				});
				const { self, route } = parseFilename(name);
				const specificity_position = 0;
				if (self) result_routes.push({
					specificity: {
						...walk_state.specificity,
						position: specificity_position
					},
					route_data: {
						method,
						route: walk_state.route ?? "/",
						file_path: entry_path
					}
				});
				if (route) result_directory.children.push({
					specificity: {
						...route.specificity,
						position: specificity_position
					},
					route_data: {
						method,
						route: (walk_state.route ?? "") + node_path.default.sep + route.part,
						file_path: entry_path
					}
				});
			} else if (entry.isDirectory()) {
				const { self, route } = parseFilename(entry.name);
				if (self) throw new Error(`Invalid directory name "${entry.name}" at "${entry_path}". Can not use optional catch-all in directory name.`);
				if (!route) throw new Error(`Invalid directory name "${entry.name}" at "${entry_path}".`);
				result_directory.children.push(...walk({
					path: entry_path,
					route: (walk_state.route ?? "") + node_path.default.sep + route.part,
					specificity: {
						...route.specificity,
						position: 2
					}
				}));
			}
		}
		sortRoutes(result_directory.children);
		const result = [result_directory, ...result_routes];
		if (walk_state.route === null) sortRoutes(result);
		for (const result_item of result_directory.children) if ("route_data" in result_item) route_datas.push(result_item.route_data);
		return result;
	})({
		path,
		route: null,
		specificity: {
			type: 0,
			static_length: 0,
			position: 2
		}
	});
	return route_datas;
}
/**
* Sorts the routes in the given result.
* @param result The result to sort.
*/
function sortRoutes(result) {
	result.sort((a, b) => {
		if (a.specificity.type !== b.specificity.type) return a.specificity.type - b.specificity.type;
		if (a.specificity.static_length !== b.specificity.static_length) return b.specificity.static_length - a.specificity.static_length;
		if (a.specificity.position !== b.specificity.position) return a.specificity.position - b.specificity.position;
		return 0;
	});
}
//#endregion
Object.defineProperty(exports, "HyperAPIDriver", {
	enumerable: true,
	get: function() {
		return HyperAPIDriver;
	}
});
Object.defineProperty(exports, "__toESM", {
	enumerable: true,
	get: function() {
		return __toESM;
	}
});
Object.defineProperty(exports, "getRoutes", {
	enumerable: true,
	get: function() {
		return getRoutes;
	}
});
Object.defineProperty(exports, "hasCommonKeys", {
	enumerable: true,
	get: function() {
		return hasCommonKeys;
	}
});
Object.defineProperty(exports, "isHyperApiMethod", {
	enumerable: true,
	get: function() {
		return isHyperApiMethod;
	}
});
Object.defineProperty(exports, "isRecord", {
	enumerable: true,
	get: function() {
		return isRecord;
	}
});
