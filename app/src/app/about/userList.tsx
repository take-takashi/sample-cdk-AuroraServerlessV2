type User = {
  id: number;
  name: string;
  email: string;
};

export default async function UserList() {
  const users = await getUsers();
  return (
    <>
      <h2>User List!</h2>
      <ul>
        {users && users.map((user) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </>
  );
}

async function getUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users: User[] = await response.json();
  return users;
}
