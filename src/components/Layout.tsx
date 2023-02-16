import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="font-sans">
      <div>{children}</div>
    </div>
  );
};
export default withPageAuthRequired(Layout);
