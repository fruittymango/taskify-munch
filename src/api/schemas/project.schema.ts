export const AddProjectSchema = {
    body: {
        type: "object",
        required: ["title"],
        properties: {
            title: { type: "string" },
            description: { type: "string" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                guid: { type: "string" },
                title: { type: "string" },
                id: { type: "number" },
                description: { type: "string" },
            },
        },
    },
};

export const UpdateProjectSchema = {
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
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                guid: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
            },
        },
    },
};

export const ProjectGuidParamSchema = {
    params: {
        type: "object",
        required: ["guid"],
        properties: {
            guid: { type: "string", format: "uuid" },
        },
    },
};
