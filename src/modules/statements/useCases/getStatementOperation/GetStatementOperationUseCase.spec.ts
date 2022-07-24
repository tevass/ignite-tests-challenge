import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase

let user_id: string;

describe("Get Statement Operation", () => {

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john.doe@test.com.br",
      password: "john.doe"
    })

    user_id = user.id as string

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("Should not be able to get statement operation if user non exists", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "User Test",
        statement_id: "Statement Test"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("Should not be able to get statement operation if statement non exists", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "Statement Test"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it("Should to be able to get statement operation", async () => {
    const { id } = await inMemoryStatementsRepository.create({
      amount: 1000,
      description: "Statement Test",
      type: OperationType.DEPOSIT,
      user_id
    })

    const statement = await getStatementOperationUseCase.execute({
      statement_id: id as string,
      user_id
    })

    expect(statement).toHaveProperty("id")
  })

})
