import Label, { LabelInput } from "../../database/models/Label";
import { DatabaseRelatedError } from "../../helpers/errors";

export const createLabel = async (payload: LabelInput): Promise<Label> => {
    try {
        const label = await Label.create(payload);
        return label;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to add label.");
    }
};

export const getAllLabels = async (): Promise<Label[]> => {
    try {
        return Label.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });
    } catch (error) {
        throw new DatabaseRelatedError("Failed to available labels.");
    }
};

export const addBulkLabels = async (
    payload: LabelInput[]
): Promise<Label[]> => {
    try {
        const labels = await Label.bulkCreate(payload);
        return labels;
    } catch (error) {
        throw new DatabaseRelatedError("Failed to add bulk labels.");
    }
};
