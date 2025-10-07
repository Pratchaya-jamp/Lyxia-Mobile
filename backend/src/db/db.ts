import mysql from 'mysql2/promise';

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
export const pool = mysql.createPool({
    host: 'mysql-39fc22c0-sxu-dcc5.b.aivencloud.com',
    user: 'avnadmin', // เปลี่ยนเป็น username ของคุณ
    password: 'AVNS_3tl0juXutq9_ihSG2s8', // เปลี่ยนเป็น password ของคุณ
    database: 'itb',
    port: 26374, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

console.log("Database pool created and ready to connect.");
