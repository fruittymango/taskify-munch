import closeWithGrace from "close-with-grace";
import "./helpers/loadEnv";

import sequelizeConnection from "./database/setup";
import taskConstants from "./database/constants";

import {
    addBulkPriorities,
    getAllPriorities,
} from "./api/services/priority.service";
import { addBulkLabels, getAllLabels } from "./api/services/label.service";
import {
    addBulkStatuses,
    getAllStatuses,
} from "./api/services/statuses.service";

import fastify, { setUpRateLimiter } from "./app";

async function initializeDB() {
    await sequelizeConnection.authenticate();
    await sequelizeConnection.sync();

    const labelsExist = (await getAllLabels())?.length > 0;
    if (!labelsExist) await addBulkLabels(taskConstants.labels);

    const prioritiesExist = (await getAllPriorities())?.length > 0;
    if (!prioritiesExist) await addBulkPriorities(taskConstants.priorities);

    const statusesExist = (await getAllStatuses())?.length > 0;
    if (!statusesExist) await addBulkStatuses(taskConstants.statuses);

    fastify.log.info("Database connected..");
}

export async function startServer() {
    await initializeDB();

    fastify.listen(
        {
            port: +(process.env.PORT || 3000),
            listenTextResolver: (address) => {
                return `Task Munch server is listening at ${address}`;
            },
        },
        function (err, address) {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
        }
    );

    closeWithGrace({ delay: 1000 }, async ({ signal, err }) => {
        if (err) {
            fastify.log.error({ err }, "server closing due to error");
        } else {
            fastify.log.info(`${signal} received, server closing...`);
        }
        await stopServer();
        fastify.log.info("server closed!");
    });
}

export async function stopServer() {
    await sequelizeConnection.close();
    await fastify.close();
}

if (require.main === module) {
    startServer();
}
