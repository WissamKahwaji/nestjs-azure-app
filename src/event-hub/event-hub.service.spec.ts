import { Test, TestingModule } from '@nestjs/testing';
import { EventHubService } from './event-hub.service';

describe('EventHubService', () => {
  let service: EventHubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventHubService],
    }).compile();

    service = module.get<EventHubService>(EventHubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
