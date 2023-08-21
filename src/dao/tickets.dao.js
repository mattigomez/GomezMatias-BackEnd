const TicketsRepository = require('../repository/tickets.repository')

const ticketsDao = new TicketsRepository()

module.exports = ticketsDao

/* async function checkDataTicket(code, userEmail, cart){
  try {
    const ticketsRepository = new TicketsRepository()
    return ticketsRepository.processDataTicket(code, userEmail, cart)
  } catch (error) {
    return error
  }
}

module.exports = checkDataTicket */