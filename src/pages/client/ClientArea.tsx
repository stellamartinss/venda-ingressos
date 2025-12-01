import React from 'react';

type Ticket = {
  id: string;
  eventId: string;
  ticketNumber: string;
  qrCodeUrl: string;
};

type Event = {
  id: string;
  name: string;
  date: string; // ISO string
  location: string;
  description: string;
  imageUrl?: string;
};

type PurchasedEvent = {
  event: Event;
  tickets: Ticket[];
};

const mockPurchasedEvents: PurchasedEvent[] = [
  {
    event: {
      id: '1',
      name: 'Show da Banda XYZ',
      date: '2024-08-15T20:00:00Z',
      location: 'Arena Central',
      description: 'Venha curtir o melhor do rock nacional!',
      imageUrl: 'https://picsum.photos/400/300?random=1',
    },
    tickets: [
      {
        id: 't1',
        eventId: '1',
        ticketNumber: 'A123456',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=A123456',
      },
      {
        id: 't2',
        eventId: '2',
        ticketNumber: 'B123456',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=B123456',
      },
    ],
  },
  {
    event: {
      id: '2',
      name: 'Festival de Comida',
      date: '2024-09-10T18:00:00Z',
      location: 'Praça Gourmet',
      description: 'Sabores do mundo em um só lugar.',
      imageUrl: 'https://picsum.photos/400/300?random=1',
    },
    tickets: [
      {
        id: 't2',
        eventId: '2',
        ticketNumber: 'B654321',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=B654321',
      },
    ],
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const ClientArea: React.FC = () => {
  const [ticketData, setTicketData] = React.useState<PurchasedEvent | null>(
    null
  );

  const dialogTicket = (
    <>
      {ticketData && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setTicketData(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: 32,
              minWidth: 320,
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 16px',
                    cursor: 'pointer',
                    fontSize: 16,
                  }}
                  onClick={() => window.print()}
                  title='Imprimir ingresso'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={20}
                    height={20}
                    fill='none'
                    viewBox='0 0 24 24'
                    style={{ verticalAlign: 'middle' }}
                  >
                    <path
                      fill='currentColor'
                      d='M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1v3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1zm2-5v5h8V4H8zm10 7H6v9h12v-9zm-2 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0z'
                    />
                  </svg>
                    Imprimir
                </button>
            <button
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'transparent',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
              }}
              aria-label='Fechar'
              onClick={() => setTicketData(null)}
            >
              &times;
            </button>
            <h1 className='text-2xl font-semibold mb-4'>
              {ticketData.event.name}
            </h1>
            {ticketData.tickets.map((ticket) => (
              <div key={ticket.id} style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 12 }}>
                  <strong>Número:</strong> {ticket.ticketNumber}
                </div>
                <img
                  src={ticket.qrCodeUrl}
                  alt='QR Code do ingresso'
                  style={{
                    width: 180,
                    height: 180,
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
                <hr style={{ margin: '24px 0' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {dialogTicket}
      <h1 className='text-2xl font-semibold mb-4'>Meus Eventos</h1>
      {mockPurchasedEvents.length === 0 ? (
        <p>Você ainda não comprou ingressos.</p>
      ) : (
        mockPurchasedEvents.map(({ event, tickets }) => (
          <div
            key={event.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              marginBottom: 32,
              overflow: 'hidden',
              boxShadow: '0 2px 8px #eee',
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.name}
                style={{
                  width: 220,
                  height: '100%',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ padding: 20, flex: 1 }}>
              <h2>{event.name}</h2>
              <div
                style={{
                  background: '#f5f5f5',
                  padding: '8px 16px',
                  borderRadius: 6,
                  display: 'inline-block',
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: '#1976d2',
                  marginBottom: 12,
                }}
              >
                {formatDate(event.date)}
              </div>
              <p>
                <strong>Local:</strong> {event.location}
              </p>
              <p>{event.description}</p>
              <h3>Ingressos</h3>
              <ul>
                <li style={{ marginBottom: 12 }}>
                  <button
                    style={{
                      marginTop: 8,
                      padding: '6px 16px',
                      background: '#1976d2',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                    onClick={() => setTicketData({ event, tickets })}
                  >
                    Ver Ingressos
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClientArea;
