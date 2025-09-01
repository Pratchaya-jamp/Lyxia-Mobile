import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors';
import { pool } from './db/db';

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia! Ready for Lyxia Mobile Backend.")
  .get("/v1/sale-items", async () => {
    try {
      const query = `
        SELECT
            si.id,
            si.model,
            bb.name AS brandName,
            si.price,
            si.ramGb,
            si.storageGb,
            si.color
        FROM
            sale_item_base AS si
        JOIN
            brand_base AS bb ON si.brand_id = bb.id;
      `;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('Error fetching sale items:', error);
      // ในการพัฒนาจริง อาจจะส่ง HTTP 500 กลับไป
      throw new Error("Failed to retrieve sale items.");
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);