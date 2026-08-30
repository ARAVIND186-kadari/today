const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const config = require('../config/env');
const orchestrator = require('../agents/orchestrator');

let bullQueue = null;
let bullWorker = null;
let isRedisConnected = false;

// In-Memory Queue Fallback
class InMemoryQueue {
  constructor() {
    this.jobs = [];
    this.isProcessing = false;
  }

  async add(name, data) {
    console.log(`[InMemoryQueue] Enqueued job '${name}' with executionId: ${data.executionId}`);
    this.jobs.push({ name, data, id: `job_${Date.now()}_${Math.random()}` });
    this.processNext();
    return { id: `mem_${Date.now()}` };
  }

  async processNext() {
    if (this.isProcessing || this.jobs.length === 0) return;
    this.isProcessing = true;

    const job = this.jobs.shift();
    if (job) {
      try {
        console.log(`[InMemoryQueue] Processing job ${job.id} for execution ${job.data.executionId}...`);
        await orchestrator.runExecution(job.data.executionId);
      } catch (err) {
        console.error(`[InMemoryQueue] Job ${job.id} execution failed:`, err.message);
      }
    }

    this.isProcessing = false;
    if (this.jobs.length > 0) {
      setTimeout(() => this.processNext(), 50);
    }
  }
}

const inMemoryQueue = new InMemoryQueue();

const initQueue = async () => {
  try {
    const redisClient = new Redis(config.redisUrl, {
      maxRetriesPerRequest: null,
      connectTimeout: 2000,
      retryStrategy: () => null, // Don't hang on connection failure
    });

    redisClient.on('connect', () => {
      console.log('[Queue] Connected to Redis successfully.');
      isRedisConnected = true;
    });

    redisClient.on('error', (err) => {
      console.warn(`[Queue] Redis unavailable (${err.message}). Using In-Memory Job Queue fallback.`);
      isRedisConnected = false;
    });

    // Test ping
    await redisClient.ping();

    bullQueue = new Queue('workflow_executions', {
      connection: redisClient,
    });

    bullWorker = new Worker(
      'workflow_executions',
      async (job) => {
        console.log(`[BullMQ Worker] Picked up job ${job.id} for execution ${job.data.executionId}`);
        await orchestrator.runExecution(job.data.executionId);
      },
      { connection: redisClient, concurrency: 5 }
    );

    bullWorker.on('completed', (job) => {
      console.log(`[BullMQ Worker] Job ${job.id} completed.`);
    });

    bullWorker.on('failed', (job, err) => {
      console.error(`[BullMQ Worker] Job ${job?.id} failed:`, err.message);
    });

    isRedisConnected = true;
  } catch (err) {
    console.warn('[Queue] Redis setup skipped or offline. In-Memory execution queue active.');
    isRedisConnected = false;
  }
};

const addExecutionJob = async ({ executionId }) => {
  if (isRedisConnected && bullQueue) {
    try {
      return await bullQueue.add(
        'run_workflow',
        { executionId },
        {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: false,
        }
      );
    } catch (e) {
      console.warn('[Queue] BullMQ dispatch failed, falling back to In-Memory queue:', e.message);
    }
  }

  // Use in-memory queue fallback
  return inMemoryQueue.add('run_workflow', { executionId });
};

module.exports = {
  initQueue,
  addExecutionJob,
};
