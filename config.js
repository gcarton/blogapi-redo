exports.DATABASE_URL =Db.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/blogapi-redo';
exports.PORT = process.env.PORT || 8080;

