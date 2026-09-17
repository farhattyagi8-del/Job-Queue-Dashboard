import { Post, Body, Get, Patch, Param, Delete } from "@nestjs/common/decorators/http/index.js";
import { CreateJobDto } from "./DTO/create-job-dto";
import { Job } from "./jobs.entity";
import { JobsService } from "./jobs.service";
import { Controller } from "@nestjs/common/decorators/core/index.js";
import { updateJobStatusDto } from "./DTO/update-status-dto";


@Controller('jobs')
export class JobsController {

  constructor(private readonly jobsService: JobsService) {}

  @Post()
  createJob(@Body() data: CreateJobDto): Promise<Job> {
    return this.jobsService.createJob(data);
  }


  @Get()
   getAllJobs(): Promise<CreateJobDto[]>{
    return this.jobsService.getAllJobs();
   }


@Patch(':id/status')
updateStatus(
  @Param('id') id: string,
  @Body() data: updateJobStatusDto,
): Promise<Job> {
  return this.jobsService.updateStatus(id, data);
}

@Delete(':id')
  deleteJob(@Param('id') id: 'string'){
    return this.jobsService.deleteJob(id)
  }
}




    


