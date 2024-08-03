import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { Post } from '../post/post.entity';
import { EntityService } from '../common/entity.service';

@Injectable()
export class TagService extends EntityService<Tag> {
  constructor(@InjectRepository(Tag) private service: Repository<Tag>) {
    super(service);
  }

  public async getPostsByTag(tag: string): Promise<Post[]> {
    const payload = await this.getOne({ name: tag }, ['posts']);
    return payload.posts;
  }
}
