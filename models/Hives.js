var database = require(__dirname+"/../lib/Database.js"), Orm = database.getOrm();

module.exports = {

    model : {
        id:          Orm.INTEGER,
        title:       Orm.STRING,
        description: Orm.STRING,
        created_on:  Orm.DATE,
        created_by:  Orm.INTEGER,
        modified_on: Orm.DATE,
        modified_by: Orm.INTEGER,
        tenant_id:   Orm.INTEGER
    },
    relations : {

    },
    options : {

    }

}