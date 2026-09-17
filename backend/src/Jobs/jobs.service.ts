
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './jobs.entity';
import { CreateJobDto } from './DTO/create-job-dto';
import { updateJobStatusDto } from './DTO/update-status-dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
  ) {}

  async createJob(data: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create({
      title: data.title,
      type: data.type,
      status: 'pending',
    });

    return this.jobsRepository.save(job);
  }

  async getAllJobs(): Promise<Job[]> {
    return this.jobsRepository.find();
  }

  async updateStatus(
  id: string,
  data: updateJobStatusDto,
): Promise<Job> {
  const jobId = Number(id);
  const newStatus = data.Status;

  if (!Number.isInteger(jobId)) {
    throw new BadRequestException('Invalid job ID');
  }

  let requiredCurrentStatus: string;

  if (newStatus === 'running') {
    requiredCurrentStatus = 'pending';
  } else if (
    newStatus === 'completed' ||
    newStatus === 'failed'
  ) {
    requiredCurrentStatus = 'running';
  } else {
    throw new BadRequestException('Invalid status');
  }

  const result = await this.jobsRepository.update(
    {
      id: jobId,
      status: requiredCurrentStatus,
    },
    {
      status: newStatus,
    },
  );

  if (result.affected === 0) {
    const job = await this.jobsRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    throw new BadRequestException(
      `Invalid status transition: ${job.status} → ${newStatus}`,
    );
  }

  const updatedJob = await this.jobsRepository.findOne({
    where: { id: jobId },
  });

  if (!updatedJob) {
    throw new NotFoundException('Job not found');
  }

  return updatedJob;
}

  // async updateStatus(
  //   id: string,
  //   data: updateJobStatusDto,
  // ): Promise<Job> {
  //   const job = await this.jobsRepository.findOne({
  //     where: { id: Number(id) },
  //   });

  //   if (!job) {
  //     throw new NotFoundException('Job not found');
  //   }

  //   const currentStatus = job.status;
  //   const newStatus = data.Status;

  //   const validTransition =
  //     (currentStatus === 'pending' && newStatus === 'running') ||
  //     (currentStatus === 'running' &&
  //       (newStatus === 'completed' || newStatus === 'failed'));

  //   if (!validTransition) {
  //     throw new BadRequestException(
  //       `Invalid status transition: ${currentStatus} → ${newStatus}`,
  //     );
  //   }

  //   job.status = newStatus;

  //   return this.jobsRepository.save(job);
  // }

  async deleteJob(id: string ){

  const job = await this.jobsRepository.findOne({
    where: {id: Number(id)}
  });

  if (!job) {
   throw new NotFoundException('Job not found');
}
return this.jobsRepository.remove(job)
}
}


