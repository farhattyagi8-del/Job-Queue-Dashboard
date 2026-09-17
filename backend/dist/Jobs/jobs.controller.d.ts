import { CreateJobDto } from "./DTO/create-job-dto";
import { Job } from "./jobs.entity";
import { JobsService } from "./jobs.service";
import { updateJobStatusDto } from "./DTO/update-status-dto";
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    createJob(data: CreateJobDto): Promise<Job>;
    getAllJobs(): Promise<CreateJobDto[]>;
    updateStatus(id: string, data: updateJobStatusDto): Promise<Job>;
    deleteJob(id: 'string'): Promise<Job>;
}
