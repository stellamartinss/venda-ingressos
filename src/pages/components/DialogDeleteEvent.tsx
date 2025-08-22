import Dialog from './Dialog';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

const DeleteDialog: React.FC<DialogProps> = ({ open, onClose, onConfirm, title }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <div>
        <div>
          <h1>Confirmar Exclusão</h1>
          <p>
            Tem certeza que deseja excluir o evento <b>{title}</b>?
          </p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50"
            onClick={onConfirm}
          >
            Excluir
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
