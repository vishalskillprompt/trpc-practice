import { type NextPage } from "next";

import { api } from "../utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const [notification, setNotification] = useState(0);
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const sendMessage = api.example.sendMessage.useMutation();

  const getAll = api.example.getAll.useQuery();
  const test = api.test.testing.useQuery();
  api.example.onMessageSend.useSubscription(undefined, {
    onData(data) {
      console.log("data reveived in client", data);
      setNotification(data.length);
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });
  return (
    <>
      <div className="bg-violet-200">hello world</div>
      <div>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</div>
      <div>{getAll.data?.map((item) => item.id)}</div>
      <div>{test.data}</div>
      <button
        type="submit"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => {
          console.log("clicked");
          await sendMessage.mutateAsync({ id: `${Math.random()}` });
        }}
      >
        Send
      </button>
      <div>Notification {notification}</div>
      {sendMessage.error && (
        <div>Something went wrong!{sendMessage.error.message}</div>
      )}
    </>
  );
};

export default Home;
