import { userService } from "@/lib/services/user-service"
import { UserContent } from "./components/user-content"

export default async function UsersPage() {
  const users = await userService.getAll()

  return <UserContent initialUsers={users} />
}

