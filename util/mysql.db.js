const mysql = require('mysql2');
const config = require('../config/db.config');

const pool = mysql.createPool(config);

const query = (sql, params, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err);
            return;
        }

        connection.query(sql, params, (err, rows) => {
            if (err) {
                callback(err);
            } else {
                callback(null, rows);
            }
        });
        connection.release();
    });
};

const executeTransaction = (queries, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err);
            return;
        }

        connection.beginTransaction((err) => {
            if (err) {
                callback(err);
                connection.release();
                return;
            }

            const executeQuery = (query, params, next) => {
                connection.query(query, params, (err, result) => {
                    if (err) {
                        next(err);
                    } else {
                        next(null, result);
                    }
                });
            };

            const executeQueries = (currentIndex) => {
                if (currentIndex >= queries.length) {
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                callback(err, null); // Provide err and null result
                                connection.release();
                            });
                        } else {
                            callback(null, 'Transaction successful'); // Provide null err and success message
                            connection.release();
                        }
                    });
                } else {
                    const { sql, params } = queries[currentIndex];
                    executeQuery(sql, params, (err, result) => {
                        if (err) {
                            connection.rollback(() => {
                                callback(err); // Provide err without result
                                connection.release();
                            });
                        } else {
                            executeQueries(currentIndex + 1);
                        }
                    });
                }
            };

            executeQueries(0);
        });
    });
};

module.exports = { query, executeTransaction };
