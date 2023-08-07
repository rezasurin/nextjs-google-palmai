import { atom } from 'recoil'

export type MessagesProps = Array<{role: string; content: string }>;

export const chatsState = atom<MessagesProps>({
  key: 'chat',
  default: []
})