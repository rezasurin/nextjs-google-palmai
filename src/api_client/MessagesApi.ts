import { MessagesProps } from "@/store/chats";
import { useMutation, useQueryClient } from "react-query";

export const sendMessage = async (messages: MessagesProps): Promise<any> => {
  // const body = JSON.stringify(messages);
  const response = await fetch(`http://localhost:3000/api/palmai`, {
    body: JSON.stringify(messages),
    method: 'POST'
  })

  const resBody = await response.json()
  return resBody
}


export const useSendMessage = () => {
  const queryClient = useQueryClient()
  return useMutation(sendMessage, {
    onSuccess: (messages: MessagesProps) => {
      queryClient.setQueryData(['messages'], (prev) => {
        
        console.log(messages, prev, '<<< cekqueryresult')
      })
    }
  })
} 