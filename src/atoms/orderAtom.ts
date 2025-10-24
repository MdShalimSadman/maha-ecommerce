// src/atoms/orderAtom.ts
import { atom } from 'jotai';

// Atom to temporarily hold the last successfully placed order ID
export const orderIdAtom = atom<string | null>(null);