import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase

let user_id: string;

describe("Get Balance", () => {

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john.doe@test.com.br",
      password: "john.doe"
    })

    user_id = user.id as string

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  })

  it("Should not be able to get balance if user non exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "User Test",
      })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })

  it("Should to be able to get balance", async () => {
    const balance = await getBalanceUseCase.execute({
      user_id,
    })

    expect(balance).toHaveProperty("balance")
  })

})
