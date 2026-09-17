"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jobs_entity_1 = require("./jobs.entity");
let JobsService = class JobsService {
    jobsRepository;
    constructor(jobsRepository) {
        this.jobsRepository = jobsRepository;
    }
    async createJob(data) {
        const job = this.jobsRepository.create({
            title: data.title,
            type: data.type,
            status: 'pending',
        });
        return this.jobsRepository.save(job);
    }
    async getAllJobs() {
        return this.jobsRepository.find();
    }
    async updateStatus(id, data) {
        const jobId = Number(id);
        const newStatus = data.Status;
        if (!Number.isInteger(jobId)) {
            throw new common_1.BadRequestException('Invalid job ID');
        }
        let requiredCurrentStatus;
        if (newStatus === 'running') {
            requiredCurrentStatus = 'pending';
        }
        else if (newStatus === 'completed' ||
            newStatus === 'failed') {
            requiredCurrentStatus = 'running';
        }
        else {
            throw new common_1.BadRequestException('Invalid status');
        }
        const result = await this.jobsRepository.update({
            id: jobId,
            status: requiredCurrentStatus,
        }, {
            status: newStatus,
        });
        if (result.affected === 0) {
            const job = await this.jobsRepository.findOne({
                where: { id: jobId },
            });
            if (!job) {
                throw new common_1.NotFoundException('Job not found');
            }
            throw new common_1.BadRequestException(`Invalid status transition: ${job.status} → ${newStatus}`);
        }
        const updatedJob = await this.jobsRepository.findOne({
            where: { id: jobId },
        });
        if (!updatedJob) {
            throw new common_1.NotFoundException('Job not found');
        }
        return updatedJob;
    }
    async deleteJob(id) {
        const job = await this.jobsRepository.findOne({
            where: { id: Number(id) }
        });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        return this.jobsRepository.remove(job);
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(jobs_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JobsService);
//# sourceMappingURL=jobs.service.js.map