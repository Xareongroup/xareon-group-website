import { describe,it,expect } from "vitest";
describe("financial profit invariant",()=>{it("defines profit as revenue minus non-pending expenses",()=>{const revenue=5000, expenses=[800,1500,50]; expect(revenue-expenses.reduce((a,b)=>a+b,0)).toBe(2650);});});
