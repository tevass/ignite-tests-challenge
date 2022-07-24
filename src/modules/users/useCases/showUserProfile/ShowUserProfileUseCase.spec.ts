import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("Should to be able a list user", async () => {
    const { id } = await inMemoryUsersRepository.create({
      email: "john.doe@test.com.br",
      name: "John Doe",
      password: "john.doe"
    })

    const user = await showUserProfileUseCase.execute(id as string)

    expect(user).toHaveProperty("id")
  })

  it("Should not be able a non existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("id")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
