"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    _model;
    constructor(model) {
        this._model = model;
    }
    async create(item) {
        const createdItem = new this._model(item);
        return await createdItem.save();
    }
    async update(id, item) {
        return await this._model.findByIdAndUpdate(id, item, { new: true }).exec();
    }
    async delete(id) {
        const result = await this._model.findByIdAndDelete(id).exec();
        return result !== null;
    }
    async findById(id) {
        return await this._model.findById(id).exec();
    }
    async findAll() {
        return await this._model.find().exec();
    }
}
exports.BaseRepository = BaseRepository;
