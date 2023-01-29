

// eslint-disable-next-line max-classes-per-file
type DonationEvents = {
  kind: 'blabla2'
 } | {
  kind: 'blabla'
 }

type ValidationEvents = {
  kind: 'validation1'
 } | {
  kind: 'validation2'
 }

type Event = {
  kind: string
}

class DomainEvent<A extends Event> {
  constructor(readonly kind: A) {}
}

class DonaionDomainEvent<A extends DonationEvents> extends DomainEvent<A> {}

new DonaionDomainEvent({
  'kind': 'blabla'
})