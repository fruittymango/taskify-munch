import Label, {LabelInput} from '../models/Label.model';

export const createLabel = async (payload: LabelInput): Promise<Label> => {
    const label = await Label.create(payload)
    return label
}

export const updateLabel = async (id: number, payload: Partial<LabelInput>): Promise<Label> => {
    const label = await Label.findByPk(id)
    if (!label) {
        // @todo throw custom error
        throw new Error('Label not found')
    }
    const updatedLabel = await (label as Label).update(payload)
    return updatedLabel
}

export const getLabelById = async (id: number): Promise<Label> => {
    const label = await Label.findByPk(id)
    if (!label) {
        // @todo throw custom error
        throw new Error('Label not found')
    }
    return label
}

export const deleteLabelById = async (id: number): Promise<boolean> => {
    const deletedLabelCount = await Label.destroy({
        where: {id}
    })
    return !!deletedLabelCount
}

export const getAllLabels = async (): Promise<Label[]> => {
    return Label.findAll();
}

export const addBulkLabels = async (payload: LabelInput[]): Promise<Label[]> => {
    const labels = await Label.bulkCreate(payload)
    return labels
} 