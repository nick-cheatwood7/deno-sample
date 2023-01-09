import { load } from "./deps.ts";
import { Application, Router } from "oak";

console.log("Hello world");

const envData = await load();
console.log("Variable from env file:", envData["ENV_VAR"]);

const app = new Application();
const router = new Router();

// Logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

router.get("/api/healthcheck", (ctx) => {
    ctx.response.status = 200;
    ctx.response.type = "application/json";
    ctx.response.body = {
        message: "Hello world!"
    };
});

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 4000 });
