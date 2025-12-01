import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, Event, OrganizerReport } from '../../services/api';
import DeleteDialog from '../components/DialogDeleteEvent';
import DialogEditEvent from '../components/DialogEditEvent';



type TicketInput = { name: string; price: number; quantity: number };

function DashboardPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [events, setEvents] = useState<Event[]>([]);
  const [report, setReport] = useState<OrganizerReport | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [image, setImage] = useState('');
  const [tickets, setTickets] = useState<TicketInput[]>([
    { name: 'Pista', price: 50, quantity: 100 },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('authUser') || 'null');
      if (!token || !user || user.role !== 'ORGANIZER') {
        navigate('/organizador/login');
        return;
      }
      setAuthed(true);

      try {
        setLoading(true);
        setError('');
        try {
          const [eventsResponse, reportData] = await Promise.all([
            api.getOrganizerEvents(),
            api.getOrganizerReport(),
          ]);
          setEvents(eventsResponse.data || []);
          setReport(reportData);
        } catch (apiError) {
          console.warn('Backend endpoints not available yet:', apiError);
          setEvents([]);
          setReport({ totalSold: 0, gross: 0, fee: 0, net: 0 });
          setError(
            'Backend endpoints não disponíveis ainda. Usando dados de exemplo.'
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [navigate]);

  function addTicket() {
    setTickets((prev) => [...prev, { name: '', price: 0, quantity: 0 }]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!authed) return;

    try {
      setLoading(true);
      setError('');

      const eventData = {
        name,
        description,
        location,
        city: location,
        dateTime,
        bannerUrl:
          image ||
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
        category: 'Outros',
        ticketTypes: tickets.map((t) => ({
          name: t.name,
          price: Number(t.price),
          quantityTotal: Number(t.quantity)
        })),
      };

      if (editingEventId) {
        // update existing
        await api.editEvent(editingEventId, eventData);
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === editingEventId ? { ...ev, ...eventData } : ev
          )
        );
      } else {
        // create new
        await api.createEvent(eventData);
        try {
          const eventsResponse = await api.getOrganizerEvents();
          setEvents(eventsResponse.data || []);
        } catch {
          const newEvent: Event = {
            id: Date.now().toString(),
            ...eventData,
            organizerId:
              JSON.parse(localStorage.getItem('authUser') || '{}').id ||
              'unknown',
          };
          setEvents((prev) => [...prev, newEvent]);
        }
      }

      // Reset form
      setName('');
      setDescription('');
      setLocation('');
      setDateTime('');
      setImage('');
      setTickets([{ name: 'Pista', price: 50, quantity: 100 }]);
      setEditingEventId(null);
      setOpenDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/organizador/login');
  }

  function openEditDialog(event: Event) {
    setEditingEventId(event.id);
    setName(event.name);
    setDescription(event.description);
    setLocation(event.location);
    setDateTime(event.dateTime || '');
    setImage(event.bannerUrl || '');
    setTickets(
      event.ticketTypes?.map((t) => ({
        name: t.name,
        price: t.price,
        quantity: t.quantityTotal,
      })) || [{ name: 'Pista', price: 50, quantity: 100 }]
    );
    setOpenDialog(true);
  }

  if (loading) {
    return <div className='text-center py-8'>Carregando painel...</div>;
  }

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    api.deleteEvent(selectedEvent.id);

    setIsDeleteOpen(false);
    setSelectedEvent(null);
    window.location.reload();
  };

  const editDialog = (<DialogEditEvent
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      onSubmit={onSubmit}
      editingEventId={editingEventId}
      name={name}
      setName={setName}
      description={description}
      setDescription={setDescription}
      location={location}
      setLocation={setLocation}
      dateTime={dateTime}
      setDateTime={setDateTime}
      image={image}
      setImage={setImage}
      tickets={tickets}
      setTickets={setTickets}
      addTicket={addTicket}
      loading={loading}
    />

  );

  const deleteDialog = <DeleteDialog
    open={isDeleteOpen}
    onClose={() => setIsDeleteOpen(false)}
    onConfirm={handleDeleteConfirm}
    title={selectedEvent?.name}
  />

  useEffect(() => {
    async function fetchClientTickets() {
      try {
        await api.getClientTickets();
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchClientTickets();
  }, []);

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>Painel do organizador</h1>
          <p className='text-sm opacity-70'>
            Gerencie seus eventos e acompanhe vendas
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => {
              setEditingEventId(null);
              setOpenDialog(true);
            }}
            className='px-3 py-1 rounded-md border text-sm bg-indigo-600 text-white'
          >
            Adicionar evento
          </button>
          <button
            onClick={logout}
            className='px-3 py-1 rounded-md border text-sm'
          >
            Sair
          </button>
        </div>
      </div>

      {error && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800'>
          <p className='text-sm'>{error}</p>
        </div>
      )}

      <section className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Dialog for creating or editing event */}
        {editDialog}

        {/* Delete Confirmation Dialog */}
        {deleteDialog}

        {/* Right side with report & events */}
        <div className='space-y-4 lg:col-span-3'>
          <div className='rounded-xl border p-4'>
            <h2 className='font-medium mb-2'>Relatório</h2>
            {report ? (
              <ul className='text-sm space-y-1'>
                <li>
                  Ingressos vendidos:{' '}
                  <span className='font-semibold'>{report?.totalSold}</span>
                </li>
                <li>
                  Total arrecadado:{' '}
                  <span className='font-semibold'>
                    R$ {report?.gross?.toFixed(2)}
                  </span>
                </li>
                <li>
                  Taxas:{' '}
                  <span className='font-semibold'>
                    R$ {report?.fee?.toFixed(2)}
                  </span>
                </li>
                <li>
                  Valor líquido:{' '}
                  <span className='font-semibold'>
                    R$ {report?.net?.toFixed(2)}
                  </span>
                </li>
              </ul>
            ) : (
              <p className='text-sm opacity-70'>Carregando relatório...</p>
            )}
          </div>

          <div className='rounded-xl border p-4'>
            <h2 className='font-medium mb-2'>Meus eventos</h2>
            <ul className='space-y-2 text-sm'>
              {events.length === 0 && (
                <li className='opacity-70'>Nenhum evento criado ainda.</li>
              )}
              {events.map((e) => (
                <li
                  key={e.id}
                  className='border rounded-md p-2 flex flex-col gap-1'
                >
                  <div className='font-medium'>{e.name} • (vendidos: {e.ticketTypes.reduce((acc, item) => acc + (item.quantitySold || 0), 0)} / {e.ticketTypes.reduce((acc, item) => acc + (item.quantityTotal || 0), 0)})</div>
                  <div className='opacity-70'>
                    {e.location} •{' '}
                    {e.dateTime ? new Date(e.dateTime).toLocaleString() : ''}
                  </div>
                  <div className='flex gap-2 mt-1'>
                    <button
                      onClick={() => openEditDialog(e)}
                      className='px-2 py-1 rounded-md border text-xs'
                    >
                      Editar
                    </button>
                    <button
                      className='px-2 py-1 rounded-md border text-xs text-red-600'
                      onClick={() => handleDeleteClick(e)}
                    >
                      Excluir
                    </button>
                    <Link
                      to={`/evento/${e.id}`}
                      className='px-2 py-1 rounded-md border text-xs'
                    >
                      Visualizar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
