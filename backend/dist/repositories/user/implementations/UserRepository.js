"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("../../base/implementations/BaseRepository");
const User_1 = require("../../../models/User");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.UserModel);
    }
    async findByEmail(email) {
        return await this._model.findOne({ email }).exec();
    }
    async findByEmailWithPassword(email) {
        // Select the password field which is normally excluded
        return await this._model.findOne({ email }).select('+password').exec();
    }
}
exports.UserRepository = UserRepository;
