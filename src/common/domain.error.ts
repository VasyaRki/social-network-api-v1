export class DomainError extends Error {
  public readonly name: string;
  public readonly domain: boolean;

  constructor(name: string, message: string) {
    super(message);

    this.name = name;
    this.domain = true;
  }
}
