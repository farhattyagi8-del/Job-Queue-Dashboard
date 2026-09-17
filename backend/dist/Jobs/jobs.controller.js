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
exports.JobsController = void 0;
const index_js_1 = require("@nestjs/common/decorators/http/index.js");
const create_job_dto_1 = require("./DTO/create-job-dto");
const jobs_service_1 = require("./jobs.service");
const index_js_2 = require("@nestjs/common/decorators/core/index.js");
const update_status_dto_1 = require("./DTO/update-status-dto");
let JobsController = class JobsController {
    jobsService;
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    createJob(data) {
        return this.jobsService.createJob(data);
    }
    getAllJobs() {
        return this.jobsService.getAllJobs();
    }
    updateStatus(id, data) {
        return this.jobsService.updateStatus(id, data);
    }
    deleteJob(id) {
        return this.jobsService.deleteJob(id);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, index_js_1.Post)(),
    __param(0, (0, index_js_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_dto_1.CreateJobDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "createJob", null);
__decorate([
    (0, index_js_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getAllJobs", null);
__decorate([
    (0, index_js_1.Patch)(':id/status'),
    __param(0, (0, index_js_1.Param)('id')),
    __param(1, (0, index_js_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.updateJobStatusDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "updateStatus", null);
__decorate([
    (0, index_js_1.Delete)(':id'),
    __param(0, (0, index_js_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "deleteJob", null);
exports.JobsController = JobsController = __decorate([
    (0, index_js_2.Controller)('jobs'),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map