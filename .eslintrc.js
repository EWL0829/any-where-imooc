module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true,
		"node": true,
	},
	"rules": {
		"no-console": ["error", {
			"allow": ["error", "info", "warn"]
		} ]
	},
	"extends": "eslint:recommended",
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly",
	},
	"parser": "babel-eslint",
	"parserOptions": {
		"ecmaVersion": 2018,
	},
};
