import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

let user_id: string;

describe("Create Statement", () => {

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john.doe@test.com.br",
      password: "john.doe"
    })

    user_id = user.id as string

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("Should not be able to create a new statement if user non exists", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "User Test",
        amount: 0,
        description: "Statement Test",
        type: OperationType.DEPOSIT
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("Should to be able to create a new statement of deposit", async () => {
    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 0,
      description: "Statement Deposit Test",
      type: OperationType.DEPOSIT
    })

    expect(statement).toHaveProperty("id")
  })

  it("Should to be able to create a new statement of withdraw", async () => {
    await createStatementUseCase.execute({
      user_id,
      amount: 1000,
      description: "Statement Deposit Test",
      type: OperationType.DEPOSIT
    })

    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 500,
      description: "Statement withdraw Test",
      type: OperationType.WITHDRAW
    })

    expect(statement).toHaveProperty("id")
    expect(statement.type).toEqual("withdraw")
  })

  it("Should not be able to create a new statement of withdraw if insufficient funds", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id,
        amount: 500,
        description: "Statement withdraw Test",
        type: OperationType.WITHDRAW
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

})
