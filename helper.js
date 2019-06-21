const pg = require("pg");

var createClient = async function () {
    var connectionString = "postgres://postgres:admin@localhost:5432/project_guide";
    return new pg.Client(connectionString);
}

exports.createClient = createClient;