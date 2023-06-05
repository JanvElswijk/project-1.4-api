module.exports = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_DATABASE || 'MijnWoongenoot',
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 600, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
}