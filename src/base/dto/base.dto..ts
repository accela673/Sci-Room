export abstract class BaseDto {
  static parse<T extends BaseDto>(obj: object, baseDto: T): T {
    Object.keys(obj).forEach((key: string) => {
      baseDto[key] = obj[key];
    });
    return baseDto;
  }

  getKeys() {
    return Object.keys(this);
  }
}
