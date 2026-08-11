export type Light = 'red' | 'green' | 'yellow'

export interface TrafficLightOptions {
  red: number
  green: number
  yellow: number
  onChange: (light: Light) => void
}

export function createTrafficLight(options: TrafficLightOptions): { start: () => void; stop: () => void } {
  void options
  throw new Error('Not implemented')
}
