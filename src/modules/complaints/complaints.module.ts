import { Module } from "@nestjs/common";
import { ComplaintsController } from "./complaints.controller";
import { ComplaintsRepository } from "./complaints.repository";
import { ComplaintsService } from "./complaints.service";
import { CreateComplaintsUseCase } from "./useCases/complaints.create.usecase";
import { GetComplaintsUseCase } from "./useCases/complaints.get.usecase";
import { MongooseModule } from "@nestjs/mongoose";
import { Complaints, ComplaintsSchema } from "database/schemas/complaints.schema";
import { ComplainsValidator } from "./validators/complaints.validator";


@Module({
    controllers: [ComplaintsController],
    providers: [
        ComplainsValidator,
        ComplaintsRepository,
        ComplaintsService,
        CreateComplaintsUseCase,
        GetComplaintsUseCase
    ],
    imports: [
        MongooseModule.forFeature([{ name: Complaints.name, schema: ComplaintsSchema }]),
    ],
    exports: [ComplaintsService],
})
export class ComplaintsModule { }