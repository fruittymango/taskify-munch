export const AddTaskSchema = {
    body: {
        type: "object",
        required: ["title", "statusId"],
        properties: {
            title: { type: "string" },
            description: { type: "string" },
            statusId: { type: "number" },
            dueDate: { type: "string", format: "date" },
            labelId: { type: "number" },
            priorityId: { type: "number" },
            projectId: { type: "number" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                guid: { type: "string", format: "uuid" },
                title: { type: "string" },
                description: { type: "string" },
                statusId: { type: "number" },
                dueDate: { type: "string" },
                labelId: { type: "number" },
                priorityId: { type: "number" },
                projectId: { type: "number" },
            },
        },
    },
};

export const GetTaskSchema = {
    params: {
        type: "object",
        properties: {
            guid: { type: "string", format: "uuid" },
        },
        required: ["guid"],
    },
};

export const DeleteTaskSchema = {
    params: {
        type: "object",
        properties: {
            guid: { type: "string", format: "uuid" },
        },
        required: ["guid"],
    },
};

export const GetTasksSchema = {
    querystring: {
        type: "object",
        properties: {
            sort: { type: "string" },
            status: { type: "string" },
            ascending: { type: "boolean" },
            projectGuid: { type: "string", format: "uuid" },
        },
    },
};

export const UpdateTaskSchema = {
    params: {
        type: "object",
        properties: {
            guid: { type: "string", format: "uuid" },
        },
    },
    body: {
        type: "object",
        properties: {
            title: { type: "string" },
            description: { type: "string" },
            statusId: { type: "number" },
            dueDate: { type: "string" },
            labelId: { type: "number" },
            priorityId: { type: "number" },
            projectId: { type: "number" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                guid: { type: "string", format: "uuid" },
                title: { type: "string" },
                description: { type: "string" },
                statusId: { type: "number" },
                dueDate: { type: "string", format: "date" },
                labelId: { type: "number" },
                priorityId: { type: "number" },
                projectId: { type: "number" },
            },
        },
    },
};

export const PatchTaskSchema = {
    params: {
        type: "object",
        properties: {
            guid: { type: "string", format: "uuid" },
        },
        required: ["guid"],
    },
    body: {
        type: "object",
        properties: {
            title: { type: "string" },
            description: { type: "string" },
            statusId: { type: "number" },
            dueDate: { type: "string" },
            labelId: { type: "number" },
            priorityId: { type: "number" },
            projectId: { type: "number" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                title: { type: "string" },
                description: { type: "string" },
                statusId: { type: "number" },
                dueDate: { type: "string" },
                labelId: { type: "number" },
                priorityId: { type: "number" },
                projectId: { type: "number" },
            },
        },
    },
};
