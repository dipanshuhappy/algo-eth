import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'get_signature' : ActorMethod<
    [],
    { 'Ok' : { 'signature_hex' : string } } |
      { 'Err' : string }
  >,
  'public_key' : ActorMethod<
    [],
    { 'Ok' : { 'public_key_hex' : string } } |
      { 'Err' : string }
  >,
  'verify' : ActorMethod<
    [string, string, string],
    { 'Ok' : { 'is_signature_valid' : boolean } } |
      { 'Err' : string }
  >,
}
