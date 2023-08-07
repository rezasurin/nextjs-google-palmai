import { useSendMessage } from "@/api_client/MessagesApi";
import { chatsState } from "@/store/chats";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRecoilState } from 'recoil'
import MarkdownIt from 'markdown-it'

const RES_STRING = "Sure, here is a summary of the article \"Managing State with React Query\" by Franklin:\n\nReact Query is a state management library for React that is designed to be efficient, scalable, and easy to use. It provides a number of features that make it well-suited for managing state in React applications, including:\n\n* **Query caching:** React Query can cache data from the server, so that it does not need to be fetched every time a component is rendered. This can improve performance significantly, especially for applications with large amounts of data.\n* **Stale data handling:** React Query can automatically handle stale data, so that your application always displays the most up-to-date data. This is done by automatically refreshing the data when it becomes stale.\n* **Error handling:** React Query can automatically handle errors, so that your application does not crash when there is a problem fetching data from the server. This is done by automatically retrying the request if it fails.\n* **Reactivity:** React Query is reactive, so that changes to the data in the store are automatically reflected in the UI. This makes it easy to keep your application's state in sync with the data from the server.\n* **Hooks:** React Query integrates with React hooks, so that you can use it with the latest React features.\n\nTo use React Query, you first need to install it:\n\n```\nnpm install react-query\n```\n\nOnce you have installed React Query, you can start using it to manage state in your React applications. Here is an example of how to use React Query to fetch data from a REST API:\n\n```\nconst useQuery = (queryKey, variables) => {\n  const query = useQueryClient().getQuery(queryKey);\n  const isLoading = !query.isReady;\n  const data = query.data;\n  const error = query.error;\n\n  return {\n    isLoading,\n    data,\n    error\n  };\n};\n```\n\nThe `useQuery` hook takes two arguments: the query key and the variables. The query key is a string that identifies the query. The variables are an object that contains the values that will be passed to the query when it is executed.\n\nThe `useQuery` hook returns a state object that contains the following properties:\n\n* `isLoading`: A boolean that indicates whether the query is loading data.\n* `data`: The data that is returned by the query.\n* `error`: An error object if the query fails.\n\nYou can use the `useQuery` hook to fetch data from any REST API. For example, the following code fetches data from the GitHub API:\n\n```\nconst useGitHubData = () => {\n  const { data, error } = useQuery(\"github\");\n\n  return {\n    data,\n    error\n  };\n};\n```\n\nThe `useGitHubData` hook will fetch data from the GitHub API and store it in the `data` property of the state object. The `error` property will be set to an error object if the query fails.\n\nYou can then use the data in the `data` property to render your UI. For example, the following code renders a list of GitHub repositories:\n\n```\nconst App = () => {\n  const { data, error } = useGitHubData();\n\n  if (error) {\n    return <h1>Error fetching data from GitHub</h1>;\n  }\n\n  return (\n    <ul>\n      {data.repositories.map((repository) => (\n        <li key={repository.id}>{repository.name}</li>\n      ))}\n    </ul>\n  );\n};\n```\n\nThe `App` component renders a list of GitHub repositories if the query succeeds. If the query fails, it renders an error message.\n\nReact Query is a powerful state management library for React that can help you to manage state in your React applications efficiently, scalably, and easily."

const md = new MarkdownIt();

const Home = (props) => {
  const { data: session } = useSession();
  const [chatState, setChatState] = useRecoilState(chatsState)
  const sendMessage = useSendMessage()
  const [isPalmLoading, setIsPalmLoading] = useState(false)

  const containerChatRef = useRef(null)


  const [textValue, setTextValue] = useState('')

  const handleSend = async (e) => {
    e.preventDefault()
    setChatState(prev => ([...prev, {
      role: session?.user.name as string,
      content: textValue
    }]))

    setIsPalmLoading(true)
    const res = await sendMessage.mutateAsync([...chatState, 
      {
        role: session?.user.name as string,
        content: textValue
      }
    ])
    setIsPalmLoading(false)
    
    setChatState(prev => ([...prev, {
      role: res.role,
      content: res.message
    }]))
    
  }


  

  console.log(sendMessage, "<<< chatstate")

  return (
    <div className=" flex flex-col justify-center h-3/4 items-center gap-4">
      <div className="flex items-center gap-4">
        <p className="text-3xl font-bold mb-4">
          Logged as <span className="font-normal">{session?.user?.name}</span>
        </p>
        <div className="w-10   rounded-full">
          <Image
            src={session?.user.image as string}
            width={100}
            height={100}
            // fill
            className="object-contain rounded-full"
            alt="img"
          />
        </div>
      </div>

      <div className="min-w-[400px] min-h-[400px] rounded-md gap-2 px-3 py-4 flex flex-col bg-gray-400">
        <div ref={containerChatRef} className="h-80 overflow-y-auto flex flex-col gap-2">
          {
            chatState.length ? chatState.map((chat, idx) => (
              <div key={idx} className="gap-2 py-2 text-black bg-white rounded-lg px-3">
                <p className="font-bold">{chat.role}</p>
                {
                  chat.role !== 'GooglePalm' ?
                   <p className="whitespace-pre-line">{chat.content}</p>
                   :
                   <div dangerouslySetInnerHTML={{
                     __html: md.render(chat.content)
                   }} />
                  
                }
              </div>
            ))
            :
            null
          }
          {
            sendMessage.status === 'loading' ?
            <p>Let me thinking ...</p>
            :
            null
          }
          
        </div>
        <div className="flex flex-col h-ful justify-end gap-2">
          <textarea className="py-2 text-black px-3 rounded gap-2" onChange={(e) => setTextValue(e.target.value)} />
          <button type="submit" className="py-2 px-3 bg-sky-500 rounded-md hover:bg-rose-600 self-end max-w-fit" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

Home.requireAuth = true;

export default Home;
