import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors';
import { pool } from './db/db';
import { saleItemController } from './modules/sale-item/controllers/sale-item.controller';
import { brandController } from "./modules/sale-item/controllers/brand.controller";

const app = new Elysia()
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }))
  .use(saleItemController)
  .use(brandController)
  .get("/", () => "Hello Elysia! Ready for Lyxia Mobile Backend.")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);