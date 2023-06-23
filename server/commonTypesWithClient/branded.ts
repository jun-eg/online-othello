import type { z } from 'zod';

type Branded<T extends string> = string & z.BRAND<T>; //幽霊型

export type UserId = Branded<'UserId'>;

export type TaskId = Branded<'TaskId'>;

export type RoomId = Branded<'RoomId'>;
