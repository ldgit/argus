module.exports = {
    "extends": "airbnb-base",
    "env": {
        "mocha": true,
        "node": true
    },
    "rules": {
        "no-use-before-define": ["error", { "functions": false, "classes": true }]
    }
};
