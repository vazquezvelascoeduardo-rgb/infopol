// Munta la sincronització del progrés cap a Supabase (només amb sessió).
// No renderitza res.
import { useProgressSync } from '../lib/syncProgress';

export default function ProgressSync() {
  useProgressSync();
  return null;
}
