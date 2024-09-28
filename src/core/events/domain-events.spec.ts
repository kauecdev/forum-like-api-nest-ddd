import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and list to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Entidade criada SEM salvar no banco
    const aggregate = CustomAggregate.create()

    // Evento criado, mas não disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Entidade salva no banco de dados, disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Função do subscriber é disparada
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
