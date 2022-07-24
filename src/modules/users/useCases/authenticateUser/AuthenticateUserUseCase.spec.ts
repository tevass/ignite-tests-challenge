import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it("Should to be able to authenticate a user", async () => {
    await createUserUseCase.execute({
      email: "john.doe@test.com.br",
      name: "John Doe",
      password: "john.doe"
    })

    const session = await authenticateUserUseCase.execute({
      email: "john.doe@test.com.br",
      password: "john.doe"
    })

    expect(session).toHaveProperty("token")
  })

  it("Should not be able to authenticate a user with email not exists", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "john.doe@test.com.br",
        password: "john.doe"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate a user with password not match", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "john.doe@test.com.br",
        name: "John Doe",
        password: "john.doe"
      })

      await authenticateUserUseCase.execute({
        email: "john.doe@test.com.br",
        password: "john"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
