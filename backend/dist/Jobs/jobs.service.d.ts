import { Repository } from 'typeorm';
import { Job } from './jobs.entity';
import { CreateJobDto } from './DTO/create-job-dto';
import { updateJobStatusDto } from './DTO/update-status-dto';
export declare class JobsService {
    private readonly jobsRepository;
    constructor(jobsRepository: Repository<Job>);
    createJob(data: CreateJobDto): Promise<Job>;
    getAllJobs(): Promise<Job[]>;
    updateStatus(id: string, data: updateJobStatusDto): Promise<Job>;
    deleteJob(id: string): Promise<Job>;
}
