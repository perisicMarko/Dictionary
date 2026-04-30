export default function ZeroNotesMessage({ message }: { message: string }) {
  return (
    <div className="center mt-10 box-layout enter-fade text-justify">
      <h2 className="text-box enter-fade-up enter-delay-1">
        <b>{message}</b>
      </h2>
    </div>
  );
}
