var database = require(__dirname+"/../lib/Database.js"), Orm = database.getOrm();

Default =  {

    model : {

    },
    relations : {

    },
    options : {

        state : {

            limit  : 10,
            offset : 0,
            search : null,
            search_type : 'OR',
            sort    : "id",
            order   : "order",
            columns : ""

        }
    },
    where : { tenant_id : 1 }

}

module.exports = Default