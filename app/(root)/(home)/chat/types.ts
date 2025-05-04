// components/types.ts
export type Message = {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    file: string | null;
  };
  
  // components/types.ts
export type Chat = {
  id: string;
  name: string;
  messages: Message[];
};
