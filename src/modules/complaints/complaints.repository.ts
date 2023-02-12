import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Complaints, ComplaintsDocument } from "database/schemas/complaints.schema";
import { Model } from "mongoose";
import { CreateComplaint } from "./dto/complaints.create.dto";
import { UtilsService } from "modules/utils/utils.service";
import { GetComplaint } from "./dto/complaints.get.dto";

@Injectable()
export class ComplaintsRepository {
    constructor(
        @InjectModel(Complaints.name) private complaintsModel: Model<ComplaintsDocument>,
        private readonly utils: UtilsService
    ) { }
    create(body: CreateComplaint) {
        const userModel = new this.complaintsModel({ ...body, updated_at: new Date(this.utils.dateTimeZoneBrasil()), reviewed: false });
        return userModel.save()
    }
    findAll(dto: GetComplaint) {
        const { limit, page, ...query } = dto
        let r: any = this.complaintsModel
            .find()
        r = this.utils.applyFilter(query, r)
        return r.skip((dto.page - 1) * dto.limit)
            .sort({ _id: 'desc' })
            .limit(dto.limit)
            .exec()
    }
}