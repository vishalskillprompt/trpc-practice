import { type NextPage } from "next";

import { api } from "../utils/api";
import { useState } from "react";
import Link from "next/link";

const Home: NextPage = () => {
  const queryCtx = api.useContext();
  const [notification, setNotification] = useState(0);
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const sendMessage = api.example.sendMessage.useMutation();
  const deleteMessage = api.example.deleteMessage.useMutation();
  const updateMessage = api.example.updateMessage.useMutation();

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
    <div className="m-8 bg-violet-200">
      {/* <div className="my-3 flex justify-end">
        <Link
          className="w-auto rounded-md bg-violet-700 p-2 text-white"
          href="/api/auth/login"
        >
          Login
        </Link>
      </div> */}
      <div className="my-3 flex justify-end">
        <Link
          className="w-auto rounded-md bg-violet-700 p-2 text-white"
          href="/api/auth/logout"
        >
          Logout
        </Link>
      </div>

      <div>hello world</div>
      <div>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</div>

      <div>{test.data}</div>
      <button
        className="rounded-md bg-green-600 p-2 text-white"
        type="submit"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => {
          await sendMessage.mutateAsync(
            { value: `${Math.random()}` },
            {
              async onSuccess() {
                await queryCtx.example.getAll.invalidate();
              },
            }
          );
        }}
      >
        Send
      </button>
      <div>Notification {notification}</div>
      <div>
        Result:
        <hr />{" "}
        {getAll.data?.map((item) => {
          return (
            <div key={item.id} className="py-4">
              <div>{item.value}</div>
              <div>
                <button
                  className="rounded-md bg-red-600 p-2 text-white"
                  type="submit"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => {
                    await deleteMessage.mutateAsync(
                      { id: parseInt(`${item.id}`) },
                      {
                        async onSuccess() {
                          await queryCtx.example.getAll.invalidate();
                        },
                      }
                    );
                  }}
                >
                  Delete
                </button>
                <button
                  className="mx-4 rounded-md bg-blue-500 p-2 text-white"
                  type="submit"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => {
                    await updateMessage.mutateAsync(
                      { id: parseInt(`${item.id}`), value: `${Math.random()}` },
                      {
                        async onSuccess() {
                          await queryCtx.example.getAll.invalidate();
                        },
                      }
                    );
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {sendMessage.error && (
        <div>Something went wrong!{sendMessage.error.message}</div>
      )}
    </div>
  );
};

export default Home;
