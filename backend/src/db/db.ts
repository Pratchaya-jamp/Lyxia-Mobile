import mysql from 'mysql2/promise';

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // เปลี่ยนเป็น username ของคุณ
    password: '@june3009', // เปลี่ยนเป็น password ของคุณ
    database: 'itb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("Database pool created and ready to connect.");