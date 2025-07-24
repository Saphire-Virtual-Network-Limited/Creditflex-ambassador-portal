declare module 'naija-state-local-government' {
  interface StateData {
    state: string;
    capital: string;
    lgas: string[];
    senatorial_districts: string[];
  }
  
  interface NaijaStates {
    all(): StateData[];
    states(): string[];
    senatorial_districts(state: string): string[];
    lgas(state: string): StateData | undefined;
  }
  
  const naijaStates: NaijaStates;
  export default naijaStates;
} 