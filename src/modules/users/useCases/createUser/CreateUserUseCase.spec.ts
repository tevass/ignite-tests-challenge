import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should to be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "john.doe@test.com.br",
      password: "john.doe"
    })

    expect(user).toHaveProperty("id")
  })

  it("Should not be able to create a new user if email already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "John Doe",
        email: "john.doe@test.com.br",
        password: "john.doe"
      })

      await createUserUseCase.execute({
        name: "John Doe",
        email: "john.doe@test.com.br",
        password: "john.doe"
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
