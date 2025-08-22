import React from "react";
import Dialog from '../components/Dialog';

const DialogEditEvent = ({
  open,
  onClose,
  onSubmit,
  editingEventId,
  name,
  setName,
  description,
  setDescription,
  location,
  setLocation,
  dateTime,
  setDateTime,
  image,
  setImage,
  tickets,
  setTickets,
  addTicket,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingEventId?: string | null;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  dateTime: string;
  setDateTime: React.Dispatch<React.SetStateAction<string>>;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  tickets: { name: string; price: number; quantity: number }[];
  setTickets: React.Dispatch<
    React.SetStateAction<{ name: string; price: number; quantity: number }[]>
  >;
  addTicket: () => void;
  loading: boolean;
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <h2 className="font-medium">
          {editingEventId ? "Editar evento" : "Criar novo evento"}
        </h2>

        <input
          required
          placeholder="Nome do evento"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />

        <textarea
          required
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            placeholder="Local"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-md border px-3 py-2"
          />
          <input
            required
            type="datetime-local"
            placeholder="Data"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="rounded-md border px-3 py-2"
          />
        </div>

        <input
          placeholder="URL da imagem (opcional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Ingressos</h3>
            <button
              type="button"
              onClick={addTicket}
              className="text-sm px-2 py-1 rounded-md border"
            >
              Adicionar tipo
            </button>
          </div>

          {tickets.map((t, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2">
              <input
                placeholder="Nome"
                value={t.name}
                onChange={(e) => {
                  const v = e.target.value;
                  setTickets((prev) =>
                    prev.map((x, i) => (i === idx ? { ...x, name: v } : x))
                  );
                }}
                className="rounded-md border px-2 py-1"
              />
              <input
                type="number"
                placeholder="Preço"
                value={t.price}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setTickets((prev) =>
                    prev.map((x, i) => (i === idx ? { ...x, price: v } : x))
                  );
                }}
                className="rounded-md border px-2 py-1"
              />
              <input
                type="number"
                placeholder="Quantidade"
                value={t.quantity}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setTickets((prev) =>
                    prev.map((x, i) => (i === idx ? { ...x, quantity: v } : x))
                  );
                }}
                className="rounded-md border px-2 py-1"
              />
            </div>
          ))}
        </div>

        <button
          disabled={loading}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50"
        >
          {loading
            ? "Salvando..."
            : editingEventId
            ? "Salvar alterações"
            : "Criar evento"}
        </button>
      </form>
    </Dialog>
  );
}

export default DialogEditEvent