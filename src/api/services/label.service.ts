import Label, {LabelInput} from '../../database/models/Label';

export const createLabel = async (payload: LabelInput): Promise<Label> => {
    const label = await Label.create(payload)
    return label
}

export const getAllLabels = async (): Promise<Label[]> => {
    return Label.findAll();
}

export const addBulkLabels = async (payload: LabelInput[]): Promise<Label[]> => {
    const labels = await Label.bulkCreate(payload)
    return labels
} 