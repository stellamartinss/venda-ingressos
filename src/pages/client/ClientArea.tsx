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
            imageUrl: 'https://source.unsplash.com/600x300/?concert',
        },
        tickets: [
            {
                id: 't1',
                eventId: '1',
                ticketNumber: 'A123456',
                qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=A123456',
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
            imageUrl: 'https://source.unsplash.com/600x300/?food-festival',
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
    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
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
                        }}
                    >
                        {event.imageUrl && (
                            <img
                                src={event.imageUrl}
                                alt={event.name}
                                style={{ width: '100%', height: 200, objectFit: 'cover' }}
                            />
                        )}
                        <div style={{ padding: 20 }}>
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
                                {tickets.map((ticket) => (
                                    <li key={ticket.id} style={{ marginBottom: 12 }}>
                                        <div>
                                            <strong>Número:</strong> {ticket.ticketNumber}
                                        </div>
                                        <div>
                                            <strong>Visualizar ingresso:</strong>
                                            <br />
                                            <img
                                                src={ticket.qrCodeUrl}
                                                alt={`QR Code ingresso ${ticket.ticketNumber}`}
                                                style={{ width: 120, marginTop: 8 }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ClientArea;