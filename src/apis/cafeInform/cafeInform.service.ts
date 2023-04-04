import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, In, Like, Repository,Any } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { CafeInform } from './entities/cafeInform.entity';
import { CafeImage } from '../cafeImage/entities/cafeImage.entity';
import { CafeMenuImage } from '../cafemenuimage/entities/cafemenuimage.entity';
import { CafeTag } from '../cafeTag/entities/cafeTag.entity';
import { PickList } from '../pickList/entities/pickList.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CafeInformService {
  constructor(
    @InjectRepository(CafeInform)
    private readonly cafeInformrRepository: Repository<CafeInform>, //

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(CafeImage)
    private readonly cafeImageRepository: Repository<CafeImage>,

    @InjectRepository(CafeMenuImage)
    private readonly menuImageRepository: Repository<CafeMenuImage>,

    @InjectRepository(CafeTag)
    private readonly cafeTagRepository: Repository<CafeTag>,

    @InjectRepository(PickList)
    private readonly pickListRepository: Repository<PickList>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne({ cafeInformID }) {
    const result = await this.cafeInformrRepository.findOne({
      where: {
        id: cafeInformID,
      },
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
    });

    return result;
  }

  async update({ updateCafeInform, CafeInformID, context }) {
    const { cafeTag, menu_imageUrl, cafe_imageUrl, ...CafeInform } =
      updateCafeInform;
    const cafeinform = await this.cafeInformrRepository.findOne({
      where: {
        id: CafeInformID,
      },
      relations: ['cafeTag', 'owner'],
    });
    if (cafeinform.owner.id !== context.req.user.id) {
      throw new ConflictException('자신의 카페만 수정이 가능합니다.');
    }
    if (menu_imageUrl) {
      await this.menuImageRepository.delete({
        cafeInform: { id: cafeinform.id },
      });
      await Promise.all(
        menu_imageUrl.map(async (el) => {
          await this.menuImageRepository.save({
            menu_imageUrl: el,
            cafeInform: {
              ...cafeinform,
            },
          });
        }),
      );
    }

    if (cafe_imageUrl) {
      const arr = [];
      const result = await this.cafeImageRepository.find({
        where: {
          cafeInform: { id: CafeInformID },
        },
      });
      for (let i = 0; i < result.length; i++) {
        if (result[i].is_main !== false) {
          arr.push(result[i].cafe_image);
        } else {
          arr.unshift(result[i].cafe_image);
        }
      }
      cafe_imageUrl.concat(arr);
      await Promise.all(
        cafe_imageUrl.map(async (el, i) => {
          await this.cafeImageRepository.save({
            cafe_image: el,
            is_main: i === 0 ? true : false,
            cafeInform: {
              ...cafeinform,
            },
          });
        }),
      );
    }
    const temp = [];
    if (cafeTag) {
      for (let i = 0; i < cafeTag.length; i++) {
        const tagName = cafeTag[i].replace('#', '');

        const prevTag = await this.cafeTagRepository.findOne({
          where: {
            tagName: tagName,
          },
        });

        if (prevTag) {
          temp.push(prevTag);
        } else {
          const newTag = await this.cafeTagRepository.save({
            tagName: tagName,
          });
          temp.push(newTag);
        }
      }
    }
    if (temp.length > 0) {
      return this.cafeInformrRepository.save({
        ...cafeinform,
        ...CafeInform,
        cafeTag: temp,
        thumbnail: cafe_imageUrl[0],
      });
    } else {
      return this.cafeInformrRepository.save({
        ...cafeinform,
        ...CafeInform,
        cafeTag: [...cafeinform.cafeTag, ...temp],
        thumbnail: cafe_imageUrl[0],
      });
    }
  }
  async create({ cafeInformInput, OwnerId }) {
    // 이메일 인증 버튼 및 중복확인, 체크까지
    const { menu_imageUrl, cafe_imageUrl, cafeTag, ...cafeInform } =
      cafeInformInput;
    const Owner = await this.ownerRepository.findOne({
      where: {
        id: OwnerId,
      },
    });

    if (Owner.is_cafeInform === true) {
      throw new ConflictException('이미 한개의 카페가 존재합니다.');
    }

    const temp = [];

    for (let i = 0; i < cafeTag.length; i++) {
      const tagName = cafeTag[i].replace('#', '');

      const prevTag = await this.cafeTagRepository.findOne({
        where: {
          tagName: tagName,
        },
      });

      if (prevTag) {
        temp.push(prevTag);
      } else {
        const newTag = await this.cafeTagRepository.save({
          tagName: tagName,
        });
        temp.push(newTag);
      }
    }

    const result2 = await this.cafeInformrRepository.save({
      ...cafeInform,
      owner: {
        ...Owner,
      },
      thumbNail: cafe_imageUrl[0],
      cafeTag: temp,
    });
    await this.ownerRepository.save({
      ...Owner,
      is_cafeInform: true,
    });

    await Promise.all(
      menu_imageUrl.map((el) =>
        this.menuImageRepository.save({
          menu_imageUrl: el,
          cafeInform: {
            ...result2,
          },
        }),
      ),
    );

    await Promise.all(
      cafe_imageUrl.map((el, i) =>
        this.cafeImageRepository.save({
          cafe_image: el,
          is_main: i === 0 ? true : false,
          cafeInform: {
            ...result2,
          },
        }),
      ),
    );
    return result2;
  }

  async pickcafe({ CafeInformID, UserID }) {
    const cafeInform = await this.cafeInformrRepository.findOne({
      where: {
        id: CafeInformID,
      },
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
    });
    const user = await this.userRepository.findOne({
      where: {
        id: UserID,
      },
    });

    if (!user) {
      throw new ConflictException('가맹주는 찜을 할 수 없습니다.');
    }

    const pickList = await this.pickListRepository.findOne({
      where: {
        user: { id: UserID },
        cafeInform: { id: CafeInformID },
      },
      relations: ['user', 'cafeInform', 'cafeInform.cafeTag'],
    });
    if (pickList) {
      await this.pickListRepository.delete({ id: pickList.id });
      if (cafeInform.like > 0) {
        await this.cafeInformrRepository.update(
          {
            id: CafeInformID,
          },
          {
            like: cafeInform.like - 1,
          },
        );
      } else {
      }

      const updatedCafeInform = await this.cafeInformrRepository.findOne({
        where: {
          id: CafeInformID,
        },
      });

      return updatedCafeInform.like;
    } else {
      await this.cafeInformrRepository.update(
        {
          id: CafeInformID,
        },
        {
          like: cafeInform.like + 1,
        },
      );

      const updatedCafeInform = await this.cafeInformrRepository.findOne({
        where: {
          id: CafeInformID,
        },
      });
      await this.pickListRepository.save({
        cafeInform: {
          ...updatedCafeInform,
        },
        user: {
          ...user,
        },
      });

      return updatedCafeInform.like;
    }
  }
  async findCafeInformWithTags({ Tags, page }) {
    const result = await this.cafeInformrRepository.find({
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
      where: {
        cafeTag: {
          tagName: In(Tags)
        },
        
      },
      order: {
        createdAt: 'DESC',
      },
      take: 10,
      skip: page === undefined ? 0 : (page - 1) * 10,
    });

    return result
    
  }

  async findCafeInformWithLocation({ Location, page }) {
    const result = await this.cafeInformrRepository.find({
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
      where: [
        {cafeAddr: Like(`%${Location}%`)},
        {detailAddr: Like(`%${Location}%`)}
      ],
      take: 10,
      skip: page === undefined ? 0 : (page - 1) * 10,
      order: {
        createdAt: 'DESC',
      },
    });
    return result
   
  }

  async deleteCafeInform({ cafeInformID, context }) {
    const resultCafe = await this.cafeInformrRepository.findOne({
      where: {
        id: cafeInformID,
      },
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
    });
    if (resultCafe.owner.id !== context.req.user.id) {
      throw new ConflictException('자신의 카페만 삭제 가능합니다.');
    }
    const result = await this.cafeInformrRepository.delete({
      id: cafeInformID,
    });
    return result.affected ? true : false;
  }
  async findBestCafe() {
    const result = await this.cafeInformrRepository.find({
      order: {
        like: 'DESC',
      },
      take:5,
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
    });

    return result;
  }
  async findAll({ page }) {
    const result = await this.cafeInformrRepository.find({
      take: 10,
      skip: page === undefined ? 0 : (page - 1) * 10,
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
    });
    return result;
  }
  async findCafeWithLocationAndTag({ Location, Tags, page }) {
    if (Location && Tags.length === 0) {
      console.log("지역만")
      const result = await this.findCafeInformWithLocation({ Location, page });
      return result;
    } else if (!Location && Tags.length > 0) {
      console.log("태그만")
      const result = await this.findCafeInformWithTags({ Tags, page });

      return result;
    } else if (Location && Tags.length > 0) {
      console.log("두개다")
      return this.cafeInformrRepository
      .createQueryBuilder('cafeInform')
      .innerJoinAndSelect('cafeInform.cafeTag','cafeTag')
      .innerJoinAndSelect('cafeInform.owner','owner')
      .innerJoinAndSelect('cafeInform.cafeImage','cafeImage')
      .innerJoinAndSelect('cafeInform.cafeMenuImage','cafeMenuImage')
      .where('cafeTag.tagName In (:...Tags)',{Tags})
      .andWhere('cafeInform.cafeAddr Like :Location OR cafeInform.detailAddr Like :Location',{Location : `%${Location}%`})
      .take(10)
      .skip((page-1) * 10)
      .getMany()
    } else {
      const result = await this.findAll({ page });
      return result;
    }
  }

  // async test(location,tags){
  //   return this.cafeInformrRepository
  //     .createQueryBuilder('cafeInform')
  //     .innerJoinAndSelect('cafeInform.cafeTag','cafeTag')
  //     .innerJoinAndSelect('cafeInform.owner','owner')
  //     .innerJoinAndSelect('cafeInform.cafeImage','cafeImage')
  //     .innerJoinAndSelect('cafeInform.cafeMenuImage','cafeMenuImage')
  //     .where('cafeInform.cafeAddr Like :location',{location : `%${location}%`})
  //     .orWhere('cafeInform.detailAddr Like :location',{location : `%${location}%`})
  //     .andWhere('cafeTag.tagName In (:...tags)',{tags})
  //     .getMany()
  // }

  async findMyCafes({ ownerID, page }) {
    const result = await this.cafeInformrRepository.find({
      where: {
        owner: { id: ownerID },
      },
      relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
      order: {
        createdAt: 'DESC',
      },
      take: 10,
      skip: page === undefined ? 0 : (page - 1) * 10,
    });
    return result;
  }
  async findCafeByName({ name, page, Location }) {
    if (name && !Location) {
      const result = await this.cafeInformrRepository.find({
        where: {
          owner: {
            brandName: Like(`%${name}%`),
          },
        },
        relations: ['cafeTag', 'owner', 'cafeImage', 'cafeMenuImage'],
        take: 10,
        skip: page === undefined ? 0 : (page - 1) * 10,
        order: {
          createdAt: 'DESC',
        },
      });
      return result;
    } else if (!name && Location) {
      const result = await this.findCafeInformWithLocation({ Location, page });
      return result;
    } else if (name && Location) {
      return this.cafeInformrRepository
      .createQueryBuilder('cafeInform')
      .innerJoinAndSelect('cafeInform.cafeTag','cafeTag')
      .innerJoinAndSelect('cafeInform.owner','owner')
      .innerJoinAndSelect('cafeInform.cafeImage','cafeImage')
      .innerJoinAndSelect('cafeInform.cafeMenuImage','cafeMenuImage')

    } else {
      const result = await this.findAll({ page });
      return result;
    }
  }
}
