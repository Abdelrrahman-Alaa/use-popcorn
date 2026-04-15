export function ToggleButton({ isOpen, onClick }) {
  return (
    <button className="btn-toggle" onClick={onClick}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
