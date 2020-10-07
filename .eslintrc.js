module.exports = {
    "root": true,
    "env": {
        "node": true,
        "es6": true,
        "jest": true,
    },
    "extends": "airbnb",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'max-len': ['error', { code: 120 }],
        'linebreak-style': 0,
        'no-unused-vars': ['error', { 'args': 'after-used' }],
        'object-curly-newline': ['error', {
          'consistent': true,
        }],
        'import/extensions': ['error', 'ignorePackages', { 'js':  'never' }],
    },
};
