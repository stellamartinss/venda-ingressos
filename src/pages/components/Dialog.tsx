interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-2xl p-6 relative'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 px-2 py-1 border rounded-md text-sm'
        >
          Fechar
        </button>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
