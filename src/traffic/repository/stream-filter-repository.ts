/**
 * Stream Filter Repository
 * 
 * Repository for StreamFilter entity database operations.
 * Loads filters configured for streams.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Repository/StreamFilterRepository.php
 */

import { getDb } from '@/lib/db';
import { StreamFilter, FilterModeValue, FilterMode, type StreamFilterData } from '../model/stream-filter';

/**
 * Stream filter repository for database operations
 */
export class StreamFilterRepository {
  private static _instance: StreamFilterRepository | null = null;

  /**
   * Get singleton instance
   */
  static getInstance(): StreamFilterRepository {
    if (!StreamFilterRepository._instance) {
      StreamFilterRepository._instance = new StreamFilterRepository();
    }
    return StreamFilterRepository._instance;
  }

  /**
   * Reset singleton
   */
  static reset(): void {
    StreamFilterRepository._instance = null;
  }

  /**
   * Find all filters for a stream
   */
  async findByStreamId(streamId: number): Promise<StreamFilter[]> {
    const db = getDb();
    const rows = await db.streamFilter.findMany({
      where: { streamId }
    });

    return rows.map(row => this._mapToEntity(row));
  }

  /**
   * Find all filters for multiple streams
   */
  async findByStreamIds(streamIds: number[]): Promise<Map<number, StreamFilter[]>> {
    const db = getDb();
    const rows = await db.streamFilter.findMany({
      where: {
        streamId: { in: streamIds }
      }
    });

    const result = new Map<number, StreamFilter[]>();
    for (const row of rows) {
      const streamId = row.streamId;
      if (streamId === null) continue;
      
      if (!result.has(streamId)) {
        result.set(streamId, []);
      }
      result.get(streamId)!.push(this._mapToEntity(row));
    }

    return result;
  }

  /**
   * Find filter by ID
   */
  async findById(id: number): Promise<StreamFilter | null> {
    const db = getDb();
    const row = await db.streamFilter.findUnique({
      where: { id }
    });

    return row ? this._mapToEntity(row) : null;
  }

  /**
   * Create a new stream filter
   */
  async create(data: Partial<StreamFilterData>): Promise<StreamFilter> {
    const db = getDb();
    const row = await db.streamFilter.create({
      data: {
        streamId: data.streamId ?? 0,
        name: data.name ?? '',
        mode: data.mode ?? FilterMode.ACCEPT,
        payload: data.payload ? JSON.stringify(data.payload) : null
      }
    });

    return this._mapToEntity(row);
  }

  /**
   * Update a stream filter
   */
  async update(id: number, data: Partial<StreamFilterData>): Promise<StreamFilter> {
    const db = getDb();
    const updateData: Record<string, unknown> = {};
    
    if (data.streamId !== undefined) updateData.streamId = data.streamId;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.mode !== undefined) updateData.mode = data.mode;
    if (data.payload !== undefined) updateData.payload = JSON.stringify(data.payload);

    const row = await db.streamFilter.update({
      where: { id },
      data: updateData
    });

    return this._mapToEntity(row);
  }

  /**
   * Delete a stream filter
   */
  async delete(id: number): Promise<void> {
    const db = getDb();
    await db.streamFilter.delete({
      where: { id }
    });
  }

  /**
   * Delete all filters for a stream
   */
  async deleteByStreamId(streamId: number): Promise<void> {
    const db = getDb();
    await db.streamFilter.deleteMany({
      where: { streamId }
    });
  }

  /**
   * Map database row to StreamFilter entity
   */
  private _mapToEntity(row: { id: bigint | number; streamId: bigint | number | null; name: string; mode: string; payload: string | null }): StreamFilter {
    let payload: unknown = null;
    if (row.payload) {
      try {
        payload = JSON.parse(row.payload);
      } catch {
        payload = row.payload;
      }
    }

    return new StreamFilter({
      id: Number(row.id),
      streamId: Number(row.streamId ?? 0),
      name: row.name,
      mode: row.mode as FilterModeValue,
      payload
    });
  }
}
