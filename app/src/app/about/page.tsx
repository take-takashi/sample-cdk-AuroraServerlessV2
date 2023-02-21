import UserList from "./userList";

export default function About() {
  return (
    <div>
      <h1>Aboutのページです。</h1>
      {/* @ts-expect-error Server Component */}
      <UserList></UserList>
    </div>
  );
}
