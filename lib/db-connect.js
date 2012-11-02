exports = mongoose = require('mongoose');
mongoose.connect(config_db.uri);
mongoose.set('debug', config_db.debug);
exports = Schema = mongoose.Schema;