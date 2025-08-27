import mysql from "mysql2/promise";

let connection: mysql.Connection;

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DATABASE,
      port: Number(process.env.DB_PORT) || 3306,
    });
  }
  return connection;
}
