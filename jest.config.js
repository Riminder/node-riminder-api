module.exports = {
	"transform": {
		"^.+\\.ts?$": "ts-jest",
	},
	"testRegex": "__tests__/*.+(ts|tsx|js)$",
	"moduleFileExtensions": [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	],
	"globals": {
		"ts-jest": {
			"tsConfigFile": "tsconfig.json",
			"useBabelrc": true,
		}
	}
}