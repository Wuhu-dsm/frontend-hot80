export interface CodingManInstance {
  eat(food: string): CodingManInstance
  sleep(seconds: number): CodingManInstance
  sleepFirst(seconds: number): CodingManInstance
}

export function CodingMan(name: string): CodingManInstance {
  void name
  throw new Error('Not implemented')
}
