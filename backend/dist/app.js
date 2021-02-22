'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var PORT = 3000;

app.listen(PORT, function () {
    console.log('Server is running at PORT ' + PORT);
});

app.get('/', function (req, res) {
    res.json({
        msg: 'Welcome to Backend!'
    });
});
//# sourceMappingURL=app.js.map